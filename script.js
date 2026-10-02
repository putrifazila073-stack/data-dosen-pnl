/**
 * ============================================================================
 * SCRIPT.JS - DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE
 * Client-Side JavaScript untuk Index & Detail Portofolio PDDIKTI
 * Terintegrasi langsung dengan API PDDIKTI via Vercel Serverless Function
 * Tanpa PHP & Tanpa Database
 * ============================================================================
 */

// Konstanta Konfigurasi
const DEFAULT_DOSEN_ID = 'p-jhS6LzvaL1kt3oVFY5zzMdtNmpfhsPIO6Op0gvy0yJlNtXCE_GGPlhKQL50UkaCMpwAQ==';
const DEFAULT_DOSEN_NIDN = '0009067504';
const API_ENDPOINT = '/api/pddikti';

// Data Cadangan / Fallback (Offline & Local Preview tanpa Vercel CLI)
const FALLBACK_DOSEN_LIST = [
  {
    id: DEFAULT_DOSEN_ID,
    nama: 'ARYATI',
    nidn: DEFAULT_DOSEN_NIDN,
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Akuntansi',
    jabatan: 'Lektor Kepala',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'Yd0MbW_bb5E4N1r31R_Kt5xTcJIEg2PAeWQNtw5qW4FVBSmB0OKVQsu8MMf-BJKFUoZA7A==',
    nama: 'MUHAMMAD ARHAMI',
    nidn: '0029107402',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknik Informatika',
    jabatan: 'Lektor Kepala',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'g8XPOShsvs3iihbcWF-zXJ3sI7nSYSbSOnNHo7Gs80ODwg0aKPB5AjQ==',
    nama: 'NURLAILI',
    nidn: '0019016904',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Rekayasa Manufaktur',
    jabatan: 'Lektor Kepala',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'cDRo0CFbEnh0bSUd0W7sQIDz9oV-_9hyTykX2BHmRenfRnnNUwZ7L39BiLTk9TVnbAFi5A==',
    nama: 'SYAHRUL AZMI',
    nidn: '0010067605',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Elektronika',
    jabatan: 'Lektor',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'wcVnoYCDalqIhP2omHdHEqKnlDmbqwvMDm-Rx0Xlmr0juT4vB5PtshquYobkePT3_2j93w==',
    nama: 'MUHAMMAD SYAHRONI',
    nidn: '0026107205',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Telekomunikasi',
    jabatan: 'Lektor',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'eLVrSLeC331CKN00QArfjh6iAfpszVOltS2xv8odMi769hKQ4DSZ-Qe1p7by_6BpY4zSjQ==',
    nama: 'MARIANA',
    nidn: '2102128702',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Akuntansi Sektor Publik',
    jabatan: 'Asisten Ahli',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'yVvpV8GWlaf3LVH13WzdpJZmhzyoVFNk3te5pSd_d767LVna0dPXZYgxz2LVt9xFjIwLcg==',
    nama: 'ZULKARNAINI',
    nidn: '0023067307',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Akuntansi Sektor Publik',
    jabatan: 'Lektor Kepala',
    pendidikan: 'S3',
    status: 'Aktif'
  },
  {
    id: '99LlCD4F_FbuP56eHZZmSU0rElUitUPcC8bAdvC3fuSvuYgrw0YOj8oYTSfXv-Nxx43EWQ==',
    nama: 'RUDI SYAHPUTRA',
    nidn: '0014047510',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Listrik',
    jabatan: 'Lektor',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'qnuh1VztiQAHrms8eJdecEquPwk4EIWaCOP_qg-YHip8R-Z06RTfavMAx2UA0v-GjmTT8A==',
    nama: 'MAHLIL',
    nidn: '0003038702',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Rekayasa Multimedia',
    jabatan: 'Asisten Ahli',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: '0q3bC3nS8Y__jJ0ysHb2xQ49NyNXDNbZeByYCuKXYD1uNfjKXxoZhKnk4iwxHJJmiwpsKg==',
    nama: 'ZUHRA AMALIA',
    nidn: '0016098009',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Kimia',
    jabatan: 'Lektor',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: '9HrmnRp_MD-_GN38fqDIoHu1OD9pkhJGye4sfMGyPrVzRWW1FepnBHvKU09fiihCiPR8Pw==',
    nama: 'M. KHADAFI',
    nidn: '0018077503',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknik Informatika',
    jabatan: 'Lektor',
    pendidikan: 'S2',
    status: 'Aktif'
  },
  {
    id: 'BBKrqudX7WJtNtEy-n2DN2LL6Wq7g1oprserBq38qJ19LCh1WlGyXIfFcuLsQwDe75g1gw==',
    nama: 'BUKHARI',
    nidn: '0028057705',
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Teknologi Rekayasa Manufaktur',
    jabatan: 'Lektor Kepala',
    pendidikan: 'S3',
    status: 'Aktif'
  }
];

