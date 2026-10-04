<?php

set_time_limit(0);
ini_set('memory_limit', '512M');

$file = __DIR__ . "/data.json";

$API = "https://pddikti.fastapicloud.dev/api";

if (!file_exists($file)) {
    die("data.json tidak ditemukan.");
}

$data = json_decode(
    file_get_contents($file),
    true
);

if (
    !$data ||
    !isset($data["dosen"]) ||
    !is_array($data["dosen"])
) {
    die("Format data.json tidak valid.");
}

$dosenList = &$data["dosen"];

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

    $httpCode = curl_getinfo(
        $ch,
        CURLINFO_HTTP_CODE
    );

    curl_close($ch);

    if (
        $hasil === false ||
        $httpCode < 200 ||
        $httpCode >= 300
    ) {
        return null;
    }

    $json = json_decode(
        $hasil,
        true
    );

    return $json;
}


/* =========================================================
   AMBIL DATA ARRAY DARI RESPONSE API
========================================================= */

function ambilArray($response)
{
    if (!is_array($response)) {
        return [];
    }

    if (
        isset($response["data"]) &&
        is_array($response["data"])
    ) {
        if (
            isset($response["data"]["data"]) &&
            is_array($response["data"]["data"])
        ) {
            return $response["data"]["data"];
        }

        return $response["data"];
    }

    if (
        isset($response["results"]) &&
        is_array($response["results"])
    ) {
        return $response["results"];
    }

    if (
        isset($response["result"]) &&
        is_array($response["result"])
    ) {
        return $response["result"];
    }

    return [];
}


/* =========================================================
   AMBIL JUDUL
========================================================= */

function ambilJudul($item)
{
    if (!is_array($item)) {
        return "";
    }

    $fields = [
        "judul",
        "judul_kegiatan",
        "judul_penelitian",
        "judul_karya",
        "nama_kegiatan",
        "nama"
    ];

    foreach ($fields as $field) {

        if (
            isset($item[$field]) &&
            trim((string)$item[$field]) !== ""
        ) {
            return trim(
                (string)$item[$field]
            );
        }
    }

    return "";
}


/* =========================================================
   AMBIL TAHUN
========================================================= */

function ambilTahun($item)
{
    if (!is_array($item)) {
        return null;
    }

    $fields = [
        "tahun",
        "tahun_kegiatan",
        "tahun_pelaksanaan",
        "year"
    ];

    foreach ($fields as $field) {

        if (
            isset($item[$field]) &&
            trim((string)$item[$field]) !== ""
        ) {
            return trim(
                (string)$item[$field]
            );
        }
    }

    return null;
}


/* =========================================================
   KONVERSI PORTFOLIO
========================================================= */

function formatPortfolio($response)
{
    $hasil = [];

    $items = ambilArray($response);

    foreach ($items as $item) {

        $judul = ambilJudul($item);

        if ($judul === "") {
            continue;
        }

        $tahun = ambilTahun($item);

        $baris = [
            "judul" => $judul
        ];

        if ($tahun !== null) {
            $baris["tahun"] = $tahun;
        }

        $hasil[] = $baris;
    }

    return $hasil;
}


/* =========================================================
   PROSES 312 DOSEN
========================================================= */

