
export default async function handler(req, res) {
    try {
        const method = req.method;

        let body = {};

        if (method === "POST") {
            body = req.body || {};
        } else {
            body = req.query || {};
        }

        const action = body.action || "search";
        const keyword = body.keyword || body.nama || "";

        // =========================
        // CARI DOSEN
        // =========================
        if (action === "search") {
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
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "User-Agent": "Mozilla/5.0"
                }
            });

            const result = await response.json();

            return res.status(response.status).json({
                sukses: response.ok,
                pesan: response.ok
                    ? "Pencarian berhasil"
                    : "Pencarian gagal",
                data: result.data || []
            });
        }

        // =========================
        // DETAIL DOSEN
        // =========================
        const id = body.id;

        if (!id) {
            return res.status(400).json({
                sukses: false,
                pesan: "ID dosen belum diberikan",
                data: []
            });
        }

        const endpoints = {
            profil:
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

        const headers = {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "Mozilla/5.0",
            "Origin": "https://pddikti.kemdiktisaintek.go.id",
            "Referer": "https://pddikti.kemdiktisaintek.go.id/"
        };

        const hasil = {};

        for (const [nama, url] of Object.entries(endpoints)) {
            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        id: id
                    })
                });

                const result = await response.json();

                hasil[nama] = {
                    sukses: response.ok,
                    pesan: response.ok
                        ? "Data berhasil diambil"
                        : "Data gagal diambil",
                    data: result.data || []
                };
            } catch (error) {
                hasil[nama] = {
                    sukses: false,
                    pesan: error.message,
                    data: []
                };
            }
        }

        return res.status(200).json({
            sukses: true,
            pesan: "Data dosen berhasil diambil",
            data: hasil
        });

    } catch (error) {
        return res.status(500).json({
            sukses: false,
            pesan: error.message,
            data: []
        });
    }
}
