import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { getLetterGeometry } from './letterGeometry.js';

// Huruf 3D yang bisa disentuh. wrongAt / correctAt = timestamp (performance.now) untuk animasi feedback.
export function HijaiyahLetter({
  char, color = '#ff7a59', size = 1.4, position = [0, 0, 0], onPick, label,
  spin = 0, float = true, glow = false, wrongAt = 0, correctAt = 0, dim = false, children,
}) {
  const group = useRef();
  const inner = useRef();
  const [hover, setHover] = useState(false);
  const seed = useRef(Math.random() * 10);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime + seed.current;
    const nowMs = performance.now();
    const g = inner.current;
    if (!g) return;
    g.position.y = float ? Math.sin(t * 1.6) * 0.08 : 0;
    if (spin) g.rotation.y += dt * spin;
    else g.rotation.y += (Math.sin(t * 0.8) * 0.25 - g.rotation.y) * Math.min(1, dt * 4);
    // goyang lembut saat salah
    const w = (nowMs - wrongAt) / 1000;
    g.rotation.z = w < 0.7 ? Math.sin(w * 30) * 0.25 * (1 - w / 0.7) : 0;
    // membesar sebentar saat benar / hover
    const c = (nowMs - correctAt) / 1000;
    const pop = c < 0.6 ? 1 + Math.sin((c / 0.6) * Math.PI) * 0.35 : 1;
    const target = (hover && onPick ? 1.1 : 1) * pop * (glow ? 1.12 : 1);
    const s = g.scale.x + (target - g.scale.x) * Math.min(1, dt * 10);
    g.scale.setScalar(s);
  });

  const geo = getLetterGeometry(char);
  const handlers = onPick
    ? {
        onClick: (e) => { e.stopPropagation(); onPick(); },
        onPointerOver: (e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; },
        onPointerOut: () => { setHover(false); document.body.style.cursor = ''; },
      }
    : {};

  return (
    <group ref={group} position={position} name={label}>
      <group ref={inner} {...handlers}>
        <mesh geometry={geo} scale={size}>
          <meshStandardMaterial
            color={dim ? '#b9c2cf' : color}
            roughness={0.35}
            metalness={0.05}
            emissive={glow ? '#ffd84d' : color}
            emissiveIntensity={glow ? 0.9 : 0.12}
          />
        </mesh>
        {/* area sentuh besar & tak terlihat agar mudah ditekan jari anak */}
        {onPick && (
          <mesh>
            <sphereGeometry args={[size * 0.62, 12, 12]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
        {glow && (
          <mesh scale={size * 0.75} position={[0, 0, -0.15]}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color="#fff3b0" transparent opacity={0.55} depthWrite={false} />
          </mesh>
        )}
      </group>
      {children}
    </group>
  );
}
