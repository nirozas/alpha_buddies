import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function WhatStartsWith() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const ROUNDS = 3;

  const buildOptions = () => {
    const others = LETTERS_DATA.filter(l => l.letter !== ld.letter)
      .sort(() => Math.random() - 0.5).slice(0, 2);
    const all = [ld, ...others].sort(() => Math.random() - 0.5);
    return all;
  };

  const [options] = useState(() => Array.from({ length: ROUNDS }, buildOptions));

  const handlePick = (idx: number, opt: typeof ld) => {
    if (selected !== null) return;
    setSelected(idx);
    if (opt.letter === ld.letter) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        if (round + 1 >= ROUNDS) {
          const stars: 1|2|3 = newScore === 3 ? 3 : newScore === 2 ? 2 : 1;
          awardStars(`${ld.letter}-what-starts-with`, stars);
          incrementActivity(`${ld.letter}-what-starts-with`);
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

  const currentOptions = options[Math.min(round, ROUNDS - 1)];

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>What Starts With?</h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color }}>{score}/{ROUNDS} ⭐</span>
      </div>

      <BuddyBear mood={selected !== null && currentOptions[selected].letter === ld.letter ? 'celebrating' : 'happy'}
        size={90}
        speech={`Which one starts with the letter "${ld.uppercase}"? 🔍`}
      />

      {/* Target letter */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ repeat: Infinity, duration: 1.8 }}
        className="mt-3 rounded-3xl flex items-center justify-center shadow-xl"
        style={{ width: 90, height: 90, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '4rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>

      {/* 3 choices */}
      <div className="flex gap-4 mt-5 px-4 flex-wrap justify-center">
        {currentOptions.map((opt, idx) => {
          const isCorrect = opt.letter === ld.letter;
          const isSelected = selected === idx;
          return (
            <motion.button
              key={`${round}-${opt.letter}`}
              animate={
                shake === idx ? { x: [-8, 8, -5, 5, 0] } :
                isSelected && isCorrect ? { scale: [1, 1.18, 1.1] } :
                { y: [0, -5, 0] }
              }
              transition={
                shake === idx ? { duration: 0.4 } :
                isSelected && isCorrect ? { duration: 0.4 } :
                { repeat: Infinity, duration: 2 + idx * 0.3, ease: 'easeInOut' }
              }
              onClick={() => handlePick(idx, opt)}
              className="rounded-3xl flex flex-col items-center justify-center gap-2 shadow-xl"
              style={{
                width: 120, height: 140,
                background: isSelected && isCorrect ? ld.color : isSelected ? '#FEF2F2' : 'white',
                border: `4px solid ${isSelected && isCorrect ? ld.color : isSelected ? '#EF4444' : '#E7E5E4'}`,
              }}
            >
              <span style={{ fontSize: '3.5rem' }}>{opt.exampleEmoji}</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.9rem', color: isSelected && isCorrect ? 'white' : '#1C1917' }}>
                {opt.exampleWord}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Round dots */}
      <div className="flex gap-2 mt-5">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div key={i} className="rounded-full"
            style={{ width: 14, height: 14, background: i < score ? ld.color : i === round ? ld.color + '60' : ld.color + '20', border: `2px solid ${ld.color}` }}
          />
        ))}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={score === 3 ? 3 : score === 2 ? 2 : 1}
        message="What a star! 🌟"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
