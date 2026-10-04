
<?php

$file = __DIR__ . "/data.json";

if (!file_exists($file)) {
    die("File data.json tidak ditemukan.");
}

$data = json_decode(file_get_contents($file), true);

if (!$data || !isset($data["dosen"]) || !is_array($data["dosen"])) {
    die("Format data.json tidak valid.");
}

/*
|--------------------------------------------------------------------------
| DATA PORTFOLIO
|--------------------------------------------------------------------------
| Isi berdasarkan NIDN.
| Data identitas dosen TIDAK DIUBAH.
*/

$portfolio = [

    // =========================
    // GUNTUR SYAHPUTRA
    // =========================
    "0127118701" => [

        "penelitian" => [
            [
                "judul" => "RANCANG BANGUN NAS SERVER DI LINGKUNGAN JURUSAN TIK PNL DALAM UPAYA MENGURANGI KETERGANTUNGAN TERHADAP JARINGAN INTERNET",
                "tahun" => 2024
            ],
            [
                "judul" => "Implementasi Pengukuran Capaian Pembelajaran Lulusan Berbasis Website",
                "tahun" => 2026
            ]
        ],

        "pengabdian" => [
            [
                "judul" => "Penerapan Virtual Reality (VR) Berbasis Video 360 dalam Rangka Optimalisasi Teknologi Multimedia untuk Mendukung Sarana Promosi Sekolah pada SMK N 5 Lhokseumawe",
                "tahun" => 2024
            ],
            [
                "judul" => "Pelatihan Penerapan Sistem Layanan Informasi Bagi Guru SMKN 5 Lhokseumawe",
                "tahun" => 2022
            ],
            [
                "judul" => "Rancang Bangun Network Attached Storage (NAS) Server pada Ruang Lingkup Jurusan Teknologi Informasi dan Komputer Politeknik Negeri Lhokseumawe dalam Upaya Mengurangi Ketergantungan terhadap Jaringan Internet",
                "tahun" => 2023
            ]
        ],

        "publikasi" => [
            [
                "judul" => "Implementasi Aplikasi The Dude Untuk Monitoring Jaringan Berbasis Telegram",
                "tahun" => 2025
            ],
            [
                "judul" => "Analisis Dan Perancangan Virtual Tour Berbasis Video 360 Pada Gedung Jurusan Teknologi Informasi Dan Komputer Menggunakan Teknik Multi Panorama",
                "tahun" => 2025
            ],
            [
                "judul" => "Perancangan Game 2D \"Bertutur Aceh Dasar\" Berbasis Android",
                "tahun" => 2026
            ],
            [
                "judul" => "Pembuatan Game 3D Petualangan Labirin Menggunakan Algoritma Dijkstra pada Non-Player Character (NPC)",
                "tahun" => 2024
            ],
            [
                "judul" => "Analisa Perbandingan Honeypot Cowrie dan Honeypot Dionaea dalam Mendeteksi Serangan Port Scanning dan Brute Force",
                "tahun" => 2024
            ],
            [
                "judul" => "Peningkatan Ketrampilan Penggunaan Teknologi Informasi pada Sistem Pembelajaran Daring bagi Guru SMK Negeri 5 Lhokseumawe",
                "tahun" => 2021
            ]
        ],

        "paten" => []
    ],


    // =========================
    // ARYATI
    // =========================
    "0009067504" => [

        "penelitian" => [
            [
                "judul" => "Analisis Vector dalam Penentuan Determinan Perdagangan Suku Ritel di Indonesia",
                "tahun" => 2025
            ],
            [
                "judul" => "Penerapan Financial Technology, Literasi Dan Inklusi Keuangan Terhadap Peningkatan Kinerja UMKM Di Kota Lhokseumawe",
                "tahun" => 2024
            ],
            [
                "judul" => "ANALISA GOOD CORPORATE GOVERNANCE TERHADAP KINERJA PERUSAHAAN PADA EMITEN JAKARTA ISLAMIC INDEX 70",
                "tahun" => 2023
            ]
        ],

        "pengabdian" => [
            [
                "judul" => "Pemanfaatan AI Tools dan Media Sosial dalam Membangun Strategi Pengemasan dan Pemasaran Produk pada UMKM Ahad Festival Kota Lhokseumawe",
                "tahun" => 2026
            ],
            [
                "judul" => "Pelatihan Pemanfaatan Dana Desa Dalam Mewujudkan Desa Mandiri Bagi Pemuda Gampong Meunasah Mesjid Dalam Perspektif Undang-Undang Nomor 6 Tahun 2014 Tentang Desa",
                "tahun" => 2024
            ],
            [
                "judul" => "Pelatihan Pengelolaan Keuangan Dan Penggunaan Digital Marketing Bagi UMKM Binaan Politeknik Negeri Lhokseumawe",
                "tahun" => 2022
            ],
            [
                "judul" => "Pelatihan Menyusun Laporan Pengelolaan Dana Gampong Untuk Penanggulangan Covid 19 Gampong Alue Lim Kecamatan Blang Mangat Lhokseumawe",
                "tahun" => 2021
            ]
        ],

        "publikasi" => [
            [
                "judul" => "Analysis of the Implementation of the Purchase Accounting Information System at PT Indonesia Asahan Aluminum",
                "tahun" => 2024
            ],
            [
                "judul" => "ANALYSIS OF RETURN ON EQUITY, CURRENT RATIO AND DEBT TO EQUITY RATIO TO CHANGES IN PROFIT IN SHARIA ISSUERS JAKARTA ISLAMIC INDEX",
                "tahun" => 2022
            ],
            [
                "judul" => "The Effect of Internal and External Factors on Non-Performing Financing at Islamic Commercial Banks in Indonesia",
                "tahun" => 2022
            ]
        ],

        "paten" => []
    ]

];


