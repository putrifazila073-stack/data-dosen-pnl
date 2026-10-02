<?php
/**
 * ============================================================================
 * INDEX.PHP - DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE
 * Halaman utama portal data dosen Politeknik Negeri Lhokseumawe
 * Terintegrasi langsung dengan API PDDIKTI Kemdiktisaintek tanpa database
 * ============================================================================
 */

require_once __DIR__ . '/api.php';

// Ambil query pencarian jika ada
$keyword = isset($_GET['q']) ? trim($_GET['q']) : '';

// Data dosen default (ARYATI - Politeknik Negeri Lhokseumawe)
$defaultDosen = [
    'id'        => DEFAULT_DOSEN_ID,
    'nama'      => 'ARYATI',
    'nidn'      => DEFAULT_DOSEN_NIDN,
    'nama_pt'   => 'Politeknik Negeri Lhokseumawe',
    'nama_prodi'=> 'Akuntansi',
    'jabatan'   => 'Lektor Kepala',
    'pendidikan'=> 'S2',
    'status'    => 'Aktif'
];

$daftarDosen = [];
$isPencarian = !empty($keyword);
$pesanStatus = '';

if ($isPencarian) {
    // Cari melalui API PDDIKTI dengan kombinasi nama instansi
    $searchQuery = $keyword . ' Politeknik Negeri Lhokseumawe';
    $hasilCari = cariDosen($searchQuery);

    if (!$hasilCari['sukses'] || empty($hasilCari['data'])) {
        // Coba pencarian dengan keyword saja jika pencarian spesifik kosong
        $hasilCari = cariDosen($keyword);
    }

    if ($hasilCari['sukses'] && !empty($hasilCari['data'])) {
        foreach ($hasilCari['data'] as $item) {
            $nidnVal = !empty($item['nidn']) ? trim($item['nidn']) : (!empty($item['nuptk']) ? trim($item['nuptk']) : '');
            if (empty($nidnVal) && stripos($item['nama'] ?? '', 'ARYATI') !== false) {
                $nidnVal = DEFAULT_DOSEN_NIDN;
            }
            if (empty($nidnVal)) {
                $nidnVal = 'Data tidak tersedia';
            }

            $daftarDosen[] = [
                'id'        => $item['id'],
                'nama'      => $item['nama'] ?? 'Tanpa Nama',
                'nidn'      => $nidnVal,
                'nama_pt'   => !empty($item['nama_pt']) && $item['nama_pt'] !== 'N/A' ? $item['nama_pt'] : 'Politeknik Negeri Lhokseumawe',
                'nama_prodi'=> !empty($item['nama_prodi']) ? $item['nama_prodi'] : 'Data tidak tersedia',
                'jabatan'   => 'Dosen',
                'pendidikan'=> 'Data tidak tersedia',
                'status'    => 'Aktif'
            ];
        }
    } else {
        $pesanStatus = 'Dosen dengan kata kunci "<strong>' . htmlspecialchars($keyword) . '</strong>" belum ditemukan di PDDIKTI.';
    }
} else {
    // Tampilan utama / default: Muat daftar dosen Politeknik Negeri Lhokseumawe
    $hasilDefault = cariDosen('Politeknik Negeri Lhokseumawe');
    if ($hasilDefault['sukses'] && !empty($hasilDefault['data'])) {
        foreach ($hasilDefault['data'] as $item) {
            $nidnVal = !empty($item['nidn']) ? trim($item['nidn']) : (!empty($item['nuptk']) ? trim($item['nuptk']) : '');
            if (empty($nidnVal) && stripos($item['nama'] ?? '', 'ARYATI') !== false) {
                $nidnVal = DEFAULT_DOSEN_NIDN;
            }
            if (empty($nidnVal)) {
                $nidnVal = 'Data tidak tersedia';
            }

            $daftarDosen[] = [
                'id'        => $item['id'],
                'nama'      => $item['nama'] ?? 'Tanpa Nama',
                'nidn'      => $nidnVal,
                'nama_pt'   => !empty($item['nama_pt']) && $item['nama_pt'] !== 'N/A' ? $item['nama_pt'] : 'Politeknik Negeri Lhokseumawe',
                'nama_prodi'=> !empty($item['nama_prodi']) ? $item['nama_prodi'] : 'Data tidak tersedia',
                'jabatan'   => 'Dosen',
                'pendidikan'=> 'Data tidak tersedia',
                'status'    => 'Aktif'
            ];
        }
    } else {
        // Fallback jika API sedang lambat atau offline
        $profilLive = ambilProfilDosen(DEFAULT_DOSEN_ID);
        if ($profilLive['sukses'] && !empty($profilLive['data'])) {
            $data = $profilLive['data'];
            $defaultDosen['nama']       = $data['nama_dosen'] ?? $defaultDosen['nama'];
            $defaultDosen['nama_pt']    = $data['nama_pt'] ?? $defaultDosen['nama_pt'];
            $defaultDosen['nama_prodi'] = $data['nama_prodi'] ?? $defaultDosen['nama_prodi'];
            $defaultDosen['jabatan']    = $data['jabatan_akademik'] ?? $defaultDosen['jabatan'];
            $defaultDosen['pendidikan'] = $data['pendidikan_tertinggi'] ?? $defaultDosen['pendidikan'];
            $defaultDosen['status']     = $data['status_aktivitas'] ?? $defaultDosen['status'];
        }
        $daftarDosen[] = $defaultDosen;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Dosen Politeknik Negeri Lhokseumawe</title>
  <meta name="description" content="Portal Data Dosen Politeknik Negeri Lhokseumawe beserta Portofolio Penelitian, Pengabdian, Publikasi, dan Paten PDDIKTI.">
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
</head>
<body>

  <!-- ==================== NAVBAR ==================== -->
  <header class="navbar">
    <div class="container navbar-inner">
      <div class="brand">
        <div class="brand-logo-badge">PNL</div>
        <div class="brand-text">
          <h1>DATA DOSEN</h1>
          <p>POLITEKNIK NEGERI LHOKSEUMAWE</p>
        </div>
      </div>
      <div class="nav-badge-pddikti">
        <span class="dot"></span>
        PDDIKTI Live API
      </div>
    </div>
  </header>

  <!-- ==================== HERO SECTION & SEARCH ==================== -->
  <section class="hero-section">
    <div class="container hero-content">
      <div class="hero-pill">
        🎓 Sistem Informasi Portofolio Dosen
      </div>
      <h2 class="hero-title">
        DATA DOSEN<br>
        <span>POLITEKNIK NEGERI LHOKSEUMAWE</span>
      </h2>
      <p class="hero-subtitle">
        Cari dan temukan portofolio tridharma perguruan tinggi, penelitian, pengabdian, publikasi ilmiah, dan HKI/paten.
      </p>

      <!-- Form Pencarian -->
      <div class="search-card">
        <form action="index.php" method="GET" class="search-form">
          <div class="search-input-wrap">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              name="q" 
              class="search-input" 
              placeholder="Cari Nama atau NIDN Dosen (Contoh: ARYATI, AZWINUR, 0009067504)..." 
              value="<?= htmlspecialchars($keyword) ?>"
              autocomplete="off"
            >
          </div>
          <button type="submit" class="btn-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            CARI
          </button>
        </form>
      </div>

      <!-- Quick Search Chips -->
      <div class="search-hints">
        <span>Saran Pencarian:</span>
        <a href="index.php?q=ARYATI" class="search-chip">ARYATI (0009067504)</a>
        <a href="index.php?q=AZWINUR" class="search-chip">AZWINUR (0010057905)</a>
        <a href="index.php?q=TEUKU+MUSTAQIM" class="search-chip">TEUKU MUSTAQIM (0007066506)</a>
        <?php if ($isPencarian): ?>
          <a href="index.php" class="search-chip" style="background: #f1f5f9; color: #475569;">✕ Reset Pencarian</a>
        <?php endif; ?>
      </div>
    </div>
  </section>

  <!-- ==================== DAFTAR DOSEN ==================== -->
  <main class="container">
    <div class="section-header">
      <h3 class="section-title">
        <span class="indicator"></span>
        <?php if ($isPencarian): ?>
          Hasil Pencarian Dosen "<?= htmlspecialchars($keyword) ?>"
        <?php else: ?>
          Daftar Dosen Politeknik Negeri Lhokseumawe
        <?php endif; ?>
      </h3>
      <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 500;">
        Ditemukan: <?= count($daftarDosen) ?> Dosen
      </span>
    </div>

    <!-- Alert jika pencarian tidak menemukan hasil -->
    <?php if (!empty($pesanStatus)): ?>
      <div class="alert alert-warning">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div>
          <?= $pesanStatus ?>
          <a href="index.php" style="margin-left: 8px; font-weight: 600; text-decoration: underline;">Kembali ke Daftar Dosen</a>
        </div>
      </div>
    <?php endif; ?>

    <!-- Grid Card Dosen -->
    <div class="dosen-grid">
      <?php foreach ($daftarDosen as $dosen): 
        $inisial = mb_substr($dosen['nama'], 0, 2);
        $linkDetail = 'detail.php?id=' . urlencode($dosen['id']) . '&nidn=' . urlencode($dosen['nidn']);
      ?>
        <div class="dosen-card">
          <div class="card-header-flex">
            <div class="avatar-circle"><?= $inisial ?></div>
            <div class="card-header-info">
              <h4 class="dosen-name"><?= htmlspecialchars($dosen['nama']) ?></h4>
              <div class="dosen-nidn-tag">
                <span class="nidn-prefix">NIDN:</span> <strong><?= htmlspecialchars($dosen['nidn']) ?></strong>
              </div>
              <div class="dosen-inst"><?= htmlspecialchars($dosen['nama_pt']) ?></div>
              <div class="dosen-prodi">Program Studi: <?= htmlspecialchars($dosen['nama_prodi']) ?></div>
            </div>
          </div>

          <ul class="meta-list">
            <li class="meta-item">
              <span class="meta-label">NIDN</span>
              <span class="meta-value">
                <?php if (!empty($dosen['nidn']) && $dosen['nidn'] !== 'Data tidak tersedia'): ?>
                  <span class="badge badge-nidn"><?= htmlspecialchars($dosen['nidn']) ?></span>
                <?php else: ?>
                  <span style="font-size:0.8rem; color:var(--text-subtle); font-style:italic;">Data tidak tersedia</span>
                <?php endif; ?>
              </span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Jabatan Fungsional</span>
              <span class="meta-value">
                <span class="badge badge-purple"><?= htmlspecialchars($dosen['jabatan']) ?></span>
              </span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Pendidikan</span>
              <span class="meta-value"><?= htmlspecialchars($dosen['pendidikan']) ?></span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Status Aktivitas</span>
              <span class="meta-value">
                <span class="badge badge-success"><?= htmlspecialchars($dosen['status']) ?></span>
              </span>
            </li>
          </ul>

          <a href="<?= $linkDetail ?>" class="btn-detail">
            Lihat Portofolio &amp; Rincian
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      <?php endforeach; ?>
    </div>
  </main>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container footer-inner">
      <p>&copy; <?= date('Y') ?> Data Dosen Politeknik Negeri Lhokseumawe</p>
      <p class="footer-pddikti">
        <span>Sumber Data: PDDIKTI Kemdiktisaintek</span>
      </p>
    </div>
  </footer>

</body>
</html>
