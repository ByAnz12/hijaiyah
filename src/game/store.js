// State game (zustand). Progress disimpan otomatis ke localStorage lewat persist.
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { LEVELS, LEVEL_BY_ID } from '../data/levels.js';
import { LETTER_BY_ID, LETTERS } from '../data/letters.js';
import { BADGES } from '../data/badges.js';
import { GUIDE, PRAISE, GENTLE } from '../data/phrases.js';
import { buildSteps, makeRound, judge, starsFor, COIN_PER_CORRECT, COIN_PER_STAR } from './engine.js';
import { audio } from '../audio/AudioManager.js';
import { safeStorage } from '../utils/storage.js';
import { pick } from '../utils/random.js';
import { DEFAULTS } from '../audio/config.js';

const PROGRESS = {
  stars: 0,
  coins: 0,
  completedLetters: [],
  completedLevels: [],
  levelStars: {},
  badges: [],
};
const SETTINGS = {
  soundEnabled: true, // suara guide (voice)
  musicEnabled: true,
  sfxEnabled: true,
  musicVolume: DEFAULTS.musicVolume,
  sfxVolume: DEFAULTS.sfxVolume,
};

const now = () => performance.now();
let timer = null;
const later = (fn, ms) => {
  clearTimeout(timer);
  timer = setTimeout(fn, ms);
};

// Kalimat instruksi + daftar pilihan (dibacakan untuk anak yang belum bisa membaca).
function instruction(round) {
  const t = round.targetId && LETTER_BY_ID[round.targetId];
  switch (round.type) {
    case 'intro': return GUIDE.intro(t);
    case 'kenali': {
      const names = round.options.map((o) => LETTER_BY_ID[o.letterId].spoken);
      return `${GUIDE.kenali()} ${names.slice(0, -1).join(', ')}, atau ${names.at(-1)}?`;
    }
    case 'pasangkan': return GUIDE.pasangkan();
    default: return GUIDE[round.type](t);
  }
}

