import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Environment, Tree, Pine, Cactus, Mountain, House, Palm } from './Environment.jsx';
import { Character } from './Character.jsx';
import { Guide3D } from './Guide3D.jsx';
import { CameraRig } from './CameraRig.jsx';
import { BlobShadow } from './BlobShadow.jsx';
import { LEVELS } from '../data/levels.js';
import { useGame } from '../game/store.js';
import { audio } from '../audio/AudioManager.js';

const ICON_MODEL = { garden: Tree, forest: Pine, desert: Cactus, mountain: Mountain, village: House, island: Palm };
export const padPosition = (i) => [i % 2 ? 1.4 : -1.4, 0, 3 - i * 2.7];

function Padlock() {
  return (
    <group position={[0, 1.0, 0.2]} scale={0.6}>
      <mesh position={[0, 0.45, 0]}><torusGeometry args={[0.28, 0.08, 8, 16, Math.PI]} /><meshStandardMaterial color="#8a94a6" /></mesh>
      <mesh><boxGeometry args={[0.8, 0.65, 0.3]} /><meshStandardMaterial color="#ffc94d" /></mesh>
      <mesh position={[0, 0, 0.16]}><circleGeometry args={[0.09, 12]} /><meshStandardMaterial color="#6b4f1d" /></mesh>
    </group>
  );
}

function Pad({ level, index, unlocked, stars, fresh, onPick }) {
  const g = useRef();
  const born = useRef(fresh ? performance.now() : 0);
  const [hover, setHover] = useState(false);
  const Model = ICON_MODEL[level.theme.deco];
  useFrame((state) => {
    const t = (performance.now() - born.current) / 1000;
    // animasi area baru terbuka: muncul memantul
    const s = born.current && t < 1.2 ? Math.max(0.01, 1 + Math.sin(t * 9) * Math.exp(-t * 4) * 0.6 - Math.max(0, 0.3 - t) * 3) : 1;
    g.current.scale.setScalar(s * (hover && unlocked ? 1.06 : 1));
    g.current.position.y = unlocked ? Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.05 : 0;
  });
  return (
    <group position={padPosition(index)}>
      <group
        ref={g}
        onClick={(e) => { e.stopPropagation(); onPick(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = ''; }}
      >
        <BlobShadow size={1.3} />
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[1.15, 1.25, 0.4, 28]} />
          <meshStandardMaterial color={unlocked ? level.theme.ground : '#cfd5de'} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.41, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 0.02, 28]} />
          <meshStandardMaterial color={unlocked ? level.theme.accent : '#e3e7ed'} transparent opacity={0.5} />
        </mesh>
        <group position={[0.55, 0.4, -0.35]} scale={0.55}>
          <Model />
        </group>
        {!unlocked && <Padlock />}
      </group>
      <Html position={[0, 2.0, 0]} center zIndexRange={[20, 0]}>
        <button
          className={`map-label ${unlocked ? '' : 'locked'}`}
          onClick={onPick}
          aria-label={`${level.name}${unlocked ? '' : ' (terkunci)'}`}
        >
          <span className="map-label-icon" aria-hidden>{unlocked ? level.icon : '🔒'}</span>
          <span>{level.id}. {level.name}</span>
          {unlocked && <span className="map-label-stars" aria-label={`${stars} bintang`}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>}
        </button>
      </Html>
    </group>
  );
}

export function WorldMap() {
  const completedLevels = useGame((s) => s.completedLevels);
  const levelStars = useGame((s) => s.levelStars);
  const justUnlocked = useGame((s) => s.justUnlocked);
  const startLevel = useGame((s) => s.startLevel);
  const isUnlocked = useGame((s) => s.isUnlocked);
  const burst = useGame((s) => s.burst);
  const say = useGame((s) => s.say);
  const clearJustUnlocked = useGame((s) => s.clearJustUnlocked);
  const highest = LEVELS.filter((l) => l.id === 1 || completedLevels.includes(l.id - 1)).length - 1;
  const [charAt, setCharAt] = useState(highest);
  const [going, setGoing] = useState(null);

  useEffect(() => {
    if (!justUnlocked) return undefined;
    const id = setTimeout(() => {
      const p = padPosition(justUnlocked - 1);
      burst([p[0], 1, p[2]]);
      audio.playSfx('unlock');
      say(`Hore! ${LEVELS[justUnlocked - 1].name} sudah terbuka!`);
      clearJustUnlocked();
    }, 600);
    return () => clearTimeout(id);
  }, [justUnlocked, burst, say, clearJustUnlocked]);

  const onPick = (level, i) => {
    if (going) return;
    if (!isUnlocked(level.id)) {
      startLevel(level.id); // memutar pesan "terkunci"
      return;
    }
    setGoing(level.id);
    if (i === charAt) {
      setTimeout(() => startLevel(level.id), 200);
      return;
    }
    audio.playSfx('jump');
    setCharAt(i);
  };

  const p = padPosition(charAt);
  return (
    <>
      <CameraRig position={[0, 12, 9.5]} target={[0, 0, -3]} maxZoom={1.3} />
      <Environment theme={{ ...LEVELS[0].theme, sky: '#bfe8ff' }} seed={21} count={26} />
      {/* jalan setapak */}
      {LEVELS.slice(0, -1).map((_, i) =>
        [0.25, 0.5, 0.75].map((f) => {
          const a = padPosition(i);
          const b = padPosition(i + 1);
          return (
            <mesh key={`${i}-${f}`} position={[a[0] + (b[0] - a[0]) * f, 0.03, a[2] + (b[2] - a[2]) * f]} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.18, 12]} />
              <meshStandardMaterial color="#fff6dc" />
            </mesh>
          );
        }),
      )}
      {LEVELS.map((level, i) => (
        <Pad
          key={level.id}
          level={level}
          index={i}
          unlocked={isUnlocked(level.id)}
          stars={levelStars[level.id] || 0}
          fresh={justUnlocked === level.id}
          onPick={() => onPick(level, i)}
        />
      ))}
      <Character
        target={[p[0], 0.42, p[2] + 0.2]}
        moveMode="jump"
        anim="idle"
        scale={0.7}
        onArrive={() => going && setTimeout(() => startLevel(going), 250)}
      />
      <Guide3D position={[-3.4, 2.2, 2.6]} scale={0.8} />
    </>
  );
}
