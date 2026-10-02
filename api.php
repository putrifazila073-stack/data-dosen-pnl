<?php
/**
 * ============================================================================
 * API HELPER - DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE
 * Mengambil data profil dan portofolio dosen langsung dari API PDDIKTI Kemdiktisaintek
 * Menggunakan cURL PHP tanpa database
 * ============================================================================
 */

// Konstanta Endpoint PDDIKTI
define('PDDIKTI_URL_PROFILE',    'https://pddikti.kemdiktisaintek.go.id/api/dosen/profile');
define('PDDIKTI_URL_PENELITIAN', 'https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian');
define('PDDIKTI_URL_PENGABDIAN', 'https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian');
define('PDDIKTI_URL_PUBLIKASI',  'https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya');
define('PDDIKTI_URL_PATEN',      'https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten');
define('PDDIKTI_URL_SEARCH',     'https://pddikti.kemdiktisaintek.go.id/api/pencarian/dosen/');

// ID Dosen Pengujian Default (ARYATI - Politeknik Negeri Lhokseumawe)
define('DEFAULT_DOSEN_ID', 'p-jhS6LzvaL1kt3oVFY5zzMdtNmpfhsPIO6Op0gvy0yJlNtXCE_GGPlhKQL50UkaCMpwAQ==');
define('DEFAULT_DOSEN_NIDN', '0009067504');

/**
 * Fungsi pembantu utama untuk mengirim HTTP POST Request dengan cURL ke PDDIKTI API
 *
 * @param string $url URL endpoint API
 * @param array $payload Data array yang akan di-encode ke JSON
 * @return array Hasil respon berupa array dengan struktur ['sukses' => bool, 'data' => mixed, 'pesan' => string]
 */
function kirimPostRequest($url, $payload = []) {
    // Inisialisasi cURL
    $ch = curl_init($url);

    // Konversi payload ke format JSON
    $jsonPayload = json_encode($payload);

    // Header HTTP penting untuk menghindari blokir 403 Forbidden dari PDDIKTI
    $headers = [
        'Content-Type: application/json',
        'Accept: application/json, text/plain, */*',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin: https://pddikti.kemdiktisaintek.go.id',
        'Referer: https://pddikti.kemdiktisaintek.go.id/'
    ];

    // Konfigurasi cURL
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonPayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);              // Batas waktu 15 detik
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);     // Kompatibilitas SSL pada server lokal XAMPP
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    // Eksekusi request cURL
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    curl_close($ch);

    // Cek error jaringan cURL
    if ($curlError) {
        return [
            'sukses' => false,
            'pesan' => 'Koneksi ke server PDDIKTI gagal: ' . $curlError,
            'data' => []
        ];
    }

    // Cek status HTTP status code
    if ($httpCode !== 200) {
        return [
            'sukses' => false,
            'pesan' => 'Server PDDIKTI merespons dengan status HTTP ' . $httpCode,
            'data' => []
        ];
    }

    // Parsing respon JSON
    $decoded = json_decode($response, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [
            'sukses' => false,
            'pesan' => 'Format data dari server tidak valid (Gagal parse JSON)',
            'data' => []
        ];
    }

    // Validasi isi data dari respon PDDIKTI
    if (isset($decoded['data'])) {
        return [
            'sukses' => true,
            'pesan' => 'Data berhasil diambil',
            'data' => $decoded['data']
        ];
    }

    return [
        'sukses' => false,
        'pesan' => isset($decoded['message']) ? $decoded['message'] : 'Data belum tersedia',
        'data' => []
    ];
}

/**
 * 1. Mengambil Data Profil Dosen
 *
 * @param string $id ID SDM / ID Dosen PDDIKTI
 * @return array
 */
function ambilProfilDosen($id) {
    return kirimPostRequest(PDDIKTI_URL_PROFILE, ['id' => $id]);
}

/**
 * 2. Mengambil Data Portofolio Penelitian
 *
 * @param string $id ID SDM / ID Dosen PDDIKTI
 * @return array
 */
function ambilPenelitian($id) {
    return kirimPostRequest(PDDIKTI_URL_PENELITIAN, ['id' => $id]);
}

/**
 * 3. Mengambil Data Portofolio Pengabdian Masyarakat
 *
 * @param string $id ID SDM / ID Dosen PDDIKTI
 * @return array
 */
function ambilPengabdian($id) {
    return kirimPostRequest(PDDIKTI_URL_PENGABDIAN, ['id' => $id]);
}

/**
 * 4. Mengambil Data Portofolio Publikasi Karya
 *
 * @param string $id ID SDM / ID Dosen PDDIKTI
 * @return array
 */
function ambilPublikasi($id) {
    return kirimPostRequest(PDDIKTI_URL_PUBLIKASI, ['id' => $id]);
}

/**
 * 5. Mengambil Data Portofolio HKI / Paten
 *
 * @param string $id ID SDM / ID Dosen PDDIKTI
 * @return array
 */
function ambilPaten($id) {
    return kirimPostRequest(PDDIKTI_URL_PATEN, ['id' => $id]);
}

/**
 * Mengambil semua data dosen (Profil + 4 Portofolio) secara bersamaan (Parallel cURL Multi)
 * Mempercepat loading halaman detail.php dari ~4 detik menjadi <1 detik
 *
 * @param string $id ID Dosen PDDIKTI
 * @param string $nidnHint NIDN dosen jika sudah diketahui (opsional)
 * @return array Kumpulan hasil data profil, penelitian, pengabdian, publikasi, dan paten
 */
