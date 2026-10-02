export default async function handler(req, res) {
  // Izinkan request dari website
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    let params = {};

    if (req.method === "GET") {
      params = req.query || {};
    } else {
      params = req.body || {};
    }

    const action = String(params.action || "search").toLowerCase();

    const keyword =
      params.keyword ||
      params.nama ||
      params.q ||
      "";

    const id =
      params.id ||
      params.id_dosen ||
      params.id_sdm ||
      params.idSdm ||
      params.sdm_id ||
      params.uuid ||
      "";

    const nidn =
      params.nidn ||
      params.nidnHint ||
      "";

    const headers = {
      "Accept": "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Origin": "https://pddikti.kemdiktisaintek.go.id",
      "Referer": "https://pddikti.kemdiktisaintek.go.id/"
    };

    async function postPDDIKTI(url) {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: id
        })
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      return {
        sukses: response.ok,
        data: result.data || [],
        pesan:
          result.message ||
          (response.ok
            ? "Data berhasil diambil"
            : "Data gagal diambil")
      };
    }

    // =========================
    // PENCARIAN DOSEN
    // =========================
    if (
      action === "search" ||
      action === "cari" ||
      action === "pencarian"
    ) {
      if (!keyword.trim()) {
        return res.status(400).json({
          sukses: false,
          pesan: "Nama dosen belum diisi",
          data: []
        });
      }

      const url =
        "https://pddikti.kemdiktisaintek.go.id/api/pencarian/dosen/" +
        encodeURIComponent(keyword.trim());

      const response = await fetch(url, {
        method: "GET",
        headers: headers
      });

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      return res.status(response.ok ? 200 : response.status).json({
        sukses: response.ok,
        pesan: response.ok
          ? "Pencarian berhasil"
          : "Pencarian gagal",
        data: Array.isArray(result.data)
          ? result.data
          : []
      });
    }

    // =========================
    // CEK ID DOSEN
    // =========================
    if (!id) {
      return res.status(400).json({
        sukses: false,
        pesan: "ID dosen belum diberikan",
        data: []
      });
    }

    // =========================
    // PROFIL
    // =========================
    if (
      action === "profile" ||
      action === "profil"
    ) {
      const result = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/profile"
      );

      return res.status(200).json(result);
    }

    // =========================
    // PENELITIAN
    // =========================
    if (action === "penelitian") {
      const result = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian"
      );

      return res.status(200).json(result);
    }

    // =========================
    // PENGABDIAN
    // =========================
    if (
      action === "pengabdian" ||
      action === "pengabdian_masyarakat"
    ) {
      const result = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian"
      );

      return res.status(200).json(result);
    }

    // =========================
    // PUBLIKASI
    // =========================
    if (
      action === "publikasi" ||
      action === "karya"
    ) {
      const result = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya"
      );

      return res.status(200).json(result);
    }

    // =========================
    // HKI / PATEN
    // =========================
    if (
      action === "paten" ||
      action === "hki"
    ) {
      const result = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten"
      );

      return res.status(200).json(result);
    }

    // =========================
    // SEMUA DATA DOSEN
    // =========================
    if (
      action === "detail" ||
      action === "all" ||
      action === "semua"
    ) {
      const hasil = {};

      hasil.profil = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/profile"
      );

      hasil.penelitian = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian"
      );

      hasil.pengabdian = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian"
      );

      hasil.publikasi = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya"
      );

      hasil.paten = await postPDDIKTI(
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten"
      );

      if (
        nidn &&
        hasil.profil &&
        hasil.profil.data &&
        typeof hasil.profil.data === "object"
      ) {
        hasil.profil.data.nidn = nidn;
      }

      return res.status(200).json({
        sukses: true,
        pesan: "Data dosen berhasil diambil",
        data: hasil
      });
    }

    return res.status(400).json({
      sukses: false,
      pesan: "Action API tidak dikenali: " + action,
      data: []
    });

  } catch (error) {
    console.error("API PDDIKTI ERROR:", error);

    return res.status(500).json({
      sukses: false,
      pesan:
        "Terjadi kesalahan pada API PDDIKTI: " +
        error.message,
      data: []
    });
  }
}
