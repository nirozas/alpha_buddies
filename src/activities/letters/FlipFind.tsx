import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { Illustration } from '../../components/Illustration';

interface Card {
  id: string;
  letter: string;
  display: string;
  color: string;
  isTarget: boolean;
}

function buildCards(letter: string, mode: 'upper' | 'lower' | 'both') {
  const currentLD = LETTERS_DATA.find(l => l.letter === letter)!;
  
  const targetCount = mode === 'both' ? 4 : 3;
  const distractorCount = 12 - targetCount;

  const distractors = LETTERS_DATA
    .filter(l => l.letter !== letter)
    .sort(() => Math.random() - 0.5)
    .slice(0, distractorCount);
  
  const targets: Card[] = [];
  if (mode === 'both') {
    // 2 Capitals, 2 Small
    targets.push({ id: 'target-u1', letter: currentLD.letter, display: currentLD.uppercase, color: currentLD.color, isTarget: true });
    targets.push({ id: 'target-u2', letter: currentLD.letter, display: currentLD.uppercase, color: currentLD.color, isTarget: true });
    targets.push({ id: 'target-l1', letter: currentLD.letter, display: currentLD.lowercase, color: currentLD.color, isTarget: true });
    targets.push({ id: 'target-l2', letter: currentLD.letter, display: currentLD.lowercase, color: currentLD.color, isTarget: true });
  } else {
    // 3 of the same
    for (let i = 1; i <= 3; i++) {
      targets.push({
        id: `target-${i}`,
        letter: currentLD.letter,
        display: mode === 'upper' ? currentLD.uppercase : currentLD.lowercase,
        color: currentLD.color,
        isTarget: true
      });
    }
  }

  const cards: Card[] = [
    ...targets,
    ...distractors.map((ld, i) => ({
      id: `dist-${i}`,
      letter: ld.letter,
      display: mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : (Math.random() < 0.5 ? ld.uppercase : ld.lowercase)),
      color: ld.color,
      isTarget: false
    }))
  ].sort(() => Math.random() - 0.5);

  return cards;
}

