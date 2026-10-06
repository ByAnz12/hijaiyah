import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BlobShadow } from './BlobShadow.jsx';

const SKIN = '#ffd3ad';
const SHIRT = '#ffb703';
const PANTS = '#4f8cff';
const HAT = '#2ec4b6';

// Karakter anak low-poly dari bentuk dasar. Animasi: idle, walk, jump, wave, happy, oops, victory.
// target: posisi tujuan; moveMode 'walk' berjalan, 'jump' melompat dalam lengkung.
export function Character({ anim = 'idle', animT = 0, target = [0, 0, 0], moveMode = 'walk', scale = 1, onArrive }) {
  const root = useRef();
  const body = useRef();
  const head = useRef();
  const armL = useRef();
  const armR = useRef();
  const legL = useRef();
  const legR = useRef();
  const move = useRef({ from: null, to: null, t: 1, arrived: true });

  useFrame((state, dt) => {
    const r = root.current;
    if (!r) return;
    const t = state.clock.elapsedTime;
    const m = move.current;
    dt = Math.min(dt, 0.05);

    // --- perpindahan ---
    const [tx, ty, tz] = target;
    if (!m.to || m.to[0] !== tx || m.to[1] !== ty || m.to[2] !== tz) {
      m.from = m.to ? [r.position.x, r.position.y, r.position.z] : [tx, ty, tz];
      m.to = [tx, ty, tz];
      const dist = Math.hypot(tx - m.from[0], tz - m.from[2]);
      m.dur = moveMode === 'jump' ? 0.7 : Math.max(0.01, dist / 2.6);
      m.t = dist < 0.01 && Math.abs(ty - m.from[1]) < 0.01 ? 1 : 0;
      m.arrived = m.t >= 1;
      m.mode = moveMode;
      if (m.t >= 1) r.position.set(tx, ty, tz);
    }
    let moving = false;
    let air = 0;
    if (m.t < 1) {
      m.t = Math.min(1, m.t + dt / m.dur);
      const k = m.t;
      r.position.x = m.from[0] + (m.to[0] - m.from[0]) * k;
      r.position.z = m.from[2] + (m.to[2] - m.from[2]) * k;
      const baseY = m.from[1] + (m.to[1] - m.from[1]) * k;
      air = m.mode === 'jump' ? Math.sin(k * Math.PI) * 1.4 : 0;
      r.position.y = baseY + air;
      const dx = m.to[0] - m.from[0];
      const dz = m.to[2] - m.from[2];
      if (Math.hypot(dx, dz) > 0.01) r.rotation.y = lerpAngle(r.rotation.y, Math.atan2(dx, dz), dt * 10);
      moving = true;
      if (m.t >= 1 && !m.arrived) {
        m.arrived = true;
        onArrive?.();
      }
    } else {
      r.rotation.y = lerpAngle(r.rotation.y, 0, dt * 5); // menghadap kamera
    }

    // --- pose ---
    const since = (performance.now() - animT) / 1000;
    let bodyY = 0, headTilt = 0, aL = 0.15, aR = -0.15, aLx = 0, aRx = 0, lL = 0, lR = 0, spin = 0, squash = 1;
    const name = moving ? (m.mode === 'jump' ? 'jump' : 'walk') : anim;

    if (name === 'walk') {
      const s = Math.sin(t * 12);
      lL = s * 0.6; lR = -s * 0.6; aLx = -s * 0.6; aRx = s * 0.6; bodyY = Math.abs(s) * 0.06;
    } else if (name === 'jump') {
      aL = 2.4; aR = -2.4; lL = -0.4; lR = 0.4; squash = 1.05;
    } else if (name === 'wave') {
      aR = -2.6 + Math.sin(t * 10) * 0.35; bodyY = Math.sin(t * 2) * 0.03; headTilt = 0.1;
    } else if (name === 'happy' && since < 1.6) {
      const h = Math.abs(Math.sin(since * 7.8));
      bodyY = h * 0.45; aL = 2.6; aR = -2.6; squash = 1 + (1 - h) * 0.06; lL = -h * 0.3; lR = h * 0.3;
    } else if (name === 'oops' && since < 1.4) {
      // reaksi lembut: memiringkan kepala & menggaruk kepala, bukan sedih berlebihan
      headTilt = Math.sin(since * 4) * 0.25; aR = -2.2; aRx = -0.4 + Math.sin(since * 16) * 0.15; bodyY = -0.03;
    } else if (name === 'victory') {
      const h = Math.abs(Math.sin(t * 5));
      bodyY = h * 0.6; aL = 2.7 + Math.sin(t * 10) * 0.2; aR = -2.7 - Math.sin(t * 10) * 0.2; spin = t * 2.5;
    } else {
      // idle: bernapas & melihat sekeliling
      bodyY = Math.sin(t * 2.2) * 0.03; headTilt = Math.sin(t * 0.7) * 0.08;
      aL = 0.15 + Math.sin(t * 2.2) * 0.05; aR = -aL;
    }
    const k = Math.min(1, dt * 14);
    body.current.position.y += (bodyY - body.current.position.y) * k;
    body.current.scale.y += (squash - body.current.scale.y) * k;
    head.current.rotation.z += (headTilt - head.current.rotation.z) * k;
    armL.current.rotation.z += (aL - armL.current.rotation.z) * k;
    armR.current.rotation.z += (aR - armR.current.rotation.z) * k;
    armL.current.rotation.x += (aLx - armL.current.rotation.x) * k;
    armR.current.rotation.x += (aRx - armR.current.rotation.x) * k;
    legL.current.rotation.x += (lL - legL.current.rotation.x) * k;
    legR.current.rotation.x += (lR - legR.current.rotation.x) * k;
    if (spin) body.current.rotation.y = spin;
    else body.current.rotation.y += (0 - body.current.rotation.y) * k;
  });

  return (
    <group ref={root} scale={scale}>
      <BlobShadow size={0.45} />
      <group ref={body}>
        {/* kaki */}
        <group ref={legL} position={[-0.14, 0.42, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.09, 0.2, 4, 8]} />
            <meshStandardMaterial color={PANTS} />
          </mesh>
          <mesh position={[0, -0.36, 0.05]}>
            <sphereGeometry args={[0.11, 12, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        <group ref={legR} position={[0.14, 0.42, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <capsuleGeometry args={[0.09, 0.2, 4, 8]} />
            <meshStandardMaterial color={PANTS} />
          </mesh>
          <mesh position={[0, -0.36, 0.05]}>
            <sphereGeometry args={[0.11, 12, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
        {/* badan */}
        <mesh position={[0, 0.7, 0]}>
          <capsuleGeometry args={[0.3, 0.3, 6, 16]} />
          <meshStandardMaterial color={SHIRT} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.72, 0.29]}>
          <circleGeometry args={[0.1, 5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* lengan */}
        <group ref={armL} position={[-0.32, 0.88, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.075, 0.24, 4, 8]} />
            <meshStandardMaterial color={SHIRT} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.085, 10, 8]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        </group>
        <group ref={armR} position={[0.32, 0.88, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <capsuleGeometry args={[0.075, 0.24, 4, 8]} />
            <meshStandardMaterial color={SHIRT} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <sphereGeometry args={[0.085, 10, 8]} />
            <meshStandardMaterial color={SKIN} />
          </mesh>
        </group>
        {/* kepala */}
        <group ref={head} position={[0, 1.35, 0]}>
          <mesh>
            <sphereGeometry args={[0.42, 24, 18]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
          {/* topi */}
          <mesh position={[0, 0.12, 0]} scale={[1, 0.75, 1]}>
            <sphereGeometry args={[0.44, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color={HAT} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.08, 10, 8]} />
            <meshStandardMaterial color="#ff6b9a" />
          </mesh>
          {/* mata */}
          {[-0.14, 0.14].map((x) => (
            <group key={x} position={[x, 0.0, 0.37]}>
              <mesh scale={[1, 1.25, 0.6]}>
                <sphereGeometry args={[0.06, 12, 10]} />
                <meshStandardMaterial color="#2b2d42" roughness={0.3} />
              </mesh>
              <mesh position={[0.02, 0.03, 0.035]}>
                <sphereGeometry args={[0.018, 8, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
          {/* pipi */}
          {[-0.25, 0.25].map((x) => (
            <mesh key={x} position={[x, -0.1, 0.32]} scale={[1, 0.6, 0.4]}>
              <sphereGeometry args={[0.065, 10, 8]} />
              <meshStandardMaterial color="#ff9eb5" />
            </mesh>
          ))}
          {/* senyum */}
          <mesh position={[0, -0.13, 0.385]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.07, 0.018, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#c44569" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function lerpAngle(a, b, t) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * Math.min(1, t);
}
