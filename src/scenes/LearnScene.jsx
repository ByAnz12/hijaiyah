import { Environment } from './Environment.jsx';
import { Character } from './Character.jsx';
import { Guide3D } from './Guide3D.jsx';
import { CameraRig } from './CameraRig.jsx';
import { HijaiyahLetter } from './HijaiyahLetter.jsx';
import { LETTER_BY_ID } from '../data/letters.js';
import { LEVELS } from '../data/levels.js';
import { useGame } from '../game/store.js';
import { useLayout } from '../hooks/useLayout.js';

// Mode Belajar: huruf terpilih membesar & berputar pelan di atas panggung.
export function LearnScene() {
  const id = useGame((s) => s.learnLetter);
  const anim = useGame((s) => s.characterAnim);
  const { portrait } = useLayout();
  const letter = LETTER_BY_ID[id];
  return (
    <>
      <CameraRig position={[0, 2.2, 7]} target={portrait ? [0, 0.4, 0] : [0, 1.0, 0]} maxZoom={1.5} />
      <Environment theme={LEVELS[4].theme} seed={11} />
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.5, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <HijaiyahLetter key={id} char={letter.arabic} size={2.1} position={[0, 2.0, 0]} spin={0.6} color="#ff7a59" correctAt={anim.t} />
      <Character target={portrait ? [-1.8, 0, 1.4] : [-2.6, 0, 0.8]} anim={anim.name} animT={anim.t} scale={0.85} />
      <Guide3D position={portrait ? [1.7, 3.4, 0.5] : [2.5, 2.6, 0.5]} scale={0.7} />
    </>
  );
}
