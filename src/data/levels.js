// 6 dunia. theme dipakai oleh scenes/Environment.jsx untuk membangun lingkungan 3D.
export const LEVELS = [
  {
    id: 1, name: 'Taman Alif', icon: '🌳', letters: ['alif', 'ba', 'ta', 'tsa'],
    theme: { sky: '#bfe8ff', fog: '#d9f2ff', ground: '#8fd16a', accent: '#ff8fb1', deco: 'garden' },
  },
  {
    id: 2, name: 'Hutan Jim', icon: '🌲', letters: ['jim', 'ha', 'kha', 'dal', 'dzal'],
    theme: { sky: '#c7f0d8', fog: '#dff7e8', ground: '#5fb36b', accent: '#ffcf5c', deco: 'forest' },
  },
  {
    id: 3, name: 'Lembah Raa', icon: '🏜️', letters: ['ra', 'zai', 'sin', 'syin', 'shad'],
    theme: { sky: '#ffe7c2', fog: '#fff1dc', ground: '#f2c27b', accent: '#7fd1ae', deco: 'desert' },
  },
  {
    id: 4, name: 'Pegunungan', icon: '⛰️', letters: ['dhad', 'tha', 'zha', 'ain', 'ghain'],
    theme: { sky: '#d4e4ff', fog: '#e7efff', ground: '#9fc98a', accent: '#a78bfa', deco: 'mountain' },
  },
  {
    id: 5, name: 'Desa Huruf', icon: '🏘️', letters: ['fa', 'qaf', 'kaf', 'lam', 'mim'],
    theme: { sky: '#ffe0ec', fog: '#fff0f5', ground: '#a6db7f', accent: '#ff9f68', deco: 'village' },
  },
  {
    id: 6, name: 'Pulau Hijaiyah', icon: '🏝️', letters: ['nun', 'ha2', 'wau', 'hamzah', 'ya'],
    theme: { sky: '#b8f0ff', fog: '#d6f8ff', ground: '#f6dca0', accent: '#38bdf8', deco: 'island' },
  },
];

export const LEVEL_BY_ID = Object.fromEntries(LEVELS.map((l) => [l.id, l]));
