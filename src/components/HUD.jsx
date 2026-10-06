import { useGame } from '../game/store.js';
import { LEVEL_BY_ID } from '../data/levels.js';
import { TopBar } from './TopBar.jsx';

// HUD level: kembali ke peta, nama dunia, checkpoint, koin sesi, ulangi instruksi.
export function HUD() {
  const levelId = useGame((s) => s.currentLevel);
  const steps = useGame((s) => s.steps);
  const stepIndex = useGame((s) => s.stepIndex);
  const coins = useGame((s) => s.sessionCoins);
  const repeat = useGame((s) => s.repeatInstruction);
  const level = LEVEL_BY_ID[levelId];
  const checkpoints = level.letters.length + 1;
  const current = steps[stepIndex]?.checkpoint ?? 0;
  return (
    <TopBar back="map" backIcon="🗺️" backLabel="Kembali ke peta" title={`${level.icon} ${level.name}`}
      below={<Checkpoints current={current} checkpoints={checkpoints} />}>
      <span className="chip" aria-label={`${coins} koin didapat`}>🪙 +{coins}</span>
      <button type="button" className="round-btn" onClick={repeat} aria-label="Ulangi instruksi">🔁</button>
    </TopBar>
  );
}

function Checkpoints({ current, checkpoints }) {
  return (
    <div className="checkpoints" aria-label={`Checkpoint ${current + 1} dari ${checkpoints}`}>
      {Array.from({ length: checkpoints }, (_, i) => (
        <span key={i} className={`cp ${i < current ? 'done' : i === current ? 'now' : ''}`} aria-hidden>
          {i < current ? '✓' : i === checkpoints - 1 ? '🏁' : ''}
        </span>
      ))}
    </div>
  );
}
