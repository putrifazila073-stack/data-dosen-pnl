/**
 * ============================================================================
 * SCRIPT.JS - DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE (PNL)
 * Client-Side JavaScript untuk Index & Detail Portofolio
 * Mendukung data.json (312 Dosen), Ringkasan Statistik Program Studi,
 * Tabel Utama Portofolio, Modal Lihat Karya, dan Ekspor Unduh Data.
 * Kompatibel 100% dengan hosting GitHub & Vercel.
 * ============================================================================
 */

// Konstanta Konfigurasi
const DATA_JSON_URL = 'data.json';
const API_ENDPOINT = '/api/pddikti';

// State Global Aplikasi
const AppState = {
  allDosen: [],          // Seluruh 312 data dosen dari data.json
  filteredDosen: [],     // Dosen hasil filter & pencarian aktif
  selectedProdi: '',     // Filter program studi aktif ('' = Semua)
  searchKeyword: '',     // Kata kunci pencarian aktif
  sortBy: 'no',          // Kolom sorting aktif ('no', 'nama', 'nidn', 'prodi', 'penelitian', 'pengabdian', 'publikasi')
  sortDir: 'asc',        // Arah sorting ('asc' atau 'desc')
  activeView: 'table',   // 'table' atau 'grid'
  currentModalDosen: null // Dosen yang sedang dibuka pada modal rincian karya
};

/* ============================================================================
   UTILITAS & HELPER
   ============================================================================ */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getInitials(name) {
  if (!name) return 'DS';
  const clean = String(name).replace(/[^a-zA-ZÀ-ÿ\s]/g, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase() || 'DS';
}

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Normalisasi objek karya untuk memastikan kelengkapan field:
 * judul, tahun, sumber, url
 */
function normalizeWorkItem(item, category = '') {
  if (!item || typeof item !== 'object') return null;

  const rawJudul = item.judul || item.title || item.judul_kegiatan || item.nama || '';
  const judul = String(rawJudul).trim();

  // Jangan menghitung placeholder atau string kosong sebagai karya valid
  if (!judul || judul.toLowerCase().startsWith('belum ditemukan data')) {
    return null;
  }

  // Tahun
  let tahun = '';
  const rawTahun = item.tahun || item.year || item.tahun_kegiatan;
  if (rawTahun && Number(rawTahun) > 1900 && Number(rawTahun) <= 2035) {
    tahun = Number(rawTahun);
  }

  // Sumber: Jangan mengasumsikan semua karya dari GARUDA jika tidak ada sumbernya
  let sumber = '';
  let isVerified = false;

  if (item.sumber && String(item.sumber).trim()) {
    sumber = String(item.sumber).trim();
    isVerified = true;
  } else if (item.url && item.url.includes('garuda.kemdiktisaintek.go.id')) {
    sumber = 'GARUDA';
    isVerified = true;
  } else if (item.url && item.url.includes('pddikti.kemdiktisaintek.go.id')) {
    sumber = 'PDDIKTI';
    isVerified = true;
  } else if (item.url && item.url.includes('sinta.kemdiktisaintek.go.id')) {
    sumber = 'SINTA';
    isVerified = true;
  } else {
    sumber = 'Sumber belum diverifikasi';
    isVerified = false;
  }

  // URL / Tautan Sumber
  const url = (item.url && typeof item.url === 'string' && item.url.startsWith('http'))
    ? item.url.trim()
    : '';

  return {
    judul: judul,
    tahun: tahun,
    sumber: sumber,
    isVerified: isVerified,
    url: url,
    kategori: category,
    author_id: item.author_id || ''
  };
}

/**
 * Normalisasi data dosen dari data.json
 */
function normalizeDosenData(item, index) {
  if (!item || typeof item !== 'object') return null;

  const id = item.id || `pnl-${String(index + 1).padStart(3, '0')}`;
  const nama = String(item.nama || 'Tanpa Nama').trim();
  const nidn = item.nidn ? String(item.nidn).trim() : 'Data tidak tersedia';
  const pt = item.perguruan_tinggi || item.nama_pt || 'Politeknik Negeri Lhokseumawe';
  const prodi = item.prodi || item.nama_prodi || 'Data tidak tersedia';
  const jurusan = item.jurusan || '';
  const jabatan = item.jabatan_fungsional || item.jabatan || 'Dosen';
  const pendidikan = item.pendidikan_terakhir || item.pendidikan || 'Data tidak tersedia';
  const kepegawaian = item.status_kepegawaian || item.status_ikatan_kerja || 'PNS';
  const status = item.status_aktivitas || item.status || 'Aktif';
  const ikatanKerja = item.ikatan_kerja || 'Dosen Tetap';

  // Bersihkan dan normalisasi portofolio
  const rawPenelitian = Array.isArray(item.penelitian) ? item.penelitian : [];
  const rawPengabdian = Array.isArray(item.pengabdian) ? item.pengabdian : [];
  const rawPublikasi  = Array.isArray(item.publikasi)  ? item.publikasi  : [];
  const rawPaten      = Array.isArray(item.paten)      ? item.paten      : [];

  const penelitian = rawPenelitian.map(p => normalizeWorkItem(p, 'Penelitian')).filter(Boolean);
  const pengabdian = rawPengabdian.map(p => normalizeWorkItem(p, 'Pengabdian Masyarakat')).filter(Boolean);
  const publikasi  = rawPublikasi.map(p => normalizeWorkItem(p, 'Publikasi Karya')).filter(Boolean);
  const paten      = rawPaten.map(p => normalizeWorkItem(p, 'HKI/Paten')).filter(Boolean);

  return {
    id: id,
    nama: nama,
    nidn: nidn,
    perguruan_tinggi: pt,
    prodi: prodi,
    jurusan: jurusan,
    jabatan_fungsional: jabatan,
    pendidikan_terakhir: pendidikan,
    status_kepegawaian: kepegawaian,
    status_aktivitas: status,
    ikatan_kerja: ikatanKerja,
    penelitian: penelitian,
    pengabdian: pengabdian,
    publikasi: publikasi,
    paten: paten,
    totalPenelitian: penelitian.length,
    totalPengabdian: pengabdian.length,
    totalPublikasi: publikasi.length,
    totalPaten: paten.length,
    garuda_author_ids: item.garuda_author_ids || []
  };
}

/* ============================================================================
   PEMUAT DATA UTAMA (DATA.JSON)
   ============================================================================ */

async function loadDataJson() {
  try {
    const res = await fetch(DATA_JSON_URL);
    if (!res.ok) {
      throw new Error(`Gagal membaca ${DATA_JSON_URL} (Status HTTP: ${res.status})`);
    }

    const json = await res.json();
    let rawList = [];

    if (Array.isArray(json)) {
      rawList = json;
    } else if (Array.isArray(json.data)) {
      rawList = json.data;
    } else if (Array.isArray(json.dosen)) {
      rawList = json.dosen;
    } else {
      rawList = [];
    }

    if (rawList.length > 0) {
      AppState.allDosen = rawList
        .map((item, idx) => normalizeDosenData(item, idx))
        .filter(Boolean);
      return AppState.allDosen;
    }
  } catch (err) {
    console.error('Peringatan saat memuat data.json:', err);
  }

  return [];
}

/* ============================================================================
   PERHITUNGAN STATISTIK PROGRAM STUDI (FITUR 1)
   ============================================================================ */

/**
 * Menghitung ringkasan statistik khusus untuk program studi yang dipilih.
 * Menghitung secara otomatis:
 * 1. Jumlah Dosen unik
 * 2. Jumlah Penelitian (menghindari duplikasi)
 * 3. Jumlah Pengabdian Masyarakat (menghindari duplikasi)
 * 4. Jumlah Publikasi Karya (menghindari duplikasi karya bersama dalam satu prodi)
 */
function calculateProdiStats(prodiName, dataset = AppState.allDosen) {
  let list = dataset;

  if (prodiName && prodiName.trim() !== '') {
    const prodiLower = prodiName.trim().toLowerCase();
    list = dataset.filter(d => d.prodi && d.prodi.trim().toLowerCase() === prodiLower);
  }

  // 1. Jumlah Dosen Unik
  const uniqueDosenIds = new Set();
  list.forEach(d => {
    uniqueDosenIds.add(d.id || d.nidn || d.nama);
  });
  const countDosen = uniqueDosenIds.size;

  // 2. Jumlah Penelitian (Deduplikasi aman berdasarkan normalisasi judul)
  const seenPenelitian = new Set();
  list.forEach(d => {
    d.penelitian.forEach(item => {
      const key = item.judul.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key) seenPenelitian.add(key);
    });
  });
  const countPenelitian = seenPenelitian.size;

  // 3. Jumlah Pengabdian Masyarakat (Deduplikasi aman berdasarkan normalisasi judul)
  const seenPengabdian = new Set();
  list.forEach(d => {
    d.pengabdian.forEach(item => {
      const key = item.judul.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key) seenPengabdian.add(key);
    });
  });
  const countPengabdian = seenPengabdian.size;

  // 4. Jumlah Publikasi Karya (Deduplikasi aman berdasarkan normalisasi judul atau url dokumen)
  const seenPublikasi = new Set();
  list.forEach(d => {
    d.publikasi.forEach(item => {
      const key = item.url
        ? item.url.toLowerCase()
        : item.judul.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (key) seenPublikasi.add(key);
    });
  });
  const countPublikasi = seenPublikasi.size;

  return {
    prodi: prodiName || 'Semua Program Studi',
    countDosen: countDosen,
    countPenelitian: countPenelitian,
    countPengabdian: countPengabdian,
    countPublikasi: countPublikasi
  };
}

