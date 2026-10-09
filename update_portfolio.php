<?php

set_time_limit(0);
ini_set('memory_limit', '512M');

$file = __DIR__ . "/data.json";
$API = "https://pddikti.fastapicloud.dev/api";

if (!file_exists($file)) {
    die("data.json tidak ditemukan.");
}

$dataRaw = file_get_contents($file);
$data = json_decode($dataRaw, true);

if (!is_array($data)) {
    die("Format data.json tidak valid.");
}

// PERBAIKAN 1: Menyesuaikan apakah root JSON berbentuk Array Dosen langsung atau Objek {"dosen": [...]}
if (isset($data["dosen"]) && is_array($data["dosen"])) {
    $dosenList = &$data["dosen"];
} else {
    $dosenList = &$data;
}

$total = count($dosenList);
$berhasil = 0;
$dilewati = 0;
$gagal = 0;


/* =========================================================
   FUNGSI REQUEST
========================================================= */

function requestAPI($url)
{
    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            "Accept: application/json",
            "User-Agent: Mozilla/5.0"
        ]
    ]);

    $hasil = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($hasil === false || $httpCode < 200 || $httpCode >= 300) {
        return null;
    }

    return json_decode($hasil, true);
}


/* =========================================================
   AMBIL DATA ARRAY DARI RESPONSE API
========================================================= */

function ambilArray($response)
{
    if (!is_array($response)) {
        return [];
    }

    if (isset($response["data"]) && is_array($response["data"])) {
        if (isset($response["data"]["data"]) && is_array($response["data"]["data"])) {
            return $response["data"]["data"];
        }
        return $response["data"];
    }

    if (isset($response["results"]) && is_array($response["results"])) {
        return $response["results"];
    }

    if (isset($response["result"]) && is_array($response["result"])) {
        return $response["result"];
    }

    return $response;
}


/* =========================================================
   AMBIL JUDUL & TAHUN
========================================================= */

function ambilJudul($item)
{
    if (!is_array($item)) return "";

    $fields = ["judul", "judul_kegiatan", "judul_penelitian", "judul_karya", "nama_kegiatan", "nama"];
    foreach ($fields as $field) {
        if (isset($item[$field]) && trim((string)$item[$field]) !== "") {
            return trim((string)$item[$field]);
        }
    }
    return "";
}

function ambilTahun($item)
{
    if (!is_array($item)) return null;

    $fields = ["tahun", "tahun_kegiatan", "tahun_pelaksanaan", "year"];
    foreach ($fields as $field) {
        if (isset($item[$field]) && trim((string)$item[$field]) !== "") {
            return trim((string)$item[$field]);
        }
    }
    return null;
}


/* =========================================================
   KONVERSI PORTFOLIO
========================================================= */

function formatPortfolio($response, $sumber = "PDDIKTI")
{
    $hasil = [];
    $items = ambilArray($response);

    if (!is_array($items)) return [];

    foreach ($items as $item) {
        $judul = ambilJudul($item);
        if ($judul === "") continue;

        $tahun = ambilTahun($item);

        $baris = [
            "judul" => $judul,
            "sumber" => $sumber
        ];

        if ($tahun !== null) {
            $baris["tahun"] = is_numeric($tahun) ? (int)$tahun : $tahun;
        }

        $hasil[] = $baris;
    }

    return $hasil;
}


/* =========================================================
   PROSES PENGGABUNGAN (MERGE) PORTOFOLIO TANPA DUPLIKASI
========================================================= */

function gabungPortofolio($lama, $baru)
{
    if (!is_array($lama)) $lama = [];
    if (!is_array($baru)) $baru = [];

    $judulAda = [];
    foreach ($lama as $item) {
        if (isset($item['judul'])) {
            $judulAda[mb_strtolower(trim($item['judul']))] = true;
        }
    }

    foreach ($baru as $item) {
        $keyJudul = mb_strtolower(trim($item['judul']));
        if (!isset($judulAda[$keyJudul])) {
            $lama[] = $item;
            $judulAda[$keyJudul] = true;
        }
    }

    return $lama;
}


/* =========================================================
   PROSES PER DOSEN
========================================================= */

