<?php
/**
 * ============================================================================
 * DETAIL.PHP - DATA DOSEN & PORTOFOLIO POLITEKNIK NEGERI LHOKSEUMAWE
 * Menampilkan rincian data profil dan 4 tab portofolio:
 * 1. Penelitian
 * 2. Pengabdian Masyarakat
 * 3. Publikasi Karya
 * 4. HKI / Paten
 * Mengambil data real-time via API PDDIKTI Kemdiktisaintek tanpa database
 * ============================================================================
 */

require_once __DIR__ . '/api.php';

// Ambil ID Dosen dari parameter URL, gunakan default Dosen Aryati jika tidak diset
$idDosen = isset($_GET['id']) && !empty(trim($_GET['id'])) 
    ? trim($_GET['id']) 
    : DEFAULT_DOSEN_ID;

// Ambil NIDN jika dikirimkan dari parameter URL
$nidnParam = isset($_GET['nidn']) && !empty(trim($_GET['nidn'])) ? trim($_GET['nidn']) : '';

// Ambil seluruh data profil dan portofolio menggunakan cURL
$semuaData = ambilSemuaDataDosen($idDosen, $nidnParam);

// Data Profil
$resProfil = $semuaData['profil'];
$profil = !empty($resProfil['data']) ? $resProfil['data'] : [];

// Data Portofolio
$penelitianList = !empty($semuaData['penelitian']['data']) && is_array($semuaData['penelitian']['data']) 
    ? $semuaData['penelitian']['data'] 
    : [];

$pengabdianList = !empty($semuaData['pengabdian']['data']) && is_array($semuaData['pengabdian']['data']) 
    ? $semuaData['pengabdian']['data'] 
    : [];

$publikasiList  = !empty($semuaData['publikasi']['data']) && is_array($semuaData['publikasi']['data']) 
    ? $semuaData['publikasi']['data'] 
    : [];

$patenList      = !empty($semuaData['paten']['data']) && is_array($semuaData['paten']['data']) 
    ? $semuaData['paten']['data'] 
    : [];

// Inisialisasi variabel profil dosen sesuai spesifikasi
$namaDosen          = !empty($profil['nama_dosen']) ? htmlspecialchars($profil['nama_dosen']) : 'ARYATI';
$perguruanTinggi    = !empty($profil['nama_pt']) ? htmlspecialchars($profil['nama_pt']) : 'Politeknik Negeri Lhokseumawe';
$programStudi       = !empty($profil['nama_prodi']) ? htmlspecialchars($profil['nama_prodi']) : 'Akuntansi';

// NIDN Handling: Pastikan NIDN valid dan sesuai dengan dosen
$nidnRaw = '';
if (!empty($nidnParam) && $nidnParam !== 'Data tidak tersedia') {
    $nidnRaw = $nidnParam;
} elseif (!empty($profil['nidn'])) {
    $nidnRaw = $profil['nidn'];
} elseif ($idDosen === DEFAULT_DOSEN_ID || stripos($namaDosen, 'ARYATI') !== false) {
    $nidnRaw = DEFAULT_DOSEN_NIDN;
} else {
    // Cari NIDN valid otomatis dari API pencarian PDDIKTI
    $nidnRaw = cariNidnDosen($namaDosen, $perguruanTinggi);
}

$nidn               = (!empty($nidnRaw) && $nidnRaw !== 'Data tidak tersedia') ? htmlspecialchars($nidnRaw) : 'Data tidak tersedia';
$jabatanFungsional  = !empty($profil['jabatan_akademik']) ? htmlspecialchars($profil['jabatan_akademik']) : 'Data tidak tersedia';
$pendidikanTerakhir = !empty($profil['pendidikan_tertinggi']) ? htmlspecialchars($profil['pendidikan_tertinggi']) : 'Data tidak tersedia';
$statusKepegawaian  = !empty($profil['status_ikatan_kerja']) ? htmlspecialchars($profil['status_ikatan_kerja']) : 'Data tidak tersedia';
$statusAktivitas    = !empty($profil['status_aktivitas']) ? htmlspecialchars($profil['status_aktivitas']) : 'Data tidak tersedia';

