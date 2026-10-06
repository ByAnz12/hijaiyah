// Bayangan lembut murah (lingkaran transparan) pengganti shadow map agar ringan di HP.
export function BlobShadow({ size = 0.6, opacity = 0.18, y = 0.01 }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y} scale={size}>
      <circleGeometry args={[1, 24]} />
      <meshBasicMaterial color="#1e2a3a" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}
