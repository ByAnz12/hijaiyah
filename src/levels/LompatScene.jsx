import { useEffect, useState } from 'react';
import { HijaiyahLetter } from '../scenes/HijaiyahLetter.jsx';
import { Character } from '../scenes/Character.jsx';
import { LETTER_BY_ID } from '../data/letters.js';
import { useGame } from '../game/store.js';
import { useLayout } from '../hooks/useLayout.js';
import { rowX, LETTER_COLORS } from './rowPositions.js';

const PLATFORM_Y = 0.45;

// Mini game 5: karakter melompat ke platform berisi huruf yang disebut guide.
export function LompatScene({ round }) {
  const found = useGame((s) => s.found);
  const lastPick = useGame((s) => s.lastPick);
  const anim = useGame((s) => s.characterAnim);
  const pick = useGame((s) => s.pick);
  const busy = useGame((s) => s.busy);
  const { spread, portrait } = useLayout();
  const xs = rowX(round.options.length, spread);
  const z = -0.6;
  const start = portrait ? [0, 0, 3.6] : [-4.2, 0, 1.4];
  const [onKey, setOnKey] = useState(null);

  useEffect(() => {
    if (!lastPick) { setOnKey(null); return undefined; }
    setOnKey(lastPick.key);
    if (lastPick.correct) return undefined;
    const id = setTimeout(() => setOnKey(null), 1400); // salah: lompat kembali ke awal
    return () => clearTimeout(id);
  }, [lastPick]);

  const idx = round.options.findIndex((o) => o.key === onKey);
  const target = idx >= 0 ? [xs[idx], PLATFORM_Y, z + 0.15] : start;

  return (
    <group>
      <Character target={target} moveMode="jump" anim={anim.name} animT={anim.t} scale={0.85} />
      {/* platform awal */}
      <mesh position={[start[0], -0.05, start[2]]}>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 24]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
      {round.options.map((o, i) => {
        const lit = found.includes(o.key);
        const letter = LETTER_BY_ID[o.letterId];
        const choose = () => !busy && pick(o.key);
        return (
          <group key={o.key} position={[xs[i], 0, z]}>
            <mesh
              position={[0, PLATFORM_Y / 2, 0]}
              onClick={(e) => { e.stopPropagation(); choose(); }}
            >
              <cylinderGeometry args={[0.8, 0.9, PLATFORM_Y, 28]} />
              <meshStandardMaterial
                color={lit ? '#ffe066' : LETTER_COLORS[i % LETTER_COLORS.length]}
                emissive={lit ? '#ffcf3a' : '#000000'}
                emissiveIntensity={lit ? 0.8 : 0}
                roughness={0.45}
              />
            </mesh>
            <HijaiyahLetter
              char={letter.arabic}
              position={[0, 2.0, -0.55]}
              size={1.1}
              color="#ffffff"
              onPick={choose}
              label={letter.name}
              glow={lit}
              wrongAt={lastPick?.key === o.key && !lastPick.correct ? lastPick.t + 700 : 0}
            >
              <mesh position={[0, 0, -0.2]}>
                <circleGeometry args={[0.75, 28]} />
                <meshStandardMaterial color={LETTER_COLORS[i % LETTER_COLORS.length]} />
              </mesh>
            </HijaiyahLetter>
          </group>
        );
      })}
    </group>
  );
}
