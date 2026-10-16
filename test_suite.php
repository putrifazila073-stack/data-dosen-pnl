<?php
/**
 * Test Suite - Validasi Fitur Data Dosen Politeknik Negeri Lhokseumawe
 */

echo "=======================================================\n";
echo "TEST SUITE: DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE\n";
echo "=======================================================\n\n";

$passCount = 0;
$failCount = 0;

function assertTest($description, $condition) {
    global $passCount, $failCount;
    if ($condition) {
        echo " [PASS] $description\n";
        $passCount++;
    } else {
        echo "![FAIL] $description\n";
        $failCount++;
    }
}

// 1. Uji data.json ketersediaan dan jumlah 312 dosen
$jsonFile = __DIR__ . '/data.json';
assertTest("File data.json tersedia", file_exists($jsonFile));

$data = json_decode(file_get_contents($jsonFile), true);
assertTest("data.json format valid JSON", is_array($data));
assertTest("Jumlah dosen di data.json tepat 312 dosen", count($data) === 312);

// 2. Uji keberadaan dosen khusus
$mursyidah = null;
$aryati = null;
$azwinur = null;
$trmLecturers = [];

foreach ($data as $d) {
    if (strpos($d['nama'], 'MURSYIDAH') !== false) {
        $mursyidah = $d;
    }
    if (strpos($d['nama'], 'ARYATI') !== false) {
        $aryati = $d;
    }
    if (strpos($d['nama'], 'AZWINUR') !== false) {
        $azwinur = $d;
    }
    if (strpos($d['nama'], 'ASWANDI') !== false) {
        $aswandi = $d;
    }
    if (trim($d['prodi']) === 'Teknologi Rekayasa Multimedia') {
        $trmLecturers[] = $d;
    }
}

assertTest("Dosen MURSYIDAH ditemukan (NIDN 0005017304)", $mursyidah !== null && $mursyidah['nidn'] === '0005017304');
assertTest("Dosen ARYATI ditemukan (NIDN 0009067504)", $aryati !== null && $aryati['nidn'] === '0009067504');
assertTest("Dosen AZWINUR ditemukan (NIDN 0010057905)", $azwinur !== null && $azwinur['nidn'] === '0010057905');
assertTest("Dosen ASWANDI ditemukan (NIDN 0024097203)", $aswandi !== null && $aswandi['nidn'] === '0024097203');

// 3. Uji Portofolio MURSYIDAH & ASWANDI
assertTest("MURSYIDAH memiliki Penelitian terverifikasi PDDIKTI (5 penelitian)", count($mursyidah['penelitian']) === 5);
assertTest("ASWANDI memiliki Penelitian terverifikasi PDDIKTI (9 penelitian)", count($aswandi['penelitian']) === 9);
assertTest("MURSYIDAH memiliki Pengabdian = 0", count($mursyidah['pengabdian']) === 0);
assertTest("MURSYIDAH memiliki Publikasi = 2", count($mursyidah['publikasi']) === 2);

// 4. Uji Program Studi Teknologi Rekayasa Multimedia
assertTest("Program Studi Teknologi Rekayasa Multimedia memiliki 9 dosen", count($trmLecturers) === 9);

$trmPenelitian = 0;
$trmPengabdian = 0;
$trmPublikasiTotal = 0;
$trmPublikasiUnique = [];

foreach ($trmLecturers as $d) {
    $trmPenelitian += count($d['penelitian']);
    $trmPengabdian += count($d['pengabdian']);
    $trmPublikasiTotal += count($d['publikasi']);
    foreach ($d['publikasi'] as $pub) {
        $key = !empty($pub['url']) ? $pub['url'] : strtolower(preg_replace('/[^a-z0-9]/', '', $pub['judul']));
        $trmPublikasiUnique[$key] = true;
    }
}

assertTest("TRM Total Penelitian terverifikasi PDDIKTI (47 penelitian)", $trmPenelitian === 47);
assertTest("TRM Total Pengabdian = 0", $trmPengabdian === 0);
assertTest("TRM Total Publikasi Masukan = 20", $trmPublikasiTotal === 20);
assertTest("TRM Total Publikasi Unik (Deduplikasi Karya Bersama) = 19", count($trmPublikasiUnique) === 19);

// 5. Uji Sumber & Tahun pada Karya Publikasi
$hasYearAndSource = true;
foreach ($mursyidah['publikasi'] as $pub) {
    if (empty($pub['judul']) || empty($pub['tahun']) || empty($pub['sumber'])) {
        $hasYearAndSource = false;
    }
}
assertTest("Publikasi MURSYIDAH memiliki Judul, Tahun, dan Sumber valid (GARUDA)", $hasYearAndSource);

