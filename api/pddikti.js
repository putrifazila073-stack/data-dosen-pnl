import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      sukses: false,
      pesan: "Metode request tidak diizinkan",
      data: []
    });
  }

  try {
    let params = {};

    if (req.method === "GET") {
      params = req.query || {};
    } else {
      params = req.body || {};
    }

    if (typeof params === "string") {
      try {
        params = JSON.parse(params);
      } catch {
        params = {};
      }
    }

    const action = String(
      params.action || "search"
    ).toLowerCase();

    const keyword = String(
      params.keyword ||
      params.nama ||
      params.q ||
      ""
    ).trim();

    const id = String(
      params.id ||
      params.id_dosen ||
      params.id_sdm ||
      ""
    ).trim();

    const nidn = String(
      params.nidn || ""
    ).trim();

    // ==============================
    // MEMBACA DATA JSON
    // ==============================

    const filePath = path.join(
      process.cwd(),
      "data.json"
    );

    const fileData = fs.readFileSync(
      filePath,
      "utf8"
    );

    const database = JSON.parse(fileData);

    const daftarDosen = Array.isArray(database.dosen)
      ? database.dosen
      : [];

    // ==============================
    // PENCARIAN DOSEN
    // ==============================

    if (
      action === "search" ||
      action === "cari" ||
      action === "pencarian"
    ) {
      if (!keyword) {
        return res.status(400).json({
          sukses: false,
          pesan: "Nama dosen belum diisi",
          data: []
        });
      }

      const kataKunci = keyword.toLowerCase();

      const hasil = daftarDosen.filter((dosen) => {
        return (
          String(dosen.nama || "")
            .toLowerCase()
            .includes(kataKunci) ||

          String(dosen.nidn || "")
            .toLowerCase()
            .includes(kataKunci) ||

          String(dosen.prodi || "")
            .toLowerCase()
            .includes(kataKunci) ||

          String(dosen.perguruan_tinggi || "")
            .toLowerCase()
            .includes(kataKunci)
        );
      });

      return res.status(200).json({
        sukses: true,
        pesan: "Pencarian berhasil",

        data: hasil.map((dosen) => ({
          id: dosen.id,
          id_dosen: dosen.id,

          nama: dosen.nama,
          nidn: dosen.nidn,

          perguruan_tinggi:
            dosen.perguruan_tinggi,

          prodi:
            dosen.prodi,

          jabatan_fungsional:
            dosen.jabatan_fungsional,

          pendidikan_terakhir:
            dosen.pendidikan_terakhir,

          status_kepegawaian:
            dosen.status_kepegawaian,

          status_aktivitas:
            dosen.status_aktivitas
        }))
      });
    }

    // ==============================
    // MENCARI DOSEN BERDASARKAN ID
    // ==============================

    let dosen = null;

    if (id) {
      dosen = daftarDosen.find(
        (item) =>
          String(item.id) === id
      );
    }

    if (!dosen && nidn) {
      dosen = daftarDosen.find(
        (item) =>
          String(item.nidn || "") === nidn
      );
    }

    if (!dosen) {
      return res.status(404).json({
        sukses: false,
        pesan: "Data dosen tidak ditemukan",
        data: []
      });
    }

    // ==============================
    // DATA PROFIL DOSEN
    // ==============================

    const profilDosen = {
      id: dosen.id,

      nama:
        dosen.nama || "Data tidak tersedia",

      nidn:
        dosen.nidn || "Data tidak tersedia",

      perguruan_tinggi:
        dosen.perguruan_tinggi ||
        "Data tidak tersedia",

      prodi:
        dosen.prodi ||
        "Data tidak tersedia",

      jabatan_fungsional:
        dosen.jabatan_fungsional ||
        "Data tidak tersedia",

      pendidikan_terakhir:
        dosen.pendidikan_terakhir ||
        "Data tidak tersedia",

      status_kepegawaian:
        dosen.status_kepegawaian ||
        "Data tidak tersedia",

      status_aktivitas:
        dosen.status_aktivitas ||
        "Data tidak tersedia"
    };

    // ==============================
    // PROFIL
    // ==============================

    if (
      action === "profile" ||
      action === "profil"
    ) {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Profil dosen berhasil diambil",

        data: profilDosen
      });
    }

    // ==============================
    // PENELITIAN
    // ==============================

    if (action === "penelitian") {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Data penelitian berhasil diambil",

        data:
          Array.isArray(dosen.penelitian)
            ? dosen.penelitian
            : []
      });
    }

    // ==============================
    // PENGABDIAN MASYARAKAT
    // ==============================

    if (
      action === "pengabdian" ||
      action === "pengabdian_masyarakat"
    ) {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Data pengabdian masyarakat berhasil diambil",

        data:
          Array.isArray(dosen.pengabdian)
            ? dosen.pengabdian
            : []
      });
    }

    // ==============================
    // PUBLIKASI KARYA
    // ==============================

    if (
      action === "publikasi" ||
      action === "karya"
    ) {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Data publikasi karya berhasil diambil",

        data:
          Array.isArray(dosen.publikasi)
            ? dosen.publikasi
            : []
      });
    }

    // ==============================
    // HKI / PATEN
    // ==============================

    if (
      action === "paten" ||
      action === "hki"
    ) {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Data HKI/Paten berhasil diambil",

        data:
          Array.isArray(dosen.paten)
            ? dosen.paten
            : []
      });
    }

    // ==============================
    // SEMUA DATA DOSEN
    // ==============================

    if (
      action === "detail" ||
      action === "all" ||
      action === "semua"
    ) {
      return res.status(200).json({
        sukses: true,
        pesan:
          "Data dosen berhasil diambil",

        data: {
          profil: profilDosen,

          penelitian:
            Array.isArray(dosen.penelitian)
              ? dosen.penelitian
              : [],

          pengabdian:
            Array.isArray(dosen.pengabdian)
              ? dosen.pengabdian
              : [],

          publikasi:
            Array.isArray(dosen.publikasi)
              ? dosen.publikasi
              : [],

          paten:
            Array.isArray(dosen.paten)
              ? dosen.paten
              : []
        }
      });
    }

    // ==============================
    // ACTION TIDAK DIKENALI
    // ==============================

    return res.status(400).json({
      sukses: false,

      pesan:
        "Action API tidak dikenali: " +
        action,

      data: []
    });

  } catch (error) {
    console.error(
      "API DATA DOSEN ERROR:",
      error
    );

    return res.status(500).json({
      sukses: false,

      pesan:
        error.message ||
        "Terjadi kesalahan pada API data dosen",

      data: []
    });
  }
}
