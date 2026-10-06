import { useGame } from '../game/store.js';
import { GameButton } from '../components/GameButton.jsx';
import { Stats } from '../components/Stats.jsx';
import { VoiceGuide } from '../components/VoiceGuide.jsx';

export function HomeScreen() {
  const go = useGame((s) => s.go);
  const openSettings = useGame((s) => s.openSettings);
  return (
    <div className="screen home">
      <div className="home-top">
        <h1 className="title">HURUFKU <span className="logo-3d">3D</span></h1>
        <p className="subtitle">Petualangan Belajar Huruf Hijaiyah</p>
        <Stats />
      </div>
      <div className="home-bottom">
        <div className="home-menu">
          <GameButton icon="▶" onClick={() => go('map')} className="wide">MULAI PETUALANGAN</GameButton>
          <div className="menu-grid">
            <GameButton icon="📚" variant="blue" size="md" onClick={() => go('learn')}>BELAJAR HURUF</GameButton>
            <GameButton icon="🏆" variant="purple" size="md" onClick={() => go('rewards')}>HADIAHKU</GameButton>
            <GameButton icon="⚙️" variant="soft" size="md" onClick={() => openSettings(true)}>PENGATURAN</GameButton>
          </div>
        </div>
        <VoiceGuide className="guide-home" />
      </div>
    </div>
  );
}
