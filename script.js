/**
 * ============================================================================
 * SCRIPT.JS - DATA DOSEN POLITEKNIK NEGERI LHOKSEUMAWE
 * Client-Side JavaScript untuk Index & Detail Portofolio PDDIKTI
 * ============================================================================
 */

const DEFAULT_DOSEN_ID = 'p-jhS6LzvaL1kt3oVFY5zzMdtNmpfhsPIO6Op0gvy0yJlNtXCE_GGPlhKQL50UkaCMpwAQ==';
const DEFAULT_DOSEN_NIDN = '0009067504';

const API_ENDPOINT = '/api/pddikti';

/* ============================================================================
   DATA FALLBACK DAFTAR DOSEN
   ============================================================================ */

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

/* ============================================================================
   HELPER
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

  const clean = String(name)
    .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
    .trim();

  const parts = clean.split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return clean.substring(0, 2).toUpperCase() || 'DS';
}

/* ============================================================================
   GELAR DOSEN
   ============================================================================ */

function getGelar(item) {
  if (!item || typeof item !== 'object') return '';

  /*
   * Mengambil gelar hanya jika memang tersedia dari API.
   * Tidak membuat atau menebak gelar.
   */

  const gelarLengkap =
    item.gelar ||
    item.gelar_lengkap ||
    item.nama_gelar ||
    item.degree ||
    item.degrees ||
    '';

  if (Array.isArray(gelarLengkap)) {
    return gelarLengkap
      .filter(Boolean)
      .join(', ');
  }

  if (gelarLengkap) {
    return String(gelarLengkap).trim();
  }

  const gelarDepan =
    item.gelar_depan ||
    item.gelar_depan_dosen ||
    item.front_degree ||
    '';

  const gelarBelakang =
    item.gelar_belakang ||
    item.gelar_belakang_dosen ||
    item.back_degree ||
    '';

  let hasil = '';

  if (gelarDepan) {
    hasil += String(gelarDepan).trim();
  }

  if (gelarBelakang) {
    if (hasil) hasil += ', ';
    hasil += String(gelarBelakang).trim();
  }

  return hasil;
}

function buildNamaLengkap(item) {
  if (!item || typeof item !== 'object') {
    return 'Tanpa Nama';
  }

  const nama =
    item.nama ||
    item.nama_dosen ||
    item.name ||
    'Tanpa Nama';

  const gelar = getGelar(item);

  /*
   * Jika API sudah memberikan nama lengkap beserta gelar,
   * jangan menggandakan gelar.
   */
  if (!gelar) {
    return String(nama).trim();
  }

  const namaString = String(nama).trim();

  if (namaString.includes(gelar)) {
    return namaString;
  }

  return `${namaString}, ${gelar}`;
}

/* ============================================================================
   NORMALISASI DATA DOSEN
   ============================================================================ */

function normalizeDosen(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const nidn =
    item.nidn
      ? String(item.nidn).trim()
      : (item.nuptk ? String(item.nuptk).trim() : '');

  /*
   * PENTING:
   * Jangan menggunakan DEFAULT_DOSEN_ID sebagai ID dosen lain.
   * Jika API tidak memberikan ID, data tersebut tidak boleh
   * diarahkan ke ARYATI.
   */
  const id =
    item.id ||
    item.id_dosen ||
    item.id_sdm ||
    item.id_sivitas ||
    '';

  const nama = buildNamaLengkap(item);

  return {
    id: id,
    nama: nama,
    nidn: nidn || 'Data tidak tersedia',

    nama_pt:
      item.nama_pt && item.nama_pt !== 'N/A'
        ? item.nama_pt
        : 'Politeknik Negeri Lhokseumawe',

    nama_prodi:
      item.nama_prodi ||
      item.prodi ||
      'Data tidak tersedia',

    jabatan:
      item.jabatan_akademik ||
      item.jabatan ||
      'Dosen',

    pendidikan:
      item.pendidikan_tertinggi ||
      item.pendidikan ||
      'Data tidak tersedia',

    status:
      item.status_aktivitas ||
      item.status ||
      'Aktif',

    gelar: getGelar(item)
  };
}

/* ============================================================================
   API CLIENT - DAFTAR DOSEN
   ============================================================================ */

