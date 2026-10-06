import { useEffect, useReducer } from 'react';
import { useGame } from '../game/store.js';
import { audio } from '../audio/AudioManager.js';

// Tombol 🎵 musik & 🔊 suara guide, plus "Nyalakan Suara" bila browser masih menahan audio.
export function AudioToggles() {
  const [, rerender] = useReducer((x) => x + 1, 0);
  const music = useGame((s) => s.musicEnabled);
  const voice = useGame((s) => s.soundEnabled);
  const setSetting = useGame((s) => s.setSetting);
  useEffect(() => audio.onChange(rerender), []);
  return (
    <>
      {audio.locked && (
        <button type="button" className="gbtn gbtn-primary gbtn-md unlock-btn" onClick={() => { audio.unlock(); audio.playMusic(); }}>
          🔊 Nyalakan Suara
        </button>
      )}
      <button type="button" className={`round-btn ${music ? '' : 'off'}`} onClick={() => setSetting('musicEnabled', !music)}
        aria-label={music ? 'Matikan musik' : 'Nyalakan musik'} aria-pressed={music}>
        🎵{!music && <span className="slash" aria-hidden />}
      </button>
      <button type="button" className={`round-btn ${voice ? '' : 'off'}`} onClick={() => setSetting('soundEnabled', !voice)}
        aria-label={voice ? 'Matikan suara guide' : 'Nyalakan suara guide'} aria-pressed={voice}>
        {voice ? '🔊' : '🔇'}
      </button>
    </>
  );
}

// Versi melayang untuk layar tanpa TopBar (menu utama & layar hasil).
export function AudioController() {
  const screen = useGame((s) => s.currentScreen);
  if (!['home', 'levelComplete', 'gameComplete'].includes(screen)) return null;
  return (
    <div className="audio-ctl">
      <AudioToggles />
    </div>
  );
}
