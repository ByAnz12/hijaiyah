import { lazy, Suspense, useEffect } from 'react';
import { useGame, applyAudioSettings } from './game/store.js';
import { audio } from './audio/AudioManager.js';
import { hasWebGL } from './utils/webgl.js';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { AudioController } from './components/AudioController.jsx';
import { SettingsPanel } from './components/SettingsPanel.jsx';
import { SplashScreen } from './screens/SplashScreen.jsx';
import { HomeScreen } from './screens/HomeScreen.jsx';
import { MapScreen } from './screens/MapScreen.jsx';
import { LevelScreen } from './screens/LevelScreen.jsx';
import { LevelCompleteScreen } from './screens/LevelCompleteScreen.jsx';
import { GameCompleteScreen } from './screens/GameCompleteScreen.jsx';
import { LearnScreen } from './screens/LearnScreen.jsx';
import { RewardsScreen } from './screens/RewardsScreen.jsx';

// 3D dimuat terpisah (lazy) supaya splash screen tampil cepat.
const Stage = lazy(() => import('./scenes/Stage.jsx'));

const SCREENS = {
  splash: SplashScreen,
  home: HomeScreen,
  map: MapScreen,
  level: LevelScreen,
  levelComplete: LevelCompleteScreen,
  gameComplete: GameCompleteScreen,
  learn: LearnScreen,
  rewards: RewardsScreen,
};

export default function App() {
  const screen = useGame((s) => s.currentScreen);
  const webgl = useGame((s) => s.webgl);
  const setWebGL = useGame((s) => s.setWebGL);
  const Screen = SCREENS[screen] || HomeScreen;

  useEffect(() => {
    applyAudioSettings(useGame.getState());
    if (!hasWebGL()) setWebGL(false);
    // interaksi pertama di mana pun membuka kunci audio browser
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock);
    return () => window.removeEventListener('pointerdown', unlock);
  }, [setWebGL]);

  return (
    <div className={`app ${webgl ? '' : 'no-webgl'}`}>
      {webgl && (
        <ErrorBoundary onError={() => setWebGL(false)}>
          <Suspense fallback={<div className="stage-loading" aria-hidden />}>
            <Stage />
          </Suspense>
        </ErrorBoundary>
      )}
      <main className="ui">
        <ErrorBoundary key={screen} fallback={<RecoverScreen />}>
          <Screen />
        </ErrorBoundary>
      </main>
      <AudioController />
      <SettingsPanel />
    </div>
  );
}

function RecoverScreen() {
  const go = useGame((s) => s.go);
  return (
    <div className="screen center">
      <div className="panel">
        <h2>Ups! Ada yang tersandung 🙈</h2>
        <button type="button" className="gbtn gbtn-primary gbtn-lg" onClick={() => go('home')}>🏠 Kembali ke Menu</button>
      </div>
    </div>
  );
}
