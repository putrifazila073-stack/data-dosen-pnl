<?php
/**
 * api.php - Proxy API PDDIKTI untuk XAMPP Localhost
 * Menangani request yang sama seperti /api/pddikti.js di Vercel
 */

// Izinkan CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ambil parameter
$params = array_merge($_GET, $_POST);
if (!$params && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true) ?? [];
    $params = $body;
}

$action = strtolower($params['action'] ?? 'search');
$keyword = $params['keyword'] ?? $params['nama'] ?? $params['q'] ?? '';
$id = $params['id'] ?? $params['id_dosen'] ?? $params['id_sdm'] ?? $params['idSdm'] ?? $params['sdm_id'] ?? $params['uuid'] ?? '';
$nidn = $params['nidn'] ?? $params['nidnHint'] ?? '';

// Headers untuk request ke PDDIKTI
$requestHeaders = [
    'Accept: application/json, text/plain, */*',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    'Origin: https://pddikti.kemdiktisaintek.go.id',
    'Referer: https://pddikti.kemdiktisaintek.go.id/',
];

/**
 * POST request ke PDDIKTI
 */
function postPDDIKTI($url, $id, $headers) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['id' => $id]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array_merge($headers, ['Content-Type: application/json']));
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        return ['sukses' => false, 'data' => [], 'pesan' => 'cURL error: ' . $error];
    }

    $result = json_decode($response, true) ?? [];
    return [
        'sukses' => $httpCode >= 200 && $httpCode < 300,
        'data' => $result['data'] ?? [],
        'pesan' => $result['message'] ?? ($httpCode === 200 ? 'Data berhasil diambil' : 'Data gagal diambil'),
    ];
}

// ========================
// PENCARIAN DOSEN
// ========================
if (in_array($action, ['search', 'cari', 'pencarian'])) {
    if (!trim($keyword)) {
        echo json_encode(['sukses' => false, 'pesan' => 'Nama dosen belum diisi', 'data' => []]);
        exit;
    }

    $url = 'https://pddikti.kemdiktisaintek.go.id/api/pencarian/dosen/' . urlencode(trim($keyword));
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $requestHeaders);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $result = json_decode($response, true) ?? [];
    echo json_encode([
        'sukses' => $httpCode === 200,
        'pesan' => $httpCode === 200 ? 'Pencarian berhasil' : 'Pencarian gagal',
        'data' => is_array($result['data'] ?? null) ? $result['data'] : [],
    ]);
    exit;
}

// ========================
// CEK ID DOSEN
// ========================
if (!$id) {
    echo json_encode(['sukses' => false, 'pesan' => 'ID dosen belum diberikan', 'data' => []]);
    exit;
}

// ========================
// PROFIL
// ========================
if (in_array($action, ['profile', 'profil'])) {
    $result = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/profile', $id, $requestHeaders);
    echo json_encode($result);
    exit;
}

// ========================
// PENELITIAN
// ========================
if ($action === 'penelitian') {
    $result = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian', $id, $requestHeaders);
    echo json_encode($result);
    exit;
}

// ========================
// PENGABDIAN
// ========================
if (in_array($action, ['pengabdian', 'pengabdian_masyarakat'])) {
    $result = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian', $id, $requestHeaders);
    echo json_encode($result);
    exit;
}

// ========================
// PUBLIKASI / KARYA
// ========================
if (in_array($action, ['publikasi', 'karya'])) {
    $result = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya', $id, $requestHeaders);
    echo json_encode($result);
    exit;
}

// ========================
// HKI / PATEN
// ========================
if (in_array($action, ['paten', 'hki'])) {
    $result = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten', $id, $requestHeaders);
    echo json_encode($result);
    exit;
}

// ========================
// SEMUA DATA DOSEN
// ========================
if (in_array($action, ['detail', 'all', 'semua'])) {
    $hasil = [];
    $hasil['profil'] = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/profile', $id, $requestHeaders);
    $hasil['penelitian'] = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian', $id, $requestHeaders);
    $hasil['pengabdian'] = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian', $id, $requestHeaders);
    $hasil['publikasi'] = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya', $id, $requestHeaders);
    $hasil['paten'] = postPDDIKTI('https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten', $id, $requestHeaders);

    if ($nidn && isset($hasil['profil']['data']) && is_array($hasil['profil']['data'])) {
        $hasil['profil']['data']['nidn'] = $nidn;
    }

    echo json_encode([
        'sukses' => true,
        'pesan' => 'Data dosen berhasil diambil',
        'data' => $hasil,
    ]);
    exit;
}

// Action tidak dikenali
echo json_encode(['sukses' => false, 'pesan' => 'Action tidak dikenali: ' . $action, 'data' => []]);
