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
    let params = req.method === "GET" ? req.query : req.body;

    if (typeof params === "string") {
      try {
        params = JSON.parse(params);
      } catch {
        params = {};
      }
    }

    params = params || {};

    const action = String(params.action || "search").toLowerCase();

    const keyword = String(
      params.keyword || params.nama || params.q || ""
    ).trim();

    const id = String(
      params.id ||
      params.id_dosen ||
      params.id_sdm ||
      params.idSdm ||
      params.sdm_id ||
      params.uuid ||
      ""
    ).trim();

    const nidn = String(
      params.nidn || params.nidnHint || ""
    ).trim();

    const headers = {
      "Accept": "application/json, text/plain, */*",
      "User-Agent": "Mozilla/5.0",
      "Origin": "https://pddikti.kemdiktisaintek.go.id",
      "Referer": "https://pddikti.kemdiktisaintek.go.id/"
    };

    async function ambilData(url, dosenId = "") {
      const options = {
        method: dosenId ? "POST" : "GET",
        headers: { ...headers }
      };

      if (dosenId) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({
          id: dosenId
        });
      }

      const response = await fetch(url, options);
      const teks = await response.text();

      let hasil;

      try {
        hasil = JSON.parse(teks);
      } catch {
        throw new Error(
          `PDDIKTI mengembalikan respons bukan JSON (HTTP ${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          hasil.message ||
          `Permintaan PDDIKTI gagal (HTTP ${response.status})`
        );
      }

      return {
        sukses: true,
        pesan: hasil.message || "Data berhasil diambil",
        data: hasil.data !== undefined
          ? hasil.data
          : hasil
      };
    }

    const endpoint = {
      profile:
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/profile",

      penelitian:
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/penelitian",

      pengabdian:
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/pengabdian",

      publikasi:
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/karya",

      paten:
        "https://pddikti.kemdiktisaintek.go.id/api/dosen/portofolio/paten"
    };

    // PENCARIAN DOSEN
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

      const url =
        "https://pddikti.kemdiktisaintek.go.id/api/pencarian/dosen/" +
        encodeURIComponent(keyword);

      const hasil = await ambilData(url);

      return res.status(200).json({
        sukses: true,
        pesan: "Pencarian berhasil",
        data: Array.isArray(hasil.data)
          ? hasil.data
          : []
      });
    }

    // AKSI SELAIN PENCARIAN MEMERLUKAN ID
    if (!id) {
      return res.status(400).json({
        sukses: false,
        pesan: "ID dosen belum diberikan",
        data: []
      });
    }

    const alias = {
      profil: "profile",
      pengabdian_masyarakat: "pengabdian",
      karya: "publikasi",
      hki: "paten"
    };

    const jenis = alias[action] || action;

    // PROFIL
    if (jenis === "profile") {
      const hasil = await ambilData(
        endpoint.profile,
        id
      );

      if (
        nidn &&
        hasil.data &&
        typeof hasil.data === "object" &&
        !Array.isArray(hasil.data)
      ) {
        hasil.data.nidn = nidn;
      }

      return res.status(200).json(hasil);
    }

    // PENELITIAN / PENGABDIAN / PUBLIKASI / PATEN
    if (endpoint[jenis]) {
      const hasil = await ambilData(
        endpoint[jenis],
        id
      );

      return res.status(200).json(hasil);
    }

    // SEMUA DATA DOSEN
    if (
      action === "detail" ||
      action === "all" ||
      action === "semua"
    ) {
      const [
        profil,
        penelitian,
        pengabdian,
        publikasi,
        paten
      ] = await Promise.all([
        ambilData(endpoint.profile, id),
        ambilData(endpoint.penelitian, id),
        ambilData(endpoint.pengabdian, id),
        ambilData(endpoint.publikasi, id),
        ambilData(endpoint.paten, id)
      ]);

      return res.status(200).json({
        sukses: true,
        pesan: "Data dosen berhasil diambil",
        data: {
          profil,
          penelitian,
          pengabdian,
          publikasi,
          paten
        }
      });
    }

    return res.status(400).json({
      sukses: false,
      pesan: "Action API tidak dikenali: " + action,
      data: []
    });

  } catch (error) {
    console.error("API PDDIKTI ERROR:", error);

    return res.status(502).json({
      sukses: false,
      pesan:
        error.message ||
        "Terjadi kesalahan saat mengambil data PDDIKTI",
      data: []
    });
  }
}
