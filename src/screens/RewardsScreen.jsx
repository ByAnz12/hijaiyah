import { useGame } from '../game/store.js';
import { LETTERS } from '../data/letters.js';
import { LEVELS } from '../data/levels.js';
import { BADGES } from '../data/badges.js';
import { TopBar } from '../components/TopBar.jsx';
import { ProgressBar } from '../components/ProgressBar.jsx';
import { LevelCard } from '../components/LevelCard.jsx';
import { GameButton } from '../components/GameButton.jsx';

export function RewardsScreen() {
  const s = useGame();
  const master = s.completedLevels.length >= LEVELS.length;
  return (
    <div className="screen rewards">
      <TopBar title="🏆 Hadiahku" />
      <div className="rewards-body">
        <div className="panel">
          <div className="big-stats">
            <div><span aria-hidden>⭐</span><b>{s.stars}</b><small>Bintang</small></div>
            <div><span aria-hidden>🪙</span><b>{s.coins}</b><small>Koin</small></div>
            <div><span aria-hidden>🎯</span><b>{s.completedLetters.length}</b><small>Huruf</small></div>
            <div><span aria-hidden>🏆</span><b>{Math.min(6, s.completedLevels.length + 1)}</b><small>Level</small></div>
          </div>
          <ProgressBar value={s.completedLetters.length} max={LETTERS.length} label="Huruf dipelajari" />
        </div>
        <div className="panel">
          <h3>🏅 Badge</h3>
          <div className="badge-row">
            {BADGES.map((b) => {
              const got = s.badges.includes(b.id);
              return (
                <div key={b.id} className={`badge ${got ? 'got' : ''}`} aria-label={`${b.name}: ${got ? 'didapat' : 'terkunci'}`}>
                  <span className="badge-icon" aria-hidden>{got ? b.icon : '🔒'}</span>
                  <strong>{b.name}</strong>
                  <small>{got ? 'Didapat!' : b.desc}</small>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel">
          <h3>🗺️ Dunia</h3>
          <div className="level-grid small">
            {LEVELS.map((l) => (
              <LevelCard key={l.id} level={l} unlocked={s.isUnlocked(l.id)} stars={s.levelStars[l.id] || 0} onClick={() => s.startLevel(l.id)} />
            ))}
          </div>
        </div>
        {master && <GameButton icon="🎉" onClick={s.showFinale}>Lihat Perayaan</GameButton>}
      </div>
    </div>
  );
}
