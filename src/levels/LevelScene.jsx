import { Environment } from '../scenes/Environment.jsx';
import { Character } from '../scenes/Character.jsx';
import { Guide3D } from '../scenes/Guide3D.jsx';
import { CameraRig } from '../scenes/CameraRig.jsx';
import { HijaiyahLetter } from '../scenes/HijaiyahLetter.jsx';
import { LEVEL_BY_ID } from '../data/levels.js';
import { LETTER_BY_ID } from '../data/letters.js';
import { useGame } from '../game/store.js';
import { useLayout } from '../hooks/useLayout.js';
import { BigLetterScene } from './IntroScene.jsx';
import { TangkapScene } from './TangkapScene.jsx';
import { PodiumChoices } from './DengarScene.jsx';
import { LompatScene } from './LompatScene.jsx';
import { rowX, LETTER_COLORS } from './rowPositions.js';

// Satu scene untuk semua mini game; isi tengah ditentukan oleh round.type dari data.
export function LevelScene({ celebrate = false }) {
  const levelId = useGame((s) => s.currentLevel) || 1;
  const round = useGame((s) => s.round);
  const anim = useGame((s) => s.characterAnim);
  const layout = useLayout();
  const level = LEVEL_BY_ID[levelId];
  const type = round?.type;

  let content = null;
  if (type === 'intro') content = <BigLetterScene round={round} spin={0.7} />;
  else if (type === 'kenali') content = <BigLetterScene round={round} />;
  else if (type === 'tangkap') content = <TangkapScene round={round} />;
  else if (type === 'dengar') content = <PodiumChoices round={round} />;
  else if (type === 'lompat') content = <LompatScene round={round} />;
  else if (type === 'pasangkan' || celebrate) {
    const xs = rowX(level.letters.length, layout.portrait ? 1.1 : 1.6);
    content = level.letters.map((id, i) => (
      <HijaiyahLetter key={id} char={LETTER_BY_ID[id].arabic} size={0.8} spin={0.8}
        position={[xs[i], celebrate ? 2.6 : 3.4, -2.5]} color={LETTER_COLORS[i % LETTER_COLORS.length]} glow={celebrate} />
    ));
  }

  const charPos = celebrate ? [0, 0, 1.2] : layout.character;
  return (
    <>
      <CameraRig position={[0, 3.2, 8.5]} target={[0, 1.4, 0]} maxZoom={1.6} />
      <Environment theme={level.theme} seed={level.id} />
      {type !== 'lompat' && (
        <Character target={charPos} anim={celebrate ? 'victory' : anim.name} animT={anim.t} scale={celebrate ? 1.2 : 0.9} />
      )}
      <Guide3D position={layout.guide} scale={0.75} />
      {content}
    </>
  );
}
