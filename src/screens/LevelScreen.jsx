import { useGame } from '../game/store.js';
import { LETTER_BY_ID, letterLabel } from '../data/letters.js';
import { audio } from '../audio/AudioManager.js';
import { HUD } from '../components/HUD.jsx';
import { VoiceGuide } from '../components/VoiceGuide.jsx';
import { GameButton } from '../components/GameButton.jsx';
import { MatchBoard } from './MatchBoard.jsx';

const TITLE = {
  intro: '✨ Kenalan Huruf',
  kenali: '👀 Kenali Huruf',
  tangkap: '🫳 Tangkap Huruf',
  dengar: '👂 Dengarkan & Pilih',
  lompat: '🦘 Lompat ke Huruf',
  pasangkan: '🧩 Pasangkan',
};

// Pilihan huruf versi tombol (dipakai bila perangkat tidak mendukung WebGL).
function FallbackChoices({ round }) {
  const pick = useGame((s) => s.pick);
  const found = useGame((s) => s.found);
  return (
    <div className="fallback-choices">
      {round.options.map((o) => (
        <button key={o.key} type="button" className={`tile arabic ${found.includes(o.key) ? 'done' : ''}`}
          onClick={() => pick(o.key)} aria-label="Pilih huruf ini" disabled={found.includes(o.key)}>
          {LETTER_BY_ID[o.letterId].arabic}
        </button>
      ))}
    </div>
  );
}

export function LevelScreen() {
  const round = useGame((s) => s.round);
  const found = useGame((s) => s.found);
  const busy = useGame((s) => s.busy);
  const webgl = useGame((s) => s.webgl);
  const pick = useGame((s) => s.pick);
  const nextStep = useGame((s) => s.nextStep);
  if (!round) return null;
  const target = round.targetId && LETTER_BY_ID[round.targetId];

  let bottom = null;
  if (round.type === 'intro') {
    bottom = (
      <div className="panel intro-card fade-up" key={target.id}>
        {!webgl && <div className="big-arabic" aria-hidden>{target.arabic}</div>}
        <div className="intro-name">{target.name.toUpperCase()}</div>
        {target.note && <div className="intro-note">{target.note}</div>}
        <div className="row">
          <GameButton variant="blue" size="md" icon="🔊" onClick={() => { audio.lastSpeech.text = ''; audio.speakLetter(target); }}>Dengarkan Lagi</GameButton>
          <GameButton size="md" icon="▶" onClick={() => { audio.playSfx('pop'); nextStep(); }}>Lanjut</GameButton>
        </div>
      </div>
    );
  } else if (round.type === 'kenali') {
    bottom = (
      <div className="panel fade-up" key={target.id}>
        {!webgl && <div className="big-arabic" aria-hidden>{target.arabic}</div>}
        <div className="choices">
          {round.options.map((o) => (
            <GameButton key={o.key} variant={found.includes(o.key) ? 'green' : 'white'} size="md"
              onClick={() => pick(o.key)} disabled={busy && !found.includes(o.key)}>
              {letterLabel(LETTER_BY_ID[o.letterId])}
            </GameButton>
          ))}
        </div>
      </div>
    );
  } else if (round.type === 'dengar') {
    bottom = (
      <div className="panel slim fade-up">
        <GameButton variant="blue" icon="🔊" onClick={() => { audio.lastSpeech.text = ''; audio.speakLetter(target); }}>Dengarkan</GameButton>
        <p className="hint">Sentuh huruf yang kamu dengar</p>
        {!webgl && <FallbackChoices round={round} />}
      </div>
    );
  } else if (round.type === 'tangkap' || round.type === 'lompat') {
    bottom = (
      <div className="panel slim fade-up">
        <p className="hint big">
          {round.type === 'tangkap' ? `Tangkap huruf ${letterLabel(target)}` : `Lompat ke huruf ${letterLabel(target)}`}
          {round.type === 'tangkap' && <span className="count"> {found.length}/{round.needed}</span>}
        </p>
        {!webgl && <FallbackChoices round={round} />}
      </div>
    );
  } else if (round.type === 'pasangkan') {
    bottom = (
      <div className="panel match-panel fade-up">
        <MatchBoard round={round} />
      </div>
    );
  }

  return (
    <div className={`screen level type-${round.type}`}>
      <HUD />
      <div className="round-title" key={round.type + (round.targetId || '')}>{TITLE[round.type]}</div>
      <VoiceGuide className="guide-level" />
      <div className="level-bottom">{bottom}</div>
    </div>
  );
}