// Fallback Portofolio Default (Ibu Aryati - PDDIKTI Real Data)
const FALLBACK_ARYATI_PORTOFOLIO = {
  profil: {
    nama_dosen: 'ARYATI',
    nidn: DEFAULT_DOSEN_NIDN,
    nama_pt: 'Politeknik Negeri Lhokseumawe',
    nama_prodi: 'Akuntansi',
    jabatan_akademik: 'Lektor Kepala',
    pendidikan_tertinggi: 'S2',
    status_ikatan_kerja: 'Dosen Tetap',
    status_aktivitas: 'Aktif'
  },
  penelitian: [
    { jenis_kegiatan: 'Penelitian', judul_kegiatan: 'Analisis Vector dalam Penentuan Determinan Perdagangan Sukuk Ritel di Indonesia', tahun_kegiatan: 2025 },
    { jenis_kegiatan: 'Penelitian', judul_kegiatan: 'Penerapan Financial Technology, Literasi Dan Iklusi Keuangan Terhadap Peningkatan Kinerja UMKM Di Kota Lhokseumawe', tahun_kegiatan: 2024 },
    { jenis_kegiatan: 'Penelitian', judul_kegiatan: 'ANALISA GOOD CORPORATE GOVERNANCE TERHADAP KINERJA PERUSAHAAN PADA EMITEN JAKARTA ISLAMIC INDEX 70', tahun_kegiatan: 2023 }
  ],
  pengabdian: [
    { jenis_kegiatan: 'Pengabdian Masyarakat', judul_kegiatan: 'PEMANFAATAN AI TOOLS DAN MEDIA SOSIAL DALAM MEMBANGUN STRATEGI PENGEMASAN DAN PEMASARAN PRODUK PADA UMKM AHAD FESTIVAL KOTA LHOKSEUMAWE', tahun_kegiatan: 2025 },
    { jenis_kegiatan: 'Pengabdian Masyarakat', judul_kegiatan: 'Pelatihan Pengawasan Pembangunan dan Keuangan Desa Kepada Pemuda Gampong Meunasah Mesjid', tahun_kegiatan: 2024 },
    { jenis_kegiatan: 'Pengabdian Masyarakat', judul_kegiatan: 'pelatihan pemanfaatan dana desa bagi pemuda gampong Meunasah mesjid', tahun_kegiatan: 2023 },
    { jenis_kegiatan: 'Pengabdian Masyarakat', judul_kegiatan: 'PELATIHAN MENYUSUN LAPORAN PENGELOLAAN DANA GAMPONG UNTUK PENANGGULANGAN COVID 19 GAMPONG ALUE LIM KECAMATAN BLANG MANGAT LHOKSEUMAWE', tahun_kegiatan: 2021 },
    { jenis_kegiatan: 'Pengabdian Masyarakat', judul_kegiatan: 'Pelatihan Pembuatan Tanaman Hidroponik sebagai Usaha Keluarga bagi Masyarakat Desa Gleumpang Meujim-jim, Kecamatan Juli, Kabupaten Bireuen', tahun_kegiatan: 2019 }
  ],
  publikasi: [
    { jenis_kegiatan: 'Buku referensi', judul_kegiatan: 'Akuntansi Syariah', tahun_kegiatan: 2025 },
    { jenis_kegiatan: 'Artikel ilmiah', judul_kegiatan: 'Pelatihan Pengawasan Pembangunan Dan Keuangan Desa Kepada Pemuda Gampong Meunasah Mesjid Kecamatan Muara Dua Kota Lhokseumawe', tahun_kegiatan: 2025 },
    { jenis_kegiatan: 'Prosiding seminar nasional', judul_kegiatan: 'Penerapan Financial Technology, Literasi Dan Iklusi Keuangan Terhadap Peningkatan Kinerja UKM Di Lhokseumawe', tahun_kegiatan: 2025 },
    { jenis_kegiatan: 'Jurnal nasional terakreditasi', judul_kegiatan: 'Literation of Muamalah academic on online transactions', tahun_kegiatan: 2024 },
    { jenis_kegiatan: 'Artikel ilmiah', judul_kegiatan: 'Pelatihan Pemanfaatan Dana Desa Dalam Mewujudkan Desa Mandiri Bagi Pemuda Gampong Meunasah Mesjid Dalam Perspektif Undang-Undang No 6 Tahun 2014 Tentang Desa', tahun_kegiatan: 2024 },
    { jenis_kegiatan: 'Artikel ilmiah', judul_kegiatan: 'Penerapan Inklusi Dan Leterasi Keuangan Dalam Perspektif Keberlanjutan Usaha Mikro Kecil Dan Menengah di Kota Lhokseumawe', tahun_kegiatan: 2024 },
    { jenis_kegiatan: 'Jurnal internasional', judul_kegiatan: 'The Sustainability of Fiscal Deficits, Sharia Obligations and Government Debt, in the Indonesian Economy', tahun_kegiatan: 2023 },
    { jenis_kegiatan: 'Jurnal nasional terakreditasi', judul_kegiatan: 'Pelatihan Pengukuran Kualitas Pengajar Berbasis Peran Pada Perguruan Tinggi', tahun_kegiatan: 2023 },
    { jenis_kegiatan: 'Jurnal nasional', judul_kegiatan: 'Analisis Pembiayaan Dan Profitabilitas Bank Pada Bank Umum Syariah Di Indonesia', tahun_kegiatan: 2023 },
    { jenis_kegiatan: 'Prosiding seminar nasional', judul_kegiatan: 'Kontribusi Insentif Pajak terhadap Pertumbuhan usaha Kecil dan Menengah di Indonesia', tahun_kegiatan: 2022 },
    { jenis_kegiatan: 'Prosiding seminar nasional', judul_kegiatan: 'Pelatihan Pengelolaan Keuangan dan Penggunaan Digital Marketing bagi UMKM Binaan Politeknik Negeri Lhokseumawe', tahun_kegiatan: 2022 },
    { jenis_kegiatan: 'Artikel ilmiah', judul_kegiatan: 'Ketidakpastian Ekonomi Global, efek Pandemi Covid-19 Perekonomian Indonesia', tahun_kegiatan: 2020 },
    { jenis_kegiatan: 'Lain-lain', judul_kegiatan: 'Analisis Perbandingan Kinerja Reksadana Saham Syariah Dengan Reksadana Saham Konvensional Di Indonesia', tahun_kegiatan: 2017 },
    { jenis_kegiatan: 'Lain-lain', judul_kegiatan: 'Faktor-Faktor Yang Mempengaruhi Prestasi Belajar Mahasiswa Pada Kelompok Mata Kuliah Keahlian Akuntansi', tahun_kegiatan: 2014 },
    { jenis_kegiatan: 'Lain-lain', judul_kegiatan: 'The Influence of Total Assets, Inflation, the Bank\'s Indonesia Certificate, and the Exchange Rate on the Return Share of Banking Companies', tahun_kegiatan: 2013 }
  ],
  paten: [
    { jenis_kegiatan: 'Hak cipta nasional', judul_kegiatan: 'Buku Aspek Lab Covid-19', tahun_kegiatan: 2022 },
    { jenis_kegiatan: 'Hak cipta nasional', judul_kegiatan: 'Video Praktikum Patologi Klinik Prodi S1 Kedokteran: Pemeriksaan Rumple Leede', tahun_kegiatan: 2022 }
  ]
};

