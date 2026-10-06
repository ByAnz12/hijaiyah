// Self-check data & logic game: npm test
import assert from 'node:assert/strict';
import { LETTERS } from '../src/data/letters.js';
import { LEVELS } from '../src/data/levels.js';
import { buildSteps, makeRound, judge, starsFor } from '../src/game/engine.js';
import font from '../src/data/hijaiyahFont.json' with { type: 'json' };

assert.equal(LETTERS.length, 29, '29 huruf');
assert.equal(new Set(LETTERS.map((l) => l.id)).size, 29, 'id unik');
assert.equal(new Set(LETTERS.map((l) => l.arabic)).size, 29, 'huruf unik');
for (const l of LETTERS) assert.ok(font.glyphs[l.arabic], 'glyph 3D ada untuk ' + l.name);

assert.equal(LEVELS.length, 6);
const all = LEVELS.flatMap((lv) => lv.letters);
assert.equal(all.length, 29, 'semua huruf masuk level');
assert.deepEqual(new Set(all), new Set(LETTERS.map((l) => l.id)));

for (let n = 0; n < 50; n++) {
  for (const lv of LEVELS) {
    for (const step of buildSteps(lv)) {
      const r = makeRound(step, lv);
      if (r.type === 'intro') continue;
      const keys = r.options.map((o) => o.key);
      assert.equal(new Set(keys).size, keys.length, 'key unik');
      if (r.type === 'pasangkan') {
        assert.equal(r.options.length, lv.letters.length);
        assert.equal(judge(r, [], r.options[0].key, r.options[0].letterId), 'correct');
        continue;
      }
      const targets = r.options.filter((o) => o.letterId === r.targetId);
      assert.equal(targets.length, r.needed, r.type + ': jumlah target');
      const target = LETTERS.find((l) => l.id === r.targetId);
      for (const o of r.options) {
        const l = LETTERS.find((x) => x.id === o.letterId);
        if (o.letterId !== r.targetId) assert.notEqual(l.name, target.name, 'pengecoh tidak boleh bernama sama');
      }
      assert.equal(judge(r, [], targets[0].key), 'correct');
      assert.equal(judge(r, [targets[0].key], targets[0].key), 'ignored');
      const wrong = r.options.find((o) => o.letterId !== r.targetId);
      assert.equal(judge(r, [], wrong.key), 'wrong');
    }
  }
}
assert.deepEqual([0, 1, 2, 4, 5, 9].map(starsFor), [3, 3, 2, 2, 1, 1]);
console.log('✓ Semua pengecekan lulus');
