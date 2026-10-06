import { Environment } from './Environment.jsx';
import { Character } from './Character.jsx';
import { Guide3D } from './Guide3D.jsx';
import { CameraRig } from './CameraRig.jsx';
import { Confetti } from './Confetti.jsx';
import { LetterRing } from './HomeScene.jsx';
import { LEVELS } from '../data/levels.js';
import { LETTERS } from '../data/letters.js';

// Perayaan akhir: karakter melakukan victory dance dikelilingi 29 huruf.
export function CelebrationScene() {
  return (
    <>
      <CameraRig position={[0, 3, 9]} target={[0, 1.6, 0]} orbit={0.15} />
      <Environment theme={LEVELS[5].theme} seed={3} />
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#ffd166" emissive="#ffb703" emissiveIntensity={0.3} />
      </mesh>
      <group position={[0, 0.4, 0]}>
        <Character anim="victory" target={[0, 0, 0]} scale={1.2} />
      </group>
      <Guide3D position={[1.6, 2.8, 0.6]} />
      <LetterRing letters={LETTERS} radius={3.6} y={2} speed={0.25} size={0.7} />
      <Confetti auto={0.9} />
    </>
  );
}

// Layar Hadiahku: karakter di atas podium.
export function RewardsScene({ master }) {
  return (
    <>
      <CameraRig position={[0, 2.4, 7]} target={[0, 1.2, 0]} orbit={0.1} maxZoom={1.5} />
      <Environment theme={LEVELS[2].theme} seed={5} />
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1, 1.15, 0.6, 32]} />
        <meshStandardMaterial color={master ? '#ffd166' : '#ffffff'} />
      </mesh>
      <group position={[0, 0.6, 0]}>
        <Character anim={master ? 'victory' : 'wave'} target={[0, 0, 0]} scale={1.1} />
      </group>
      <Guide3D position={[1.4, 2.6, 0.5]} />
    </>
  );
}
