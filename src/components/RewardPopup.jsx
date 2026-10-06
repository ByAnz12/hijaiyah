import { useState } from 'react';
import { BADGES } from '../data/badges.js';
import { GameButton } from './GameButton.jsx';

// Muncul saat anak mendapat badge baru.
export function RewardPopup({ badgeIds }) {
  const [open, setOpen] = useState(true);
  if (!open || !badgeIds?.length) return null;
  const badges = BADGES.filter((b) => badgeIds.includes(b.id));
  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-label="Badge baru">
      <div className="modal reward pop-in">
        <div className="rays" aria-hidden />
        <h2>🏅 Badge Baru!</h2>
        <div className="badge-row">
          {badges.map((b) => (
            <div key={b.id} className="badge got bounce">
              <span className="badge-icon" aria-hidden>{b.icon}</span>
              <strong>{b.name}</strong>
            </div>
          ))}
        </div>
        <GameButton icon="👍" onClick={() => setOpen(false)}>Asyik!</GameButton>
      </div>
    </div>
  );
}