async function fetchDosenList(keyword = '') {
  try {
    const url = keyword
      ? `${API_ENDPOINT}?action=search&q=${encodeURIComponent(keyword)}`
      : `${API_ENDPOINT}?action=search&q=`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (
      json.sukses &&
      Array.isArray(json.data) &&
      json.data.length > 0
    ) {
      const normalized = json.data
        .map(normalizeDosen)
        .filter(dosen => dosen && dosen.id);

      if (normalized.length > 0) {
        return normalized;
      }
    }
  } catch (err) {
    console.warn(
      'Gagal memuat API live, menggunakan data fallback:',
      err.message
    );
  }

  /*
   * Fallback hanya digunakan untuk daftar dosen.
   * Bukan untuk mengganti detail dosen dengan ARYATI.
   */
  if (!keyword) {
    return FALLBACK_DOSEN_LIST;
  }

  const qLower = keyword.toLowerCase();

  return FALLBACK_DOSEN_LIST.filter(dosen =>
    dosen.nama.toLowerCase().includes(qLower) ||
    (dosen.nidn && dosen.nidn.includes(qLower)) ||
    (dosen.nama_prodi &&
      dosen.nama_prodi.toLowerCase().includes(qLower))
  );
}

/* ============================================================================
   API CLIENT - DETAIL DOSEN
   ============================================================================ */

async function fetchDosenDetail(id, nidnHint = '') {
  /*
   * Jangan pernah mengganti ID dosen dengan DEFAULT_DOSEN_ID.
   */

  if (!id) {
    throw new Error('ID dosen tidak tersedia.');
  }

  try {
    const url =
      `${API_ENDPOINT}?action=all` +
      `&id=${encodeURIComponent(id)}` +
      `&nidn=${encodeURIComponent(nidnHint || '')}`;

    console.log('Mengambil detail dosen dengan ID:', id);

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();

    if (json.sukses && json.data) {
      return json.data;
    }

    throw new Error(
      json.pesan || 'Data detail dosen tidak tersedia.'
    );

  } catch (err) {
    console.error('Gagal memuat detail dosen:', err);

    /*
     * JANGAN:
     * return FALLBACK_ARYATI_PORTOFOLIO;
     *
     * Karena itu menyebabkan semua dosen berubah menjadi ARYATI.
     */

    return {
      profil: {
        nama_dosen: 'Data dosen tidak tersedia',
        nidn: nidnHint || 'Data tidak tersedia',
        nama_pt: 'Politeknik Negeri Lhokseumawe',
        nama_prodi: 'Data tidak tersedia',
        jabatan_akademik: 'Data tidak tersedia',
        pendidikan_tertinggi: 'Data tidak tersedia',
        status_ikatan_kerja: 'Data tidak tersedia',
        status_aktivitas: 'Data tidak tersedia'
      },
      penelitian: [],
      pengabdian: [],
      publikasi: [],
      paten: [],
      error: true,
      errorMessage: err.message
    };
  }
}

