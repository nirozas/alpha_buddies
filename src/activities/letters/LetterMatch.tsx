import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

type GameMode = 'image-word' | 'image-only';

// Helper: compute stars for Letter Match (1 star for +WORD, 2 stars for WITHOUT WORD, 3 for both)
export function getLetterMatchStars(
  letter: string,
  starsEarned: Record<string, 1 | 2 | 3 | number | undefined>
): {
  hasWord: boolean;
  hasNoWord: boolean;
  totalStars: 0 | 1 | 2 | 3;
} {
  const upper = letter.toUpperCase();
  let hasWord = Boolean(starsEarned[`letter_match_${upper}_word`]);
  let hasNoWord = Boolean(starsEarned[`letter_match_${upper}_noword`]);

  if (!hasWord && !hasNoWord) {
    const legacy = (starsEarned[`${upper}-letter-match`] || starsEarned[`letter-match-${upper}`] || 0) as number;
    if (legacy >= 3) {
      hasWord = true;
      hasNoWord = true;
    } else if (legacy >= 2) {
      hasNoWord = true;
    } else if (legacy >= 1) {
      hasWord = true;
    }
  }

  const total = (hasWord ? 1 : 0) + (hasNoWord ? 2 : 0);
  return {
    hasWord,
    hasNoWord,
    totalStars: Math.min(3, total) as 0 | 1 | 2 | 3,
  };
}

