import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function MoreOrLess() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<'left' | 'right' | 'equal' | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const ROUNDS = 4;

  const buildRound = () => {
    const left = Math.floor(Math.random() * 9) + 1;
    const rightOptions = [left - 1, left, left + 1].filter(n => n >= 1 && n <= 9);
    const right = rightOptions[Math.floor(Math.random() * rightOptions.length)];
    return { left, right };
  };

  const [rounds] = useState(() => Array.from({ length: ROUNDS }, buildRound));
  const current = rounds[Math.min(round, ROUNDS - 1)];
  const { left, right } = current;
  const correctAnswer: 'left' | 'right' | 'equal' = left > right ? 'left' : right > left ? 'right' : 'equal';

  const stars = ['⭐', '🌟', '💫', '✨', '🌸', '🍀', '🎈', '🦋', '🐢'];
  const leftObjects = stars.slice(0, left);
  const rightObjects = stars.slice(0, right);

  const handlePick = (choice: 'left' | 'right' | 'equal') => {
    if (selected) return;
    setSelected(choice);
    if (choice === correctAnswer) {
      const newScore = score + 1;
      setScore(newScore);
      if (round + 1 >= ROUNDS) {
        const s: 1|2|3 = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
        awardStars(`${nd.digit}-more-or-less`, s);
        incrementActivity(`${nd.digit}-more-or-less`);
        setTimeout(() => setShowCelebration(true), 700);
      } else {
        setTimeout(() => { setRound(r => r + 1); setSelected(null); }, 900);
      }
    } else {
      setMistakes(m => m + 1);
      setTimeout(() => setSelected(null), 800);
    }
  };

  const tiltAngle = left > right ? -20 : right > left ? 20 : 0;

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>More or Less?</h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color }}>{score}/{ROUNDS}</span>
      </div>

      <BuddyBear mood={selected === correctAnswer ? 'celebrating' : 'thinking'} size={90}
        speech="Which side has MORE stars? Tap it! ⭐"
      />

      {/* Balance scale visual */}
      <div className="relative mt-4 flex flex-col items-center" style={{ width: 280, height: 120 }}>
        {/* Beam */}
        <motion.div
          animate={selected ? { rotate: tiltAngle } : { rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.3 }}
          className="absolute"
          style={{ top: 24, width: 200, height: 8, background: nd.color, borderRadius: 4, left: '50%', transform: 'translateX(-50%)' }}
        />
        {/* Fulcrum */}
        <div style={{ width: 16, height: 40, background: nd.color + '80', borderRadius: 4, position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)' }} />
        {/* Left pan */}
        <div style={{ position: 'absolute', left: 10, top: 0, width: 80, height: 28, borderRadius: '0 0 12px 12px', border: `3px solid ${nd.color}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: nd.color, fontFamily: 'Nunito' }}>{left}</span>
        </div>
        {/* Right pan */}
        <div style={{ position: 'absolute', right: 10, top: 0, width: 80, height: 28, borderRadius: '0 0 12px 12px', border: `3px solid ${nd.color}`, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: nd.color, fontFamily: 'Nunito' }}>{right}</span>
        </div>
      </div>

      {/* Two groups side by side */}
      <div className="flex gap-4 mt-2 px-4">
        {[{ side: 'left' as const, items: leftObjects, count: left },
          { side: 'right' as const, items: rightObjects, count: right }].map(({ side, items, count }) => (
          <motion.button
            key={side}
            onClick={() => handlePick(side)}
            whileTap={{ scale: 0.95 }}
            animate={selected === side && side === correctAnswer ? { scale: [1, 1.08, 1], boxShadow: [`0 0 0 0px ${nd.color}`, `0 0 0 8px ${nd.color}40`, `0 0 0 0px ${nd.color}`] } :
              selected === side ? { x: [-5, 5, -3, 3, 0] } : {}}
            className="rounded-3xl p-4 flex flex-col items-center gap-2"
            style={{ width: 130, minHeight: 140, background: 'white', border: `3px solid ${selected === side && side === correctAnswer ? nd.color : '#E7E5E4'}`, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          >
            <div className="flex flex-wrap gap-1 justify-center">
              {items.map((obj, i) => <span key={i} style={{ fontSize: '1.5rem' }}>{obj}</span>)}
            </div>
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.8rem', color: nd.color }}>{count}</span>
          </motion.button>
        ))}
      </div>

      {/* Equal button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => handlePick('equal')}
        className="mt-4 rounded-2xl px-8 py-3 shadow-md"
        style={{ background: selected === 'equal' && correctAnswer === 'equal' ? nd.color : 'white', border: `2px solid ${nd.color}`, fontFamily: 'Nunito', fontWeight: 800, color: selected === 'equal' && correctAnswer === 'equal' ? 'white' : nd.color, fontSize: '1rem' }}
      >
        They're the same! ⚖️
      </motion.button>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1}
        message="You know more and less! ⭐"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
