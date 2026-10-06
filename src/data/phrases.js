// Semua kalimat guide di satu tempat agar mudah diganti / diterjemahkan.
export const PRAISE = ['Hebat!', 'Bagus sekali!', 'Pintar!', 'Luar biasa!', 'Kamu hebat!'];
export const GENTLE = ['Belum tepat. Ayo coba lagi.', 'Kamu hampir benar!', 'Perhatikan hurufnya.', 'Belum tepat. Coba perhatikan lagi.'];

export const GUIDE = {
  splash: 'Halo, Penjelajah!',
  welcome: 'Halo! Selamat datang di Hurufku 3D. Ayo belajar huruf Hijaiyah bersama!',
  map: 'Pilih dunia yang mau kamu jelajahi!',
  locked: 'Dunia ini masih terkunci. Selesaikan dunia sebelumnya dulu ya!',
  learn: 'Sentuh kartu huruf untuk mendengar namanya.',
  rewards: 'Ini hadiah-hadiahmu!',
  intro: (l) => `Ini adalah huruf ${l.spoken}.`,
  kenali: () => 'Ini huruf apa?',
  tangkap: (l) => `Cari huruf ${l.spoken}!`,
  dengar: (l) => `Dengarkan. ${l.spoken}.`,
  lompat: (l) => `Lompat ke huruf ${l.spoken}!`,
  pasangkan: () => 'Pasangkan huruf dengan namanya!',
  levelDone: 'Level selesai! Hebat!',
  gameDone: 'Selamat! Kamu sudah mengenal semua huruf Hijaiyah!',
};
