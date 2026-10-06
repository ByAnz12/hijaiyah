// Huruf Hijaiyah sebagai geometri 3D (extrude dari outline font). Di-cache per huruf.
import { ExtrudeGeometry } from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import fontData from '../data/hijaiyahFont.json';

const font = new Font(fontData);
const cache = new Map();

export function getLetterGeometry(char) {
  if (cache.has(char)) return cache.get(char);
  const shapes = font.generateShapes(char, 1);
  const geo = new ExtrudeGeometry(shapes, {
    depth: 0.18, curveSegments: 6,
    bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.025, bevelSegments: 2,
  });
  geo.computeBoundingBox();
  const b = geo.boundingBox;
  const size = Math.max(b.max.x - b.min.x, b.max.y - b.min.y);
  geo.center();
  geo.scale(1 / size, 1 / size, 1 / size); // ukuran terbesar = 1 unit
  geo.computeVertexNormals();
  cache.set(char, geo);
  return geo;
}
