import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { HijaiyahLetter } from '../scenes/HijaiyahLetter.jsx';
import { LETTER_BY_ID } from '../data/letters.js';
import { useGame } from '../game/store.js';
import { useLayout } from '../hooks/useLayout.js';
import { LETTER_COLORS } from './rowPositions.js';

// Mini game 2: huruf-huruf bergerak pelan di arena, anak menangkap huruf target.
function Mover({ index, total, width, children, caught }) {
  const g = useRef();
  const p = useRef({ ph: Math.random() * 6, sp: 0.25 + Math.random() * 0.2, lane: index / Math.max(1, total - 1) });
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const q = p.current;
    if (caught) {
      // terbang ke atas lalu menghilang
      g.current.position.y += dt * 4;
      g.current.scale.multiplyScalar(Math.max(0, 1 - dt * 2.5));
      return;
    }
    g.current.position.x = Math.sin(t * q.sp + q.ph) * width;
    g.current.position.y = 1.0 + q.lane * 2.0 + Math.sin(t * q.sp * 2 + q.ph) * 0.25;
    g.current.position.z = -1.6 + Math.cos(t * q.sp * 1.3 + q.ph) * 1.0 + q.lane * 0.4;
  });
  return <group ref={g}>{children}</group>;
}

export function TangkapScene({ round }) {
  const found = useGame((s) => s.found);
  const lastPick = useGame((s) => s.lastPick);
  const pick = useGame((s) => s.pick);
  const { arenaWidth } = useLayout();
  return round.options.map((o, i) => (
    <Mover key={o.key} index={i} total={round.options.length} width={arenaWidth} caught={found.includes(o.key)}>
      <HijaiyahLetter
        char={LETTER_BY_ID[o.letterId].arabic}
        size={1.05}
        color={LETTER_COLORS[i % LETTER_COLORS.length]}
        onPick={() => pick(o.key)}
        label={LETTER_BY_ID[o.letterId].name}
        glow={found.includes(o.key)}
        wrongAt={lastPick?.key === o.key && !lastPick.correct ? lastPick.t : 0}
      />
    </Mover>
  ));
}