export function LetterMatch() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { progress, awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();

  const rawLetters = letter
    ? letter.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : (masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : ['A']));
  const targetLetters = rawLetters.length > 0 ? rawLetters : ['A'];

  const roundLetters = useMemo(() => {
    if (targetLetters.length === 1) {
      return Array(5).fill(targetLetters[0]);
    }
    let list: string[] = [];
    while (list.length < Math.max(5, targetLetters.length)) {
      list.push(...targetLetters);
    }
    return list.slice(0, Math.max(5, targetLetters.length));
  }, [targetLetters]);

  const ROUNDS = roundLetters.length;
  const OPTIONS_COUNT = 6;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<GameMode>('image-word');
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentRoundLetter = roundLetters[round] || roundLetters[0];
  const ld = LETTERS_DATA.find(l => l.letter === currentRoundLetter) || LETTERS_DATA[0];

  const buildRoundOptions = (targetL: string) => {
    const lObj = LETTERS_DATA.find(l => l.letter === targetL) || LETTERS_DATA[0];
    const correctObj = lObj.objects[Math.floor(Math.random() * lObj.objects.length)];
    
    const otherLetters = LETTERS_DATA.filter(l => l.letter !== targetL)
      .sort(() => Math.random() - 0.5)
      .slice(0, OPTIONS_COUNT - 1);
    
    const incorrectOptions = otherLetters.map(l => {
      const obj = l.objects[Math.floor(Math.random() * l.objects.length)];
      return { ...obj, letter: l.letter, isCorrect: false };
    });

    return [
      { ...correctObj, letter: targetL, isCorrect: true },
      ...incorrectOptions
    ].sort(() => Math.random() - 0.5);
  };

  const roundsData = useMemo(() => {
    return roundLetters.map(l => buildRoundOptions(l));
  }, [roundLetters]);

  const currentOptions = roundsData[round] || roundsData[0];

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
          // Scoring requirement: + word = 1 star, without word = 2 stars, both = 3 stars
          const isWordMode = mode === 'image-word';
          const earnedForMode: 1 | 2 = isWordMode ? 1 : 2;
          const condKey = isWordMode ? 'word' : 'noword';

          targetLetters.forEach(l => {
            // 1. Record condition
            awardStars(`letter_match_${l}_${condKey}`, earnedForMode);

            // 2. Compute combined stars for this letter
            const starsObj = getLetterMatchStars(l, {
              ...useStore.getState().progress.starsEarned,
              [`letter_match_${l}_${condKey}`]: earnedForMode,
            });

            const letterStars = Math.max(earnedForMode, starsObj.totalStars) as 1 | 2 | 3;
            awardStars(`${l}-letter-match`, letterStars);
            incrementActivity(`${l}-letter-match`);
          });

          awardStars('letter-match', earnedForMode);
          incrementActivity('letter-match');
          setShowCelebration(true);
        }
      }, 900);
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
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 mb-2">
        <BackButton onClick={() => navigate('/letters/activity/letter-match')} color={ld.color} />
        <div className="flex-1 max-w-xs sm:max-w-md mx-auto flex flex-col items-center">
          <ProgressBar
            value={round}
            max={ROUNDS}
            color={ld.color}
            label={`Round ${round + 1}/${ROUNDS}`}
          />
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Large Mode Toggle with explicit star values */}
      <div className="flex bg-white/70 backdrop-blur rounded-[2.5rem] p-1.5 shadow-xl border-2 border-white/50 mb-6 scale-110 sm:scale-125">
        <button 
          onClick={() => setMode('image-word')}
          className={`px-5 py-2 rounded-[2rem] text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            mode === 'image-word'
              ? 'bg-white shadow-md text-emerald-950 border border-emerald-200'
              : 'opacity-50 text-slate-600 hover:opacity-80'
          }`}
          style={{ fontFamily: 'Nunito' }}
        >
          <span>🖼️ + WORD</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-black">
            1⭐
          </span>
        </button>
        <button 
          onClick={() => setMode('image-only')}
          className={`px-5 py-2 rounded-[2rem] text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            mode === 'image-only'
              ? 'bg-white shadow-md text-emerald-950 border border-emerald-200'
              : 'opacity-50 text-slate-600 hover:opacity-80'
          }`}
          style={{ fontFamily: 'Nunito' }}
        >
          <span>🖼️ ONLY</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-black">
            2⭐⭐
          </span>
        </button>
      </div>

      <BuddyBear
        mood={selected !== null && currentOptions[selected].isCorrect ? 'celebrating' : 'happy'}
        size={95}
        speech={`Which one starts with the letter "${ld.uppercase}"? 🧐`}
      />

      {/* Target letter */}
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="my-5 rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white"
        style={{ width: 110, height: 110, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '4.5rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>

      {/* 6-card grid - Three images in a row */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 px-4 w-full max-w-2xl">
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
                  scale: isSelected && isCorrect ? 1.08 : 1,
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTap(idx, opt)}
                className="aspect-[3/4] rounded-[2rem] flex flex-col items-center justify-center shadow-xl relative overflow-hidden group cursor-pointer"
                style={{
                  background: isSelected && isCorrect ? ld.color : 'white',
                  border: `5px solid ${isSelected && isCorrect ? ld.color : isSelected ? '#EF4444' : '#E7E5E4'}`,
                }}
              >
                <div className="flex-1 w-full flex items-center justify-center p-3 sm:p-4">
                  <img src={opt.image} alt={opt.word} className="w-full h-full object-contain" />
                </div>
                
                {mode === 'image-word' && (
                  <div className="w-full py-2 sm:py-3 px-2 text-center"
                    style={{ 
                      background: isSelected && isCorrect ? 'rgba(0,0,0,0.1)' : '#F8F7F6',
                    }}
                  >
                    <span style={{ 
                      fontFamily: 'Nunito', 
                      fontWeight: 800, 
                      fontSize: '0.95rem', 
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
      <div className="flex gap-2.5 mt-8">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div key={i} className="rounded-full shadow-sm"
            style={{ 
              width: 14, 
              height: 14, 
              background: i < round ? ld.color : i === round ? ld.color + '80' : 'white', 
              border: `2px solid ${ld.color}` 
            }}
          />
        ))}
      </div>

      {/* Celebration Screen */}
      <CelebrationScreen 
        active={showCelebration} 
        stars={mode === 'image-word' ? 1 : 2}
        message={
          mode === 'image-word' 
            ? "Great Word Matching! +1 ⭐ added to your letter!" 
            : "Super Picture Matching! +2 ⭐⭐ added to your letter!"
        }
        onContinue={() => navigate('/letters/activity/letter-match')} 
        onMenu={() => navigate('/letters')} 
      />
    </div>
  );
}
