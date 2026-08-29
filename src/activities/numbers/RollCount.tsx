import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

function DieFace({ value }: { value: number }) {
  const dotPositions: Record<number, Array<{ top: string; left: string }>> = {
    1: [{ top: '50%', left: '50%' }],
    2: [{ top: '25%', left: '25%' }, { top: '75%', left: '75%' }],
    3: [{ top: '25%', left: '25%' }, { top: '50%', left: '50%' }, { top: '75%', left: '75%' }],
    4: [{ top: '25%', left: '25%' }, { top: '25%', left: '75%' }, { top: '75%', left: '25%' }, { top: '75%', left: '75%' }],
    5: [{ top: '25%', left: '25%' }, { top: '25%', left: '75%' }, { top: '50%', left: '50%' }, { top: '75%', left: '25%' }, { top: '75%', left: '75%' }],
    6: [{ top: '25%', left: '25%' }, { top: '25%', left: '75%' }, { top: '50%', left: '25%' }, { top: '50%', left: '75%' }, { top: '75%', left: '25%' }, { top: '75%', left: '75%' }],
  };
  const dots = dotPositions[value] || [];
  return (
    <div style={{ position: 'relative', width: 120, height: 120, background: 'white', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '3px solid #E7E5E4' }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: 'absolute', width: 20, height: 20, borderRadius: '50%', background: '#1C1917',
          top: d.top, left: d.left, transform: 'translate(-50%, -50%)',
        }} />
      ))}
    </div>
  );
}

export function RollCount() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;

  const [dieValue, setDieValue] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const ROUNDS = 3;

  const rollDie = () => {
    if (rolling) return;
    setRolling(true);
    setSelectedAnswer(null);
    setDieValue(null);
    let flips = 0;
    const interval = setInterval(() => {
      setDieValue(Math.floor(Math.random() * 6) + 1);
      flips++;
      if (flips > 8) {
        clearInterval(interval);
        const final = Math.floor(Math.random() * 6) + 1;
        setDieValue(final);
        setRolling(false);
      }
    }, 100);
  };

  const buildAnswers = (correct: number) => {
    const opts = new Set([correct]);
    while (opts.size < 3) opts.add(Math.max(1, Math.min(6, correct + Math.round((Math.random()-0.5)*3))));
    return [...opts].sort(() => Math.random()-0.5);
  };

  const [answers] = useState(() => buildAnswers(dieValue || 3));
  const currentAnswers = dieValue ? buildAnswers(dieValue) : [1,2,3];

  const handleAnswer = (ans: number) => {
    if (selectedAnswer !== null || dieValue === null || rolling) return;
    setSelectedAnswer(ans);
    if (ans === dieValue) {
      const newScore = score + 1;
      setScore(newScore);
      if (round + 1 >= ROUNDS) {
        const stars: 1|2|3 = mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1;
        awardStars(`${nd.digit}-roll-count`, stars);
        incrementActivity(`${nd.digit}-roll-count`);
        setTimeout(() => setShowCelebration(true), 500);
      } else {
        setTimeout(() => { setRound(r => r+1); setSelectedAnswer(null); setDieValue(null); }, 800);
      }
    } else {
      setMistakes(m => m+1);
      setTimeout(() => { setSelectedAnswer(null); }, 700);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Roll &amp; Count</h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color }}>{score}/{ROUNDS}</span>
      </div>

      <BuddyBear mood={rolling ? 'excited' : dieValue ? 'thinking' : 'happy'} size={90}
        speech={dieValue ? `Count the dots! How many dots do you see? 🎲` : `Tap the dice to roll it! 🎲`}
      />

      {/* Die */}
      <motion.button
        onClick={rollDie}
        animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.1, 0.9, 1.1, 1] } : { y: [0, -6, 0] }}
        transition={rolling ? { duration: 0.6, repeat: Infinity } : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="mt-4 cursor-pointer"
        style={{ background: 'none', border: 'none' }}
      >
        {dieValue ? <DieFace value={dieValue} /> : (
          <div style={{ width: 120, height: 120, borderRadius: 20, background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', border: '3px solid #E7E5E4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '3rem' }}>🎲</span>
          </div>
        )}
      </motion.button>
      <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color, marginTop: 8 }}>
        {rolling ? 'Rolling...' : dieValue ? 'Count the dots!' : 'Tap to roll!'}
      </p>

      {/* Answer buttons */}
      {dieValue && !rolling && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-5">
          {buildAnswers(dieValue).map(ans => (
            <motion.button key={ans} whileTap={{ scale: 0.9 }}
              onClick={() => handleAnswer(ans)}
              className="rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                width: 80, height: 80,
                background: selectedAnswer === ans && ans === dieValue ? nd.color : selectedAnswer === ans ? '#FEF2F2' : 'white',
                border: `4px solid ${nd.color + '60'}`,
              }}
            >
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2.5rem', color: selectedAnswer === ans && ans === dieValue ? 'white' : nd.color }}>
                {ans}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1}
        message="Dice master! 🎲🎉"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
