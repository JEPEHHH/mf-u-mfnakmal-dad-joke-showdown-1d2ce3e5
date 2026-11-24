# Rencana Kerja — Dad Joke Showdown

## Ringkasan Tugas
- **Kompetisi**: `u-mfnakmal-dad-joke-showdown-1d2ce3e5` (`program/v1`, runtime `node22`/`python3.13`, tanpa jaringan).
- **Output wajib**: `/output/entry.txt` berupa 1 dad joke UTF-8 (1–200 karakter, bukan whitespace saja).
- **Kriteria Judge (berurutan)**: (1) layak diceritakan ayah di meja makan, (2) pun langsung paham tanpa penjelasan, (3) segar dalam tradisi dad joke, (4) padat dengan punchline di akhir, (5) natural diucapkan keras.
- **Tie-break**: skor playoff > ukuran byte lebih kecil > waktu submit lebih awal.

## Rencana Kerja per Milestone
1. **M1 — Inisialisasi Struktur & Lisensi**
   - Tambah berkas `LICENSE` (MIT, OSI-approved) dan kerangka awal `main.ts` + `joke.ts`.
   - Commit milestone M1.
2. **M2 — Penyusunan & Seleksi Kandidat Dad Joke**
   - Rancang beberapa kandidat dad joke orisinal (ringkas agar unggul di tie-break byte, <= 200 karakter).
   - Evaluasi dan bandingkan berpasangan (pairwise) sesuai 5 kriteria judge untuk memilih 1 joke terkuat.
3. **M3 — Implementasi & Revisi Entrypoint**
   - Implementasikan penulisan `/output/entry.txt` secara deterministik di `main.ts` menggunakan `joke.ts`.
   - Lakukan revisi terukur pada `joke.ts`/`main.ts` (minimal 2 kali penulisan/edit untuk syarat `thinking_revised`).
   - Commit milestone M2–M3.
4. **M4 — Pengujian & Validasi Lokal**
   - Jalankan `scripts/verify.ts` untuk memastikan file terbit di lokasi output, valid UTF-8, panjang 1–200 karakter, bebas trailing noise, dan identik pada 2x eksekusi.
   - Pastikan kepatuhan batas sandbox (1 CPU, 512 MB RAM, <= 60 detik, tanpa akses jaringan/eksternal).
   - Commit milestone M4.
5. **M5 — Kesiapan Submit**
   - Lengkapi `README.md` (termasuk format badge jika submit via GitHub) dan pastikan seluruh kode ditulis via file tool.
   - Jalankan pre-submit check (`makefun.mjs check`) bila bundle transkrip siap, lalu commit final.

## Daftar Berkas yang Akan Dibuat
- `LICENSE` — Lisensi MIT (OSI-approved) sesuai syarat wajib kompetisi.
- `main.ts` — Entrypoint utama (`node22`) yang membuat direktori output dan menulis `/output/entry.txt`.
- `joke.ts` — Modul penyimpan dad joke final dan helper validasi (UTF-8, 1–200 karakter, non-whitespace).
- `scripts/verify.ts` — Skrip verifikasi lokal (uji 2x run, cek panjang karakter, ukuran byte, dan integritas output).
- `README.md` — Ringkasan singkat entry dan instruksi verifikasi (plus badge make.fun jika via GitHub).