// 6. Uji ARYATI tidak bocor ke dosen lain
assertTest("ARYATI ID berbeda dari MURSYIDAH", $aryati['id'] !== $mursyidah['id']);
assertTest("ARYATI NIDN berbeda dari MURSYIDAH", $aryati['nidn'] !== $mursyidah['nidn']);

$aryatiTitles = array_column($aryati['penelitian'], 'judul');
$mursyidahTitles = array_column($mursyidah['penelitian'], 'judul');
$overlap = array_intersect($aryatiTitles, $mursyidahTitles);
assertTest("Penelitian ARYATI tidak tertukar pada MURSYIDAH", count($overlap) === 0 && count($aryati['penelitian']) === 3 && count($mursyidah['penelitian']) === 5);

// 7. Uji Vercel Configuration
$vercelJson = __DIR__ . '/vercel.json';
assertTest("File vercel.json tersedia", file_exists($vercelJson));
$vercelData = json_decode(file_get_contents($vercelJson), true);
assertTest("vercel.json format valid JSON", is_array($vercelData));
assertTest("vercel.json memiliki rute cleanUrls dan routing tepat", isset($vercelData['routes']) && count($vercelData['routes']) > 0);

// 8. Uji Struktur HTML pada index.html
$indexHtml = file_get_contents(__DIR__ . '/index.html');
assertTest("index.html memuat filter Program Studi (#filter-prodi)", strpos($indexHtml, 'id="filter-prodi"') !== false);
assertTest("index.html memuat 4 kotak statistik (#stat-dosen-count, #stat-penelitian-count, dll)", 
    strpos($indexHtml, 'id="stat-dosen-count"') !== false &&
    strpos($indexHtml, 'id="stat-penelitian-count"') !== false &&
    strpos($indexHtml, 'id="stat-pengabdian-count"') !== false &&
    strpos($indexHtml, 'id="stat-publikasi-count"') !== false
);
assertTest("index.html memuat tabel utama dosen (#dosen-table)", strpos($indexHtml, 'id="dosen-table"') !== false);
assertTest("index.html memuat tombol unduh data (#btn-unduh-toggle)", strpos($indexHtml, 'id="btn-unduh-toggle"') !== false);
assertTest("index.html memuat modal rincian karya (#modal-karya)", strpos($indexHtml, 'id="modal-karya"') !== false);
assertTest("index.html menghubungkan script.js", strpos($indexHtml, 'script.js') !== false);
assertTest("index.html menghubungkan style.css", strpos($indexHtml, 'style.css') !== false);

// 9. Uji Struktur script.js
$scriptJs = file_get_contents(__DIR__ . '/script.js');
assertTest("script.js memuat calculateProdiStats", strpos($scriptJs, 'calculateProdiStats') !== false);
assertTest("script.js memuat downloadCsvAllDosen", strpos($scriptJs, 'downloadCsvAllDosen') !== false);
assertTest("script.js memuat downloadCsvByProdi", strpos($scriptJs, 'downloadCsvByProdi') !== false);
assertTest("script.js memuat downloadJsonFullPortfolio", strpos($scriptJs, 'downloadJsonFullPortfolio') !== false);
assertTest("script.js memuat downloadCsvWorksDetail", strpos($scriptJs, 'downloadCsvWorksDetail') !== false);
assertTest("script.js memuat openModalKarya", strpos($scriptJs, 'openModalKarya') !== false);
assertTest("script.js memuat renderDetailPagePortfolioTable", strpos($scriptJs, 'renderDetailPagePortfolioTable') !== false);

// 10. Uji Detail.html
$detailHtml = file_get_contents(__DIR__ . '/detail.html');
assertTest("detail.html menghubungkan script.js", strpos($detailHtml, 'script.js') !== false);
assertTest("detail.html memiliki container tabel portofolio", strpos($detailHtml, 'container-penelitian') !== false);

echo "\n=======================================================\n";
echo "HASIL PENGUJIAN: $passCount LULUS, $failCount GAGAL\n";
echo "=======================================================\n";

if ($failCount === 0) {
    echo "SELURUH PENGUJIAN BERHASIL SEMPURNA (100% PASS)\n";
} else {
    echo "ADA PENGUJIAN YANG GAGAL!\n";
}

