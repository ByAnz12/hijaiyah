import { HijaiyahLetter } from '../scenes/HijaiyahLetter.jsx';
import { LETTER_BY_ID } from '../data/letters.js';
import { useGame } from '../game/store.js';

// Kenalan huruf (intro) & Kenali Huruf: satu huruf besar di tengah.
export function BigLetterScene({ round, spin = 0 }) {
  const found = useGame((s) => s.found);
  const lastPick = useGame((s) => s.lastPick);
  const letter = LETTER_BY_ID[round.targetId];
  return (
    <HijaiyahLetter
      key={round.targetId}
      char={letter.arabic}
      size={2.3}
      position={[0, 1.9, 0]}
      spin={spin}
      color="#ff7a59"
      glow={found.length > 0}
      correctAt={lastPick?.correct ? lastPick.t : 0}
      wrongAt={lastPick && !lastPick.correct ? lastPick.t : 0}
    />
  );
}
