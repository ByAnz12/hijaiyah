import { useGame } from '../game/store.js';
import { audio } from '../audio/AudioManager.js';

// Gelembung bicara Kak Pipo. Ketuk untuk mendengar ulang.
export function VoiceGuide({ className = '' }) {
  const text = useGame((s) => s.guideText);
  const key = useGame((s) => s.guideKey);
  if (!text) return null;
  const replay = () => {
    audio.lastSpeech.text = '';
    audio.speak(text);
  };
  return (
    <button type="button" className={`guide ${className}`} onClick={replay} aria-label={`Kak Pipo berkata: ${text}. Ketuk untuk dengar lagi`}>
      <span className="guide-avatar" aria-hidden>🦉</span>
      <span key={key} className="guide-bubble">{text}</span>
    </button>
  );
}
