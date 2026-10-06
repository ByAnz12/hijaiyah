// check(p) menerima progress tersimpan dan mengembalikan true jika badge didapat.
export const BADGES = [
  { id: 'penjelajah-alif', icon: '🌳', name: 'Penjelajah Alif', desc: 'Selesaikan Taman Alif', check: (p) => p.completedLevels.includes(1) },
  { id: 'jago-huruf', icon: '🧠', name: 'Jago Huruf', desc: 'Pelajari 10 huruf', check: (p) => p.completedLetters.length >= 10 },
  { id: 'bintang-terang', icon: '🌟', name: 'Bintang Terang', desc: 'Kumpulkan 9 bintang', check: (p) => p.stars >= 9 },
  { id: 'pemburu-hijaiyah', icon: '🏹', name: 'Pemburu Hijaiyah', desc: 'Pelajari 20 huruf', check: (p) => p.completedLetters.length >= 20 },
  { id: 'master-hijaiyah', icon: '🏆', name: 'Master Hijaiyah', desc: 'Kuasai semua 29 huruf', check: (p) => p.completedLevels.length >= 6 },
];