export const useGame = create(
  persist(
    (set, get) => ({
      ...PROGRESS,
      ...SETTINGS,
      currentScreen: 'splash',
      currentLevel: null,
      currentLetter: null,
      gameState: 'idle', // idle | playing | levelComplete | gameComplete
      score: 0,
      webgl: true,
      settingsOpen: false,
      guideText: '',
      guideKey: 0,
      // sesi level
      steps: [],
      stepIndex: 0,
      round: null,
      found: [],
      mistakes: 0,
      sessionCoins: 0,
      busy: false,
      lastPick: null, // { key, correct, t }
      characterAnim: { name: 'idle', t: 0 },
      confetti: { t: 0, pos: [0, 1, 0] },
      lastResult: null,
      newBadges: [],
      justUnlocked: null,
      learnLetter: 'alif',

      // ---------- umum ----------
      say(text, speakText = text) {
        set((s) => ({ guideText: text, guideKey: s.guideKey + 1 }));
        audio.speak(speakText);
      },
      animate(name) { set({ characterAnim: { name, t: now() } }); },
      burst(pos = [0, 1.2, 0]) { set({ confetti: { t: now(), pos } }); },
      go(screen) {
        clearTimeout(timer);
        audio.playSfx('tap');
        set({ currentScreen: screen, settingsOpen: false, busy: false, characterAnim: { name: 'idle', t: now() } });
        if (screen === 'home') get().say(GUIDE.welcome);
        if (screen === 'map') get().say(GUIDE.map);
        if (screen === 'learn') get().say(GUIDE.learn);
        if (screen === 'rewards') get().say(GUIDE.rewards);
      },
      setWebGL(ok) { set({ webgl: ok }); },
      openSettings(open) { audio.playSfx('tap'); set({ settingsOpen: open }); },
      setSetting(key, value) {
        set({ [key]: value });
        applyAudioSettings(get());
      },
      resetProgress() {
        clearTimeout(timer);
        set({ ...PROGRESS, currentScreen: 'home', settingsOpen: false, justUnlocked: null, gameState: 'idle' });
        get().say('Progress dimulai dari awal. Ayo berpetualang lagi!');
      },

      // ---------- belajar ----------
      learn(id) {
        const l = LETTER_BY_ID[id];
        audio.playSfx('pop');
        set({ learnLetter: id, guideText: l.note ? `${l.name} (${l.note})` : l.name, guideKey: get().guideKey + 1 });
        get().animate('happy');
        audio.speakLetter(l);
      },

      // ---------- level ----------
      isUnlocked(levelId) {
        return levelId === 1 || get().completedLevels.includes(levelId - 1);
      },
      startLevel(levelId) {
        const level = LEVEL_BY_ID[levelId];
        if (!level) return;
        if (!get().isUnlocked(levelId)) {
          audio.playSfx('wrong');
          get().say(GUIDE.locked);
          return;
        }
        clearTimeout(timer);
        audio.playSfx('pop');
        set({
          currentScreen: 'level', currentLevel: levelId, gameState: 'playing', settingsOpen: false,
          steps: buildSteps(level), stepIndex: 0, mistakes: 0, sessionCoins: 0, score: 0,
          lastPick: null, newBadges: [], justUnlocked: null,
        });
        get().startStep(0);
      },
      startStep(i) {
        const { steps, currentLevel } = get();
        const step = steps[i];
        const round = makeRound(step, LEVEL_BY_ID[currentLevel]);
        set({
          stepIndex: i, round, found: [], busy: false, lastPick: null,
          currentLetter: step.letterId ?? null,
          characterAnim: { name: step.type === 'intro' ? 'wave' : 'idle', t: now() },
        });
        const text = instruction(round);
        get().say(text);
      },
      repeatInstruction() {
        const { round } = get();
        if (!round) return;
        audio.playSfx('tap');
        audio.lastSpeech.text = '';
        if (round.type === 'dengar' || round.type === 'intro') audio.speakLetter(LETTER_BY_ID[round.targetId]);
        else get().say(instruction(round));
      },
      nextStep() {
        const { stepIndex, steps } = get();
        if (stepIndex + 1 >= steps.length) get().completeLevel();
        else get().startStep(stepIndex + 1);
      },
      // key = pilihan yang disentuh. answerId hanya untuk Pasangkan.
      pick(key, answerId) {
        const s = get();
        if (s.busy || s.gameState !== 'playing' || !s.round) return 'ignored';
        const result = judge(s.round, s.found, key, answerId);
        if (result === 'ignored') return result;
        const correct = result === 'correct';
        const delay = s.round.type === 'lompat' ? 750 : 0; // tunggu karakter mendarat
        set({ lastPick: { key, correct, t: now() }, busy: true });
        if (s.round.type === 'lompat') audio.playSfx('jump');
        setTimeout(() => (correct ? onCorrect(key) : onWrong()), delay);
        return result;
      },

      completeLevel() {
        const s = get();
        const level = LEVEL_BY_ID[s.currentLevel];
        const stars = starsFor(s.mistakes);
        const bonus = stars * COIN_PER_STAR;
        const levelStars = { ...s.levelStars, [level.id]: Math.max(stars, s.levelStars[level.id] || 0) };
        const firstClear = !s.completedLevels.includes(level.id);
        const completedLevels = firstClear ? [...s.completedLevels, level.id] : s.completedLevels;
        const totalStars = Object.values(levelStars).reduce((a, b) => a + b, 0);
        const progress = { ...s, levelStars, completedLevels, stars: totalStars };
        const newBadges = BADGES.filter((b) => !s.badges.includes(b.id) && b.check(progress)).map((b) => b.id);
        const allDone = completedLevels.length === LEVELS.length;
        set({
          levelStars, completedLevels, stars: totalStars,
          coins: s.coins + bonus,
          badges: [...s.badges, ...newBadges],
          newBadges,
          justUnlocked: firstClear && level.id < LEVELS.length ? level.id + 1 : null,
          lastResult: { levelId: level.id, stars, coins: s.sessionCoins + bonus, letters: level.letters.length },
          gameState: firstClear && allDone ? 'gameComplete' : 'levelComplete',
          currentScreen: firstClear && allDone ? 'gameComplete' : 'levelComplete',
          round: null,
          busy: false,
        });
        audio.playSfx('fanfare');
        get().animate(firstClear && allDone ? 'victory' : 'happy');
        get().say(firstClear && allDone ? GUIDE.gameDone : GUIDE.levelDone);
      },
      nextLevel() {
        const id = get().currentLevel;
        if (id < LEVELS.length) get().startLevel(id + 1);
        else get().go('map');
      },
      showFinale() {
        audio.playSfx('fanfare');
        set({ currentScreen: 'gameComplete', gameState: 'gameComplete', settingsOpen: false });
        get().animate('victory');
        get().say(GUIDE.gameDone);
      },
      clearJustUnlocked() { set({ justUnlocked: null }); },
    }),
    {
      name: 'hurufku3d-progress',
      version: 1,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => {
        const out = {};
        for (const k of [...Object.keys(PROGRESS), ...Object.keys(SETTINGS), 'learnLetter']) out[k] = s[k];
        return out;
      },
      merge: (persisted, current) => {
        // Data rusak / versi lama tidak boleh membuat game crash.
        const p = persisted && typeof persisted === 'object' ? persisted : {};
        const arr = (v) => (Array.isArray(v) ? v : []);
        const ids = new Set(LETTERS.map((l) => l.id));
        return {
          ...current,
          ...p,
          completedLetters: arr(p.completedLetters).filter((id) => ids.has(id)),
          completedLevels: arr(p.completedLevels).filter((id) => LEVEL_BY_ID[id]),
          badges: arr(p.badges),
          levelStars: p.levelStars && typeof p.levelStars === 'object' ? p.levelStars : {},
          learnLetter: ids.has(p.learnLetter) ? p.learnLetter : 'alif',
        };
      },
    },
  ),
);

