import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Pairs for matching: Aa, Bb etc. — take 6 random pairs
function buildCards(seed: string) {
  const picked = LETTERS_DATA.sort(() => Math.random() - 0.5).slice(0, 6);
  const cards = picked.flatMap(ld => [
    { id: `${ld.letter}-upper`, letter: ld.letter, display: ld.uppercase, isUpper: true, color: ld.color },
    { id: `${ld.letter}-lower`, letter: ld.letter, display: ld.lowercase, isUpper: false, color: ld.color },
  ]).sort(() => Math.random() - 0.5);
  return cards;
}

export function FlipFind() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [cards] = useState(() => buildCards(ld.letter));
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [disabled, setDisabled] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const handleFlip = (id: string) => {
    if (disabled || flipped.includes(id) || matched.some(m => id.startsWith(m.split('-')[0]))) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      const [a, b] = newFlipped;
      const letterA = a.split('-')[0];
      const letterB = b.split('-')[0];
      if (letterA === letterB && a !== b) {
        // Match!
        const newMatched = [...matched, letterA];
        setMatched(newMatched);
        setFlipped([]);
        setDisabled(false);
        if (newMatched.length === cards.length / 2) {
          const stars: 1|2|3 = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
          awardStars(`${ld.letter}-flip-find`, stars);
          incrementActivity(`${ld.letter}-flip-find`);
          setTimeout(() => setShowCelebration(true), 500);
        }
      } else {
        setMistakes(m => m + 1);
        setTimeout(() => { setFlipped([]); setDisabled(false); }, 900);
      }
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Flip &amp; Find</h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color }}>
          {matched.length}/{cards.length / 2} ⭐
        </span>
      </div>

      <BuddyBear mood="thinking" size={80}
        speech="Match the uppercase and lowercase letters! Flip two cards to find a pair! 🃏"
      />

      <div className="grid grid-cols-4 gap-3 px-4 mt-3 w-full max-w-sm">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id);
          const isMatched = matched.includes(card.letter);
          return (
            <motion.div
              key={card.id}
              onClick={() => handleFlip(card.id)}
              className="flip-card aspect-square cursor-pointer"
              style={{ height: 70 }}
              animate={isMatched ? { y: -60, opacity: 0, scale: 0.5 } : {}}
              transition={isMatched ? { type: 'spring', stiffness: 200 } : {}}
            >
              <div className={`flip-card-inner ${isFlipped || isMatched ? 'flipped' : ''}`}
                style={{ width: '100%', height: '100%', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                <div className="flip-card-front" style={{ background: ld.color }}>
                  <span style={{ fontSize: '2rem' }}>🌟</span>
                </div>
                <div className="flip-card-back" style={{ background: 'white', border: `3px solid ${card.color}` }}>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: card.color }}>
                    {card.display}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-6">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1}
        message="Perfect Pairs! 🃏✨"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
