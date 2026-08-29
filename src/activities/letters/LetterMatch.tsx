import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

type GameMode = 'image-word' | 'image-only';

export function LetterMatch() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<GameMode>('image-word');
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  
  const ROUNDS = 5;
  const OPTIONS_COUNT = 6;

  const buildRoundOptions = () => {
    // Correct option: random object from target letter
    const correctObj = ld.objects[Math.floor(Math.random() * ld.objects.length)];
    
    // 5 Incorrect options: random objects from other letters
    const otherLetters = LETTERS_DATA.filter(l => l.letter !== ld.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, OPTIONS_COUNT - 1);
    
    const incorrectOptions = otherLetters.map(l => {
      const obj = l.objects[Math.floor(Math.random() * l.objects.length)];
      return { ...obj, letter: l.letter, isCorrect: false };
    });

    const all = [
      { ...correctObj, letter: ld.letter, isCorrect: true },
      ...incorrectOptions
    ].sort(() => Math.random() - 0.5);

    return all;
  };

  const roundsData = useMemo(() => {
    return Array.from({ length: ROUNDS }, buildRoundOptions);
  }, [ld]);

  const currentOptions = roundsData[round];

  const handleTap = (idx: number, opt: typeof currentOptions[0]) => {
    if (selected !== null) return;
    
    setSelected(idx);
    if (opt.isCorrect) {
      setScore(s => s + 1);
      setTimeout(() => {
        if (round + 1 < ROUNDS) {
          setRound(r => r + 1);
          setSelected(null);
        } else {
          const stars: 1|2|3 = score + 1 >= 4 ? 3 : score + 1 >= 2 ? 2 : 1;
          awardStars(`${ld.letter}-letter-match`, stars);
          incrementActivity(`${ld.letter}-letter-match`);
          setShowCelebration(true);
        }
      }, 1000);
    } else {
      setShake(idx);
      setTimeout(() => {
        setShake(null);
        setSelected(null);
      }, 600);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-10 relative z-10 bg-transparent">
      <div className="w-full flex items-center justify-between p-4 mb-2">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.4rem', color: ld.color }}>Letter Match</h2>
        <div style={{ width: 48 }} />
      </div>

      {/* Large Mode Toggle */}
      <div className="flex bg-white/60 rounded-[2.5rem] p-2 shadow-xl border-2 border-white/30 mb-8 scale-125 md:scale-150">
        <button 
          onClick={() => setMode('image-word')}
          className={`px-8 py-3 rounded-[2rem] text-sm font-black transition-all ${mode === 'image-word' ? 'bg-white shadow-md' : 'opacity-40'}`}
          style={{ color: ld.color, fontFamily: 'Nunito' }}
        >
          🖼️ + WORD
        </button>
        <button 
          onClick={() => setMode('image-only')}
          className={`px-8 py-3 rounded-[2rem] text-sm font-black transition-all ${mode === 'image-only' ? 'bg-white shadow-md' : 'opacity-40'}`}
          style={{ color: ld.color, fontFamily: 'Nunito' }}
        >
          🖼️ ONLY
        </button>
      </div>

      <BuddyBear mood={selected !== null && currentOptions[selected].isCorrect ? 'celebrating' : 'happy'} size={110}
        speech={`Which one starts with the letter "${ld.uppercase}"? 🧐`}
      />

      {/* Target letter */}
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="my-8 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white"
        style={{ width: 120, height: 120, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '5rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>

      {/* 6-card grid - Three images in a row */}
      <div className="grid grid-cols-3 gap-6 px-4 w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {currentOptions.map((opt, idx) => {
            const isSelected = selected === idx;
            const isCorrect = opt.isCorrect;
            
            return (
              <motion.button
                key={`${round}-${idx}-${opt.word}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  x: shake === idx ? [-10, 10, -10, 10, 0] : 0,
                  scale: isSelected && isCorrect ? 1.1 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTap(idx, opt)}
                className="aspect-[3/4] rounded-[2rem] flex flex-col items-center justify-center shadow-xl relative overflow-hidden group"
                style={{
                  background: isSelected && isCorrect ? ld.color : 'white',
                  border: `5px solid ${isSelected && isCorrect ? ld.color : isSelected ? '#EF4444' : '#E7E5E4'}`,
                }}
              >
                <div className="flex-1 w-full flex items-center justify-center p-4">
                  <img src={opt.image} alt={opt.word} className="w-full h-full object-contain" />
                </div>
                
                {mode === 'image-word' && (
                  <div className="w-full py-3 px-2 text-center"
                    style={{ 
                      background: isSelected && isCorrect ? 'rgba(0,0,0,0.1)' : '#F8F7F6',
                    }}
                  >
                    <span style={{ 
                      fontFamily: 'Nunito', 
                      fontWeight: 800, 
                      fontSize: '1rem', 
                      color: isSelected && isCorrect ? 'white' : '#1C1917',
                      textTransform: 'capitalize'
                    }}>
                      {opt.word}
                    </span>
                  </div>
                )}

                {isSelected && isCorrect && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                  >
                    <span className="text-xl">⭐</span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex gap-3 mt-10">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div key={i} className="rounded-full shadow-sm"
            style={{ 
              width: 16, 
              height: 16, 
              background: i < round ? ld.color : i === round ? ld.color + '60' : 'white', 
              border: `2px solid ${ld.color}` 
            }}
          />
        ))}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={score >= 4 ? 3 : score >= 2 ? 2 : 1}
        message={score === ROUNDS ? "Perfect Matching! 🏆" : "Great Job! 🌟"}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
