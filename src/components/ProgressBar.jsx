export function ProgressBar({ value, max, label, color = 'var(--green)' }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="pbar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="pbar-fill" style={{ width: `${pct}%`, background: color }} />
      <span className="pbar-text">{label}: {value} / {max}</span>
    </div>
  );
}