// Inisial avatar
$inisial = mb_substr($namaDosen, 0, 2);
?>
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $namaDosen ?> - Data Dosen Politeknik Negeri Lhokseumawe</title>
  <meta name="description" content="Detail profil dan portofolio dosen <?= $namaDosen ?> Politeknik Negeri Lhokseumawe terintegrasi PDDIKTI.">
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

  <!-- ==================== MAIN CONTENT ==================== -->
  <main class="container">
    <div class="detail-page-header">
      <a href="index.php" class="btn-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Kembali ke Pencarian
      </a>
    </div>

    <!-- ==================== BAGIAN 1: DATA DOSEN ==================== -->
    <section class="profile-card">
      <div class="profile-top-banner">
        <div class="avatar-circle large"><?= $inisial ?></div>
        <div class="profile-main-info">
          <div class="profile-category-tag">DATA DOSEN</div>
          <h2 class="profile-nama"><?= $namaDosen ?></h2>
          <?php if ($nidn !== 'Data tidak tersedia'): ?>
            <div class="profile-nidn-pill">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                <line x1="7" y1="8" x2="17" y2="8"></line>
                <line x1="7" y1="12" x2="13" y2="12"></line>
              </svg>
              NIDN: <strong><?= $nidn ?></strong>
            </div>
          <?php endif; ?>
          <div class="profile-kampus"><?= $perguruanTinggi ?></div>
          <div class="profile-prodi">Program Studi: <?= $programStudi ?></div>
        </div>
      </div>

      <!-- Grid Detail Informasi Dosen -->
      <div class="detail-grid">
        <div class="detail-item">
          <div class="detail-item-label">NIDN</div>
          <div class="detail-item-value <?= ($nidn === 'Data tidak tersedia') ? 'unavailable' : '' ?>">
            <?php if ($nidn !== 'Data tidak tersedia'): ?>
              <span class="badge badge-nidn-large"><?= $nidn ?></span>
            <?php else: ?>
              <?= $nidn ?>
            <?php endif; ?>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-item-label">Jabatan Fungsional</div>
          <div class="detail-item-value <?= ($jabatanFungsional === 'Data tidak tersedia') ? 'unavailable' : '' ?>">
            <?php if ($jabatanFungsional !== 'Data tidak tersedia'): ?>
              <span class="badge badge-purple"><?= $jabatanFungsional ?></span>
            <?php else: ?>
              <?= $jabatanFungsional ?>
            <?php endif; ?>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-item-label">Pendidikan Terakhir</div>
          <div class="detail-item-value <?= ($pendidikanTerakhir === 'Data tidak tersedia') ? 'unavailable' : '' ?>">
            <?php if ($pendidikanTerakhir !== 'Data tidak tersedia'): ?>
              <span class="badge badge-pink"><?= $pendidikanTerakhir ?></span>
            <?php else: ?>
              <?= $pendidikanTerakhir ?>
            <?php endif; ?>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-item-label">Status Kepegawaian</div>
          <div class="detail-item-value <?= ($statusKepegawaian === 'Data tidak tersedia') ? 'unavailable' : '' ?>">
            <?= $statusKepegawaian ?>
          </div>
        </div>

        <div class="detail-item">
          <div class="detail-item-label">Status Aktivitas</div>
          <div class="detail-item-value <?= ($statusAktivitas === 'Data tidak tersedia') ? 'unavailable' : '' ?>">
            <?php if (strtolower($statusAktivitas) === 'aktif'): ?>
              <span class="badge badge-success"><?= $statusAktivitas ?></span>
            <?php else: ?>
              <?= $statusAktivitas ?>
            <?php endif; ?>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== BAGIAN 2: PORTOFOLIO ==================== -->
    <section class="portfolio-section">
      <div class="section-header">
        <h3 class="section-title">
          <span class="indicator"></span>
          PORTOFOLIO DOSEN
        </h3>
      </div>

      <!-- Tab Buttons Navigasi -->
      <div class="tabs-wrapper" role="tablist">
        <button class="tab-btn active" data-tab="tab-penelitian" role="tab" aria-selected="true" id="btn-penelitian">
          <span>1. PENELITIAN</span>
          <span class="tab-counter"><?= count($penelitianList) ?></span>
        </button>

        <button class="tab-btn" data-tab="tab-pengabdian" role="tab" aria-selected="false" id="btn-pengabdian">
          <span>2. PENGABDIAN MASYARAKAT</span>
          <span class="tab-counter"><?= count($pengabdianList) ?></span>
        </button>

        <button class="tab-btn" data-tab="tab-publikasi" role="tab" aria-selected="false" id="btn-publikasi">
          <span>3. PUBLIKASI KARYA</span>
          <span class="tab-counter"><?= count($publikasiList) ?></span>
        </button>

        <button class="tab-btn" data-tab="tab-paten" role="tab" aria-selected="false" id="btn-paten">
          <span>4. HKI / PATEN</span>
          <span class="tab-counter"><?= count($patenList) ?></span>
        </button>
      </div>

      <!-- TAB 1: PENELITIAN -->
      <div id="tab-penelitian" class="tab-pane active" role="tabpanel">
        <div class="portfolio-card">
          <div class="portfolio-card-header">
            <h4 class="portfolio-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#6d28d9">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Portofolio Penelitian
            </h4>
            <span class="portfolio-card-subtitle">Total: <?= count($penelitianList) ?> Penelitian</span>
          </div>

          <div class="table-responsive">
            <?php if (!empty($penelitianList)): ?>
              <table class="modern-table">
                <thead>
                  <tr>
                    <th class="col-no">No</th>
                    <th>Judul Penelitian</th>
                    <th class="col-tahun">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($penelitianList as $i => $item): ?>
                    <tr>
                      <td class="col-no"><?= $i + 1 ?></td>
                      <td>
                        <div class="table-item-title"><?= htmlspecialchars($item['judul_kegiatan'] ?? '-') ?></div>
                        <?php if (!empty($item['jenis_kegiatan'])): ?>
                          <span class="table-item-meta"><?= htmlspecialchars($item['jenis_kegiatan']) ?></span>
                        <?php endif; ?>
                      </td>
                      <td class="col-tahun">
                        <?php 
                          $thn = (!empty($item['tahun_kegiatan']) && (int)$item['tahun_kegiatan'] > 0) 
                              ? htmlspecialchars($item['tahun_kegiatan']) 
                              : '-';
                        ?>
                        <span class="year-badge"><?= $thn ?></span>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            <?php else: ?>
              <div class="empty-state">
                <div class="empty-icon">🔬</div>
                <div class="empty-title">Data belum tersedia</div>
                <div class="empty-desc">Belum ada catatan data penelitian untuk dosen ini pada sistem PDDIKTI.</div>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- TAB 2: PENGABDIAN MASYARAKAT -->
      <div id="tab-pengabdian" class="tab-pane" role="tabpanel">
        <div class="portfolio-card">
          <div class="portfolio-card-header">
            <h4 class="portfolio-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#6d28d9">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Portofolio Pengabdian Masyarakat
            </h4>
            <span class="portfolio-card-subtitle">Total: <?= count($pengabdianList) ?> Pengabdian</span>
          </div>

          <div class="table-responsive">
            <?php if (!empty($pengabdianList)): ?>
              <table class="modern-table">
                <thead>
                  <tr>
                    <th class="col-no">No</th>
                    <th>Judul Pengabdian</th>
                    <th class="col-tahun">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($pengabdianList as $i => $item): ?>
                    <tr>
                      <td class="col-no"><?= $i + 1 ?></td>
                      <td>
                        <div class="table-item-title"><?= htmlspecialchars($item['judul_kegiatan'] ?? '-') ?></div>
                        <?php if (!empty($item['jenis_kegiatan'])): ?>
                          <span class="table-item-meta"><?= htmlspecialchars($item['jenis_kegiatan']) ?></span>
                        <?php endif; ?>
                      </td>
                      <td class="col-tahun">
                        <?php 
                          $thn = (!empty($item['tahun_kegiatan']) && (int)$item['tahun_kegiatan'] > 0) 
                              ? htmlspecialchars($item['tahun_kegiatan']) 
                              : '-';
                        ?>
                        <span class="year-badge"><?= $thn ?></span>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            <?php else: ?>
              <div class="empty-state">
                <div class="empty-icon">🤝</div>
                <div class="empty-title">Data belum tersedia</div>
                <div class="empty-desc">Belum ada catatan data pengabdian masyarakat untuk dosen ini pada sistem PDDIKTI.</div>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- TAB 3: PUBLIKASI KARYA -->
      <div id="tab-publikasi" class="tab-pane" role="tabpanel">
        <div class="portfolio-card">
          <div class="portfolio-card-header">
            <h4 class="portfolio-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#6d28d9">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Portofolio Publikasi Karya
            </h4>
            <span class="portfolio-card-subtitle">Total: <?= count($publikasiList) ?> Publikasi</span>
          </div>

          <div class="table-responsive">
            <?php if (!empty($publikasiList)): ?>
              <table class="modern-table">
                <thead>
                  <tr>
                    <th class="col-no">No</th>
                    <th>Judul Publikasi</th>
                    <th class="col-tahun">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($publikasiList as $i => $item): ?>
                    <tr>
                      <td class="col-no"><?= $i + 1 ?></td>
                      <td>
                        <div class="table-item-title"><?= htmlspecialchars($item['judul_kegiatan'] ?? '-') ?></div>
                        <?php if (!empty($item['jenis_kegiatan'])): ?>
                          <span class="table-item-meta"><?= htmlspecialchars($item['jenis_kegiatan']) ?></span>
                        <?php endif; ?>
                      </td>
                      <td class="col-tahun">
                        <?php 
                          $thn = (!empty($item['tahun_kegiatan']) && (int)$item['tahun_kegiatan'] > 0) 
                              ? htmlspecialchars($item['tahun_kegiatan']) 
                              : '-';
                        ?>
                        <span class="year-badge"><?= $thn ?></span>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            <?php else: ?>
              <div class="empty-state">
                <div class="empty-icon">📚</div>
                <div class="empty-title">Data belum tersedia</div>
                <div class="empty-desc">Belum ada catatan data publikasi karya untuk dosen ini pada sistem PDDIKTI.</div>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

      <!-- TAB 4: HKI / PATEN -->
      <div id="tab-paten" class="tab-pane" role="tabpanel">
        <div class="portfolio-card">
          <div class="portfolio-card-header">
            <h4 class="portfolio-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" color="#6d28d9">
                <circle cx="12" cy="8" r="7"></circle>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              Portofolio HKI / Paten
            </h4>
            <span class="portfolio-card-subtitle">Total: <?= count($patenList) ?> HKI / Paten</span>
          </div>

          <div class="table-responsive">
            <?php if (!empty($patenList)): ?>
              <table class="modern-table">
                <thead>
                  <tr>
                    <th class="col-no">No</th>
                    <th>Judul HKI/Paten</th>
                    <th class="col-tahun">Tahun</th>
                  </tr>
                </thead>
                <tbody>
                  <?php foreach ($patenList as $i => $item): ?>
                    <tr>
                      <td class="col-no"><?= $i + 1 ?></td>
                      <td>
                        <div class="table-item-title"><?= htmlspecialchars($item['judul_kegiatan'] ?? '-') ?></div>
                        <?php if (!empty($item['jenis_kegiatan'])): ?>
                          <span class="table-item-meta"><?= htmlspecialchars($item['jenis_kegiatan']) ?></span>
                        <?php endif; ?>
                      </td>
                      <td class="col-tahun">
                        <?php 
                          $thn = (!empty($item['tahun_kegiatan']) && (int)$item['tahun_kegiatan'] > 0) 
                              ? htmlspecialchars($item['tahun_kegiatan']) 
                              : '-';
                        ?>
                        <span class="year-badge"><?= $thn ?></span>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                </tbody>
              </table>
            <?php else: ?>
              <div class="empty-state">
                <div class="empty-icon">🛡️</div>
                <div class="empty-title">Data belum tersedia</div>
                <div class="empty-desc">Belum ada catatan data HKI atau Paten untuk dosen ini pada sistem PDDIKTI.</div>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </div>

    </section>
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

  <!-- ==================== JAVASCRIPT TAB INTERACTION ==================== -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const tabButtons = document.querySelectorAll('.tab-btn');
      const tabPanes = document.querySelectorAll('.tab-pane');

      tabButtons.forEach(button => {
        button.addEventListener('click', function() {
          const targetTabId = this.getAttribute('data-tab');

          // Nonaktifkan semua tab button
          tabButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
          });

          // Sembunyikan semua tab content
          tabPanes.forEach(pane => {
            pane.classList.remove('active');
          });

          // Aktifkan tab yang dipilih
          this.classList.add('active');
          this.setAttribute('aria-selected', 'true');

          const targetPane = document.getElementById(targetTabId);
          if (targetPane) {
            targetPane.classList.add('active');
          }
        });
      });
    });
  </script>
</body>
</html>