function onCorrect(key) {
  const g = useGame.getState();
  const found = [...g.found, key];
  const done = found.length >= g.round.needed;
  const isGameStep = g.round.type !== 'pasangkan';
  const letterId = g.round.type === 'pasangkan' ? g.round.options.find((o) => o.key === key)?.letterId : g.round.targetId;
  const completedLetters = done && isGameStep && !g.completedLetters.includes(letterId)
    ? [...g.completedLetters, letterId] : g.completedLetters;
  useGame.setState({
    found,
    score: g.score + 10,
    coins: g.coins + COIN_PER_CORRECT,
    sessionCoins: g.sessionCoins + COIN_PER_CORRECT,
    completedLetters,
    busy: done,
  });
  audio.playSfx('correct');
  setTimeout(() => audio.playSfx('coin'), 250);
  g.animate('happy');
  if (g.round.type !== 'pasangkan') g.burst();
  if (done) {
    g.say(pick(PRAISE) + ' Jawabanmu benar!');
    later(() => useGame.getState().nextStep(), 2200);
  } else {
    g.say(g.round.type === 'pasangkan' ? 'Benar!' : 'Hebat! Cari satu lagi!');
  }
}

function onWrong() {
  const g = useGame.getState();
  useGame.setState({ mistakes: g.mistakes + 1 });
  audio.playSfx('wrong');
  g.animate('oops');
  const t = g.round.targetId && LETTER_BY_ID[g.round.targetId];
  const hint = t && g.round.type !== 'kenali' ? ` ${GUIDE[g.round.type](t)}` : '';
  g.say(pick(GENTLE) + hint);
  // Jeda singkat agar anak tidak menekan sembarangan; lompat butuh waktu kembali ke awal.
  later(() => useGame.setState({ busy: false }), g.round.type === 'lompat' ? 1500 : 700);
}

export function applyAudioSettings(s) {
  audio.setMusicEnabled(s.musicEnabled);
  audio.setSfxEnabled(s.sfxEnabled);
  audio.setVoiceEnabled(s.soundEnabled);
  audio.setMusicVolume(s.musicVolume);
  audio.setSfxVolume(s.sfxVolume);
}
