import { useRef, useState } from 'react';
import { useGame } from '../game/store.js';
import { LETTER_BY_ID } from '../data/letters.js';
import { audio } from '../audio/AudioManager.js';

// Mini game 3 — Pasangkan. Seret huruf ke namanya (mouse & sentuh lewat Pointer Events),
// atau ketuk huruf lalu ketuk namanya. Mengetuk nama tanpa huruf terpilih membacakan nama itu.
export function MatchBoard({ round }) {
  const found = useGame((s) => s.found);
  const pick = useGame((s) => s.pick);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null); // { id, x, y }
  const [shake, setShake] = useState(null); // { letter, name } yang sedang bergoyang
  const start = useRef(null);
  const names = round.names;

  const attempt = (letterId, nameId) => {
    const res = pick(letterId, nameId);
    setSelected(null);
    if (res === 'wrong') {
      setShake({ letter: letterId, name: nameId });
      setTimeout(() => setShake(null), 600);
    }
  };

  const onDown = (e, id) => {
    if (found.includes(id)) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY, id, moved: false };
  };
  const onMove = (e) => {
    const s = start.current;
    if (!s) return;
    if (!s.moved && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 8) s.moved = true;
    if (s.moved) setDrag({ id: s.id, x: e.clientX, y: e.clientY });
  };
  const onUp = (e) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    if (!s.moved) {
      audio.playSfx('tap');
      setSelected((cur) => (cur === s.id ? null : s.id));
      return;
    }
    setDrag(null);
    const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-name-id]');
    if (el) attempt(s.id, el.dataset.nameId);
  };

  const onName = (nameId) => {
    if (found.includes(nameId)) return;
    if (selected) attempt(selected, nameId);
    else audio.speakLetter(LETTER_BY_ID[nameId]);
  };

  return (
    <div className="match">
      <div className="match-col">
        {round.options.map((o) => {
          const l = LETTER_BY_ID[o.letterId];
          const done = found.includes(o.key);
          return (
            <button
              type="button"
              key={o.key}
              className={`tile arabic ${done ? 'done' : ''} ${selected === o.key ? 'selected' : ''} ${drag?.id === o.key ? 'dragging' : ''} ${shake?.letter === o.key ? 'shake' : ''}`}
              onPointerDown={(e) => onDown(e, o.key)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={() => { start.current = null; setDrag(null); }}
              aria-label={done ? `Huruf ${l.name}, sudah dipasangkan` : `Huruf Hijaiyah${selected === o.key ? ', terpilih' : ''}`}
              aria-pressed={selected === o.key}
            >
              {l.arabic}
              {done && <span className="tick" aria-hidden>✓</span>}
            </button>
          );
        })}
      </div>
      <div className="match-col">
        {names.map((id) => {
          const l = LETTER_BY_ID[id];
          const done = found.includes(id);
          return (
            <button
              type="button"
              key={id}
              data-name-id={id}
              className={`tile name ${done ? 'done' : ''} ${selected && !done ? 'target' : ''} ${shake?.name === id ? 'shake' : ''}`}
              onClick={() => onName(id)}
              aria-label={done ? `${l.name}, sudah benar` : `Nama ${l.name}`}
            >
              {done && <span className="mini-arabic" aria-hidden>{l.arabic}</span>}
              {l.note ? `${l.name} (${l.note})` : l.name}
              {done && <span className="tick" aria-hidden>✓</span>}
            </button>
          );
        })}
      </div>
      {drag && (
        <div className="tile arabic ghost" style={{ left: drag.x, top: drag.y }} aria-hidden>
          {LETTER_BY_ID[round.options.find((o) => o.key === drag.id).letterId].arabic}
        </div>
      )}
    </div>
  );
}