foreach ($dosenList as $index => &$dosen) {

    $nama = trim(
        (string)($dosen["nama"] ?? "")
    );

    $nidn = trim(
        (string)($dosen["nidn"] ?? "")
    );

    echo "<div style='font-family:Arial'>";
    echo "<b>" . ($index + 1) . " / " . $total . "</b> ";
    echo htmlspecialchars($nama);
    echo " - NIDN: ";
    echo htmlspecialchars($nidn);
    echo "<br>";

    flush();

    /*
     * NIDN kosong tidak bisa dicari
     */

    if ($nidn === "") {

        echo "⚠️ NIDN kosong<br><br>";

        $dilewati++;

        continue;
    }


    /*
     * =====================================================
     * CARI DOSEN BERDASARKAN NIDN
     * =====================================================
     */

    $urlSearch =
        $API .
        "/search/dosen/" .
        rawurlencode($nidn) .
        "/";

    $search = requestAPI(
        $urlSearch
    );

    $hasilSearch = ambilArray(
        $search
    );

    $idDosen = "";


    /*
     * Cari hasil yang NIDN-nya benar-benar cocok
     */

    foreach ($hasilSearch as $hasil) {

        if (!is_array($hasil)) {
            continue;
        }

        $nidnHasil = trim(
            (string)(
                $hasil["nidn"] ??
                $hasil["NIDN"] ??
                ""
            )
        );

        if (
            $nidnHasil === $nidn
        ) {

            $idDosen =
                $hasil["id"] ??
                $hasil["id_dosen"] ??
                $hasil["id_sdm"] ??
                "";

            break;
        }
    }


    /*
     * Kalau tidak ditemukan
     */

    if ($idDosen === "") {

        echo "❌ ID dosen tidak ditemukan<br><br>";

        $gagal++;

        continue;
    }

    echo "ID Dosen ditemukan: ";
    echo htmlspecialchars(
        (string)$idDosen
    );
    echo "<br>";


    /*
     * =====================================================
     * PENELITIAN
     * =====================================================
     */

    $penelitian = requestAPI(
        $API .
        "/dosen/penelitian/" .
        rawurlencode($idDosen) .
        "/"
    );


    /*
     * =====================================================
     * PENGABDIAN
     * =====================================================
     */

    $pengabdian = requestAPI(
        $API .
        "/dosen/pengabdian/" .
        rawurlencode($idDosen) .
        "/"
    );


    /*
     * =====================================================
     * PUBLIKASI / KARYA
     * =====================================================
     */

    $publikasi = requestAPI(
        $API .
        "/dosen/karya/" .
        rawurlencode($idDosen) .
        "/"
    );


    /*
     * =====================================================
     * PATEN / HKI
     * =====================================================
     */

    $paten = requestAPI(
        $API .
        "/dosen/paten/" .
        rawurlencode($idDosen) .
        "/"
    );


    /*
     * =====================================================
     * SIMPAN PORTFOLIO
     * =====================================================
     */

    $dataPenelitian =
        formatPortfolio(
            $penelitian
        );

    $dataPengabdian =
        formatPortfolio(
            $pengabdian
        );

    $dataPublikasi =
        formatPortfolio(
            $publikasi
        );

    $dataPaten =
        formatPortfolio(
            $paten
        );


    /*
     * HANYA mengganti portfolio.
     * IDENTITAS DOSEN TIDAK DISENTUH.
     */

    if (count($dataPenelitian) > 0) {
        $dosen["penelitian"] =
            $dataPenelitian;
    }

    if (count($dataPengabdian) > 0) {
        $dosen["pengabdian"] =
            $dataPengabdian;
    }

    if (count($dataPublikasi) > 0) {
        $dosen["publikasi"] =
            $dataPublikasi;
    }

    if (count($dataPaten) > 0) {
        $dosen["paten"] =
            $dataPaten;
    }


    echo "Penelitian: ";
    echo count($dataPenelitian);
    echo "<br>";

    echo "Pengabdian: ";
    echo count($dataPengabdian);
    echo "<br>";

    echo "Publikasi: ";
    echo count($dataPublikasi);
    echo "<br>";

    echo "Paten: ";
    echo count($dataPaten);
    echo "<br><br>";

    $berhasil++;

    /*
     * Jeda sedikit agar tidak terlalu agresif
     */

    usleep(200000);
}

unset($dosen);


/* =========================================================
   SIMPAN DATA.JSON
========================================================= */

$jsonBaru = json_encode(
    $data,
    JSON_PRETTY_PRINT |
    JSON_UNESCAPED_UNICODE |
    JSON_UNESCAPED_SLASHES
);

if ($jsonBaru === false) {
    die("Gagal membuat JSON.");
}

if (
    file_put_contents(
        $file,
        $jsonBaru
    ) === false
) {
    die("Gagal menyimpan data.json.");
}


/* =========================================================
   HASIL AKHIR
========================================================= */

echo "<hr>";

echo "<h2>SELESAI</h2>";

echo "Jumlah dosen: <b>"
    . $total .
    "</b><br>";

echo "Berhasil diproses: <b>"
    . $berhasil .
    "</b><br>";

echo "Dilewati: <b>"
    . $dilewati .
    "</b><br>";

echo "Gagal ditemukan: <b>"
    . $gagal .
    "</b><br>";

echo "<br>";

echo "<b>data.json sudah diperbarui.</b>";

echo "</div>";

?>
