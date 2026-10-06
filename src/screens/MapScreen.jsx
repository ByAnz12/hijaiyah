import { useGame } from '../game/store.js';
import { LEVELS } from '../data/levels.js';
import { TopBar } from '../components/TopBar.jsx';
import { VoiceGuide } from '../components/VoiceGuide.jsx';
import { LevelCard } from '../components/LevelCard.jsx';

// Peta 3D ada di scenes/WorldMap.jsx; layar ini hanya UI di atasnya (dan peta kartu bila WebGL tidak tersedia).
export function MapScreen() {
  const webgl = useGame((s) => s.webgl);
  const isUnlocked = useGame((s) => s.isUnlocked);
  const levelStars = useGame((s) => s.levelStars);
  const startLevel = useGame((s) => s.startLevel);
  useGame((s) => s.completedLevels);
  return (
    <div className="screen map">
      <TopBar title="🗺️ Peta Petualangan" />
      {!webgl && (
        <div className="level-grid">
          {LEVELS.map((l) => (
            <LevelCard key={l.id} level={l} unlocked={isUnlocked(l.id)} stars={levelStars[l.id] || 0} onClick={() => startLevel(l.id)} />
          ))}
        </div>
      )}
      <VoiceGuide className="guide-bottom" />
    </div>
  );
}
