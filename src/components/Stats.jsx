import { useGame } from '../game/store.js';
import { LETTERS } from '../data/letters.js';

// Chip ringkas: bintang, koin, huruf dipelajari, level.
export function Stats({ compact = false }) {
  const stars = useGame((s) => s.stars);
  const coins = useGame((s) => s.coins);
  const learned = useGame((s) => s.completedLetters.length);
  const levels = useGame((s) => s.completedLevels.length);
  return (
    <div className={`stats ${compact ? 'compact' : ''}`}>
      <span className="chip" aria-label={`${stars} bintang`}>⭐ {stars}</span>
      <span className="chip" aria-label={`${coins} koin`}>🪙 {coins}</span>
      {!compact && <span className="chip" aria-label={`${learned} dari ${LETTERS.length} huruf dipelajari`}>🎯 {learned}/{LETTERS.length}</span>}
      {!compact && <span className="chip" aria-label={`Level ${Math.min(6, levels + 1)}`}>🏆 {Math.min(6, levels + 1)}</span>}
    </div>
  );
}
