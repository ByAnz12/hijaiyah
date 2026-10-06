import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Object3D, Color } from 'three';
import { useGame } from '../game/store.js';

const COUNT = 60; // dibatasi agar ringan di HP
const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff8fb1'];
const dummy = new Object3D();

// Ledakan partikel saat benar / hadiah. Dipicu oleh store.confetti.t. auto=true untuk perayaan berulang.
export function Confetti({ auto = 0 }) {
  const mesh = useRef();
  const parts = useMemo(() => Array.from({ length: COUNT }, () => ({ p: [0, -99, 0], v: [0, 0, 0], r: 0, life: 0 })), []);
  const last = useRef(0);
  const autoT = useRef(0);

  const spawn = (pos) => {
    for (const q of parts) {
      q.p = [pos[0], pos[1], pos[2]];
      const a = Math.random() * Math.PI * 2;
      const sp = 1.5 + Math.random() * 2.5;
      q.v = [Math.cos(a) * sp, 3 + Math.random() * 3, Math.sin(a) * sp * 0.6];
      q.r = Math.random() * 6;
      q.life = 1.6 + Math.random() * 0.6;
    }
  };

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05);
    const c = useGame.getState().confetti;
    if (c.t !== last.current) {
      last.current = c.t;
      if (c.t) spawn(c.pos);
    }
    if (auto) {
      autoT.current -= dt;
      if (autoT.current <= 0) {
        autoT.current = auto;
        spawn([(Math.random() - 0.5) * 4, 2 + Math.random(), -1]);
      }
    }
    let alive = false;
    parts.forEach((q, i) => {
      if (q.life > 0) {
        alive = true;
        q.life -= dt;
        q.v[1] -= 7 * dt;
        q.p[0] += q.v[0] * dt; q.p[1] += q.v[1] * dt; q.p[2] += q.v[2] * dt;
        q.r += dt * 8;
      }
      dummy.position.set(q.p[0], q.p[1], q.p[2]);
      dummy.rotation.set(q.r, q.r * 0.7, 0);
      dummy.scale.setScalar(q.life > 0 ? Math.min(1, q.life) * 0.09 : 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.visible = alive;
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, COUNT]}
      onUpdate={(m) => {
        if (m.userData.colored) return;
        m.userData.colored = true;
        for (let i = 0; i < COUNT; i++) m.setColorAt(i, new Color(COLORS[i % COLORS.length]));
        m.instanceColor.needsUpdate = true;
      }}
    >
      <boxGeometry args={[1, 1.4, 0.2]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}