// ============================================================================
// HELPER UTILITIES
// ============================================================================

/**
 * Sanitasi string untuk mencegah XSS
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Ambil 2 huruf pertama inisial nama
 */
function getInitials(name) {
  if (!name) return 'DS';
  const clean = name.replace(/[^a-zA-Z\s]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase() || 'DS';
}

/**
 * Normalisasi item dosen dari PDDIKTI ke objek standar
 */
function normalizeDosen(item) {
  let nidn = item.nidn ? String(item.nidn).trim() : (item.nuptk ? String(item.nuptk).trim() : '');
  if (!nidn && item.nama && item.nama.toUpperCase().includes('ARYATI')) {
    nidn = DEFAULT_DOSEN_NIDN;
  }
  if (!nidn) nidn = 'Data tidak tersedia';

  return {
    id: item.id || DEFAULT_DOSEN_ID,
    nama: item.nama || item.nama_dosen || 'Tanpa Nama',
    nidn: nidn,
    nama_pt: (item.nama_pt && item.nama_pt !== 'N/A') ? item.nama_pt : 'Politeknik Negeri Lhokseumawe',
    nama_prodi: item.nama_prodi || 'Data tidak tersedia',
    jabatan: item.jabatan_akademik || item.jabatan || 'Dosen',
    pendidikan: item.pendidikan_tertinggi || item.pendidikan || 'Data tidak tersedia',
    status: item.status_aktivitas || item.status || 'Aktif'
  };
}

// ============================================================================
// API CLIENT
// ============================================================================

async function fetchDosenList(keyword = '') {
  try {
    const url = keyword 
      ? `${API_ENDPOINT}?action=search&q=${encodeURIComponent(keyword)}`
      : `${API_ENDPOINT}?action=search&q=`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (json.sukses && Array.isArray(json.data) && json.data.length > 0) {
      return json.data.map(normalizeDosen);
    }
  } catch (err) {
    console.warn('Gagal memuat API live, beralih ke data fallback lokal:', err.message);
  }

  // Fallback lokal jika API offline atau dibuka via file:// tanpa Vercel CLI
  if (!keyword) {
    return FALLBACK_DOSEN_LIST;
  }

  const qLower = keyword.toLowerCase();
  const filtered = FALLBACK_DOSEN_LIST.filter(d => 
    d.nama.toLowerCase().includes(qLower) || 
    (d.nidn && d.nidn.includes(qLower)) ||
    (d.nama_prodi && d.nama_prodi.toLowerCase().includes(qLower))
  );

  return filtered;
}

async function fetchDosenDetail(id, nidnHint = '') {
  try {
    const url = `${API_ENDPOINT}?action=all&id=${encodeURIComponent(id)}&nidn=${encodeURIComponent(nidnHint)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (json.sukses && json.data) {
      return json.data;
    }
  } catch (err) {
    console.warn('Gagal memuat detail API live, beralih ke data fallback lokal:', err.message);
  }

  // Fallback data lokal
  return FALLBACK_ARYATI_PORTOFOLIO;
}

// ============================================================================
// HALAMAN UTAMA: INDEX.HTML
// ============================================================================

function initIndexPage() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');
  const btnReset = document.getElementById('btn-reset-search');
  const dosenGrid = document.getElementById('dosen-grid');
  const skeletonContainer = document.getElementById('skeleton-container');
  const sectionTitle = document.getElementById('section-title-text');
  const countBadge = document.getElementById('count-badge');
  const alertContainer = document.getElementById('alert-container');
  const chips = document.querySelectorAll('.search-chip[data-query]');

  // Muat dosen berdasarkan query di URL jika ada
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  if (initialQuery) {
    searchInput.value = initialQuery;
  }

  // Load awal
  loadDosen(initialQuery);

  // Event listener search submit
  function handleSearch() {
    const q = searchInput.value.trim();
    const newUrl = q ? `index.html?q=${encodeURIComponent(q)}` : 'index.html';
    window.history.pushState({}, '', newUrl);
    loadDosen(q);
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', (e) => {
      e.preventDefault();
      handleSearch();
    });
  }

  // Event listener chip saran pencarian
  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      const q = this.getAttribute('data-query');
      searchInput.value = q;
      handleSearch();
    });
  });

  // Event listener reset
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      searchInput.value = '';
      window.history.pushState({}, '', 'index.html');
      loadDosen('');
    });
  }

  // Fungsi memuat & merender daftar dosen
  async function loadDosen(query = '') {
    // Tampilkan skeleton, sembunyikan grid
    skeletonContainer.style.display = 'grid';
    dosenGrid.style.display = 'none';
    alertContainer.innerHTML = '';

    if (query) {
      sectionTitle.textContent = `Hasil Pencarian Dosen "${query}"`;
      if (btnReset) btnReset.style.display = 'inline-block';
    } else {
      sectionTitle.textContent = 'Daftar Dosen Politeknik Negeri Lhokseumawe';
      if (btnReset) btnReset.style.display = 'none';
    }

    countBadge.textContent = 'Mencari data...';

    const list = await fetchDosenList(query);

    skeletonContainer.style.display = 'none';
    dosenGrid.style.display = 'grid';

    countBadge.textContent = `Ditemukan: ${list.length} Dosen`;

    if (list.length === 0) {
      dosenGrid.innerHTML = '';
      alertContainer.innerHTML = `
        <div class="alert alert-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            Dosen dengan kata kunci "<strong>${escapeHtml(query)}</strong>" belum ditemukan di PDDIKTI.
            <a href="javascript:void(0)" id="link-kembali" style="margin-left: 8px; font-weight: 600; text-decoration: underline;">Kembali ke Daftar Dosen</a>
          </div>
        </div>
      `;

      const linkKembali = document.getElementById('link-kembali');
      if (linkKembali) {
        linkKembali.addEventListener('click', () => {
          searchInput.value = '';
          window.history.pushState({}, '', 'index.html');
          loadDosen('');
        });
      }
      return;
    }

    // Render kartu dosen
    let html = '';
    list.forEach(dosen => {
      const inisial = getInitials(dosen.nama);
      const linkDetail = `detail.html?id=${encodeURIComponent(dosen.id)}&nidn=${encodeURIComponent(dosen.nidn)}`;

      html += `
        <div class="dosen-card">
          <div class="card-header-flex">
            <div class="avatar-circle">${escapeHtml(inisial)}</div>
            <div class="card-header-info">
              <h4 class="dosen-name">${escapeHtml(dosen.nama)}</h4>
              <div class="dosen-nidn-tag">
                <span class="nidn-prefix">NIDN:</span> <strong>${escapeHtml(dosen.nidn)}</strong>
              </div>
              <div class="dosen-inst">${escapeHtml(dosen.nama_pt)}</div>
              <div class="dosen-prodi">Program Studi: ${escapeHtml(dosen.nama_prodi)}</div>
            </div>
          </div>

          <ul class="meta-list">
            <li class="meta-item">
              <span class="meta-label">NIDN</span>
              <span class="meta-value">
                ${dosen.nidn !== 'Data tidak tersedia'
                  ? `<span class="badge badge-nidn">${escapeHtml(dosen.nidn)}</span>`
                  : `<span style="font-size:0.8rem; color:var(--text-subtle); font-style:italic;">Data tidak tersedia</span>`
                }
              </span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Jabatan Fungsional</span>
              <span class="meta-value">
                <span class="badge badge-purple">${escapeHtml(dosen.jabatan)}</span>
              </span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Pendidikan</span>
              <span class="meta-value">${escapeHtml(dosen.pendidikan)}</span>
            </li>
            <li class="meta-item">
              <span class="meta-label">Status Aktivitas</span>
              <span class="meta-value">
                <span class="badge badge-success">${escapeHtml(dosen.status)}</span>
              </span>
            </li>
          </ul>

          <a href="${linkDetail}" class="btn-detail">
            Lihat Portofolio &amp; Rincian
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      `;
    });

    dosenGrid.innerHTML = html;
  }
}

// ============================================================================
// HALAMAN DETAIL: DETAIL.HTML
// ============================================================================

function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const idDosen = urlParams.get('id') || DEFAULT_DOSEN_ID;
  const nidnHint = urlParams.get('nidn') || '';

  const skeleton = document.getElementById('detail-skeleton');
  const content = document.getElementById('detail-content');

  // Inisialisasi tab switching
  setupTabs();

  // Muat data detail & 4 portofolio
  loadDetailData(idDosen, nidnHint);

  async function loadDetailData(id, nidn) {
    const data = await fetchDosenDetail(id, nidn);
    const profil = data.profil || {};
    const penelitian = Array.isArray(data.penelitian) ? data.penelitian : [];
    const pengabdian = Array.isArray(data.pengabdian) ? data.pengabdian : [];
    const publikasi = Array.isArray(data.publikasi) ? data.publikasi : [];
    const paten = Array.isArray(data.paten) ? data.paten : [];

    // Profil Dosen
    const nama = profil.nama_dosen || profil.nama || 'ARYATI';
    const inisial = getInitials(nama);
    const pt = profil.nama_pt || 'Politeknik Negeri Lhokseumawe';
    const prodi = profil.nama_prodi || 'Akuntansi';
    
    let nidnVal = nidn && nidn !== 'Data tidak tersedia' 
      ? nidn 
      : (profil.nidn ? profil.nidn : (id === DEFAULT_DOSEN_ID ? DEFAULT_DOSEN_NIDN : 'Data tidak tersedia'));

    const jabatan = profil.jabatan_akademik || profil.jabatan || 'Data tidak tersedia';
    const pendidikan = profil.pendidikan_tertinggi || profil.pendidikan || 'Data tidak tersedia';
    const kepegawaian = profil.status_ikatan_kerja || 'Data tidak tersedia';
    const status = profil.status_aktivitas || profil.status || 'Data tidak tersedia';

    // Update Head Title
    document.title = `${nama} - Data Dosen Politeknik Negeri Lhokseumawe`;

    // Render Profil Top
    document.getElementById('profile-avatar').textContent = inisial;
    document.getElementById('dosen-nama').textContent = nama;
    document.getElementById('dosen-kampus').textContent = pt;
    document.getElementById('dosen-prodi').textContent = `Program Studi: ${prodi}`;

    const nidnPill = document.getElementById('dosen-nidn-pill');
    const nidnText = document.getElementById('dosen-nidn-text');
    if (nidnVal !== 'Data tidak tersedia') {
      nidnPill.style.display = 'inline-flex';
      nidnText.textContent = nidnVal;
    } else {
      nidnPill.style.display = 'none';
    }

    // Render Grid Detail
    const gridNidn = document.getElementById('grid-nidn');
    if (nidnVal !== 'Data tidak tersedia') {
      gridNidn.className = 'detail-item-value';
      gridNidn.innerHTML = `<span class="badge badge-nidn-large">${escapeHtml(nidnVal)}</span>`;
    } else {
      gridNidn.className = 'detail-item-value unavailable';
      gridNidn.textContent = 'Data tidak tersedia';
    }

    const gridJabatan = document.getElementById('grid-jabatan');
    if (jabatan !== 'Data tidak tersedia') {
      gridJabatan.className = 'detail-item-value';
      gridJabatan.innerHTML = `<span class="badge badge-purple">${escapeHtml(jabatan)}</span>`;
    } else {
      gridJabatan.className = 'detail-item-value unavailable';
      gridJabatan.textContent = jabatan;
    }

    const gridPendidikan = document.getElementById('grid-pendidikan');
    if (pendidikan !== 'Data tidak tersedia') {
      gridPendidikan.className = 'detail-item-value';
      gridPendidikan.innerHTML = `<span class="badge badge-pink">${escapeHtml(pendidikan)}</span>`;
    } else {
      gridPendidikan.className = 'detail-item-value unavailable';
      gridPendidikan.textContent = pendidikan;
    }

    const gridKepegawaian = document.getElementById('grid-kepegawaian');
    gridKepegawaian.className = 'detail-item-value' + (kepegawaian === 'Data tidak tersedia' ? ' unavailable' : '');
    gridKepegawaian.textContent = kepegawaian;

    const gridAktivitas = document.getElementById('grid-aktivitas');
    if (status.toLowerCase() === 'aktif') {
      gridAktivitas.className = 'detail-item-value';
      gridAktivitas.innerHTML = `<span class="badge badge-success">${escapeHtml(status)}</span>`;
    } else {
      gridAktivitas.className = 'detail-item-value' + (status === 'Data tidak tersedia' ? ' unavailable' : '');
      gridAktivitas.textContent = status;
    }

    // Update Counter Tab Buttons
    document.getElementById('counter-penelitian').textContent = penelitian.length;
    document.getElementById('counter-pengabdian').textContent = pengabdian.length;
    document.getElementById('counter-publikasi').textContent = publikasi.length;
    document.getElementById('counter-paten').textContent = paten.length;

    // Update Sub-Counters
    document.getElementById('sub-counter-penelitian').textContent = `Total: ${penelitian.length} Penelitian`;
    document.getElementById('sub-counter-pengabdian').textContent = `Total: ${pengabdian.length} Pengabdian`;
    document.getElementById('sub-counter-publikasi').textContent = `Total: ${publikasi.length} Publikasi`;
    document.getElementById('sub-counter-paten').textContent = `Total: ${paten.length} HKI / Paten`;

    // Render 4 Tabel Portofolio
    renderPortfolioTable('container-penelitian', penelitian, '🔬', 'Belum ada catatan data penelitian untuk dosen ini pada sistem PDDIKTI.');
    renderPortfolioTable('container-pengabdian', pengabdian, '🤝', 'Belum ada catatan data pengabdian masyarakat untuk dosen ini pada sistem PDDIKTI.');
    renderPortfolioTable('container-publikasi', publikasi, '📚', 'Belum ada catatan data publikasi karya untuk dosen ini pada sistem PDDIKTI.');
    renderPortfolioTable('container-paten', paten, '🛡️', 'Belum ada catatan data HKI atau Paten untuk dosen ini pada sistem PDDIKTI.');

    // Sembunyikan loader dan tampilkan konten
    skeleton.style.display = 'none';
    content.style.display = 'block';
  }

  function renderPortfolioTable(containerId, list, emptyIcon, emptyText) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!list || list.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">${emptyIcon}</div>
          <div class="empty-title">Data belum tersedia</div>
          <div class="empty-desc">${escapeHtml(emptyText)}</div>
        </div>
      `;
      return;
    }

    let rowsHtml = '';
    list.forEach((item, index) => {
      const judul = item.judul_kegiatan || item.judul || '-';
      const jenis = item.jenis_kegiatan || item.jenis || '';
      const tahun = (item.tahun_kegiatan && Number(item.tahun_kegiatan) > 0) ? item.tahun_kegiatan : (item.tahun || '-');

      rowsHtml += `
        <tr>
          <td class="col-no">${index + 1}</td>
          <td>
            <div class="table-item-title">${escapeHtml(judul)}</div>
            ${jenis ? `<span class="table-item-meta">${escapeHtml(jenis)}</span>` : ''}
          </td>
          <td class="col-tahun">
            <span class="year-badge">${escapeHtml(tahun)}</span>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <table class="modern-table">
        <thead>
          <tr>
            <th class="col-no">No</th>
            <th>Judul</th>
            <th class="col-tahun">Tahun</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetTabId = this.getAttribute('data-tab');

        // Nonaktifkan semua button
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });

        // Sembunyikan semua pane
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
  }
}

// ============================================================================
// INISIALISASI HALAMAN OTOMATIS
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('search-form') || document.getElementById('dosen-grid')) {
    initIndexPage();
  }
  if (document.getElementById('detail-skeleton') || document.getElementById('profile-avatar')) {
    initDetailPage();
  }
});