/* ============================================================================
   HALAMAN INDEX
   ============================================================================ */

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

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';

  if (searchInput && initialQuery) {
    searchInput.value = initialQuery;
  }

  loadDosen(initialQuery);

  function handleSearch() {
    const q = searchInput.value.trim();

    const newUrl = q
      ? `index.html?q=${encodeURIComponent(q)}`
      : 'index.html';

    window.history.pushState({}, '', newUrl);

    loadDosen(q);
  }

  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      handleSearch();
    });
  }

  if (btnSearch) {
    btnSearch.addEventListener('click', e => {
      e.preventDefault();
      handleSearch();
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      const q = this.getAttribute('data-query');

      if (searchInput) {
        searchInput.value = q;
      }

      handleSearch();
    });
  });

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }

      window.history.pushState({}, '', 'index.html');

      loadDosen('');
    });
  }

  async function loadDosen(query = '') {
    if (skeletonContainer) {
      skeletonContainer.style.display = 'grid';
    }

    if (dosenGrid) {
      dosenGrid.style.display = 'none';
    }

    if (alertContainer) {
      alertContainer.innerHTML = '';
    }

    if (query) {
      if (sectionTitle) {
        sectionTitle.textContent =
          `Hasil Pencarian Dosen "${query}"`;
      }

      if (btnReset) {
        btnReset.style.display = 'inline-block';
      }

    } else {
      if (sectionTitle) {
        sectionTitle.textContent =
          'Daftar Dosen Politeknik Negeri Lhokseumawe';
      }

      if (btnReset) {
        btnReset.style.display = 'none';
      }
    }

    if (countBadge) {
      countBadge.textContent = 'Mencari data...';
    }

    const list = await fetchDosenList(query);

    if (skeletonContainer) {
      skeletonContainer.style.display = 'none';
    }

    if (dosenGrid) {
      dosenGrid.style.display = 'grid';
    }

    if (countBadge) {
      countBadge.textContent =
        `Ditemukan: ${list.length} Dosen`;
    }

    if (list.length === 0) {
      if (dosenGrid) {
        dosenGrid.innerHTML = '';
      }

      if (alertContainer) {
        alertContainer.innerHTML = `
          <div class="alert alert-warning">
            <svg width="20" height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">

              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>

            </svg>

            <div>
              Dosen dengan kata kunci
              "<strong>${escapeHtml(query)}</strong>"
              belum ditemukan di PDDIKTI.

              <a href="javascript:void(0)"
                id="link-kembali"
                style="margin-left: 8px; font-weight: 600; text-decoration: underline;">
                Kembali ke Daftar Dosen
              </a>
            </div>
          </div>
        `;

        const linkKembali =
          document.getElementById('link-kembali');

        if (linkKembali) {
          linkKembali.addEventListener('click', () => {
            if (searchInput) {
              searchInput.value = '';
            }

            window.history.pushState(
              {},
              '',
              'index.html'
            );

            loadDosen('');
          });
        }
      }

      return;
    }

    let html = '';

    list.forEach(dosen => {

      /*
       * Jika ID kosong, jangan membuat link detail
       * yang mengarah ke ARYATI.
       */

      const inisial = getInitials(dosen.nama);

      const linkDetail = dosen.id
        ? `detail.html?id=${encodeURIComponent(dosen.id)}&nidn=${encodeURIComponent(dosen.nidn || '')}`
        : '#';

      html += `
        <div class="dosen-card">

          <div class="card-header-flex">

            <div class="avatar-circle">
              ${escapeHtml(inisial)}
            </div>

            <div class="card-header-info">

              <h4 class="dosen-name">
                ${escapeHtml(dosen.nama)}
              </h4>

              <div class="dosen-nidn-tag">
                <span class="nidn-prefix">NIDN:</span>
                <strong>
                  ${escapeHtml(dosen.nidn)}
                </strong>
              </div>

              <div class="dosen-inst">
                ${escapeHtml(dosen.nama_pt)}
              </div>

              <div class="dosen-prodi">
                Program Studi:
                ${escapeHtml(dosen.nama_prodi)}
              </div>

            </div>

          </div>

          <ul class="meta-list">

            <li class="meta-item">
              <span class="meta-label">NIDN</span>

              <span class="meta-value">
                ${
                  dosen.nidn !== 'Data tidak tersedia'
                    ? `<span class="badge badge-nidn">
                        ${escapeHtml(dosen.nidn)}
                       </span>`
                    : `<span style="font-size:0.8rem; color:var(--text-subtle); font-style:italic;">
                        Data tidak tersedia
                       </span>`
                }
              </span>
            </li>

            <li class="meta-item">
              <span class="meta-label">
                Jabatan Fungsional
              </span>

              <span class="meta-value">
                <span class="badge badge-purple">
                  ${escapeHtml(dosen.jabatan)}
                </span>
              </span>
            </li>

            <li class="meta-item">
              <span class="meta-label">
                Pendidikan
              </span>

              <span class="meta-value">
                ${escapeHtml(dosen.pendidikan)}
              </span>
            </li>

            <li class="meta-item">
              <span class="meta-label">
                Status Aktivitas
              </span>

              <span class="meta-value">
                <span class="badge badge-success">
                  ${escapeHtml(dosen.status)}
                </span>
              </span>
            </li>

          </ul>

          ${
            dosen.id
              ? `
                <a href="${linkDetail}" class="btn-detail">
                  Lihat Portofolio &amp; Rincian

                  <svg width="18" height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">

                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>

                  </svg>
                </a>
              `
              : `
                <span class="btn-detail"
                  style="opacity:0.5; cursor:not-allowed;">
                  Detail tidak tersedia
                </span>
              `
          }

        </div>
      `;
    });

    if (dosenGrid) {
      dosenGrid.innerHTML = html;
    }
  }
}

/* ============================================================================
   HALAMAN DETAIL
   ============================================================================ */

