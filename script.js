function normalizeDosen(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const nidn =
    item.nidn
      ? String(item.nidn).trim()
      : (item.nuptk ? String(item.nuptk).trim() : '');

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
      item.perguruan_tinggi ||
      item.nama_pt ||
      'Politeknik Negeri Lhokseumawe',

    nama_prodi:
      item.prodi ||
      item.nama_prodi ||
      'Data tidak tersedia',

    jabatan:
      item.jabatan_fungsional ||
      item.jabatan_akademik ||
      item.jabatan ||
      'Data tidak tersedia',

    pendidikan:
      item.pendidikan_terakhir ||
      item.pendidikan_tertinggi ||
      item.pendidikan ||
      'Data tidak tersedia',

    status_kepegawaian:
      item.status_kepegawaian ||
      'Data tidak tersedia',

    status:
      item.status_aktivitas ||
      item.status ||
      'Data tidak tersedia',

    gelar: getGelar(item)
  };
}
