import { useGame } from '../game/store.js';
import { LETTERS, LETTER_BY_ID } from '../data/letters.js';
import { audio } from '../audio/AudioManager.js';
import { TopBar } from '../components/TopBar.jsx';
import { GameButton } from '../components/GameButton.jsx';

export function LearnScreen() {
  const id = useGame((s) => s.learnLetter);
  const learn = useGame((s) => s.learn);
  const done = useGame((s) => s.completedLetters);
  const webgl = useGame((s) => s.webgl);
  const letter = LETTER_BY_ID[id];
  return (
    <div className="screen learn">
      <TopBar title="📚 Belajar Huruf" />
      <div className="learn-name fade-up" key={id}>
        {!webgl && <div className="big-arabic" aria-hidden>{letter.arabic}</div>}
        <div className="intro-name">{letter.name.toUpperCase()}</div>
        {letter.note && <div className="intro-note">{letter.note}</div>}
        <GameButton variant="blue" size="md" icon="🔊" onClick={() => { audio.lastSpeech.text = ''; audio.speakLetter(letter); }}>Dengarkan Lagi</GameButton>
      </div>
      <div className="card-grid" role="list">
        {LETTERS.map((l) => (
          <button key={l.id} type="button" role="listitem" className={`card3d ${l.id === id ? 'active' : ''}`} onClick={() => learn(l.id)}
            aria-label={`${l.name}${l.note ? ` (${l.note})` : ''}${done.includes(l.id) ? ', sudah dipelajari' : ''}`}>
            <span className="card3d-arabic" aria-hidden>{l.arabic}</span>
            <span className="card3d-name">{l.name}</span>
            {done.includes(l.id) && <span className="card3d-done" aria-hidden>✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
