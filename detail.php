<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Dosen - PNL</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f5f3fa;
            color: #222;
        }

        .header {
            background: linear-gradient(135deg, #5b21b6, #7c3aed);
            color: white;
            padding: 25px 20px;
        }

        .header-content {
            max-width: 1100px;
            margin: auto;
        }

        .back {
            display: inline-block;
            color: white;
            text-decoration: none;
            margin-bottom: 18px;
            font-size: 14px;
        }

        .back:hover {
            text-decoration: underline;
        }

        .header h1 {
            font-size: 28px;
            margin-bottom: 8px;
        }

        .header p {
            opacity: 0.9;
        }

        .container {
            max-width: 1100px;
            margin: 30px auto;
            padding: 0 20px;
        }

        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 22px;
            box-shadow: 0 5px 18px rgba(0,0,0,0.07);
        }

        .card h2 {
            color: #5b21b6;
            margin-bottom: 20px;
            font-size: 21px;
            border-bottom: 2px solid #ede9fe;
            padding-bottom: 10px;
        }

        .profile-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .profile-item {
            background: #f8f7fc;
            border-radius: 10px;
            padding: 15px;
        }

        .profile-label {
            color: #777;
            font-size: 13px;
            margin-bottom: 6px;
        }

        .profile-value {
            font-weight: 600;
            color: #222;
        }

        .item {
            padding: 16px 0;
            border-bottom: 1px solid #eee;
        }

        .item:last-child {
            border-bottom: none;
        }

        .item-title {
            font-weight: 600;
            line-height: 1.5;
            color: #222;
        }

        .item-year {
            display: inline-block;
            margin-top: 8px;
            background: #ede9fe;
            color: #5b21b6;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }

        .item-source {
            margin-top: 8px;
            font-size: 12px;
            color: #777;
        }

        .empty {
            text-align: center;
            padding: 25px;
            color: #888;
            background: #fafafa;
            border-radius: 10px;
        }

        .loading {
            text-align: center;
            padding: 50px;
            color: #666;
        }

        .error {
            background: #fee2e2;
            color: #991b1b;
            padding: 20px;
            border-radius: 10px;
        }

        .badge {
            display: inline-block;
            background: #5b21b6;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            margin-left: 5px;
        }

        @media (max-width: 700px) {
            .profile-grid {
                grid-template-columns: 1fr;
            }

            .header h1 {
                font-size: 22px;
            }

            .container {
                padding: 0 12px;
            }

            .card {
                padding: 18px;
            }
        }
    </style>
</head>

<body>

    <div class="header">
        <div class="header-content">

            <a href="index.html" class="back">
                ← Kembali ke Data Dosen
            </a>

            <h1>Detail Dosen</h1>

            <p>
                Politeknik Negeri Lhokseumawe
            </p>

        </div>
    </div>


    <main class="container">

        <div id="loading" class="loading">
            Memuat data dosen...
        </div>


        <div id="content" style="display:none;">

            <!-- PROFIL -->
            <section class="card">

                <h2>Profil Dosen</h2>

                <div class="profile-grid">

                    <div class="profile-item">
                        <div class="profile-label">Nama</div>
                        <div class="profile-value" id="nama">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">NIDN</div>
                        <div class="profile-value" id="nidn">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Perguruan Tinggi</div>
                        <div class="profile-value" id="perguruan">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Program Studi</div>
                        <div class="profile-value" id="prodi">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Jabatan Fungsional</div>
                        <div class="profile-value" id="jabatan">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Pendidikan</div>
                        <div class="profile-value" id="pendidikan">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Status Kepegawaian</div>
                        <div class="profile-value" id="statusPegawai">-</div>
                    </div>

                    <div class="profile-item">
                        <div class="profile-label">Status Aktivitas</div>
                        <div class="profile-value" id="statusAktif">-</div>
                    </div>

                </div>

            </section>


            <!-- PENELITIAN -->
            <section class="card">

                <h2>Penelitian</h2>

                <div id="penelitian">
                    <div class="empty">
                        Belum ada data penelitian.
                    </div>
                </div>

            </section>


            <!-- PENGABDIAN -->
            <section class="card">

                <h2>Pengabdian Masyarakat</h2>

                <div id="pengabdian">
                    <div class="empty">
                        Belum ada data pengabdian masyarakat.
                    </div>
                </div>

            </section>


            <!-- PUBLIKASI -->
            <section class="card">

                <h2>
                    Publikasi Karya
                    <span class="badge" id="jumlahPublikasi">0</span>
                </h2>

                <div id="publikasi">
                    <div class="empty">
                        Belum ada data publikasi.
                    </div>
                </div>

            </section>


            <!-- PATEN -->
            <section class="card">

                <h2>HKI / Paten</h2>

                <div id="paten">
                    <div class="empty">
                        Belum ada data HKI / Paten.
                    </div>
                </div>

            </section>

        </div>


        <div id="error" class="error" style="display:none;"></div>

    </main>


<script>

    const params =
        new URLSearchParams(window.location.search);


    const idDosen =
        params.get("id");


    const nidnDosen =
        params.get("nidn");


    /* NORMALISASI */
    function normalisasi(value) {

        return String(value || "")
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

    }


    /* ESCAPE HTML */
    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text ?? "-";

        return div.innerHTML;

    }


    /* TAMPILKAN PORTOFOLIO */
    function tampilkanItem(
        containerId,
        data,
        kosongText,
        sourceText = ""
    ) {

        const container =
            document.getElementById(containerId);


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            container.innerHTML = `
                <div class="empty">
                    ${escapeHTML(kosongText)}
                </div>
            `;

            return;

        }


        container.innerHTML =
            data.map((item, index) => {

                const judul =
                    item.judul ||
                    item.title ||
                    item.nama ||
                    item.name ||
                    "Judul tidak tersedia";


                const tahun =
                    item.tahun ||
                    item.year ||
                    "";


                const url =
                    item.url && typeof item.url === "string" && item.url.startsWith("http")
                    ? item.url.trim()
                    : "";


                let sumberText = "Sumber belum diverifikasi";
                if (item.sumber && String(item.sumber).trim()) {
                    sumberText = String(item.sumber).trim();
                } else if (url && url.includes("garuda.kemdiktisaintek.go.id")) {
                    sumberText = "GARUDA";
                } else if (url && url.includes("pddikti.kemdiktisaintek.go.id")) {
                    sumberText = "PDDIKTI";
                }


                return `

                    <div class="item">

                        <div class="item-title">

                            ${index + 1}.
                            ${escapeHTML(judul)}

                        </div>


                        ${
                            tahun
                            ? `
                                <div class="item-year">
                                    Tahun: ${escapeHTML(tahun)}
                                </div>
                              `
                            : `
                                <div class="item-year" style="background:#f1f5f9; color:#64748b;">
                                    Tahun: Belum tersedia
                                </div>
                              `
                        }


                        <div class="item-source" style="margin-top: 6px;">
                            Sumber: ${escapeHTML(sumberText)}
                        </div>

                        ${
                            url
                            ? `
                                <div style="margin-top: 6px;">
                                    <a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer" style="color: #5b21b6; font-size: 13px; font-weight: bold; text-decoration: underline;">
                                        Lihat publikasi / tautan sumber ↗
                                    </a>
                                </div>
                              `
                            : ""
                        }

                    </div>

                `;

            }).join("");

    }


    /* CARI DATA DOSEN */
    async function cariDosen() {

        const response =
            await fetch("data.json");


        if (!response.ok) {

            throw new Error(
                "File data.json tidak dapat dibaca."
            );

        }


        const json =
            await response.json();


        let daftarDosen =
            Array.isArray(json)
            ? json
            : (
                json.data ||
                json.dosen ||
                json.lecturers ||
                json.items ||
                []
            );


        let dosen = null;


        /*
         * PENTING:
         * Cari berdasarkan NIDN terlebih dahulu.
         * Karena NIDN adalah identitas dosen
         * yang dikirim oleh index.html.
         */

        if (nidnDosen) {

            dosen =
                daftarDosen.find(item =>

                    normalisasi(item.nidn) ===
                    normalisasi(nidnDosen)

                );

        }


        /*
         * Jika NIDN tidak ditemukan,
         * baru coba ID.
         */

        if (!dosen && idDosen) {

            dosen =
                daftarDosen.find(item =>

                    normalisasi(item.id) ===
                    normalisasi(idDosen)

                );

        }


        if (!dosen) {

            throw new Error(
                "Data dosen tidak ditemukan untuk NIDN: " +
                (nidnDosen || "-")
            );

        }


        return dosen;

    }


    /* DATA GARUDA */
    async function cariDataGaruda(dosen) {

        try {

            const response =
                await fetch("data_garuda.json");


            if (!response.ok) {

                return null;

            }


            const json =
                await response.json();


            const daftar =
                Array.isArray(json)
                ? json
                : (
                    json.data ||
                    json.dosen ||
                    json.lecturers ||
                    json.items ||
                    []
                );


            /*
             * Cari berdasarkan NIDN.
             */

            let hasil =
                daftar.find(item =>

                    normalisasi(item.nidn) ===
                    normalisasi(dosen.nidn)

                );


            /*
             * Jika tidak ada,
             * cari berdasarkan ID.
             */

            if (!hasil && dosen.id) {

                hasil =
                    daftar.find(item =>

                        normalisasi(item.id) ===
                        normalisasi(dosen.id)

                    );

            }


            return hasil || null;

        } catch (error) {

            console.log(
                "Data Garuda tidak tersedia."
            );

            return null;

        }

    }


    /* GABUNG DATA */
    function gabungkanData(
        dosen,
        garuda
    ) {

        const hasil = {
            ...dosen
        };


        if (!garuda) {

            return hasil;

        }


        if (
            Array.isArray(garuda.penelitian) &&
            garuda.penelitian.length > 0
        ) {

            hasil.penelitian =
                garuda.penelitian;

        }


        if (
            Array.isArray(garuda.pengabdian) &&
            garuda.pengabdian.length > 0
        ) {

            hasil.pengabdian =
                garuda.pengabdian;

        }


        if (
            Array.isArray(garuda.publikasi) &&
            garuda.publikasi.length > 0
        ) {

            hasil.publikasi =
                garuda.publikasi;

        }


        if (
            Array.isArray(garuda.paten) &&
            garuda.paten.length > 0
        ) {

            hasil.paten =
                garuda.paten;

        }


        return hasil;

    }


    /* TAMPILKAN */
    async function tampilkanDosen() {

        try {

            const dosen =
                await cariDosen();


            const garuda =
                await cariDataGaruda(dosen);


            const data =
                gabungkanData(
                    dosen,
                    garuda
                );


            /* PROFIL */

            document.getElementById("nama")
                .textContent =
                data.nama || "-";


            document.getElementById("nidn")
                .textContent =
                data.nidn || "-";


            document.getElementById("perguruan")
                .textContent =
                data.perguruan_tinggi || "-";


            document.getElementById("prodi")
                .textContent =
                data.prodi || "-";


            document.getElementById("jabatan")
                .textContent =
                data.jabatan_fungsional || "-";


            document.getElementById("pendidikan")
                .textContent =
                data.pendidikan_terakhir || "-";


            document.getElementById("statusPegawai")
                .textContent =
                data.status_kepegawaian || "-";


            document.getElementById("statusAktif")
                .textContent =
                data.status_aktivitas || "-";


            /* PENELITIAN */

            tampilkanItem(
                "penelitian",
                data.penelitian,
                "Belum ada data penelitian."
            );


            /* PENGABDIAN */

            tampilkanItem(
                "pengabdian",
                data.pengabdian,
                "Belum ada data pengabdian masyarakat."
            );


            /* PUBLIKASI */

            const jumlah =
                Array.isArray(data.publikasi)
                ? data.publikasi.length
                : 0;


            document.getElementById(
                "jumlahPublikasi"
            ).textContent =
                jumlah;


            tampilkanItem(
                "publikasi",
                data.publikasi,
                "Belum ada data publikasi."
            );


            /* PATEN */

            tampilkanItem(
                "paten",
                data.paten,
                "Belum ada data HKI / Paten."
            );


            /* TAMPILKAN */

            document.getElementById(
                "loading"
            ).style.display =
                "none";


            document.getElementById(
                "content"
            ).style.display =
                "block";


            document.title =
                `${data.nama || "Dosen"} - PNL`;

        } catch (error) {

            console.error(error);


            document.getElementById(
                "loading"
            ).style.display =
                "none";


            const errorBox =
                document.getElementById("error");


            errorBox.style.display =
                "block";


            errorBox.textContent =
                "Gagal memuat data: " +
                error.message;

        }

    }


    tampilkanDosen();

</script>

</body>
</html>