export function FlipFind() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, progress } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase()) || LETTERS_DATA[0];

  const [mode, setMode] = useState<'upper' | 'lower' | 'both' | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  useEffect(() => {
    if (mode) {
      setCards(buildCards(ld.letter, mode));
      setFlipped([]);
    }
  }, [ld.letter, mode]);

  const checkWin = (currentFlipped: string[]) => {
    const flippedCards = cards.filter(c => currentFlipped.includes(c.id));
    const targetCount = flippedCards.filter(c => c.isTarget).length;
    const distractorCount = flippedCards.filter(c => !c.isTarget).length;

    const winCount = mode === 'both' ? 4 : 3;

    if (targetCount === winCount && distractorCount === 0) {
      playDing();
      const key = `${ld.letter}-flip-find-${mode}`;
      awardStars(key, 3);
      incrementActivity(key);

      const hasUpper = (progress.starsEarned[`${ld.letter}-flip-find-upper`] || 0) > 0 || mode === 'upper';
      const hasLower = (progress.starsEarned[`${ld.letter}-flip-find-lower`] || 0) > 0 || mode === 'lower';
      const hasBoth = (progress.starsEarned[`${ld.letter}-flip-find-both`] || 0) > 0 || mode === 'both';
      
      if (hasUpper && hasLower && hasBoth) {
        awardStars(`${ld.letter}-flip-find`, 3);
      }

      setTimeout(() => setShowCelebration(true), 600);
    }
  };

  const handleFlip = (id: string) => {
    playPop();
    const isCurrentlyFlipped = flipped.includes(id);
    let nextFlipped: string[];
    
    if (isCurrentlyFlipped) {
      nextFlipped = flipped.filter(fid => fid !== id);
    } else {
      nextFlipped = [...flipped, id];
      const card = cards.find(c => c.id === id)!;
      if (!card.isTarget) {
        speak(`Oops! That's ${card.letter}. Flip it back!`);
      } else {
        speak(card.display);
      }
    }
    
    setFlipped(nextFlipped);
    checkWin(nextFlipped);
  };

  if (!mode) {
    const getStars = (m: string) => progress.starsEarned[`${ld.letter}-flip-find-${m}`] || 0;
    const modes = [
      { id: 'upper', label: 'Find Capitals', char: ld.uppercase, color: ld.color },
      { id: 'lower', label: 'Find Small', char: ld.lowercase, color: ld.color },
      { id: 'both', label: 'Find Both', char: `${ld.uppercase}${ld.lowercase}`, color: '#f59e0b' },
    ];

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-transparent relative z-10">
        <div className="absolute top-4 left-4 z-[110]">
          <BackButton onClick={() => navigate(-1)} color={ld.color} />
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-8 flex flex-col items-center gap-6 max-w-xl w-full bg-white/95 border-4 shadow-2xl"
          style={{ borderColor: ld.color }}
        >
          <BuddyBear mood="thinking" size={100} speech={`Master all 3 modes to win full stars! 🃏`} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {modes.map((m) => {
              const stars = getStars(m.id);
              return (
                <button 
                  key={m.id}
                  onClick={() => { setMode(m.id as any); speak(`Let's find ${m.label}!`); }}
                  className="p-4 flex flex-col items-center justify-center gap-3 rounded-3xl border-4 transition-all hover:scale-105 active:scale-95 shadow-lg relative"
                  style={{ 
                    borderColor: m.color,
                    background: stars >= 3 ? '#F0FDF4' : 'white',
                    minHeight: '180px'
                  }}
                >
                  <div className="text-5xl font-black mb-1" style={{ color: m.color }}>{m.char}</div>
                  <div className="text-sm font-bold opacity-70 text-center" style={{ color: ld.color }}>{m.label}</div>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map(s => (
                      <span key={s} className="text-xl" style={{ filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>🌟</span>
                    ))}
                  </div>
                  {stars >= 3 && <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-bl-xl shadow-sm">✅</div>}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  const flippedCards = cards.filter(c => flipped.includes(c.id));
  const correctCount = flippedCards.filter(c => c.isTarget).length;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-transparent relative z-10">
      <div className="w-full flex items-center justify-between p-4 relative z-[100]">
        <BackButton onClick={() => setMode(null)} color={ld.color} />
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={correctCount} max={mode === 'both' ? 4 : 3} color={ld.color} />
          <p className="text-[10px] font-black uppercase text-center mt-1 opacity-60">Found: {correctCount}/{mode === 'both' ? 4 : 3}</p>
        </div>
        <div className="flex flex-col items-end">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Flip & Match</h2>
          <p className="text-xl font-black" style={{ color: ld.color }}>Find: {mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : `${ld.uppercase}/${ld.lowercase}`)}</p>
        </div>
      </div>

      <div className="mt-2 relative z-[100]">
        <BuddyBear mood="thinking" size={70} 
          speech={`Find ${mode === 'both' ? '4' : '3'} "${mode === 'both' ? ld.letter : (mode === 'upper' ? ld.uppercase : ld.lowercase)}" cards. If you flip a wrong one, flip it back!`} 
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id);
            return (
              <motion.div
                key={card.id}
                onClick={() => handleFlip(card.id)}
                className="aspect-[3/4] relative cursor-pointer group"
                initial={false}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                >
                  {/* Front (Hidden) */}
                  <div 
                    className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white/50"
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      background: `linear-gradient(135deg, ${ld.color}, ${ld.color}CC)`,
                    }}
                  >
                    <div className="text-4xl text-white/50 font-black">?</div>
                  </div>

                  {/* Back (Revealed) */}
                  <div 
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center shadow-xl border-4 bg-white"
                    style={{ 
                      backfaceVisibility: 'hidden', 
                      transform: 'rotateY(180deg)',
                      borderColor: card.isTarget ? '#22C55E' : '#EF4444' 
                    }}
                  >
                    <div className="text-5xl font-black" style={{ color: card.color }}>{card.display}</div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CelebrationScreen 
        active={showCelebration} 
        stars={3} 
        message="Flip Master! 🃏✨"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }}
      />

      {showFact && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
    </div>
  );
}
