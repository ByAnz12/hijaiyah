// ====== KONFIGURASI AUDIO (mudah diganti) ======
// MUSIC_URL: isi dengan file lokal di folder public/, mis. '/audio/music.mp3'.
// null = pakai musik anak-anak sintetis bawaan (dibuat dengan Web Audio, tanpa file & tanpa internet).
export const MUSIC_URL = null;

// VOICE_FILES: rekaman suara pengganti Web Speech API.
// Kunci 'letter:<id>' untuk pengucapan huruf (lihat src/data/letters.js), atau teks kalimat persis.
// Contoh: { 'letter:alif': '/audio/voice/alif.mp3', 'Hebat!': '/audio/voice/hebat.mp3' }
export const VOICE_FILES = {};

export const VOICE_LANG = 'id-ID';
export const DEFAULTS = { musicVolume: 0.35, sfxVolume: 0.8 };
