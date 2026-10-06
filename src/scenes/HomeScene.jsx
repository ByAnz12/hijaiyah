import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from './Environment.jsx';
import { Character } from './Character.jsx';
import { Guide3D } from './Guide3D.jsx';
import { CameraRig } from './CameraRig.jsx';
import { HijaiyahLetter } from './HijaiyahLetter.jsx';
import { LEVELS } from '../data/levels.js';
import { LETTERS } from '../data/letters.js';
import { LETTER_COLORS } from '../levels/rowPositions.js';
import { useGame } from '../game/store.js';

// Cincin huruf yang mengorbit pelan di sekitar karakter.
export function LetterRing({ letters, radius = 3, y = 1.6, speed = 0.15, size = 0.8 }) {
  const g = useRef();
  useFrame((_, dt) => { g.current.rotation.y += dt * speed; });
  return (
    <group ref={g}>
      {letters.map((l, i) => {
        const a = (i / letters.length) * Math.PI * 2;
        return (
          <HijaiyahLetter key={l.id} char={l.arabic} size={size} spin={0.6}
            position={[Math.sin(a) * radius, y + Math.sin(i * 1.7) * 0.4, Math.cos(a) * radius]}
            color={LETTER_COLORS[i % LETTER_COLORS.length]} />
        );
      })}
    </group>
  );
}

export function HomeScene({ splash = false }) {
  const anim = useGame((s) => s.characterAnim);
  return (
    <>
      <CameraRig position={[0, 2.6, 7.5]} target={[0, 1.3, 0]} orbit={0.12} />
      <Environment theme={LEVELS[0].theme} seed={7} />
      <Character target={[0, 0, 0]} anim={splash ? 'wave' : anim.name === 'idle' ? 'wave' : anim.name} animT={anim.t} scale={1.25} />
      <Guide3D position={[1.4, 2.4, 0.4]} />
      <LetterRing letters={LETTERS.filter((_, i) => i % 3 === 0)} radius={3.6} y={1.5} />
    </>
  );
}