function initDetailPage() {

  const urlParams =
    new URLSearchParams(window.location.search);

  /*
   * PENTING:
   * Jangan menggunakan DEFAULT_DOSEN_ID jika parameter id tidak ada.
   * Jika halaman detail dibuka tanpa ID, tampilkan pesan.
   */

  const idDosen = urlParams.get('id');
  const nidnHint = urlParams.get('nidn') || '';

  const skeleton =
    document.getElementById('detail-skeleton');

  const content =
    document.getElementById('detail-content');

  setupTabs();

  if (!idDosen) {
    showDetailError(
      'ID dosen tidak ditemukan. Silakan kembali ke daftar dosen dan pilih dosen terlebih dahulu.'
    );

    return;
  }

  loadDetailData(idDosen, nidnHint);

  async function loadDetailData(id, nidn) {

    const data =
      await fetchDosenDetail(id, nidn);

    const profil = data.profil || {};

    const penelitian =
      Array.isArray(data.penelitian)
        ? data.penelitian
        : [];

    const pengabdian =
      Array.isArray(data.pengabdian)
        ? data.pengabdian
        : [];

    const publikasi =
      Array.isArray(data.publikasi)
        ? data.publikasi
        : [];

    const paten =
      Array.isArray(data.paten)
        ? data.paten
        : [];

    /*
     * Nama diambil dari API.
     * Tidak lagi menggunakan fallback ARYATI.
     */

    const nama =
      buildNamaLengkap(profil);

    const inisial =
      getInitials(nama);

    const pt =
      profil.nama_pt ||
      'Politeknik Negeri Lhokseumawe';

    const prodi =
      profil.nama_prodi ||
      'Data tidak tersedia';

    let nidnVal =
      nidn && nidn !== 'Data tidak tersedia'
        ? nidn
        : (
            profil.nidn ||
            'Data tidak tersedia'
          );

    const jabatan =
      profil.jabatan_akademik ||
      profil.jabatan ||
      'Data tidak tersedia';

    const pendidikan =
      profil.pendidikan_tertinggi ||
      profil.pendidikan ||
      'Data tidak tersedia';

    const kepegawaian =
      profil.status_ikatan_kerja ||
      'Data tidak tersedia';

    const status =
      profil.status_aktivitas ||
      profil.status ||
      'Data tidak tersedia';

    /*
     * Jika API mengembalikan error,
     * tampilkan peringatan tetapi tetap render halaman.
     */

    if (data.error) {
      showDetailWarning(
        data.errorMessage ||
        'Data detail dosen tidak dapat dimuat dari API PDDIKTI.'
      );
    }

    document.title =
      `${nama} - Data Dosen Politeknik Negeri Lhokseumawe`;

    /* Profil utama */

    const avatar =
      document.getElementById('profile-avatar');

    if (avatar) {
      avatar.textContent = inisial;
    }

    const namaElement =
      document.getElementById('dosen-nama');

    if (namaElement) {
      namaElement.textContent = nama;
    }

    const kampusElement =
      document.getElementById('dosen-kampus');

    if (kampusElement) {
      kampusElement.textContent = pt;
    }

    const prodiElement =
      document.getElementById('dosen-prodi');

    if (prodiElement) {
      prodiElement.textContent =
        `Program Studi: ${prodi}`;
    }

    /* NIDN */

    const nidnPill =
      document.getElementById('dosen-nidn-pill');

    const nidnText =
      document.getElementById('dosen-nidn-text');

    if (
      nidnPill &&
      nidnText
    ) {

      if (
        nidnVal &&
        nidnVal !== 'Data tidak tersedia'
      ) {

        nidnPill.style.display =
          'inline-flex';

        nidnText.textContent =
          nidnVal;

      } else {

        nidnPill.style.display =
          'none';
      }
    }

    /* Grid NIDN */

    const gridNidn =
      document.getElementById('grid-nidn');

    if (gridNidn) {

      if (
        nidnVal &&
        nidnVal !== 'Data tidak tersedia'
      ) {

        gridNidn.className =
          'detail-item-value';

        gridNidn.innerHTML =
          `<span class="badge badge-nidn-large">
            ${escapeHtml(nidnVal)}
           </span>`;

      } else {

        gridNidn.className =
          'detail-item-value unavailable';

        gridNidn.textContent =
          'Data tidak tersedia';
      }
    }

    /* Jabatan */

    const gridJabatan =
      document.getElementById('grid-jabatan');

    if (gridJabatan) {

      if (
        jabatan &&
        jabatan !== 'Data tidak tersedia'
      ) {

        gridJabatan.className =
          'detail-item-value';

        gridJabatan.innerHTML =
          `<span class="badge badge-purple">
            ${escapeHtml(jabatan)}
           </span>`;

      } else {

        gridJabatan.className =
          'detail-item-value unavailable';

        gridJabatan.textContent =
          'Data tidak tersedia';
      }
    }

    /* Pendidikan */

    const gridPendidikan =
      document.getElementById('grid-pendidikan');

    if (gridPendidikan) {

      if (
        pendidikan &&
        pendidikan !== 'Data tidak tersedia'
      ) {

        gridPendidikan.className =
          'detail-item-value';

        gridPendidikan.innerHTML =
          `<span class="badge badge-pink">
            ${escapeHtml(pendidikan)}
           </span>`;

      } else {

        gridPendidikan.className =
          'detail-item-value unavailable';

        gridPendidikan.textContent =
          'Data tidak tersedia';
      }
    }

    /* Kepegawaian */

    const gridKepegawaian =
      document.getElementById('grid-kepegawaian');

    if (gridKepegawaian) {

      gridKepegawaian.className =
        'detail-item-value' +
        (
          kepegawaian === 'Data tidak tersedia'
            ? ' unavailable'
            : ''
        );

      gridKepegawaian.textContent =
        kepegawaian;
    }

    /* Status aktivitas */

    const gridAktivitas =
      document.getElementById('grid-aktivitas');

    if (gridAktivitas) {

      if (
        status &&
        status.toLowerCase() === 'aktif'
      ) {

        gridAktivitas.className =
          'detail-item-value';

        gridAktivitas.innerHTML =
          `<span class="badge badge-success">
            ${escapeHtml(status)}
           </span>`;

      } else {

        gridAktivitas.className =
          'detail-item-value' +
          (
            status === 'Data tidak tersedia'
              ? ' unavailable'
              : ''
          );

        gridAktivitas.textContent =
          status;
      }
    }

    /* Counter */

    const counterPenelitian =
      document.getElementById(
        'counter-penelitian'
      );

    if (counterPenelitian) {
      counterPenelitian.textContent =
        penelitian.length;
    }

    const counterPengabdian =
      document.getElementById(
        'counter-pengabdian'
      );

    if (counterPengabdian) {
      counterPengabdian.textContent =
        pengabdian.length;
    }

    const counterPublikasi =
      document.getElementById(
        'counter-publikasi'
      );

    if (counterPublikasi) {
      counterPublikasi.textContent =
        publikasi.length;
    }

    const counterPaten =
      document.getElementById(
        'counter-paten'
      );

    if (counterPaten) {
      counterPaten.textContent =
        paten.length;
    }

    /* Sub-counter */

    const subPenelitian =
      document.getElementById(
        'sub-counter-penelitian'
      );

    if (subPenelitian) {
      subPenelitian.textContent =
        `Total: ${penelitian.length} Penelitian`;
    }

    const subPengabdian =
      document.getElementById(
        'sub-counter-pengabdian'
      );

    if (subPengabdian) {
      subPengabdian.textContent =
        `Total: ${pengabdian.length} Pengabdian`;
    }

    const subPublikasi =
      document.getElementById(
        'sub-counter-publikasi'
      );

    if (subPublikasi) {
      subPublikasi.textContent =
        `Total: ${publikasi.length} Publikasi`;
    }

    const subPaten =
      document.getElementById(
        'sub-counter-paten'
      );

    if (subPaten) {
      subPaten.textContent =
        `Total: ${paten.length} HKI / Paten`;
    }

    /* Tabel portofolio */

    renderPortfolioTable(
      'container-penelitian',
      penelitian,
      '🔬',
      'Belum ada catatan data penelitian untuk dosen ini pada sistem PDDIKTI.'
    );

    renderPortfolioTable(
      'container-pengabdian',
      pengabdian,
      '🤝',
      'Belum ada catatan data pengabdian masyarakat untuk dosen ini pada sistem PDDIKTI.'
    );

    renderPortfolioTable(
      'container-publikasi',
      publikasi,
      '📚',
      'Belum ada catatan data publikasi karya untuk dosen ini pada sistem PDDIKTI.'
    );

    renderPortfolioTable(
      'container-paten',
      paten,
      '🛡️',
      'Belum ada catatan data HKI atau Paten untuk dosen ini pada sistem PDDIKTI.'
    );

    if (skeleton) {
      skeleton.style.display = 'none';
    }

    if (content) {
      content.style.display = 'block';
    }
  }

  /* ==========================================================================
     ERROR DETAIL
     ========================================================================== */

  function showDetailError(message) {

    if (skeleton) {
      skeleton.style.display = 'none';
    }

    if (content) {

      content.style.display = 'block';

      content.innerHTML = `
        <div class="alert alert-warning"
          style="margin:20px 0;">

          <strong>
            Data dosen tidak dapat dibuka.
          </strong>

          <p style="margin-top:8px;">
            ${escapeHtml(message)}
          </p>

          <a href="index.html"
            class="btn-detail"
            style="display:inline-flex; margin-top:12px;">
            Kembali ke Daftar Dosen
          </a>

        </div>
      `;
    }
  }

  function showDetailWarning(message) {

    const existing =
      document.getElementById(
        'detail-api-warning'
      );

    if (existing) return;

    const warning =
      document.createElement('div');

    warning.id =
      'detail-api-warning';

    warning.className =
      'alert alert-warning';

    warning.style.margin =
      '0 0 20px 0';

    warning.innerHTML = `
      <strong>
        Informasi:
      </strong>
      ${escapeHtml(message)}
    `;

    if (content) {
      content.prepend(warning);
    }
  }

  /* ==========================================================================
     TABEL PORTOFOLIO
     ========================================================================== */

  function renderPortfolioTable(
    containerId,
    list,
    emptyIcon,
    emptyText
  ) {

    const container =
      document.getElementById(containerId);

    if (!container) return;

    if (!list || list.length === 0) {

      container.innerHTML = `
        <div class="empty-state">

          <div class="empty-icon">
            ${emptyIcon}
          </div>

          <div class="empty-title">
            Data belum tersedia
          </div>

          <div class="empty-desc">
            ${escapeHtml(emptyText)}
          </div>

        </div>
      `;

      return;
    }

    let rowsHtml = '';

    list.forEach((item, index) => {

      const judul =
        item.judul_kegiatan ||
        item.judul ||
        item.title ||
        '-';

      const jenis =
        item.jenis_kegiatan ||
        item.jenis ||
        item.type ||
        '';

      const tahun =
        (
          item.tahun_kegiatan &&
          Number(item.tahun_kegiatan) > 0
        )
          ? item.tahun_kegiatan
          : (
              item.tahun ||
              item.year ||
              '-'
            );

      rowsHtml += `
        <tr>

          <td class="col-no">
            ${index + 1}
          </td>

          <td>

            <div class="table-item-title">
              ${escapeHtml(judul)}
            </div>

            ${
              jenis
                ? `
                  <span class="table-item-meta">
                    ${escapeHtml(jenis)}
                  </span>
                `
                : ''
            }

          </td>

          <td class="col-tahun">

            <span class="year-badge">
              ${escapeHtml(tahun)}
            </span>

          </td>

        </tr>
      `;
    });

    container.innerHTML = `
      <table class="modern-table">

        <thead>

          <tr>

            <th class="col-no">
              No
            </th>

            <th>
              Judul
            </th>

            <th class="col-tahun">
              Tahun
            </th>

          </tr>

        </thead>

        <tbody>
          ${rowsHtml}
        </tbody>

      </table>
    `;
  }

  /* ==========================================================================
     TAB
     ========================================================================== */

  function setupTabs() {

    const tabButtons =
      document.querySelectorAll('.tab-btn');

    const tabPanes =
      document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {

      button.addEventListener(
        'click',
        function() {

          const targetTabId =
            this.getAttribute('data-tab');

          tabButtons.forEach(btn => {

            btn.classList.remove('active');

            btn.setAttribute(
              'aria-selected',
              'false'
            );
          });

          tabPanes.forEach(pane => {
            pane.classList.remove('active');
          });

          this.classList.add('active');

          this.setAttribute(
            'aria-selected',
            'true'
          );

          const targetPane =
            document.getElementById(
              targetTabId
            );

          if (targetPane) {
            targetPane.classList.add('active');
          }
        }
      );
    });
  }
}

/* ============================================================================
   INISIALISASI
   ============================================================================ */

document.addEventListener(
  'DOMContentLoaded',
  () => {

    if (
      document.getElementById('search-form') ||
      document.getElementById('dosen-grid')
    ) {
      initIndexPage();
    }

    if (
      document.getElementById('detail-skeleton') ||
      document.getElementById('profile-avatar')
    ) {
      initDetailPage();
    }

  }
);
