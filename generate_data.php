
<?php

$url = "https://data.pnl.ac.id/dosen/list";

echo "<!DOCTYPE html>";
echo "<html lang='id'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<title>Generate Data Dosen PNL</title>";

echo "
<style>
body {
    font-family: Arial, sans-serif;
    background: #f5f3fa;
    padding: 30px;
    color: #222;
}

.box {
    max-width: 800px;
    margin: auto;
    background: white;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.08);
}

h1 {
    color: #5b21b6;
}

.success {
    background: #dcfce7;
    color: #166534;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
}

.error {
    background: #fee2e2;
    color: #991b1b;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
}

.info {
    background: #f3e8ff;
    color: #581c87;
    padding: 15px;
    border-radius: 10px;
    margin: 15px 0;
}

code {
    background: #f1f5f9;
    padding: 3px 6px;
    border-radius: 5px;
}
</style>
";

echo "</head>";
echo "<body>";

echo "<div class='box'>";

echo "<h1>Generate Data Dosen PNL</h1>";
echo "<p>Mengambil data dari portal resmi Politeknik Negeri Lhokseumawe...</p>";


/* =========================
   AMBIL HALAMAN PNL
========================= */

$ch = curl_init($url);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_SSL_VERIFYHOST => false,
    CURLOPT_CONNECTTIMEOUT => 15,
    CURLOPT_TIMEOUT => 60,

    CURLOPT_USERAGENT =>
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " .
        "AppleWebKit/537.36 (KHTML, like Gecko) " .
        "Chrome/154.0.0.0 Safari/537.36",

    CURLOPT_HTTPHEADER => [
        "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language: id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7"
    ]
]);

$html = curl_exec($ch);

$httpCode = curl_getinfo(
    $ch,
    CURLINFO_HTTP_CODE
);

$curlError = curl_error($ch);

curl_close($ch);


/* =========================
   CEK REQUEST
========================= */

if ($html === false || empty($html)) {

    echo "<div class='error'>";
    echo "<strong>Gagal mengambil halaman PNL.</strong><br><br>";
    echo "Error: " . htmlspecialchars($curlError);
    echo "</div>";

    echo "</div></body></html>";

    exit;
}


if ($httpCode < 200 || $httpCode >= 300) {

    echo "<div class='error'>";
    echo "<strong>Server PNL memberikan HTTP $httpCode.</strong>";
    echo "</div>";

    echo "</div></body></html>";

    exit;
}


/* =========================
   PARSING HTML
========================= */

libxml_use_internal_errors(true);

$dom = new DOMDocument();

$loaded = $dom->loadHTML(
    '<?xml encoding="UTF-8">' . $html
);

if (!$loaded) {

    echo "<div class='error'>";
    echo "<strong>HTML PNL tidak dapat dibaca.</strong>";
    echo "</div>";

    echo "</div></body></html>";

    exit;
}

$xpath = new DOMXPath($dom);


/* =========================
   CARI BARIS TABEL
========================= */

$rows = $xpath->query("//table//tbody/tr");

if ($rows->length === 0) {
    $rows = $xpath->query("//table//tr");
}


/* =========================
   ARRAY DOSEN
========================= */

$dosen = [];

$nomor = 1;


/* =========================
   BERSIHKAN TEKS
========================= */

function bersihkanTeks($text)
{
    $text = html_entity_decode(
        $text,
        ENT_QUOTES | ENT_HTML5,
        'UTF-8'
    );

    $text = preg_replace(
        '/\s+/',
        ' ',
        $text
    );

    return trim($text);
}


/* =========================
   BUAT ID
========================= */

function buatId($nomor, $nama)
{
    $nama = strtolower($nama);

    $nama = preg_replace(
        '/[^a-z0-9]+/',
        '-',
        $nama
    );

    $nama = trim(
        $nama,
        '-'
    );

    return "pnl-" .
        str_pad(
            $nomor,
            3,
            "0",
            STR_PAD_LEFT
        ) .
        "-" .
        $nama;
}


/* =========================
   BACA SETIAP BARIS
========================= */

foreach ($rows as $row) {

    $cells = $xpath->query(
        "./td",
        $row
    );

    /*
    Kolom resmi PNL:

    0  No
    1  Nama Dosen
    2  NIDN
    3  NUPTK
    4  Pendidikan
    5  Status Aktif
    6  Status Pegawai
    7  Ikatan Kerja
    8  Program Studi
    9  Jurusan
    10 Semester
    */

    if ($cells->length < 10) {
        continue;
    }


    $no = bersihkanTeks(
        $cells->item(0)->textContent
    );


    if (!preg_match('/^\d+$/', $no)) {
        continue;
    }


    $nama = bersihkanTeks(
        $cells->item(1)->textContent
    );

    $nidn = bersihkanTeks(
        $cells->item(2)->textContent
    );

    $pendidikan = bersihkanTeks(
        $cells->item(4)->textContent
    );

    $statusAktif = bersihkanTeks(
        $cells->item(5)->textContent
    );

    $statusPegawai = bersihkanTeks(
        $cells->item(6)->textContent
    );

    $ikatanKerja = bersihkanTeks(
        $cells->item(7)->textContent
    );

    $prodi = bersihkanTeks(
        $cells->item(8)->textContent
    );

    $jurusan = bersihkanTeks(
        $cells->item(9)->textContent
    );

    $semester = "";

    if ($cells->length > 10) {

        $semester = bersihkanTeks(
            $cells->item(10)->textContent
        );
    }


    if ($nidn === "-") {
        $nidn = "";
    }


    if ($prodi === "") {
        $prodi = "-";
    }


    $id = buatId(
        $nomor,
        $nama
    );


    $dosen[] = [

        "id" => $id,

        "nama" => $nama,

        "nidn" => $nidn,

        "perguruan_tinggi" =>
            "Politeknik Negeri Lhokseumawe",

        "prodi" => $prodi,

        "jurusan" => $jurusan,

        "jabatan_fungsional" => "",

        "pendidikan_terakhir" =>
            $pendidikan,

        "status_kepegawaian" =>
            $statusPegawai,

        "status_aktivitas" =>
            $statusAktif,

        "ikatan_kerja" =>
            $ikatanKerja,

        "semester" =>
            $semester,

        "penelitian" => [],

        "pengabdian" => [],

        "publikasi" => [],

        "paten" => []
    ];


    $nomor++;
}


