import { useGame } from '../game/store.js';
import { LEVEL_BY_ID } from '../data/levels.js';
import { GameButton } from '../components/GameButton.jsx';
import { RewardPopup } from '../components/RewardPopup.jsx';

export function LevelCompleteScreen() {
  const r = useGame((s) => s.lastResult);
  const newBadges = useGame((s) => s.newBadges);
  const startLevel = useGame((s) => s.startLevel);
  const nextLevel = useGame((s) => s.nextLevel);
  const go = useGame((s) => s.go);
  if (!r) return null;
  const level = LEVEL_BY_ID[r.levelId];
  return (
    <div className="screen complete">
      <div className="panel result pop-in">
        <h1>🎉 LEVEL SELESAI!</h1>
        <p className="big-praise">Hebat!</p>
        <p className="muted">{level.icon} {level.name}</p>
        <div className="stars-big" aria-label={`${r.stars} dari 3 bintang`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={`star ${i <= r.stars ? 'on' : ''}`} style={{ animationDelay: `${i * 0.25}s` }} aria-hidden>
              {i <= r.stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <ul className="result-stats">
          <li>🎯 Huruf dipelajari: <b>{r.letters}</b></li>
          <li>🪙 Koin: <b>{r.coins}</b></li>
        </ul>
        <div className="col">
          {level.id < 6 && <GameButton icon="➡️" onClick={nextLevel}>LANJUT LEVEL</GameButton>}
          <div className="row">
            <GameButton icon="🔁" variant="blue" size="md" onClick={() => startLevel(level.id)}>MAIN LAGI</GameButton>
            <GameButton icon="🏠" variant="soft" size="md" onClick={() => go('map')}>KEMBALI</GameButton>
          </div>
        </div>
      </div>
      <RewardPopup badgeIds={newBadges} />
    </div>
  );
}
