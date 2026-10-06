import { useGame } from '../game/store.js';
import { Stats } from './Stats.jsx';
import { AudioToggles } from './AudioController.jsx';

export function TopBar({ back = 'home', backIcon = '🏠', backLabel = 'Kembali ke menu', title, children, below }) {
  const go = useGame((s) => s.go);
  const openSettings = useGame((s) => s.openSettings);
  return (
    <header className="topbar">
      <div className="topbar-main">
        <button type="button" className="round-btn" onClick={() => go(back)} aria-label={backLabel}>{backIcon}</button>
        {title && <h2 className="topbar-title">{title}</h2>}
        <button type="button" className="round-btn gear" onClick={() => openSettings(true)} aria-label="Pengaturan">⚙️</button>
      </div>
      <div className="topbar-sub">
        {children ?? <Stats compact />}
        <AudioToggles />
      </div>
      {below}
    </header>
  );
}
