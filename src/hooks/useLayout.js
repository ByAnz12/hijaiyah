import { useThree } from '@react-three/fiber';

// Posisi elemen 3D yang menyesuaikan orientasi layar (portrait HP vs landscape).
export function useLayout() {
  const { size } = useThree();
  const portrait = size.width / size.height < 0.9;
  return {
    portrait,
    spread: portrait ? 2.0 : 2.6, // jarak antar pilihan huruf
    character: portrait ? [0, 0, 4.2] : [-3.6, 0, 1.2],
    guide: portrait ? [1.8, 3.6, 1.6] : [-3.9, 3.0, 0.4],
    arenaWidth: portrait ? 2.2 : 4.2,
  };
}