foreach ($dosenList as $index => &$dosen) {

    $nama = trim((string)($dosen["nama"] ?? ""));
    $nidn = trim((string)($dosen["nidn"] ?? ""));

    echo "<div style='font-family:Arial; font-size:14px;'>";
    echo "<b>" . ($index + 1) . " / " . $total . "</b> ";
    echo htmlspecialchars($nama) . " - NIDN: " . htmlspecialchars($nidn) . "<br>";
    flush();

    if ($nidn === "") {
        echo "⚠️ NIDN kosong<br><br></div>";
        $dilewati++;
        continue;
    }

    /*
     * CARI DOSEN BERDASARKAN NIDN
     */
    $urlSearch = $API . "/search/dosen/" . rawurlencode($nidn) . "/";
    $search = requestAPI($urlSearch);
    $hasilSearch = ambilArray($search);

    $idDosen = "";

    if (is_array($hasilSearch)) {
        foreach ($hasilSearch as $hasil) {
            if (!is_array($hasil)) continue;

            $nidnHasil = trim((string)($hasil["nidn"] ?? $hasil["NIDN"] ?? ""));
            if ($nidnHasil === $nidn) {
                $idDosen = $hasil["id"] ?? $hasil["id_dosen"] ?? $hasil["id_sdm"] ?? "";
                break;
            }
        }
    }

    if ($idDosen === "") {
        echo "❌ ID dosen tidak ditemukan di PDDIKTI<br><br></div>";
        $gagal++;
        usleep(100000);
        continue;
    }

    echo "ID Dosen PDDIKTI: " . htmlspecialchars((string)$idDosen) . "<br>";

    // Fetch dari API PDDIKTI
    $penelitian = requestAPI($API . "/dosen/penelitian/" . rawurlencode($idDosen) . "/");
    $pengabdian = requestAPI($API . "/dosen/pengabdian/" . rawurlencode($idDosen) . "/");
    $publikasi  = requestAPI($API . "/dosen/karya/" . rawurlencode($idDosen) . "/");
    $paten      = requestAPI($API . "/dosen/paten/" . rawurlencode($idDosen) . "/");

    $dataPenelitian = formatPortfolio($penelitian, "PDDIKTI");
    $dataPengabdian = formatPortfolio($pengabdian, "PDDIKTI");
    $dataPublikasi  = formatPortfolio($publikasi, "PDDIKTI");
    $dataPaten      = formatPortfolio($paten, "PDDIKTI");

    // PERBAIKAN 2: Menggabungkan data (merge) tanpa menghapus data GARUDA
    $dosen["penelitian"] = gabungPortofolio($dosen["penelitian"] ?? [], $dataPenelitian);
    $dosen["pengabdian"] = gabungPortofolio($dosen["pengabdian"] ?? [], $dataPengabdian);
    $dosen["publikasi"]  = gabungPortofolio($dosen["publikasi"] ?? [], $dataPublikasi);
    $dosen["paten"]      = gabungPortofolio($dosen["paten"] ?? [], $dataPaten);

    echo "Total Penelitian: " . count($dosen["penelitian"]) . "<br>";
    echo "Total Pengabdian: " . count($dosen["pengabdian"]) . "<br>";
    echo "Total Publikasi: " . count($dosen["publikasi"]) . "<br>";
    echo "Total Paten: " . count($dosen["paten"]) . "<br><br></div>";

    $berhasil++;
    usleep(200000); // Jeda 0.2s
}

unset($dosen);


/* =========================================================
   SIMPAN DATA.JSON
========================================================= */

$jsonBaru = json_encode(
    $data,
    JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
);

if ($jsonBaru === false) {
    die("Gagal membuat JSON.");
}

if (file_put_contents($file, $jsonBaru) === false) {
    die("Gagal menyimpan data.json.");
}


/* =========================================================
   HASIL AKHIR
========================================================= */

echo "<hr><div style='font-family:Arial'>";
echo "<h2>SELESAI</h2>";
echo "Jumlah dosen: <b>" . $total . "</b><br>";
echo "Berhasil diproses: <b>" . $berhasil . "</b><br>";
echo "Dilewati: <b>" . $dilewati . "</b><br>";
echo "Gagal ditemukan: <b>" . $gagal . "</b><br><br>";
echo "<b>data.json berhasil diperbarui tanpa menimpa data terdahulu.</b></div>";

?>
