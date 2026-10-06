// Membuat src/data/hijaiyahFont.json (format typeface three.js) hanya untuk glyph Hijaiyah,
// supaya huruf bisa di-extrude menjadi objek 3D tanpa memuat font penuh saat runtime.
// Jalankan ulang dengan: npm run font
import fs from 'node:fs';
import opentype from 'opentype.js';

const FONT = 'node_modules/@fontsource/baloo-bhaijaan-2/files/baloo-bhaijaan-2-arabic-800-normal.woff';
const CHARS = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوءي';

const buf = fs.readFileSync(FONT);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const r = (n) => Math.round(n);
const glyphs = {};
let yMin = Infinity, yMax = -Infinity, xMin = Infinity, xMax = -Infinity;

for (const ch of CHARS) {
  const g = font.charToGlyph(ch);
  if (!g || !g.path.commands.length) throw new Error('Glyph tidak ditemukan: ' + ch);
  const o = [];
  for (const c of g.path.commands) {
    if (c.type === 'M') o.push('m', r(c.x), r(c.y));
    else if (c.type === 'L') o.push('l', r(c.x), r(c.y));
    else if (c.type === 'Q') o.push('q', r(c.x), r(c.y), r(c.x1), r(c.y1));
    else if (c.type === 'C') o.push('b', r(c.x), r(c.y), r(c.x1), r(c.y1), r(c.x2), r(c.y2));
  }
  const bb = g.getBoundingBox();
  yMin = Math.min(yMin, bb.y1); yMax = Math.max(yMax, bb.y2);
  xMin = Math.min(xMin, bb.x1); xMax = Math.max(xMax, bb.x2);
  glyphs[ch] = { ha: r(g.advanceWidth), x_min: r(bb.x1), x_max: r(bb.x2), o: o.join(' ') };
}

const out = {
  glyphs,
  familyName: 'Baloo Bhaijaan 2 (subset Hijaiyah)',
  ascender: font.ascender,
  descender: font.descender,
  underlinePosition: -100,
  underlineThickness: 50,
  boundingBox: { yMin: r(yMin), xMin: r(xMin), yMax: r(yMax), xMax: r(xMax) },
  resolution: font.unitsPerEm,
  original_font_information: { license: 'SIL Open Font License 1.1', source: 'Baloo Bhaijaan 2 by Ek Type' },
};
fs.writeFileSync('src/data/hijaiyahFont.json', JSON.stringify(out));
console.log('OK', Object.keys(glyphs).length, 'glyph,', fs.statSync('src/data/hijaiyahFont.json').size, 'bytes');