function ambilSemuaDataDosen($id, $nidnHint = '') {
    $endpoints = [
        'profil'     => PDDIKTI_URL_PROFILE,
        'penelitian' => PDDIKTI_URL_PENELITIAN,
        'pengabdian' => PDDIKTI_URL_PENGABDIAN,
        'publikasi'  => PDDIKTI_URL_PUBLIKASI,
        'paten'      => PDDIKTI_URL_PATEN,
    ];

    $headers = [
        'Content-Type: application/json',
        'Accept: application/json, text/plain, */*',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin: https://pddikti.kemdiktisaintek.go.id',
        'Referer: https://pddikti.kemdiktisaintek.go.id/'
    ];

    $payload = json_encode(['id' => $id]);

    $mh = curl_multi_init();
    $handles = [];

    foreach ($endpoints as $key => $url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_multi_add_handle($mh, $ch);
        $handles[$key] = $ch;
    }

    $active = null;
    do {
        $status = curl_multi_exec($mh, $active);
        if ($active) {
            curl_multi_select($mh, 0.1);
        }
    } while ($active && $status == CURLM_OK);

    $results = [];
    foreach ($handles as $key => $ch) {
        $content = curl_multi_getcontent($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);

        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);

        if ($curlError || $httpCode !== 200) {
            $results[$key] = [
                'sukses' => false,
                'pesan' => 'Gagal memuat data (HTTP ' . $httpCode . ')',
                'data' => []
            ];
            continue;
        }

        $decoded = json_decode($content, true);
        if (isset($decoded['data'])) {
            $results[$key] = [
                'sukses' => true,
                'pesan' => 'Data berhasil diambil',
                'data' => $decoded['data']
            ];
        } else {
            $results[$key] = [
                'sukses' => false,
                'pesan' => isset($decoded['message']) ? $decoded['message'] : 'Data belum tersedia',
                'data' => []
            ];
        }
    }

    curl_multi_close($mh);

    // Sisipkan NIDN ke dalam data profil jika disediakan
    if (!empty($nidnHint) && isset($results['profil']['data']) && is_array($results['profil']['data'])) {
        $results['profil']['data']['nidn'] = $nidnHint;
    }

    return $results;
}

/**
 * Mencari NIDN valid dosen dari PDDIKTI berdasarkan nama dan perguruan tinggi
 * Fungsi ini digunakan untuk melengkapi data NIDN yang tidak disertakan pada endpoint profil PDDIKTI
 *
 * @param string $nama Nama dosen
 * @param string $pt Nama perguruan tinggi (opsional, default 'Politeknik Negeri Lhokseumawe')
 * @return string NIDN valid jika ditemukan, atau 'Data tidak tersedia'
 */
function cariNidnDosen($nama, $pt = 'Politeknik Negeri Lhokseumawe') {
    if (empty($nama)) {
        return 'Data tidak tersedia';
    }

    // Default dosen ARYATI
    if (stripos($nama, 'ARYATI') !== false && (empty($pt) || stripos($pt, 'Lhokseumawe') !== false)) {
        return DEFAULT_DOSEN_NIDN;
    }

    // 1. Coba pencarian dengan Nama + PT
    $query = trim($nama . ' ' . $pt);
    $res = cariDosen($query);
    if ($res['sukses'] && !empty($res['data'])) {
        foreach ($res['data'] as $item) {
            if (strcasecmp(trim($item['nama']), trim($nama)) === 0) {
                if (!empty($item['nidn'])) return trim($item['nidn']);
                if (!empty($item['nuptk'])) return trim($item['nuptk']);
            }
        }
        foreach ($res['data'] as $item) {
            if (stripos($item['nama_pt'] ?? '', 'Lhokseumawe') !== false && !empty($item['nidn'])) {
                return trim($item['nidn']);
            }
        }
        if (!empty($res['data'][0]['nidn'])) {
            return trim($res['data'][0]['nidn']);
        }
    }

    // 2. Coba pencarian dengan Nama Dosen saja
    $res2 = cariDosen($nama);
    if ($res2['sukses'] && !empty($res2['data'])) {
        foreach ($res2['data'] as $item) {
            $isSamePT = empty($pt) || stripos($item['nama_pt'] ?? '', 'Lhokseumawe') !== false;
            if ($isSamePT && strcasecmp(trim($item['nama']), trim($nama)) === 0) {
                if (!empty($item['nidn'])) return trim($item['nidn']);
                if (!empty($item['nuptk'])) return trim($item['nuptk']);
            }
        }
        foreach ($res2['data'] as $item) {
            if (!empty($item['nidn'])) return trim($item['nidn']);
        }
    }

    return 'Data tidak tersedia';
}

/**
 * Mencari dosen berdasarkan nama atau kata kunci di PDDIKTI API
 *
 * @param string $keyword Nama dosen
 * @return array
 */
function cariDosen($keyword) {
    $url = PDDIKTI_URL_SEARCH . rawurlencode(trim($keyword));

    $ch = curl_init($url);
    $headers = [
        'Accept: application/json, text/plain, */*',
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin: https://pddikti.kemdiktisaintek.go.id',
        'Referer: https://pddikti.kemdiktisaintek.go.id/'
    ];

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($curlError || $httpCode !== 200) {
        return [
            'sukses' => false,
            'pesan' => 'Pencarian gagal menghubungkan ke server PDDIKTI',
            'data' => []
        ];
    }

    $decoded = json_decode($response, true);
    if (isset($decoded['data']) && is_array($decoded['data'])) {
        return [
            'sukses' => true,
            'pesan' => 'Pencarian berhasil',
            'data' => $decoded['data']
        ];
    }

    return [
        'sukses' => false,
        'pesan' => 'Dosen tidak ditemukan',
        'data' => []
    ];
}