/**
 * Memperbarui tampilan 4 kotak statistik pada halaman
 */
function renderProdiStats(stats) {
  const elTitle = document.getElementById('prodi-active-name');
  const elDosen = document.getElementById('stat-dosen-count');
  const elPenelitian = document.getElementById('stat-penelitian-count');
  const elPengabdian = document.getElementById('stat-pengabdian-count');
  const elPublikasi = document.getElementById('stat-publikasi-count');
  const prodiSelectLabel = document.getElementById('btn-unduh-prodi-label');

  if (elTitle) {
    elTitle.textContent = stats.prodi === 'Semua Program Studi'
      ? 'Semua Program Studi (Politeknik Negeri Lhokseumawe)'
      : stats.prodi;
  }

  if (elDosen) elDosen.textContent = stats.countDosen.toLocaleString('id-ID');
  if (elPenelitian) elPenelitian.textContent = stats.countPenelitian.toLocaleString('id-ID');
  if (elPengabdian) elPengabdian.textContent = stats.countPengabdian.toLocaleString('id-ID');
  if (elPublikasi) elPublikasi.textContent = stats.countPublikasi.toLocaleString('id-ID');

  if (prodiSelectLabel) {
    if (stats.prodi && stats.prodi !== 'Semua Program Studi') {
      const shortName = stats.prodi.length > 25 ? stats.prodi.substring(0, 22) + '...' : stats.prodi;
      prodiSelectLabel.textContent = `Unduh Data Prodi: ${shortName} (CSV)`;
    } else {
      prodiSelectLabel.textContent = 'Unduh Data Prodi Terpilih (CSV)';
    }
  }
}

/**
 * Mengisi opsi dropdown Program Studi secara otomatis dari data.json
 */
function populateProdiDropdown(dosenList) {
  const select = document.getElementById('filter-prodi');
  if (!select) return;

  const prodiSet = new Set();
  dosenList.forEach(d => {
    if (d.prodi && d.prodi !== '-' && d.prodi !== 'Data tidak tersedia') {
      prodiSet.add(d.prodi.trim());
    }
  });

  const prodiSorted = Array.from(prodiSet).sort((a, b) => a.localeCompare(b, 'id'));

  let optionsHtml = '<option value="">Semua Program Studi (312 Dosen)</option>';
  prodiSorted.forEach(prodi => {
    const isSelected = AppState.selectedProdi.toLowerCase() === prodi.toLowerCase() ? 'selected' : '';
    optionsHtml += `<option value="${escapeHtml(prodi)}" ${isSelected}>${escapeHtml(prodi)}</option>`;
  });

  select.innerHTML = optionsHtml;
}

/* ============================================================================
   FILTER, PENCARIAN, & SORTING TABEL UTAMA (FITUR 3)
   ============================================================================ */

function applyFilterAndSearch() {
  let result = [...AppState.allDosen];

  // 1. Filter Program Studi
  if (AppState.selectedProdi) {
    const pLower = AppState.selectedProdi.trim().toLowerCase();
    result = result.filter(d => d.prodi && d.prodi.trim().toLowerCase() === pLower);
  }

  // 2. Pencarian Keyword (Nama atau NIDN)
  if (AppState.searchKeyword) {
    const q = AppState.searchKeyword.trim().toLowerCase();
    result = result.filter(d => {
      const matchNama = d.nama && d.nama.toLowerCase().includes(q);
      const matchNidn = d.nidn && d.nidn.toLowerCase().includes(q);
      const matchProdi = d.prodi && d.prodi.toLowerCase().includes(q);
      return matchNama || matchNidn || matchProdi;
    });
  }

  // 3. Sorting
  const sortKey = AppState.sortBy;
  const sortDir = AppState.sortDir === 'desc' ? -1 : 1;

  result.sort((a, b) => {
    if (sortKey === 'nama') {
      return sortDir * a.nama.localeCompare(b.nama, 'id');
    }
    if (sortKey === 'nidn') {
      return sortDir * a.nidn.localeCompare(b.nidn);
    }
    if (sortKey === 'pendidikan') {
      return sortDir * a.pendidikan_terakhir.localeCompare(b.pendidikan_terakhir);
    }
    if (sortKey === 'status') {
      return sortDir * a.status_aktivitas.localeCompare(b.status_aktivitas);
    }
    if (sortKey === 'prodi') {
      return sortDir * a.prodi.localeCompare(b.prodi, 'id');
    }
    if (sortKey === 'penelitian') {
      return sortDir * (a.totalPenelitian - b.totalPenelitian);
    }
    if (sortKey === 'pengabdian') {
      return sortDir * (a.totalPengabdian - b.totalPengabdian);
    }
    if (sortKey === 'publikasi') {
      return sortDir * (a.totalPublikasi - b.totalPublikasi);
    }
    // Default 'no': pertahankan urutan asli
    return 0;
  });

  AppState.filteredDosen = result;
  return result;
}

