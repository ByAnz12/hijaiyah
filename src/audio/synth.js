// Musik & efek suara sintetis (Web Audio). Placeholder lokal yang tidak butuh file atau internet.

const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI -> Hz

export function tone(ctx, out, { freq, start = 0, dur = 0.2, type = 'sine', vol = 0.3, slideTo }) {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export const SFX = {
  tap: (c, o) => tone(c, o, { freq: 660, dur: 0.08, type: 'triangle', vol: 0.2 }),
  pop: (c, o) => tone(c, o, { freq: 520, slideTo: 980, dur: 0.12, type: 'sine', vol: 0.3 }),
  correct: (c, o) => {
    tone(c, o, { freq: NOTE(76), dur: 0.15, type: 'triangle', vol: 0.3 });
    tone(c, o, { freq: NOTE(83), start: 0.1, dur: 0.3, type: 'triangle', vol: 0.3 });
    tone(c, o, { freq: NOTE(88), start: 0.2, dur: 0.35, type: 'sine', vol: 0.2 });
  },
  // Suara "salah" sengaja lembut & tidak menghukum.
  wrong: (c, o) => {
    tone(c, o, { freq: NOTE(67), dur: 0.18, type: 'sine', vol: 0.18 });
    tone(c, o, { freq: NOTE(64), start: 0.14, dur: 0.25, type: 'sine', vol: 0.15 });
  },
  coin: (c, o) => {
    tone(c, o, { freq: NOTE(88), dur: 0.08, type: 'square', vol: 0.06 });
    tone(c, o, { freq: NOTE(93), start: 0.07, dur: 0.18, type: 'square', vol: 0.06 });
  },
  jump: (c, o) => tone(c, o, { freq: 300, slideTo: 750, dur: 0.25, type: 'triangle', vol: 0.18 }),
  unlock: (c, o) => [0, 4, 7, 12, 16].forEach((n, i) => tone(c, o, { freq: NOTE(72 + n), start: i * 0.07, dur: 0.3, type: 'sine', vol: 0.18 })),
  fanfare: (c, o) => {
    [0, 4, 7, 12].forEach((n, i) => tone(c, o, { freq: NOTE(67 + n), start: i * 0.13, dur: 0.25, type: 'triangle', vol: 0.25 }));
    [0, 4, 7].forEach((n) => tone(c, o, { freq: NOTE(79 + n), start: 0.55, dur: 0.8, type: 'triangle', vol: 0.15 }));
  },
};

// Lagu loop ceria 8 bar (pentatonik C), 104 BPM, dijadwalkan sedikit di depan agar tidak putus-putus.
const MELODY = [
  72, 76, 79, 76, 81, 79, 76, null, 74, 76, 79, 84, 81, 79, 76, null,
  72, 74, 76, 79, 76, 74, 72, null, 74, 76, 74, 72, 69, 72, 72, null,
];
const BASS = [48, 48, 53, 53, 55, 55, 48, 48];

export function createMusicLoop(ctx, out) {
  const step = 60 / 104 / 2; // durasi 1 not seperdelapan
  let i = 0;
  let next = ctx.currentTime + 0.1;
  const timer = setInterval(() => {
    while (next < ctx.currentTime + 0.4) {
      const m = MELODY[i % MELODY.length];
      const start = next - ctx.currentTime;
      if (m) tone(ctx, out, { freq: NOTE(m), start, dur: step * 1.6, type: 'triangle', vol: 0.12 });
      if (i % 4 === 0) tone(ctx, out, { freq: NOTE(BASS[(i / 4) % BASS.length]), start, dur: step * 3.5, type: 'sine', vol: 0.14 });
      if (i % 2 === 1) tone(ctx, out, { freq: 2400, start, dur: 0.03, type: 'square', vol: 0.008 });
      next += step;
      i++;
    }
  }, 100);
  return () => clearInterval(timer);
}
