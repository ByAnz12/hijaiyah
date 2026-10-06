// Kartu dunia (dipakai di Hadiahku & peta versi tanpa 3D).
export function LevelCard({ level, unlocked, stars, onClick }) {
  return (
    <button type="button" className={`level-card ${unlocked ? '' : 'locked'}`} onClick={onClick}
      aria-label={`${level.name}, ${unlocked ? `${stars} bintang` : 'terkunci'}`}
      style={{ '--accent': level.theme.ground }}>
      <span className="level-card-icon" aria-hidden>{unlocked ? level.icon : '🔒'}</span>
      <strong>{level.id}. {level.name}</strong>
      <span aria-hidden>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
    </button>
  );
}
