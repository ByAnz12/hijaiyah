import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { seeded } from '../utils/random.js';

// Lingkungan 3D per dunia dari bentuk low-poly sederhana. Dekorasi diletakkan melingkar
// di luar area bermain supaya tidak menghalangi huruf.

function Tree({ color = '#5cc46a' }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.8, 6]} />
        <meshStandardMaterial color="#9c6b43" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
function Pine() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 6]} />
        <meshStandardMaterial color="#8a5a3b" />
      </mesh>
      <mesh position={[0, 0.9, 0]}><coneGeometry args={[0.6, 0.9, 7]} /><meshStandardMaterial color="#2f9e5b" flatShading /></mesh>
      <mesh position={[0, 1.4, 0]}><coneGeometry args={[0.45, 0.75, 7]} /><meshStandardMaterial color="#38b26a" flatShading /></mesh>
    </group>
  );
}
function Flower({ color }) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3, 4]} /><meshStandardMaterial color="#3a9d4f" /></mesh>
      <mesh position={[0, 0.32, 0]}><sphereGeometry args={[0.1, 8, 6]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.32, 0.05]}><sphereGeometry args={[0.04, 6, 4]} /><meshStandardMaterial color="#ffe066" /></mesh>
    </group>
  );
}
function Mushroom() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}><cylinderGeometry args={[0.07, 0.09, 0.3, 8]} /><meshStandardMaterial color="#fff4e0" /></mesh>
      <mesh position={[0, 0.3, 0]}><sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#ff6b6b" /></mesh>
    </group>
  );
}
function Cactus() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]}><capsuleGeometry args={[0.16, 0.8, 4, 8]} /><meshStandardMaterial color="#4caf72" /></mesh>
      <mesh position={[0.25, 0.65, 0]} rotation={[0, 0, -0.9]}><capsuleGeometry args={[0.09, 0.25, 4, 8]} /><meshStandardMaterial color="#4caf72" /></mesh>
      <mesh position={[-0.22, 0.85, 0]} rotation={[0, 0, 0.9]}><capsuleGeometry args={[0.08, 0.2, 4, 8]} /><meshStandardMaterial color="#4caf72" /></mesh>
    </group>
  );
}
function Rock({ color = '#c9b8a6' }) {
  return <mesh position={[0, 0.2, 0]} scale={[1, 0.7, 1]}><dodecahedronGeometry args={[0.35, 0]} /><meshStandardMaterial color={color} flatShading /></mesh>;
}
function Mountain() {
  return (
    <group>
      <mesh position={[0, 1.2, 0]}><coneGeometry args={[1.6, 2.4, 6]} /><meshStandardMaterial color="#8fa8c8" flatShading /></mesh>
      <mesh position={[0, 2.05, 0]}><coneGeometry args={[0.62, 0.7, 6]} /><meshStandardMaterial color="#ffffff" flatShading /></mesh>
    </group>
  );
}
function House({ color }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.9, 0.8, 0.8]} /><meshStandardMaterial color="#fff6e5" /></mesh>
      <mesh position={[0, 1.05, 0]} rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[0.8, 0.6, 4]} /><meshStandardMaterial color={color} flatShading /></mesh>
      <mesh position={[0, 0.25, 0.41]}><boxGeometry args={[0.24, 0.42, 0.02]} /><meshStandardMaterial color="#b5835a" /></mesh>
    </group>
  );
}
function Palm() {
  return (
    <group>
      <mesh position={[0.1, 0.7, 0]} rotation={[0, 0, -0.12]}><cylinderGeometry args={[0.07, 0.12, 1.4, 6]} /><meshStandardMaterial color="#b5835a" /></mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0.18, 1.42, 0]} rotation={[0, (i / 5) * Math.PI * 2, 0.9]}>
          <coneGeometry args={[0.12, 0.9, 4]} />
          <meshStandardMaterial color="#3fbf6a" flatShading />
        </mesh>
      ))}
    </group>
  );
}

const DECO = {
  garden: (r, i) => (i % 3 === 0 ? <Tree /> : <Flower color={['#ff8fb1', '#ffd166', '#a78bfa', '#ff7b54'][i % 4]} />),
  forest: (r, i) => (i % 4 === 3 ? <Mushroom /> : i % 2 ? <Pine /> : <Tree color="#45b05b" />),
  desert: (r, i) => (i % 3 === 0 ? <Cactus /> : <Rock color="#e0b37a" />),
  mountain: (r, i) => (i % 3 === 0 ? <Mountain /> : i % 3 === 1 ? <Pine /> : <Rock color="#b8c4d6" />),
  village: (r, i) => (i % 3 === 0 ? <House color={['#ff7b54', '#4f8cff', '#ff8fb1'][(i / 3) % 3]} /> : i % 3 === 1 ? <Tree /> : <Flower color="#ffd166" />),
  island: (r, i) => (i % 2 === 0 ? <Palm /> : <Rock color="#d9c8a9" />),
};

function Clouds() {
  const g = useRef();
  useFrame((_, dt) => { g.current.rotation.y += dt * 0.02; });
  return (
    <group ref={g}>
      {[[-8, 6, -14], [7, 7, -16], [0, 8, -20], [12, 6, -8], [-13, 7, -6]].map((p, i) => (
        <group key={i} position={p}>
          <mesh><sphereGeometry args={[1, 10, 8]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[0.9, -0.2, 0]}><sphereGeometry args={[0.75, 10, 8]} /><meshStandardMaterial color="#ffffff" /></mesh>
          <mesh position={[-0.9, -0.25, 0]}><sphereGeometry args={[0.7, 10, 8]} /><meshStandardMaterial color="#ffffff" /></mesh>
        </group>
      ))}
    </group>
  );
}

export function Environment({ theme, seed = 1, count = 22 }) {
  const items = useMemo(() => {
    const rnd = seeded(seed * 9973);
    return Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2 + rnd() * 0.25;
      const radius = 6 + rnd() * 6;
      // sisakan ruang di depan kamera (arah +z) supaya tidak menutupi pandangan
      const x = Math.sin(a) * radius;
      let z = -Math.abs(Math.cos(a)) * radius - 1.5;
      if (Math.abs(x) > 6.5) z = Math.cos(a) * radius * 0.6;
      return { pos: [x, 0, z], s: 0.8 + rnd() * 0.6, rot: rnd() * 6, i };
    });
  }, [seed, count]);

  const island = theme.deco === 'island';
  return (
    <group>
      <color attach="background" args={[theme.sky]} />
      <fog attach="fog" args={[theme.fog, 18, 42]} />
      <hemisphereLight args={['#ffffff', theme.ground, 1.1]} />
      <directionalLight position={[5, 10, 6]} intensity={1.4} />
      {island && (
        <mesh rotation-x={-Math.PI / 2} position-y={-0.15}>
          <circleGeometry args={[60, 32]} />
          <meshStandardMaterial color="#5ec8f2" roughness={0.3} />
        </mesh>
      )}
      <mesh rotation-x={-Math.PI / 2} position-y={0}>
        <circleGeometry args={[island ? 16 : 60, 40]} />
        <meshStandardMaterial color={theme.ground} roughness={0.9} />
      </mesh>
      {/* jalur lembut di tengah area bermain */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <circleGeometry args={[4.2, 40]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      {items.map((it) => (
        <group key={it.i} position={it.pos} scale={it.s} rotation-y={it.rot}>
          {DECO[theme.deco](it, it.i)}
        </group>
      ))}
      <Clouds />
    </group>
  );
}

export { Tree, Pine, Cactus, Mountain, House, Palm, Rock, Flower };
