import { useState } from 'react';
import { useGame } from '../game/store.js';
import { audio } from '../audio/AudioManager.js';
import { GameButton } from './GameButton.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';

function Toggle({ icon, label, value, onChange }) {
  return (
    <button type="button" className={`toggle ${value ? 'on' : ''}`} onClick={() => onChange(!value)} aria-pressed={value} aria-label={`${label}: ${value ? 'nyala' : 'mati'}`}>
      <span className="toggle-icon" aria-hidden>{icon}</span>
      <span className="toggle-label">{label}</span>
      <span className="toggle-state">{value ? 'NYALA' : 'MATI'}</span>
    </button>
  );
}

export function SettingsPanel() {
  const open = useGame((st) => st.settingsOpen);
  return open ? <Panel /> : null;
}

function Panel() {
  const s = useGame();
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-label="Pengaturan">
      <div className="modal settings pop-in">
        <h2>⚙️ Pengaturan</h2>
        <Toggle icon="🎵" label="Musik" value={s.musicEnabled} onChange={(v) => s.setSetting('musicEnabled', v)} />
        <Toggle icon="🗣️" label="Suara Guide" value={s.soundEnabled} onChange={(v) => s.setSetting('soundEnabled', v)} />
        <Toggle icon="🔔" label="Efek Suara" value={s.sfxEnabled} onChange={(v) => s.setSetting('sfxEnabled', v)} />
        <label className="slider">
          <span>🎵 Volume Musik</span>
          <input type="range" min="0" max="1" step="0.05" value={s.musicVolume} onChange={(e) => s.setSetting('musicVolume', +e.target.value)} />
        </label>
        <label className="slider">
          <span>🔔 Volume Efek</span>
          <input type="range" min="0" max="1" step="0.05" value={s.sfxVolume}
            onChange={(e) => s.setSetting('sfxVolume', +e.target.value)} onPointerUp={() => audio.playSfx('correct')} />
        </label>
        {!audio.speechSupported && <p className="note">Browser ini belum mendukung suara guide. Teks tetap ditampilkan.</p>}
        <div className="row">
          <GameButton variant="danger" size="md" icon="🔁" onClick={() => setConfirm(true)}>Mulai Lagi</GameButton>
          <GameButton variant="primary" size="md" icon="✔️" onClick={() => s.openSettings(false)}>Selesai</GameButton>
        </div>
      </div>
      {confirm && (
        <ConfirmDialog
          icon="⚠️"
          title="Hapus semua progress?"
          text="Bintang, koin, huruf, dan badge akan kembali ke awal."
          yes="Ya, Hapus"
          no="Tidak"
          onYes={() => { setConfirm(false); s.resetProgress(); }}
          onNo={() => setConfirm(false)}
        />
      )}
    </div>
  );
}
