import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';

const look = new Vector3();
const want = new Vector3();

// Kamera bergerak halus ke posisi tiap layar. Di layar portrait (HP) kamera mundur agar semua muat.
export function CameraRig({ position = [0, 3, 8], target = [0, 1, 0], orbit = 0, maxZoom = 1.9 }) {
  const { camera, size } = useThree();
  useFrame((state, dt) => {
    const aspect = size.width / size.height;
    const zoom = aspect < 1 ? Math.min(maxZoom, 1 / Math.pow(aspect, 0.85)) : 1;
    const t = state.clock.elapsedTime;
    if (orbit) {
      const r = Math.hypot(position[0], position[2]) * zoom;
      const a = Math.sin(t * orbit) * 0.5;
      want.set(Math.sin(a) * r, position[1] * zoom, Math.cos(a) * r);
    } else {
      want.set(position[0] * zoom, position[1] * (zoom > 1 ? 1 + (zoom - 1) * 0.6 : 1), position[2] * zoom);
    }
    const k = Math.min(1, dt * 3);
    camera.position.lerp(want, k);
    look.lerp(want.set(...target), k);
    camera.lookAt(look);
  });
  return null;
}
