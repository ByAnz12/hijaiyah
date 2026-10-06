import { useEffect, useState } from 'react';
import { useGame } from '../game/store.js';
import { audio } from '../audio/AudioManager.js';
import { GUIDE } from '../data/phrases.js';
import { GameButton } from '../components/GameButton.jsx';

export function SplashScreen() {
  const go = useGame((s) => s.go);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 1300);
    return () => clearTimeout(id);
  }, []);
  const start = () => {
    audio.unlock(); // interaksi pertama: buka kunci audio browser
    audio.playMusic();
    go('home');
  };
  return (
    <div className="screen splash">
      <div className="logo pop-in">
        <span className="logo-arabic" aria-hidden>ا ب ت</span>
        <h1>HURUFKU <span className="logo-3d">3D</span></h1>
      </div>
      {ready && (
        <div className="splash-bottom fade-up">
          <p className="hello">{GUIDE.splash} 👋</p>
          <GameButton icon="▶" className="pulse" onClick={start}>MULAI</GameButton>
        </div>
      )}
    </div>
  );
}
