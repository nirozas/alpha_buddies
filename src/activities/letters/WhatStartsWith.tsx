import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

interface ChoiceOption {
  word: string;
  image: string;
  letter: string;
  isCorrect: boolean;
  emoji?: string;
}

export function WhatStartsWith() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();

  const rawLetters = letter
    ? letter.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : (masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : ['A']));
  const targetLetters = rawLetters.length > 0 ? rawLetters : ['A'];

  const roundLetters = useMemo(() => {
    if (targetLetters.length === 1) {
      return Array(5).fill(targetLetters[0]);
    }
    const list: string[] = [];
    while (list.length < Math.max(5, targetLetters.length)) {
      list.push(...targetLetters);
    }
    return list.slice(0, Math.max(5, targetLetters.length));
  }, [targetLetters]);

  const ROUNDS = roundLetters.length;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const currentRoundLetter = roundLetters[round] || roundLetters[0];
  const ld = LETTERS_DATA.find(l => l.letter === currentRoundLetter) || LETTERS_DATA[0];

  const buildOptions = (targetL: string): ChoiceOption[] => {
    const targetLD = LETTERS_DATA.find(l => l.letter === targetL) || LETTERS_DATA[0];
    const correctObj = targetLD.objects[Math.floor(Math.random() * targetLD.objects.length)];
    
    // 3 Incorrect options from other letters
    const otherLetters = LETTERS_DATA.filter(l => l.letter !== targetL)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    
    const incorrectObjs: ChoiceOption[] = otherLetters.map(l => {
      const obj = l.objects[Math.floor(Math.random() * l.objects.length)];
      return { ...obj, letter: l.letter, isCorrect: false };
    });

    const all: ChoiceOption[] = [
      { ...correctObj, letter: targetL, isCorrect: true },
      ...incorrectObjs
    ].sort(() => Math.random() - 0.5);
    
    return all;
  };

  const options: ChoiceOption[][] = useMemo(() => roundLetters.map((l: string) => buildOptions(l)), [roundLetters]);

  const handlePick = (idx: number, opt: { isCorrect: boolean, letter: string }) => {
    if (selected !== null) return;
    setSelected(idx);
    if (opt.isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          const stars: 1|2|3 = newScore >= Math.ceil(ROUNDS * 0.7) ? 3 : newScore >= Math.ceil(ROUNDS * 0.4) ? 2 : 1;
          targetLetters.forEach(l => {
            awardStars(`${l}-what-starts-with`, stars);
            incrementActivity(`${l}-what-starts-with`);
          });
          awardStars('what-starts-with', stars);
          incrementActivity('what-starts-with');
          setShowCelebration(true);
        } else {
          setRound(r => r + 1);
          setSelected(null);
        }
      }, 900);
    } else {
      setShake(idx);
      setTimeout(() => { setShake(null); setSelected(null); }, 800);
    }
  };

  const currentOptions = options[Math.min(round, ROUNDS - 1)] || options[0];

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8 relative z-10 bg-transparent">
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate('/letters')} color={ld.color} />
        <div className="flex items-center gap-2">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: ld.color }}>What Starts With?</h2>
          {targetLetters.length > 1 && (
            <div className="flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur rounded-full shadow border border-amber-300">
              <span className="text-xs font-black text-amber-900" style={{ fontFamily: 'Nunito' }}>
                Round {round + 1}/{ROUNDS}
              </span>
            </div>
          )}
        </div>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color, fontSize: '1.1rem' }}>{score}/{ROUNDS} ⭐</span>
      </div>

      <BuddyBear mood={selected !== null && currentOptions[selected]?.isCorrect ? 'celebrating' : 'happy'}
        size={100}
        speech={`Which one starts with the letter "${ld.uppercase}"? 🔍`}
      />

      {/* Target letter */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="mt-2 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white"
        style={{ width: 100, height: 100, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '4.5rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>

      {/* 4 choices */}
      <div className="grid grid-cols-2 gap-6 mt-8 px-4 max-w-2xl w-full justify-items-center">
        {currentOptions.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = opt.isCorrect;
          
          return (
            <motion.button
              key={`${round}-${idx}-${opt.word}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              animate={
                shake === idx ? { x: [-10, 10, -10, 10, 0] } :
                isSelected && isCorrect ? { scale: [1, 1.15, 1.1] } :
                {}
              }
              transition={
                shake === idx ? { duration: 0.4 } :
                isSelected && isCorrect ? { duration: 0.4 } :
                { duration: 0.2 }
              }
              onClick={() => handlePick(idx, opt)}
              className="rounded-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-2xl w-full max-w-[180px] aspect-[4/5] relative overflow-hidden group"
              style={{
                background: isSelected && isCorrect ? ld.color : isSelected ? '#FEF2F2' : 'white',
                border: `6px solid ${isSelected && isCorrect ? ld.color : isSelected ? '#EF4444' : '#E7E5E4'}`,
              }}
            >
              <div className="flex-1 flex items-center justify-center p-4">
                <img src={opt.image} alt={opt.word} className="w-full h-full object-contain" />
              </div>
              
              <div className="w-full py-3 text-center" style={{ 
                background: isSelected && isCorrect ? 'rgba(0,0,0,0.1)' : '#F8F7F6',
              }}>
                <span style={{ 
                  fontFamily: 'Nunito', 
                  fontWeight: 800, 
                  fontSize: '1.2rem', 
                  color: isSelected && isCorrect ? 'white' : '#1C1917',
                  textTransform: 'capitalize'
                }}>
                  {opt.word}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Round dots */}
      <div className="flex gap-3 mt-10">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <motion.div 
            key={i} 
            initial={false}
            animate={{ 
              scale: i === round ? 1.2 : 1,
              backgroundColor: i < score ? ld.color : i === round ? ld.color + '60' : ld.color + '20'
            }}
            className="rounded-full shadow-sm"
            style={{ 
              width: 18, 
              height: 18, 
              border: `2px solid ${ld.color}` 
            }}
          />
        ))}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => {
            const parts = window.location.pathname.split('/').filter(Boolean);
            if (parts.length >= 4) {
              navigate(`/${parts[0]}/${parts[1]}/${parts[2]}`);
            } else {
              navigate('/letters');
            }
          }} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={score >= 4 ? 3 : score >= 2 ? 2 : 1}
        message={score === ROUNDS ? "Perfect Score! 🌈" : "What a star! 🌟"}
        onContinue={() => navigate('/letters/activity/what-starts-with')}
        onMenu={() => navigate('/letters')}
      />
    </div>
  );
}
