import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGame } from '../game/store.js';

// Kak Pipo, burung hantu kecil pemandu. Mengepak & memantul saat sedang berbicara.
export function Guide3D({ position = [1.3, 1.9, 0.3], scale = 0.8 }) {
  const root = useRef();
  const wingL = useRef();
  const wingR = useRef();
  const lastKey = useRef(0);
  const talkStart = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const key = useGame.getState().guideKey;
    if (key !== lastKey.current) {
      lastKey.current = key;
      talkStart.current = t;
    }
    const talking = t - talkStart.current < 2;
    const r = root.current;
    r.position.y = position[1] + Math.sin(t * 2) * 0.12 + (talking ? Math.abs(Math.sin(t * 9)) * 0.08 : 0);
    r.rotation.y = Math.sin(t * 0.8) * 0.3 - 0.3;
    const flap = Math.sin(t * (talking ? 18 : 6)) * (talking ? 0.6 : 0.25);
    wingL.current.rotation.z = 0.4 + flap;
    wingR.current.rotation.z = -0.4 - flap;
  });

  return (
    <group ref={root} position={position} scale={scale}>
      <mesh scale={[1, 1.05, 0.9]}>
        <sphereGeometry args={[0.32, 20, 16]} />
        <meshStandardMaterial color="#a77bff" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.06, 0.2]} scale={[1, 1.1, 0.5]}>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#f3e8ff" />
      </mesh>
      {[-0.12, 0.12].map((x) => (
        <group key={x} position={[x, 0.1, 0.25]}>
          <mesh scale={[1, 1, 0.5]}>
            <sphereGeometry args={[0.1, 16, 12]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.05, 12, 8]} />
            <meshStandardMaterial color="#2b2d42" />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.045, 0.1, 8]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>
      {[-0.17, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.32, 0]} rotation={[0, 0, x > 0 ? -0.4 : 0.4]}>
          <coneGeometry args={[0.07, 0.16, 6]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      ))}
      <group ref={wingL} position={[-0.3, 0, 0]}>
        <mesh position={[-0.05, -0.1, 0]} scale={[0.4, 1, 0.6]}>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>
      <group ref={wingR} position={[0.3, 0, 0]}>
        <mesh position={[0.05, -0.1, 0]} scale={[0.4, 1, 0.6]}>
          <sphereGeometry args={[0.2, 12, 10]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>
    </group>
  );
}
