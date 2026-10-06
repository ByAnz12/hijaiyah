import { GameButton } from './GameButton.jsx';

export function ConfirmDialog({ icon = '❓', title, text, yes, no, onYes, onNo }) {
  return (
    <div className="modal-back" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal pop-in">
        <div className="modal-icon" aria-hidden>{icon}</div>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
        <div className="row">
          <GameButton variant="danger" size="md" onClick={onYes}>{yes}</GameButton>
          <GameButton variant="soft" size="md" onClick={onNo}>{no}</GameButton>
        </div>
      </div>
    </div>
  );
}
