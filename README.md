# HURUFKU 3D — Petualangan Belajar Huruf Hijaiyah

Game edukasi 3D untuk anak 4–9 tahun. Berjalan sepenuhnya di browser: tanpa login, backend, database, maupun API key.

## Menjalankan

```bash
npm install
npm run dev        # buka alamat yang muncul (mis. http://localhost:5173), bisa juga dari HP di jaringan yang sama
```

Build produksi (hasil statis di `dist/`, bisa di-hosting di mana saja, mis. Netlify / GitHub Pages / Vercel):

```bash
npm run build
npm run preview
```

Cek data & logika game: `npm test`

## Isi game

- **Menu utama** 3D: Mulai Petualangan, Belajar Huruf, Hadiahku, Pengaturan.
- **Peta dunia 3D** dengan 6 dunia: Taman Alif, Hutan Jim, Lembah Raa, Pegunungan, Desa Huruf, Pulau Hijaiyah. Dunia berikutnya terbuka setelah dunia sebelumnya selesai.
- **29 huruf Hijaiyah** (termasuk Hamzah ء di Pulau Hijaiyah), masing-masing dengan bentuk 3D, nama, transliterasi, dan suara.
- **Setiap huruf = 1 checkpoint**: kenalan huruf, lalu satu mini game. Setiap dunia ditutup dengan mini game Pasangkan.
- **5 mini game**: Kenali Huruf, Tangkap Huruf (huruf bergerak), Pasangkan (drag & drop atau ketuk-ketuk), Dengarkan & Pilih, Lompat ke Huruf.
- **Mode Belajar**: 29 kartu huruf; huruf terpilih tampil besar & berputar di panggung 3D dan diucapkan.
- **Progress & hadiah**: bintang (1–3 per dunia), koin, 5 badge, tersimpan di localStorage. "Mulai Lagi" di Pengaturan (dengan konfirmasi).
- **Audio**: musik latar, efek suara, dan suara guide (Web Speech API, Bahasa Indonesia), masing-masing bisa dimatikan.

## Struktur kode

```
src/
  audio/       AudioManager (playMusic, stopMusic, playSfx, speak, setMusicVolume, setSfxVolume, setVoiceEnabled), synth, config
  components/  GameButton, HUD, TopBar, ProgressBar, VoiceGuide, AudioController, SettingsPanel, RewardPopup, LevelCard, ...
  data/        letters.js (29 huruf), levels.js (6 dunia), badges.js, phrases.js, hijaiyahFont.json (glyph 3D)
  game/        store.js (state zustand + localStorage), engine.js (logika ronde, murni & teruji)
  hooks/       useLayout (posisi 3D portrait/landscape)
  levels/      scene 3D tiap mini game + LevelScene
  scenes/      Stage (Canvas), Character, Guide3D, HijaiyahLetter, Environment, WorldMap, Confetti, ...
  screens/     layar UI: Splash, Home, Map, Level, MatchBoard, LevelComplete, GameComplete, Learn, Rewards
  styles/      global.css
  utils/       storage aman, deteksi WebGL, random
scripts/       build-font.mjs (membuat glyph 3D), test.mjs
```

Menambah huruf atau dunia cukup dengan mengubah `src/data/letters.js` dan `src/data/levels.js`; semua mini game membaca dari data tersebut.

## Mengganti audio

Lihat `src/audio/config.js`:

- `MUSIC_URL` — isi dengan file lokal, mis. `'/audio/music.mp3'` (taruh file di `public/audio/`). Default `null` memakai musik sintetis bawaan.
- `VOICE_FILES` — rekaman suara pengganti TTS, mis. `{ 'letter:alif': '/audio/voice/alif.mp3' }`. Huruf tanpa rekaman tetap memakai Web Speech API.

Kualitas suara guide bergantung pada suara Bahasa Indonesia yang terpasang di perangkat. Untuk pengucapan huruf yang lebih tepat (makhraj), disarankan merekam suara asli lalu mendaftarkannya di `VOICE_FILES`.

## Ketahanan

- Audio diblokir browser → tombol "🔊 Nyalakan Suara"; game tetap jalan.
- Web Speech API tidak ada → teks guide tetap tampil.
- localStorage gagal (mode privat) → game tetap jalan, progress hanya tidak tersimpan.
- WebGL tidak didukung → otomatis memakai tampilan tombol/kartu, semua mini game tetap bisa dimainkan.

## Lisensi aset

Font: Baloo Bhaijaan 2 (SIL Open Font License 1.1) via @fontsource. Semua model 3D, musik, dan efek suara dibuat dari kode.

## Deploy ke Coolify

Project ini sudah punya `Dockerfile` (build dengan Node, disajikan nginx di port 80).

1. Upload folder project ke repository GitHub/GitLab (tanpa `node_modules` dan `dist`).
2. Di Coolify: **+ New → Resource → Public/Private Repository**, pilih repo-nya.
3. **Build Pack: Dockerfile**, **Ports Exposes: 80**.
4. Isi **Domains** (mis. `https://hurufku.domainanda.com`), lalu **Deploy**.

Alternatif tanpa Docker: Build Pack **Nixpacks**, centang **Is it a static site?**, Publish Directory `/dist`.
