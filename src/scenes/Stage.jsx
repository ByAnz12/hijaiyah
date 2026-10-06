import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../game/store.js';
import { HomeScene } from './HomeScene.jsx';
import { WorldMap } from './WorldMap.jsx';
import { LearnScene } from './LearnScene.jsx';
import { CelebrationScene, RewardsScene } from './CelebrationScene.jsx';
import { LevelScene } from '../levels/LevelScene.jsx';
import { Confetti } from './Confetti.jsx';

// Satu Canvas WebGL untuk seluruh game (hemat memori di HP); isi berganti sesuai layar.
function SceneSwitch() {
  const screen = useGame((s) => s.currentScreen);
  const master = useGame((s) => s.completedLevels.length >= 6);
  switch (screen) {
    case 'map': return <WorldMap />;
    case 'level': return <LevelScene />;
    case 'levelComplete': return <><LevelScene celebrate /><Confetti auto={1.4} /></>;
    case 'gameComplete': return <CelebrationScene />;
    case 'learn': return <LearnScene />;
    case 'rewards': return <RewardsScene master={master} />;
    default: return <HomeScene splash={screen === 'splash'} />;
  }
}

export default function Stage() {
  return (
    <Canvas
      className="stage"
      dpr={[1, 1.75]}
      camera={{ fov: 50, position: [0, 3, 9], near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'default' }}
    >
      <Suspense fallback={null}>
        <SceneSwitch />
        <Confetti />
      </Suspense>
    </Canvas>
  );
}
