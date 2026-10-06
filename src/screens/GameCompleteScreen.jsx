import { useGame } from '../game/store.js';
import { LETTERS } from '../data/letters.js';
import { GameButton } from '../components/GameButton.jsx';
import { RewardPopup } from '../components/RewardPopup.jsx';

export function GameCompleteScreen() {
  const stars = useGame((s) => s.stars);
  const coins = useGame((s) => s.coins);
  const newBadges = useGame((s) => s.newBadges);
  const go = useGame((s) => s.go);
  return (
    <div className="screen complete finale">
      <div className="panel result pop-in">
        <h1>🎉 SELAMAT!</h1>
        <p className="big-praise">Kamu sudah mengenal semua huruf Hijaiyah!</p>
        <div className="master bounce">🏆 MASTER HIJAIYAH</div>
        <ul className="result-stats">
          <li>🎯 Huruf: <b>{LETTERS.length} / {LETTERS.length}</b></li>
          <li>⭐ Bintang total: <b>{stars}</b></li>
          <li>🪙 Koin: <b>{coins}</b></li>
        </ul>
        <div className="row">
          <GameButton icon="📚" variant="blue" size="md" onClick={() => go('learn')}>BELAJAR</GameButton>
          <GameButton icon="🏠" variant="soft" size="md" onClick={() => go('home')}>KEMBALI</GameButton>
        </div>
      </div>
      <RewardPopup badgeIds={newBadges} />
    </div>
  );
}