/**
 * Render baris-baris tabel utama 312 dosen
 */
function renderDosenTable(list) {
  const tbody = document.getElementById('dosen-table-body');
  const countBadge = document.getElementById('count-badge');
  const showingInfo = document.getElementById('table-showing-info');
  const alertContainer = document.getElementById('alert-container');

  if (countBadge) {
    countBadge.textContent = `Ditemukan: ${list.length} Dosen`;
  }

  if (showingInfo) {
    showingInfo.textContent = `Menampilkan ${list.length} dari ${AppState.allDosen.length} total dosen Politeknik Negeri Lhokseumawe`;
  }

  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="10" style="text-align: center; padding: 40px 20px;">
          <div class="empty-state">
            <div class="empty-icon">🔍</div>
            <div class="empty-title">Data dosen tidak ditemukan</div>
            <div class="empty-desc">
              Tidak ada data yang cocok dengan kriteria pencarian atau filter yang dipilih.
            </div>
          </div>
        </td>
      </tr>
    `;

    if (alertContainer && AppState.searchKeyword) {
      alertContainer.innerHTML = `
        <div class="alert alert-warning">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div>
            Dosen dengan kata kunci "<strong>${escapeHtml(AppState.searchKeyword)}</strong>" belum ditemukan.
            <a href="javascript:void(0)" id="link-reset-alert" style="margin-left: 8px; font-weight: 600; text-decoration: underline;">Reset Pencarian</a>
          </div>
        </div>
      `;
      const btnResetAlert = document.getElementById('link-reset-alert');
      if (btnResetAlert) {
        btnResetAlert.addEventListener('click', () => {
          const input = document.getElementById('search-input');
          if (input) input.value = '';
          AppState.searchKeyword = '';
          applyAndRender();
        });
      }
    }
    return;
  }

  if (alertContainer) {
    alertContainer.innerHTML = '';
  }

  let html = '';

  list.forEach((dosen, idx) => {
    const inisial = getInitials(dosen.nama);
    const linkDetail = `detail.html?id=${encodeURIComponent(dosen.id)}&nidn=${encodeURIComponent(dosen.nidn)}`;

    // Kelas badge untuk angka portofolio
    const classPenelitian = dosen.totalPenelitian > 0 ? 'badge-count-penelitian' : 'badge-count-zero';
    const classPengabdian = dosen.totalPengabdian > 0 ? 'badge-count-pengabdian' : 'badge-count-zero';
    const classPublikasi  = dosen.totalPublikasi > 0  ? 'badge-count-publikasi'  : 'badge-count-zero';

    html += `
      <tr data-dosen-id="${escapeHtml(dosen.id)}">
        <td class="col-center col-no">${idx + 1}</td>
        
        <td>
          <div class="cell-dosen-wrap">
            <div class="cell-avatar">${escapeHtml(inisial)}</div>
            <div class="cell-dosen-info">
              <a href="${linkDetail}" class="cell-dosen-nama">${escapeHtml(dosen.nama)}</a>
              <span class="cell-dosen-meta">${escapeHtml(dosen.jabatan_fungsional || 'Dosen')}</span>
            </div>
          </div>
        </td>

        <td>
          ${dosen.nidn && dosen.nidn !== 'Data tidak tersedia'
            ? `<span class="badge badge-nidn">${escapeHtml(dosen.nidn)}</span>`
            : `<span style="font-size:0.78rem; color:var(--text-subtle); font-style:italic;">-</span>`
          }
        </td>

        <td>
          <span class="badge badge-pink" style="font-size: 0.76rem;">${escapeHtml(dosen.pendidikan_terakhir)}</span>
        </td>

        <td>
          <span class="badge badge-success" style="font-size: 0.74rem;">${escapeHtml(dosen.status_aktivitas)}</span>
        </td>

        <td>
          <span style="font-weight: 500; font-size: 0.84rem;">${escapeHtml(dosen.prodi)}</span>
        </td>

        <td class="col-center">
          <button type="button" class="badge-counter ${classPenelitian}" 
            title="Lihat ${dosen.totalPenelitian} Penelitian" 
            onclick="openModalKarya('${escapeHtml(dosen.id)}', 'modal-tab-penelitian')">
            ${dosen.totalPenelitian}
          </button>
        </td>

        <td class="col-center">
          <button type="button" class="badge-counter ${classPengabdian}" 
            title="Lihat ${dosen.totalPengabdian} Pengabdian" 
            onclick="openModalKarya('${escapeHtml(dosen.id)}', 'modal-tab-pengabdian')">
            ${dosen.totalPengabdian}
          </button>
        </td>

        <td class="col-center">
          <button type="button" class="badge-counter ${classPublikasi}" 
            title="Lihat ${dosen.totalPublikasi} Publikasi" 
            onclick="openModalKarya('${escapeHtml(dosen.id)}', 'modal-tab-publikasi')">
            ${dosen.totalPublikasi}
          </button>
        </td>

        <td class="col-center col-aksi">
          <div class="table-action-group">
            <button type="button" class="btn-table-karya" onclick="openModalKarya('${escapeHtml(dosen.id)}')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Lihat Karya
            </button>
            <a href="${linkDetail}" class="btn-table-detail" title="Buka Detail Profil Lengkap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * Render alternatif Grid Kartu Dosen jika pengguna memilih tampilan kartu
 */
function renderDosenGrid(list) {
  const grid = document.getElementById('dosen-grid');
  if (!grid) return;

  if (list.length === 0) {
    grid.innerHTML = '';
    return;
  }

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
            <div class="dosen-inst">${escapeHtml(dosen.perguruan_tinggi)}</div>
            <div class="dosen-prodi">Program Studi: ${escapeHtml(dosen.prodi)}</div>
          </div>
        </div>

        <ul class="meta-list">
          <li class="meta-item">
            <span class="meta-label">Pendidikan</span>
            <span class="meta-value">${escapeHtml(dosen.pendidikan_terakhir)}</span>
          </li>
          <li class="meta-item">
            <span class="meta-label">Portofolio</span>
            <span class="meta-value" style="display:flex; gap:6px;">
              <span class="badge ${dosen.totalPenelitian > 0 ? 'badge-count-penelitian' : 'badge-count-zero'}">🔬 ${dosen.totalPenelitian}</span>
              <span class="badge ${dosen.totalPengabdian > 0 ? 'badge-count-pengabdian' : 'badge-count-zero'}">🤝 ${dosen.totalPengabdian}</span>
              <span class="badge ${dosen.totalPublikasi > 0 ? 'badge-count-publikasi' : 'badge-count-zero'}">📚 ${dosen.totalPublikasi}</span>
            </span>
          </li>
          <li class="meta-item">
            <span class="meta-label">Status Aktivitas</span>
            <span class="meta-value">
              <span class="badge badge-success">${escapeHtml(dosen.status_aktivitas)}</span>
            </span>
          </li>
        </ul>

        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button type="button" class="btn-detail" style="flex: 1; justify-content: center; background: #ede9fe; color: var(--primary-purple);" onclick="openModalKarya('${escapeHtml(dosen.id)}')">
            Lihat Karya
          </button>
          <a href="${linkDetail}" class="btn-detail" style="flex: 1; justify-content: center;">
            Rincian
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

/**
 * Filter, hitung statistik, dan render tabel + grid
 */
function applyAndRender() {
  const filtered = applyFilterAndSearch();

  // Hitung dan perbarui 4 kotak statistik khusus Program Studi yang dipilih
  const stats = calculateProdiStats(AppState.selectedProdi, AppState.allDosen);
  renderProdiStats(stats);

  // Render tabel dan grid
  renderDosenTable(filtered);
  renderDosenGrid(filtered);

  // Perbarui indikator sort icon di header tabel
  updateTableSortIndicators();
}

function updateTableSortIndicators() {
  const headers = document.querySelectorAll('.dosen-main-table th[data-sort]');
  headers.forEach(th => {
    const key = th.getAttribute('data-sort');
    th.classList.remove('sorted-asc', 'sorted-desc');
    const icon = th.querySelector('.sort-icon');

    if (key === AppState.sortBy) {
      if (AppState.sortDir === 'asc') {
        th.classList.add('sorted-asc');
        if (icon) icon.textContent = '▲';
      } else {
        th.classList.add('sorted-desc');
        if (icon) icon.textContent = '▼';
      }
    } else {
      if (icon) icon.textContent = '⇅';
    }
  });
}

/* ============================================================================
   MODAL LIHAT KARYA & PORTOFOLIO (FITUR 2 & 3)
   ============================================================================ */

/**
 * Membuka modal rincian karya untuk dosen tertentu tanpa meninggalkan tabel utama
 */
window.openModalKarya = function (dosenId, targetTabId = 'modal-tab-penelitian') {
  const dosen = AppState.allDosen.find(d => d.id === dosenId || d.nidn === dosenId);
  if (!dosen) {
    console.warn('Dosen tidak ditemukan untuk modal:', dosenId);
    return;
  }

  AppState.currentModalDosen = dosen;

  const modal = document.getElementById('modal-karya');
  const elNama = document.getElementById('modal-karya-nama');
  const elNidn = document.getElementById('modal-karya-nidn');
  const elProdi = document.getElementById('modal-karya-prodi');
  const elPendidikan = document.getElementById('modal-karya-pendidikan');
  const elStatus = document.getElementById('modal-karya-status');
  const linkDetail = document.getElementById('modal-link-detail');

  if (elNama) elNama.textContent = dosen.nama;
  if (elNidn) elNidn.textContent = dosen.nidn;
  if (elProdi) elProdi.textContent = dosen.prodi;
  if (elPendidikan) elPendidikan.textContent = dosen.pendidikan_terakhir;
  if (elStatus) elStatus.textContent = dosen.status_aktivitas;

  if (linkDetail) {
    linkDetail.href = `detail.html?id=${encodeURIComponent(dosen.id)}&nidn=${encodeURIComponent(dosen.nidn)}`;
  }

  // Update counter tab modal
  const cPen = document.getElementById('modal-count-penelitian');
  const cPeng = document.getElementById('modal-count-pengabdian');
  const cPub = document.getElementById('modal-count-publikasi');
  const cPat = document.getElementById('modal-count-paten');

  if (cPen) cPen.textContent = dosen.penelitian.length;
  if (cPeng) cPeng.textContent = dosen.pengabdian.length;
  if (cPub) cPub.textContent = dosen.publikasi.length;
  if (cPat) cPat.textContent = dosen.paten.length;

  // Render daftar karya untuk masing-masing tab (memastikan sumber & tahun tampil)
  renderModalWorksList('modal-list-penelitian', dosen.penelitian, 'Belum ada data penelitian untuk dosen ini.');
  renderModalWorksList('modal-list-pengabdian', dosen.pengabdian, 'Belum ada data pengabdian masyarakat untuk dosen ini.');
  renderModalWorksList('modal-list-publikasi', dosen.publikasi, 'Belum ada data publikasi karya untuk dosen ini.');
  renderModalWorksList('modal-list-paten', dosen.paten, 'Belum ada data HKI atau Paten untuk dosen ini.');

  // Aktifkan tab yang diminta
  switchModalTab(targetTabId);

  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
};

window.closeModalKarya = function () {
  const modal = document.getElementById('modal-karya');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

function switchModalTab(tabId) {
  const tabBtns = document.querySelectorAll('.modal-tab-btn');
  const tabPanes = document.querySelectorAll('.modal-tab-content');

  tabBtns.forEach(btn => {
    if (btn.getAttribute('data-modaltab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  tabPanes.forEach(pane => {
    if (pane.id === tabId) {
      pane.classList.add('active');
    } else {
      pane.classList.remove('active');
    }
  });
}

/**
 * Render daftar karya pada modal dengan kepastian menampilkan:
 * 1. Judul
 * 2. Tahun (atau keterangan jika belum ada)
 * 3. Sumber asli (GARUDA / PDDIKTI / SINTA atau "Sumber belum diverifikasi")
 * 4. Tautan sumber jika tersedia
 */
function renderModalWorksList(containerId, items, emptyText) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 30px 10px;">
        <div class="empty-icon" style="width:44px; height:44px; font-size:1.3rem;">📄</div>
        <div class="empty-desc">${escapeHtml(emptyText)}</div>
      </div>
    `;
    return;
  }

  let html = '';

  items.forEach((item, idx) => {
    const tahunText = item.tahun ? `Tahun: ${item.tahun}` : 'Tahun: Belum tersedia';
    const sumberClass = item.isVerified ? 'verified' : 'unverified';
    const sumberLabel = item.sumber || 'Sumber belum diverifikasi';

    html += `
      <div class="work-item-card">
        <div class="work-item-title">${idx + 1}. ${escapeHtml(item.judul)}</div>
        <div class="work-meta-row">
          <span class="work-year-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${escapeHtml(tahunText)}
          </span>

          <span class="work-source-badge ${sumberClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            Sumber: ${escapeHtml(sumberLabel)}
          </span>

          ${item.url
            ? `
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="work-link">
                Lihat publikasi / tautan
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            `
            : ''
          }
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ============================================================================
   FITUR UNDUH DATA DOSEN & PORTOFOLIO (FITUR 4)
   ============================================================================ */

/**
 * Utilitas untuk memicu unduhan file langsung di browser
 */
function triggerBrowserDownload(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format CSV dengan penanganan koma, tanda petik, dan UTF-8 BOM untuk kompatibilitas Microsoft Excel
 */
function formatCsvCell(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * 1. Unduh Data Semua Dosen (CSV) - mencakup 312 dosen
 */
function downloadCsvAllDosen() {
  const dataset = AppState.allDosen;
  if (!dataset || dataset.length === 0) {
    alert('Data dosen belum siap untuk diunduh.');
    return;
  }

  const headers = [
    'No',
    'ID Dosen',
    'Nama Dosen',
    'NIDN',
    'Perguruan Tinggi',
    'Program Studi',
    'Jurusan',
    'Jabatan Fungsional',
    'Pendidikan Terakhir',
    'Status Kepegawaian',
    'Status Aktivitas',
    'Ikatan Kerja',
    'Jumlah Penelitian',
    'Jumlah Pengabdian',
    'Jumlah Publikasi',
    'Jumlah Paten'
  ];

  let csvRows = [];
  csvRows.push(headers.map(formatCsvCell).join(','));

  dataset.forEach((d, idx) => {
    const row = [
      idx + 1,
      d.id,
      d.nama,
      d.nidn,
      d.perguruan_tinggi,
      d.prodi,
      d.jurusan,
      d.jabatan_fungsional,
      d.pendidikan_terakhir,
      d.status_kepegawaian,
      d.status_aktivitas,
      d.ikatan_kerja,
      d.totalPenelitian,
      d.totalPengabdian,
      d.totalPublikasi,
      d.totalPaten
    ];
    csvRows.push(row.map(formatCsvCell).join(','));
  });

  // Tambahkan \uFEFF (UTF-8 BOM) agar Excel membaca karakter Indonesia dengan rapi
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  triggerBrowserDownload(csvContent, 'data-dosen-pnl.csv', 'text/csv;charset=utf-8;');
}

/**
 * 2. Unduh Data Berdasarkan Program Studi (CSV)
 */
function downloadCsvByProdi() {
  const selectedProdi = AppState.selectedProdi;
  let dataset = AppState.allDosen;

  if (selectedProdi) {
    const pLower = selectedProdi.trim().toLowerCase();
    dataset = dataset.filter(d => d.prodi && d.prodi.trim().toLowerCase() === pLower);
  }

  if (dataset.length === 0) {
    alert('Tidak ada data dosen pada program studi yang dipilih.');
    return;
  }

  const headers = [
    'No',
    'Nama Dosen',
    'NIDN',
    'Program Studi',
    'Pendidikan Terakhir',
    'Jabatan Fungsional',
    'Status Aktivitas',
    'Jumlah Penelitian',
    'Jumlah Pengabdian',
    'Jumlah Publikasi',
    'Jumlah Paten'
  ];

  let csvRows = [];
  csvRows.push(headers.map(formatCsvCell).join(','));

  dataset.forEach((d, idx) => {
    const row = [
      idx + 1,
      d.nama,
      d.nidn,
      d.prodi,
      d.pendidikan_terakhir,
      d.jabatan_fungsional,
      d.status_aktivitas,
      d.totalPenelitian,
      d.totalPengabdian,
      d.totalPublikasi,
      d.totalPaten
    ];
    csvRows.push(row.map(formatCsvCell).join(','));
  });

  const slug = selectedProdi ? slugify(selectedProdi) : 'semua-prodi';
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  triggerBrowserDownload(csvContent, `data-dosen-pnl-${slug}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * 3. Unduh Portofolio Lengkap (JSON)
 */
function downloadJsonFullPortfolio() {
  const dataset = AppState.allDosen;
  if (!dataset || dataset.length === 0) {
    alert('Data portofolio belum tersedia.');
    return;
  }

  const exportData = {
    institusi: 'Politeknik Negeri Lhokseumawe',
    total_dosen: dataset.length,
    tanggal_unduh: new Date().toISOString(),
    sumber_data: 'Portal Resmi Data Dosen PNL & GARUDA Kemdiktisaintek',
    dosen: dataset
  };

  const jsonContent = JSON.stringify(exportData, null, 2);
  triggerBrowserDownload(jsonContent, 'portofolio-dosen-pnl-lengkap.json', 'application/json');
}

/**
 * 4. Unduh Rincian Portofolio Karya Semua Dosen (CSV)
 * Memuat baris per karya dengan Judul, Tahun, Sumber, dan Tautan
 */
function downloadCsvWorksDetail() {
  const dataset = AppState.allDosen;
  if (!dataset || dataset.length === 0) {
    alert('Data belum siap untuk diunduh.');
    return;
  }

  const headers = [
    'No',
    'Nama Dosen',
    'NIDN',
    'Program Studi',
    'Kategori Portofolio',
    'Judul Karya',
    'Tahun',
    'Sumber Data',
    'Tautan Sumber'
  ];

  let csvRows = [];
  csvRows.push(headers.map(formatCsvCell).join(','));
  let counter = 1;

  dataset.forEach(d => {
    // 1. Penelitian
    d.penelitian.forEach(item => {
      csvRows.push([
        counter++,
        d.nama,
        d.nidn,
        d.prodi,
        'Penelitian',
        item.judul,
        item.tahun || '',
        item.sumber || 'Sumber belum diverifikasi',
        item.url || ''
      ].map(formatCsvCell).join(','));
    });

    // 2. Pengabdian
    d.pengabdian.forEach(item => {
      csvRows.push([
        counter++,
        d.nama,
        d.nidn,
        d.prodi,
        'Pengabdian Masyarakat',
        item.judul,
        item.tahun || '',
        item.sumber || 'Sumber belum diverifikasi',
        item.url || ''
      ].map(formatCsvCell).join(','));
    });

    // 3. Publikasi
    d.publikasi.forEach(item => {
      csvRows.push([
        counter++,
        d.nama,
        d.nidn,
        d.prodi,
        'Publikasi Karya',
        item.judul,
        item.tahun || '',
        item.sumber || 'Sumber belum diverifikasi',
        item.url || ''
      ].map(formatCsvCell).join(','));
    });

    // 4. Paten
    d.paten.forEach(item => {
      csvRows.push([
        counter++,
        d.nama,
        d.nidn,
        d.prodi,
        'HKI / Paten',
        item.judul,
        item.tahun || '',
        item.sumber || 'Sumber belum diverifikasi',
        item.url || ''
      ].map(formatCsvCell).join(','));
    });
  });

  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  triggerBrowserDownload(csvContent, 'rincian-portofolio-karya-pnl.csv', 'text/csv;charset=utf-8;');
}

/**
 * 5. Unduh Portofolio Per Dosen (JSON)
 */
function downloadJsonPerDosen(dosen) {
  if (!dosen) return;
  const fileName = `portofolio-${slugify(dosen.nama)}.json`;
  const jsonContent = JSON.stringify(dosen, null, 2);
  triggerBrowserDownload(jsonContent, fileName, 'application/json');
}

/**
 * 6. Cetak / Simpan Ringkasan Portofolio Dosen (PDF)
 */
function printOrSavePdf(dosen) {
  if (!dosen) return;
  window.print();
}

/* ============================================================================
   INISIALISASI HALAMAN UTAMA (INDEX.HTML)
   ============================================================================ */

async function initIndexPage() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const btnSearch = document.getElementById('btn-search');
  const btnReset = document.getElementById('btn-reset-search');
  const selectProdi = document.getElementById('filter-prodi');
  const skeletonContainer = document.getElementById('skeleton-container');
  const tableSection = document.getElementById('dosen-table-section');
  const dosenGrid = document.getElementById('dosen-grid');
  const chips = document.querySelectorAll('.search-chip[data-query]');

  // Dropdown Unduh Menu
  const btnUnduhToggle = document.getElementById('btn-unduh-toggle');
  const downloadMenu = document.getElementById('download-menu');
  const btnUnduhSemuaCsv = document.getElementById('btn-unduh-semua-csv');
  const btnUnduhProdiCsv = document.getElementById('btn-unduh-prodi-csv');
  const btnUnduhPortofolioJson = document.getElementById('btn-unduh-portofolio-json');
  const btnUnduhKaryaCsv = document.getElementById('btn-unduh-karya-csv');

  // View Toggle (Tabel / Grid)
  const btnViewTable = document.getElementById('btn-view-table');
  const btnViewGrid = document.getElementById('btn-view-grid');

  // Modal Rincian Karya
  const modalClose = document.getElementById('modal-karya-close');
  const modalOverlay = document.getElementById('modal-karya');
  const modalBtnUnduhJson = document.getElementById('modal-btn-unduh-json');
  const modalBtnCetakPdf = document.getElementById('modal-btn-cetak-pdf');

  // Cek parameter URL untuk pencarian awal atau filter prodi
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  const initialProdi = urlParams.get('prodi') || '';

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
    AppState.searchKeyword = initialQuery;
  }

  if (initialProdi) {
    AppState.selectedProdi = initialProdi;
  }

  // Tampilkan Skeleton Loading awal
  if (skeletonContainer) skeletonContainer.style.display = 'grid';
  if (tableSection) tableSection.style.display = 'none';
  if (dosenGrid) dosenGrid.style.display = 'none';

  // Muat data.json (312 dosen)
  await loadDataJson();

  // Sembunyikan Skeleton Loading
  if (skeletonContainer) skeletonContainer.style.display = 'none';
  if (tableSection) tableSection.style.display = 'block';

  // Isi dropdown Program Studi
  populateProdiDropdown(AppState.allDosen);

  if (selectProdi && AppState.selectedProdi) {
    selectProdi.value = AppState.selectedProdi;
  }

  // Render awal data dan statistik
  applyAndRender();

  // Event Handler Pencarian
  function handleSearchSubmit() {
    const q = searchInput ? searchInput.value.trim() : '';
    AppState.searchKeyword = q;

    if (btnReset) {
      btnReset.style.display = q ? 'inline-block' : 'none';
    }

    const newUrl = q ? `index.html?q=${encodeURIComponent(q)}` : 'index.html';
    window.history.pushState({}, '', newUrl);

    applyAndRender();
  }

  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      handleSearchSubmit();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', e => {
      e.preventDefault();
      handleSearchSubmit();
    });
  }

  if (searchInput) {
    // Live filter saat pengguna mengetik (debounce ringan)
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        AppState.searchKeyword = searchInput.value.trim();
        if (btnReset) {
          btnReset.style.display = AppState.searchKeyword ? 'inline-block' : 'none';
        }
        applyAndRender();
      }, 250);
    });
  }

  // Event Handler Search Chips
  chips.forEach(chip => {
    chip.addEventListener('click', function () {
      const q = this.getAttribute('data-query');
      if (searchInput) searchInput.value = q;
      AppState.searchKeyword = q;
      if (btnReset) btnReset.style.display = 'inline-block';
      applyAndRender();
    });
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      AppState.searchKeyword = '';
      btnReset.style.display = 'none';
      window.history.pushState({}, '', 'index.html');
      applyAndRender();
    });
  }

  // Event Handler Filter Program Studi
  if (selectProdi) {
    selectProdi.addEventListener('change', function () {
      AppState.selectedProdi = this.value;
      applyAndRender();
    });
  }

  // Event Handler Sorting Kolom Tabel
  const sortHeaders = document.querySelectorAll('.dosen-main-table th[data-sort]');
  sortHeaders.forEach(th => {
    th.addEventListener('click', function () {
      const sortKey = this.getAttribute('data-sort');
      if (AppState.sortBy === sortKey) {
        AppState.sortDir = AppState.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        AppState.sortBy = sortKey;
        AppState.sortDir = (sortKey === 'penelitian' || sortKey === 'pengabdian' || sortKey === 'publikasi') ? 'desc' : 'asc';
      }
      applyAndRender();
    });
  });

  // Event Handler View Toggle (Tabel / Grid)
  if (btnViewTable && btnViewGrid) {
    btnViewTable.addEventListener('click', () => {
      btnViewTable.classList.add('active');
      btnViewGrid.classList.remove('active');
      if (tableSection) tableSection.style.display = 'block';
      if (dosenGrid) dosenGrid.style.display = 'none';
      AppState.activeView = 'table';
    });

    btnViewGrid.addEventListener('click', () => {
      btnViewGrid.classList.add('active');
      btnViewTable.classList.remove('active');
      if (tableSection) tableSection.style.display = 'none';
      if (dosenGrid) dosenGrid.style.display = 'grid';
      AppState.activeView = 'grid';
    });
  }

  // Event Handler Download Menu Dropdown
  if (btnUnduhToggle && downloadMenu) {
    btnUnduhToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShow = downloadMenu.classList.contains('show');
      downloadMenu.classList.toggle('show', !isShow);
      btnUnduhToggle.setAttribute('aria-expanded', !isShow ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.download-dropdown-wrap')) {
        downloadMenu.classList.remove('show');
        btnUnduhToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (btnUnduhSemuaCsv) {
    btnUnduhSemuaCsv.addEventListener('click', () => {
      downloadCsvAllDosen();
      if (downloadMenu) downloadMenu.classList.remove('show');
    });
  }

  if (btnUnduhProdiCsv) {
    btnUnduhProdiCsv.addEventListener('click', () => {
      downloadCsvByProdi();
      if (downloadMenu) downloadMenu.classList.remove('show');
    });
  }

  if (btnUnduhPortofolioJson) {
    btnUnduhPortofolioJson.addEventListener('click', () => {
      downloadJsonFullPortfolio();
      if (downloadMenu) downloadMenu.classList.remove('show');
    });
  }

  if (btnUnduhKaryaCsv) {
    btnUnduhKaryaCsv.addEventListener('click', () => {
      downloadCsvWorksDetail();
      if (downloadMenu) downloadMenu.classList.remove('show');
    });
  }

  // Event Handler Modal Rincian Karya
  if (modalClose) {
    modalClose.addEventListener('click', closeModalKarya);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModalKarya();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalKarya();
  });

  const modalTabBtns = document.querySelectorAll('.modal-tab-btn');
  modalTabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-modaltab');
      switchModalTab(tabId);
    });
  });

  if (modalBtnUnduhJson) {
    modalBtnUnduhJson.addEventListener('click', () => {
      if (AppState.currentModalDosen) {
        downloadJsonPerDosen(AppState.currentModalDosen);
      }
    });
  }

  if (modalBtnCetakPdf) {
    modalBtnCetakPdf.addEventListener('click', () => {
      if (AppState.currentModalDosen) {
        printOrSavePdf(AppState.currentModalDosen);
      }
    });
  }
}

/* ============================================================================
   INISIALISASI HALAMAN DETAIL (DETAIL.HTML) (FITUR 2 & 5)
   ============================================================================ */

async function initDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const idDosen = urlParams.get('id');
  const nidnDosen = urlParams.get('nidn') || '';

  const skeleton = document.getElementById('detail-skeleton');
  const content = document.getElementById('detail-content');

  setupDetailTabs();

  if (!idDosen && !nidnDosen) {
    showDetailError('Parameter ID atau NIDN dosen tidak ditemukan. Silakan kembali ke daftar dosen.');
    return;
  }

  // Muat data.json
  if (AppState.allDosen.length === 0) {
    await loadDataJson();
  }

  // Cari data dosen yang benar pada data.json tanpa tertukar dengan dosen lain
  let dosen = null;

  if (nidnDosen) {
    dosen = AppState.allDosen.find(d => d.nidn && d.nidn.trim() === nidnDosen.trim());
  }

  if (!dosen && idDosen) {
    dosen = AppState.allDosen.find(d => d.id === idDosen);
  }

  if (dosen) {
    renderDetailPageData(dosen);
  } else {
    // Jika tidak ditemukan di data.json, coba cari melalui API
    try {
      const liveData = await fetchDosenDetailApi(idDosen, nidnDosen);
      if (liveData && !liveData.error) {
        renderDetailPageFromApi(liveData);
      } else {
        showDetailError('Data dosen tidak ditemukan dalam sistem.');
      }
    } catch (err) {
      showDetailError(`Gagal memuat profil dosen: ${err.message}`);
    }
  }
}

function renderDetailPageData(dosen) {
  const skeleton = document.getElementById('detail-skeleton');
  const content = document.getElementById('detail-content');

  document.title = `${dosen.nama} - Detail Dosen Politeknik Negeri Lhokseumawe`;

  // Profil Banner
  const avatar = document.getElementById('profile-avatar');
  if (avatar) avatar.textContent = getInitials(dosen.nama);

  const elNama = document.getElementById('dosen-nama');
  if (elNama) elNama.textContent = dosen.nama;

  const elKampus = document.getElementById('dosen-kampus');
  if (elKampus) elKampus.textContent = dosen.perguruan_tinggi;

  const elProdi = document.getElementById('dosen-prodi');
  if (elProdi) elProdi.textContent = `Program Studi: ${dosen.prodi}`;

  const nidnPill = document.getElementById('dosen-nidn-pill');
  const nidnText = document.getElementById('dosen-nidn-text');
  if (nidnPill && nidnText) {
    if (dosen.nidn && dosen.nidn !== 'Data tidak tersedia') {
      nidnPill.style.display = 'inline-flex';
      nidnText.textContent = dosen.nidn;
    } else {
      nidnPill.style.display = 'none';
    }
  }

  // Grid Detail
  const setGridValue = (id, val, isBadge = false, badgeClass = '') => {
    const el = document.getElementById(id);
    if (!el) return;
    if (val && val !== 'Data tidak tersedia' && val !== '-') {
      el.className = 'detail-item-value';
      el.innerHTML = isBadge ? `<span class="badge ${badgeClass}">${escapeHtml(val)}</span>` : escapeHtml(val);
    } else {
      el.className = 'detail-item-value unavailable';
      el.textContent = 'Data tidak tersedia';
    }
  };

  setGridValue('grid-nidn', dosen.nidn, true, 'badge-nidn-large');
  setGridValue('grid-jabatan', dosen.jabatan_fungsional, true, 'badge-purple');
  setGridValue('grid-pendidikan', dosen.pendidikan_terakhir, true, 'badge-pink');
  setGridValue('grid-kepegawaian', dosen.status_kepegawaian);
  setGridValue('grid-aktivitas', dosen.status_aktivitas, true, 'badge-success');

  // Counters
  const setCounter = (id, count) => {
    const el = document.getElementById(id);
    if (el) el.textContent = count;
  };

  setCounter('counter-penelitian', dosen.penelitian.length);
  setCounter('counter-pengabdian', dosen.pengabdian.length);
  setCounter('counter-publikasi', dosen.publikasi.length);
  setCounter('counter-paten', dosen.paten.length);

  setCounter('sub-counter-penelitian', `Total: ${dosen.penelitian.length} Penelitian`);
  setCounter('sub-counter-pengabdian', `Total: ${dosen.pengabdian.length} Pengabdian`);
  setCounter('sub-counter-publikasi', `Total: ${dosen.publikasi.length} Publikasi`);
  setCounter('sub-counter-paten', `Total: ${dosen.paten.length} HKI / Paten`);

  // Render Portofolio Tables dengan Judul, Tahun, Sumber, & Tautan
  renderDetailPagePortfolioTable('container-penelitian', dosen.penelitian, '🔬', 'Belum ada data penelitian untuk dosen ini.');
  renderDetailPagePortfolioTable('container-pengabdian', dosen.pengabdian, '🤝', 'Belum ada data pengabdian masyarakat untuk dosen ini.');
  renderDetailPagePortfolioTable('container-publikasi', dosen.publikasi, '📚', 'Belum ada data publikasi karya untuk dosen ini.');
  renderDetailPagePortfolioTable('container-paten', dosen.paten, '🛡️', 'Belum ada data HKI atau Paten untuk dosen ini.');

  // Tambahkan tombol unduh per dosen jika belum ada
  injectDetailActionButtons(dosen);

  if (skeleton) skeleton.style.display = 'none';
  if (content) content.style.display = 'block';
}

function renderDetailPagePortfolioTable(containerId, list, emptyIcon, emptyText) {
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
    const tahunText = item.tahun ? item.tahun : '-';
    const sumberLabel = item.sumber || 'Sumber belum diverifikasi';
    const sumberClass = item.isVerified ? 'verified' : 'unverified';

    rowsHtml += `
      <tr>
        <td class="col-no">${index + 1}</td>
        <td>
          <div class="table-item-title">${escapeHtml(item.judul)}</div>
        </td>
        <td class="col-tahun">
          <span class="year-badge">${escapeHtml(tahunText)}</span>
        </td>
        <td>
          <span class="work-source-badge ${sumberClass}" style="font-size:0.75rem;">
            ${escapeHtml(sumberLabel)}
          </span>
        </td>
        <td style="text-align: center;">
          ${item.url
            ? `
              <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" class="btn-table-karya" style="text-decoration:none; padding:4px 8px; font-size:0.75rem;">
                Lihat Tautan ↗
              </a>
            `
            : `<span style="color:var(--text-subtle); font-size:0.76rem;">-</span>`
          }
        </td>
      </tr>
    `;
  });

  container.innerHTML = `
    <table class="modern-table">
      <thead>
        <tr>
          <th class="col-no">No</th>
          <th>Judul Karya</th>
          <th class="col-tahun">Tahun</th>
          <th>Sumber Data</th>
          <th style="text-align: center; width: 120px;">Tautan Sumber</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function injectDetailActionButtons(dosen) {
  const existing = document.getElementById('detail-actions-bar');
  if (existing) return;

  const header = document.querySelector('.detail-page-header');
  if (!header) return;

  const bar = document.createElement('div');
  bar.id = 'detail-actions-bar';
  bar.style.display = 'flex';
  bar.style.gap = '10px';
  bar.style.alignItems = 'center';
  bar.style.marginLeft = 'auto';

  bar.innerHTML = `
    <button type="button" class="btn-modal-action" id="btn-detail-unduh-json" title="Unduh data profil dan portofolio dosen dalam format JSON">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Unduh Portofolio (JSON)
    </button>
    <button type="button" class="btn-modal-action" id="btn-detail-cetak-pdf" title="Cetak atau simpan portofolio ke PDF">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      Cetak / Simpan PDF
    </button>
  `;

  header.style.display = 'flex';
  header.style.alignItems = 'center';
  header.style.justifyContent = 'space-between';
  header.appendChild(bar);

  const btnJson = document.getElementById('btn-detail-unduh-json');
  const btnPdf = document.getElementById('btn-detail-cetak-pdf');

  if (btnJson) btnJson.addEventListener('click', () => downloadJsonPerDosen(dosen));
  if (btnPdf) btnPdf.addEventListener('click', () => printOrSavePdf(dosen));
}

function showDetailError(message) {
  const skeleton = document.getElementById('detail-skeleton');
  const content = document.getElementById('detail-content');

  if (skeleton) skeleton.style.display = 'none';
  if (content) {
    content.style.display = 'block';
    content.innerHTML = `
      <div class="alert alert-warning" style="margin: 20px 0;">
        <strong>Data dosen tidak dapat dibuka.</strong>
        <p style="margin-top: 8px;">${escapeHtml(message)}</p>
        <a href="index.html" class="btn-detail" style="display: inline-flex; margin-top: 12px;">
          Kembali ke Daftar Dosen
        </a>
      </div>
    `;
  }
}

function setupDetailTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetTabId = this.getAttribute('data-tab');

      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      tabPanes.forEach(pane => {
        pane.classList.remove('active');
      });

      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/**
 * Fallback jika memanggil API PDDIKTI langsung
 */
async function fetchDosenDetailApi(id, nidnHint = '') {
  if (!id) throw new Error('ID dosen tidak tersedia.');

  const url = `${API_ENDPOINT}?action=all&id=${encodeURIComponent(id)}&nidn=${encodeURIComponent(nidnHint || '')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const json = await res.json();
  if (json.sukses && json.data) return json.data;

  throw new Error(json.pesan || 'Data detail tidak ditemukan.');
}

function renderDetailPageFromApi(apiData) {
  const profil = apiData.profil && apiData.profil.data ? apiData.profil.data : {};
  const dosenObj = {
    id: profil.id || 'pddikti-live',
    nama: profil.nama_dosen || 'Dosen PNL',
    nidn: profil.nidn || 'Data tidak tersedia',
    perguruan_tinggi: profil.nama_pt || 'Politeknik Negeri Lhokseumawe',
    prodi: profil.nama_prodi || 'Data tidak tersedia',
    jurusan: '',
    jabatan_fungsional: profil.jabatan_akademik || 'Dosen',
    pendidikan_terakhir: profil.pendidikan_tertinggi || 'Data tidak tersedia',
    status_kepegawaian: profil.status_ikatan_kerja || 'Data tidak tersedia',
    status_aktivitas: profil.status_aktivitas || 'Aktif',
    ikatan_kerja: 'Dosen Tetap',
    penelitian: (apiData.penelitian && apiData.penelitian.data ? apiData.penelitian.data : [])
      .map(p => normalizeWorkItem(p, 'Penelitian')).filter(Boolean),
    pengabdian: (apiData.pengabdian && apiData.pengabdian.data ? apiData.pengabdian.data : [])
      .map(p => normalizeWorkItem(p, 'Pengabdian Masyarakat')).filter(Boolean),
    publikasi: (apiData.publikasi && apiData.publikasi.data ? apiData.publikasi.data : [])
      .map(p => normalizeWorkItem(p, 'Publikasi Karya')).filter(Boolean),
    paten: (apiData.paten && apiData.paten.data ? apiData.paten.data : [])
      .map(p => normalizeWorkItem(p, 'HKI/Paten')).filter(Boolean)
  };

  renderDetailPageData(dosenObj);
}

/* ============================================================================
   STARTUP ROUTER
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Jika berada di halaman Index
  if (document.getElementById('search-form') || document.getElementById('dosen-table')) {
    initIndexPage();
  }

  // Jika berada di halaman Detail
  if (document.getElementById('detail-skeleton') || document.getElementById('profile-avatar')) {
    initDetailPage();
  }
});