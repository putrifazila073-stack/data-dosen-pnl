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

if (isset($data["dosen"]) && is_array($data["dosen"])) {
    $dosenList = &$data["dosen"];
} else {
    $dosenList = &$data;
}

$total = count($dosenList);
$berhasil = 0;
$dilewati = 0;
$gagal = 0;

// Daftar ID Hash Manual (Backup Terakhir)
$manualIdMap = [
    "0027017001" => "Cjhx88e7kZcTuM1TMcZkS-s1cR0-uV0PJgX7RhvjnuROOHFpp-gC-Vbi8pZb_w0mO4JLcA==",
];

function requestAPI($url)
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            "Accept: application/json",
            "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
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

function ambilArray($response)
{
    if (!is_array($response)) return [];
    if (isset($response["data"]) && is_array($response["data"])) {
        if (isset($response["data"]["data"]) && is_array($response["data"]["data"])) {
            return $response["data"]["data"];
        }
        return $response["data"];
    }
    if (isset($response["results"]) && is_array($response["results"])) return $response["results"];
    if (isset($response["result"]) && is_array($response["result"])) return $response["result"];

    return $response;
}

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

function formatPortfolio($response, $sumber = "PDDIKTI")
{
    $hasil = [];
    $items = ambilArray($response);
    if (!is_array($items)) return [];

    foreach ($items as $item) {
        $judul = ambilJudul($item);
        if ($judul === "") continue;

        $tahun = ambilTahun($item);
        $baris = ["judul" => $judul, "sumber" => $sumber];
        if ($tahun !== null) {
            $baris["tahun"] = is_numeric($tahun) ? (int)$tahun : $tahun;
        }
        $hasil[] = $baris;
    }
    return $hasil;
}

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

// PROSES LOOPING ALL DOSEN
foreach ($dosenList as $index => &$dosen) {

    $nama = trim((string)($dosen["nama"] ?? ""));
    $nidn = trim((string)($dosen["nidn"] ?? ""));

    echo "<div style='font-family:monospace; font-size:13px; margin-bottom:8px;'>";
    echo "<b>[" . ($index + 1) . "/{$total}]</b> " . htmlspecialchars($nama) . " (NIDN: " . ($nidn ?: "KOSONG") . ")<br>";
    flush();

    if ($nidn === "") {
        echo "└─ ⚠️ Skipped: NIDN Kosong<br></div>";
        $dilewati++;
        continue;
    }

    $idDosen = "";

    // 1. Cek dari mapping manual
    if (isset($manualIdMap[$nidn])) {
        $idDosen = $manualIdMap[$nidn];
    } 

    // 2. Cari via API berdasarkan NIDN
    if ($idDosen === "") {
        $urlSearchNidn = $API . "/search/dosen/" . rawurlencode($nidn) . "/";
        $searchNidn = requestAPI($urlSearchNidn);
        $hasilSearchNidn = ambilArray($searchNidn);

        if (is_array($hasilSearchNidn)) {
            foreach ($hasilSearchNidn as $h) {
                if (!is_array($h)) continue;
                $nidnHasil = trim((string)($h["nidn"] ?? $h["NIDN"] ?? ""));
                if ($nidnHasil === $nidn) {
                    $idDosen = $h["id"] ?? $h["id_sdm"] ?? $h["id_dosen"] ?? "";
                    break;
                }
            }
        }
    }

    // 3. Jika via NIDN gagal, cari via Nama Dosen + Kampus
    if ($idDosen === "") {
        $urlSearchNama = $API . "/search/dosen/" . rawurlencode($nama) . "/";
        $searchNama = requestAPI($urlSearchNama);
        $hasilSearchNama = ambilArray($searchNama);

        if (is_array($hasilSearchNama)) {
            foreach ($hasilSearchNama as $h) {
                if (!is_array($h)) continue;
                $pt = strtolower((string)($h["pt"] ?? $h["perguruan_tinggi"] ?? ""));
                $nidnHasil = trim((string)($h["nidn"] ?? $h["NIDN"] ?? ""));

                if (($nidnHasil === $nidn) || (strpos($pt, "lhokseumawe") !== false && $nidnHasil === $nidn)) {
                    $idDosen = $h["id"] ?? $h["id_sdm"] ?? $h["id_dosen"] ?? "";
                    break;
                }
            }
        }
    }

    if ($idDosen === "") {
        echo "└─ ❌ Gagal: ID Dosen tidak ditemukan di PDDikti<br></div>";
        $gagal++;
        usleep(100000);
        continue;
    }

    echo "└─ ID PDDikti: " . htmlspecialchars((string)$idDosen) . "<br>";

    // Fetch portofolio
    $penelitian = requestAPI($API . "/dosen/penelitian/" . rawurlencode($idDosen) . "/");
    $pengabdian = requestAPI($API . "/dosen/pengabdian/" . rawurlencode($idDosen) . "/");
    $publikasi  = requestAPI($API . "/dosen/karya/" . rawurlencode($idDosen) . "/");
    $paten      = requestAPI($API . "/dosen/paten/" . rawurlencode($idDosen) . "/");

    $dataPenelitian = formatPortfolio($penelitian, "PDDIKTI");
    $dataPengabdian = formatPortfolio($pengabdian, "PDDIKTI");
    $dataPublikasi  = formatPortfolio($publikasi, "PDDIKTI");
    $dataPaten      = formatPortfolio($paten, "PDDIKTI");

    $dosen["penelitian"] = gabungPortofolio($dosen["penelitian"] ?? [], $dataPenelitian);
    $dosen["pengabdian"] = gabungPortofolio($dosen["pengabdian"] ?? [], $dataPengabdian);
    $dosen["publikasi"]  = gabungPortofolio($dosen["publikasi"] ?? [], $dataPublikasi);
    $dosen["paten"]      = gabungPortofolio($dosen["paten"] ?? [], $dataPaten);

    echo "   [Hasil] Penelitian: " . count($dosen["penelitian"]) . " | Pengabdian: " . count($dosen["pengabdian"]) . " | Publikasi: " . count($dosen["publikasi"]) . " | Paten: " . count($dosen["paten"]) . "<br></div>";

    $berhasil++;

    // Simpan progres ke file per 10 data
    if ($berhasil % 10 === 0) {
        file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    usleep(250000); // Jeda 0.25 detik
}

unset($dosen);

// Simpan Akhir
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

echo "<hr><h3>PROSES SELESAI</h3>";
echo "Total: <b>{$total}</b> | Berhasil: <b>{$berhasil}</b> | Dilewati: <b>{$dilewati}</b> | Gagal: <b>{$gagal}</b><br>";
echo "Data JSON berhasil disimpan secara bertahap.";
?>
