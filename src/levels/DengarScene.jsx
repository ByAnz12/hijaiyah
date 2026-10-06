import { HijaiyahLetter } from '../scenes/HijaiyahLetter.jsx';
import { BlobShadow } from '../scenes/BlobShadow.jsx';
import { LETTER_BY_ID } from '../data/letters.js';
import { useGame } from '../game/store.js';
import { useLayout } from '../hooks/useLayout.js';
import { rowX, LETTER_COLORS } from './rowPositions.js';

// Mini game 4 (Dengarkan & Pilih) dan Kenali: huruf-huruf di atas podium.
export function PodiumChoices({ round }) {
  const found = useGame((s) => s.found);
  const lastPick = useGame((s) => s.lastPick);
  const pick = useGame((s) => s.pick);
  const { spread } = useLayout();
  const xs = rowX(round.options.length, spread);
  return round.options.map((o, i) => (
    <group key={o.key} position={[xs[i], 0, -0.4]}>
      <BlobShadow size={0.8} />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.65, 0.75, 0.6, 24]} />
        <meshStandardMaterial color={found.includes(o.key) ? '#ffe066' : '#ffffff'} roughness={0.5} />
      </mesh>
      <HijaiyahLetter
        char={LETTER_BY_ID[o.letterId].arabic}
        position={[0, 1.55, 0]}
        size={1.3}
        color={LETTER_COLORS[i % LETTER_COLORS.length]}
        onPick={() => pick(o.key)}
        label={LETTER_BY_ID[o.letterId].name}
        glow={found.includes(o.key)}
        correctAt={lastPick?.key === o.key && lastPick.correct ? lastPick.t : 0}
        wrongAt={lastPick?.key === o.key && !lastPick.correct ? lastPick.t : 0}
      />
    </group>
  ));
}