/* =========================
   JUMLAH DATA
========================= */

$jumlahDosen = count($dosen);

echo "<div class='info'>";
echo "<strong>Data berhasil dibaca dari portal PNL.</strong><br>";
echo "Jumlah data ditemukan: <strong>";
echo $jumlahDosen;
echo "</strong>";
echo "</div>";


/* =========================
   HARUS 312 DATA
========================= */

if ($jumlahDosen !== 312) {

    echo "<div class='error'>";

    echo "<strong>PERHATIAN!</strong><br><br>";

    echo "Portal PNL seharusnya menampilkan 312 entri, ";
    echo "tetapi script membaca ";
    echo "<strong>" . $jumlahDosen . "</strong> entri.<br><br>";

    echo "Untuk keamanan, data.json tidak dibuat.";

    echo "</div>";

    echo "</div></body></html>";

    exit;
}


/* =========================
   DATA.JSON LAMA
========================= */

$fileLama = __DIR__ . "/data.json";

$dataLama = [];

if (file_exists($fileLama)) {

    $isiLama = file_get_contents(
        $fileLama
    );

    $jsonLama = json_decode(
        $isiLama,
        true
    );

    if (
        is_array($jsonLama) &&
        isset($jsonLama["dosen"]) &&
        is_array($jsonLama["dosen"])
    ) {

        $dataLama =
            $jsonLama["dosen"];
    }
}


/* =========================
   SIMPAN DATA LAMA BERDASARKAN NIDN
========================= */

$lamaByNidn = [];

foreach ($dataLama as $lama) {

    $nidnLama = trim(
        (string)(
            $lama["nidn"] ?? ""
        )
    );

    if ($nidnLama !== "") {

        $lamaByNidn[$nidnLama] =
            $lama;
    }
}


/* =========================
   PERTAHANKAN DATA ARYATI
========================= */

foreach ($dosen as &$item) {

    $nidnSekarang = trim(
        (string)(
            $item["nidn"] ?? ""
        )
    );


    if (
        $nidnSekarang !== "" &&
        isset(
            $lamaByNidn[$nidnSekarang]
        )
    ) {

        $lama =
            $lamaByNidn[$nidnSekarang];


        if (
            !empty(
                $lama["jabatan_fungsional"]
            )
        ) {

            $item["jabatan_fungsional"] =
                $lama["jabatan_fungsional"];
        }


        if (
            isset($lama["penelitian"]) &&
            is_array($lama["penelitian"])
        ) {

            $item["penelitian"] =
                $lama["penelitian"];
        }


        if (
            isset($lama["pengabdian"]) &&
            is_array($lama["pengabdian"])
        ) {

            $item["pengabdian"] =
                $lama["pengabdian"];
        }


        if (
            isset($lama["publikasi"]) &&
            is_array($lama["publikasi"])
        ) {

            $item["publikasi"] =
                $lama["publikasi"];
        }


        if (
            isset($lama["paten"]) &&
            is_array($lama["paten"])
        ) {

            $item["paten"] =
                $lama["paten"];
        }
    }
}

unset($item);


/* =========================
   DATA YANG AKAN DISIMPAN
========================= */

$output = [

    "sumber" =>
        "Portal Data Politeknik Negeri Lhokseumawe",

    "url_sumber" =>
        $url,

    "jumlah_dosen" =>
        count($dosen),

    "dosen" =>
        $dosen
];


/* =========================
   UBAH KE JSON
========================= */

$json = json_encode(
    $output,
    JSON_PRETTY_PRINT |
    JSON_UNESCAPED_UNICODE |
    JSON_UNESCAPED_SLASHES
);


if ($json === false) {

    echo "<div class='error'>";

    echo "<strong>Gagal membuat JSON.</strong><br>";

    echo htmlspecialchars(
        json_last_error_msg()
    );

    echo "</div>";

    echo "</div></body></html>";

    exit;
}


/* =========================
   SIMPAN DATA.JSON
========================= */

$hasilSimpan = file_put_contents(
    $fileLama,
    $json
);


if ($hasilSimpan === false) {

    echo "<div class='error'>";

    echo "<strong>Gagal menyimpan data.json.</strong><br><br>";

    echo "Pastikan folder XAMPP dapat ditulis.";

    echo "</div>";

    echo "</div></body></html>";

    exit;
}


/* =========================
   SELESAI
========================= */

echo "<div class='success'>";

echo "<strong>BERHASIL!</strong><br><br>";

echo "File <code>data.json</code> berhasil dibuat.<br><br>";

echo "Jumlah dosen: <strong>";
echo count($dosen);
echo "</strong><br><br>";

echo "Data berasal dari portal resmi PNL.";

echo "</div>";


echo "<div class='info'>";

echo "<strong>Selanjutnya:</strong><br><br>";

echo "1. Buka file <code>data.json</code>.<br>";
echo "2. Pastikan jumlahnya 312 dosen.<br>";
echo "3. Jangan ubah isi datanya.<br>";
echo "4. Setelah itu baru upload <code>data.json</code> ke GitHub.";

echo "</div>";


echo "</div>";

echo "</body>";
echo "</html>";

?>
