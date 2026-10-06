// Data 29 huruf Hijaiyah. Semua mini game membaca dari sini, jadi tidak ada logic khusus per huruf.
// spoken: teks yang diucapkan suara (Bahasa Indonesia). note: keterangan kecil untuk membedakan huruf yang namanya mirip.
export const LETTERS = [
  { id: 'alif', arabic: 'ا', name: 'Alif', transliteration: 'a', spoken: 'Alif' },
  { id: 'ba', arabic: 'ب', name: 'Ba', transliteration: 'b', spoken: 'Ba' },
  { id: 'ta', arabic: 'ت', name: 'Ta', transliteration: 't', spoken: 'Ta' },
  { id: 'tsa', arabic: 'ث', name: 'Tsa', transliteration: 'ts', spoken: 'Tsa' },
  { id: 'jim', arabic: 'ج', name: 'Jim', transliteration: 'j', spoken: 'Jim' },
  { id: 'ha', arabic: 'ح', name: 'Ha', transliteration: 'ḥ', spoken: 'Ha', note: 'Ha besar' },
  { id: 'kha', arabic: 'خ', name: 'Kha', transliteration: 'kh', spoken: 'Kha' },
  { id: 'dal', arabic: 'د', name: 'Dal', transliteration: 'd', spoken: 'Dal' },
  { id: 'dzal', arabic: 'ذ', name: 'Dzal', transliteration: 'dz', spoken: 'Dzal' },
  { id: 'ra', arabic: 'ر', name: 'Ra', transliteration: 'r', spoken: 'Ra' },
  { id: 'zai', arabic: 'ز', name: 'Zai', transliteration: 'z', spoken: 'Zai' },
  { id: 'sin', arabic: 'س', name: 'Sin', transliteration: 's', spoken: 'Sin' },
  { id: 'syin', arabic: 'ش', name: 'Syin', transliteration: 'sy', spoken: 'Syin' },
  { id: 'shad', arabic: 'ص', name: 'Shad', transliteration: 'sh', spoken: 'Shod' },
  { id: 'dhad', arabic: 'ض', name: 'Dhad', transliteration: 'dh', spoken: 'Dhod' },
  { id: 'tha', arabic: 'ط', name: 'Tha', transliteration: 'th', spoken: 'Tho' },
  { id: 'zha', arabic: 'ظ', name: 'Zha', transliteration: 'zh', spoken: 'Zho' },
  { id: 'ain', arabic: 'ع', name: "'Ain", transliteration: "'", spoken: 'Ain' },
  { id: 'ghain', arabic: 'غ', name: 'Ghain', transliteration: 'gh', spoken: 'Ghoin' },
  { id: 'fa', arabic: 'ف', name: 'Fa', transliteration: 'f', spoken: 'Fa' },
  { id: 'qaf', arabic: 'ق', name: 'Qaf', transliteration: 'q', spoken: 'Qof' },
  { id: 'kaf', arabic: 'ك', name: 'Kaf', transliteration: 'k', spoken: 'Kaf' },
  { id: 'lam', arabic: 'ل', name: 'Lam', transliteration: 'l', spoken: 'Lam' },
  { id: 'mim', arabic: 'م', name: 'Mim', transliteration: 'm', spoken: 'Mim' },
  { id: 'nun', arabic: 'ن', name: 'Nun', transliteration: 'n', spoken: 'Nun' },
  { id: 'ha2', arabic: 'ه', name: 'Ha', transliteration: 'h', spoken: 'Ha', note: 'Ha kecil' },
  { id: 'wau', arabic: 'و', name: 'Wau', transliteration: 'w', spoken: 'Wau' },
  { id: 'hamzah', arabic: 'ء', name: 'Hamzah', transliteration: "'", spoken: 'Hamzah' },
  { id: 'ya', arabic: 'ي', name: 'Ya', transliteration: 'y', spoken: 'Ya' },
];

export const LETTER_BY_ID = Object.fromEntries(LETTERS.map((l) => [l.id, l]));
export const letterLabel = (l) => (l.note ? `${l.name} (${l.note})` : l.name);
