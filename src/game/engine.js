// Logic permainan murni (tanpa React / audio) sehingga bisa diuji dengan `npm test`.
import { LETTERS, LETTER_BY_ID } from '../data/letters.js';
import { shuffle } from '../utils/random.js';

export const GAME_TYPES = ['kenali', 'tangkap', 'dengar', 'lompat'];
const OPTION_COUNT = { kenali: 3, dengar: 3, lompat: 3, tangkap: 5 };
const TANGKAP_TARGETS = 2;

// Setiap huruf = 1 checkpoint: kenalan (intro) lalu 1 mini game. Ditutup dengan mini game Pasangkan.
export function buildSteps(level) {
  const steps = [];
  level.letters.forEach((letterId, i) => {
    steps.push({ type: 'intro', letterId, checkpoint: i });
    steps.push({ type: GAME_TYPES[(i + level.id - 1) % GAME_TYPES.length], letterId, checkpoint: i });
  });
  steps.push({ type: 'pasangkan', letterIds: [...level.letters], checkpoint: level.letters.length });
  return steps;
}

// Pengecoh: utamakan huruf dari level yang sama, jangan pernah memakai huruf dengan nama sama (Ha / Ha).
export function pickDistractors(targetId, count, levelLetters, rng = Math.random) {
  const target = LETTER_BY_ID[targetId];
  const ok = (l) => l.id !== targetId && l.name !== target.name;
  const same = shuffle(levelLetters.map((id) => LETTER_BY_ID[id]).filter(ok), rng);
  const others = shuffle(LETTERS.filter((l) => ok(l) && !levelLetters.includes(l.id)), rng);
  return [...same, ...others].slice(0, count).map((l) => l.id);
}

export function makeRound(step, level, rng = Math.random) {
  if (step.type === 'intro') return { type: 'intro', targetId: step.letterId, options: [], needed: 0 };
  if (step.type === 'pasangkan') {
    const ids = step.letterIds;
    return {
      type: 'pasangkan',
      options: shuffle(ids, rng).map((id) => ({ key: id, letterId: id })),
      names: shuffle(ids, rng),
      needed: ids.length,
    };
  }
  const targetId = step.letterId;
  if (step.type === 'tangkap') {
    const distractors = pickDistractors(targetId, OPTION_COUNT.tangkap, level.letters, rng);
    const ids = [...Array(TANGKAP_TARGETS).fill(targetId), ...distractors];
    return {
      type: 'tangkap', targetId, needed: TANGKAP_TARGETS,
      options: shuffle(ids, rng).map((id, i) => ({ key: `${id}-${i}`, letterId: id })),
    };
  }
  const ids = [targetId, ...pickDistractors(targetId, OPTION_COUNT[step.type] - 1, level.letters, rng)];
  return {
    type: step.type, targetId, needed: 1,
    options: shuffle(ids, rng).map((id) => ({ key: id, letterId: id })),
  };
}

// 'correct' | 'wrong' | 'ignored'. answerId hanya dipakai Pasangkan (nama tempat huruf dijatuhkan).
export function judge(round, found, key, answerId) {
  if (found.includes(key)) return 'ignored';
  const opt = round.options.find((o) => o.key === key);
  if (!opt) return 'ignored';
  if (round.type === 'pasangkan') return opt.letterId === answerId ? 'correct' : 'wrong';
  return opt.letterId === round.targetId ? 'correct' : 'wrong';
}

export const starsFor = (mistakes) => (mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1);
export const COIN_PER_CORRECT = 10;
export const COIN_PER_STAR = 20;