/*
|--------------------------------------------------------------------------
| PROSES
|--------------------------------------------------------------------------
*/

$jumlahDosen = count($data["dosen"]);
$jumlahDiupdate = 0;

foreach ($data["dosen"] as &$dosen) {

    $nidn = trim((string)($dosen["nidn"] ?? ""));

    /*
     * Kalau NIDN ditemukan dalam daftar portfolio,
     * hanya portfolio yang diubah.
     */
    if ($nidn !== "" && isset($portfolio[$nidn])) {

        $dosen["penelitian"] = $portfolio[$nidn]["penelitian"];
        $dosen["pengabdian"] = $portfolio[$nidn]["pengabdian"];
        $dosen["publikasi"] = $portfolio[$nidn]["publikasi"];
        $dosen["paten"] = $portfolio[$nidn]["paten"];

        $jumlahDiupdate++;
    }

    /*
     * Kalau portfolio belum ada, jangan hapus data lama.
     */
    if (!isset($dosen["penelitian"])) {
        $dosen["penelitian"] = [];
    }

    if (!isset($dosen["pengabdian"])) {
        $dosen["pengabdian"] = [];
    }

    if (!isset($dosen["publikasi"])) {
        $dosen["publikasi"] = [];
    }

    if (!isset($dosen["paten"])) {
        $dosen["paten"] = [];
    }
}

unset($dosen);


/*
|--------------------------------------------------------------------------
| SIMPAN
|--------------------------------------------------------------------------
*/

$jsonBaru = json_encode(
    $data,
    JSON_PRETTY_PRINT |
    JSON_UNESCAPED_UNICODE |
    JSON_UNESCAPED_SLASHES
);

if ($jsonBaru === false) {
    die("Gagal membuat JSON.");
}

if (file_put_contents($file, $jsonBaru) === false) {
    die("Gagal menyimpan data.json.");
}


/*
|--------------------------------------------------------------------------
| HASIL
|--------------------------------------------------------------------------
*/

echo "<!DOCTYPE html>";
echo "<html lang='id'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<title>Update Portfolio Dosen</title>";
echo "<style>
body{
    font-family:Arial,sans-serif;
    background:#f4f1ff;
    padding:40px;
}
.box{
    max-width:600px;
    margin:auto;
    background:white;
    padding:30px;
    border-radius:15px;
    box-shadow:0 5px 20px rgba(0,0,0,.1);
}
h1{
    color:#6d28d9;
}
.success{
    background:#ecfdf5;
    padding:15px;
    border-radius:10px;
    color:#166534;
}
.info{
    margin-top:15px;
    line-height:1.8;
}
</style>";
echo "</head>";
echo "<body>";

echo "<div class='box'>";
echo "<h1>Update Portfolio Dosen</h1>";

echo "<div class='success'>";
echo "Berhasil memperbarui data portfolio.";
echo "</div>";

echo "<div class='info'>";
echo "Jumlah dosen: <b>" . $jumlahDosen . "</b><br>";
echo "Data dosen yang diperbarui: <b>" . $jumlahDiupdate . "</b><br>";
echo "Data identitas dosen tetap dipertahankan.";
echo "</div>";

echo "</div>";

echo "</body>";
echo "</html>";

?>
