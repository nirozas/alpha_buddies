import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

interface Bubble {
  id: number;
  letter: string;
  x: number;
  color: string;
  speed: number;
  size: number;
}

export function PopTheBubble() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playPop, playDing } = useAudio();
  
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase()) || LETTERS_DATA[0];

  const [mode, setMode] = useState<'upper' | 'lower' | 'both' | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [popped, setPopped] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const idCounter = useRef(0);
  const GOAL = 10;

  const { progress } = useStore();
  const getStars = (m: string) => progress.starsEarned[`${ld.letter}-pop-the-bubble-${m}`] || 0;

  // Spawning logic using CSS animation for reliability
  useEffect(() => {
    if (!mode) return;

    const spawn = () => {
      const randomEntry = LETTERS_DATA[Math.floor(Math.random() * LETTERS_DATA.length)];
      
      let targetLetter = ld.uppercase;
      if (mode === 'lower') targetLetter = ld.lowercase;
      if (mode === 'both') targetLetter = Math.random() < 0.5 ? ld.uppercase : ld.lowercase;

      let otherLetter = randomEntry.uppercase;
      if (mode === 'lower') otherLetter = randomEntry.lowercase;
      if (mode === 'both') otherLetter = Math.random() < 0.5 ? randomEntry.uppercase : randomEntry.lowercase;

      const nb: Bubble = {
        id: idCounter.current++,
        letter: Math.random() < 0.4 ? targetLetter : otherLetter,
        x: 5 + Math.random() * 90,
        color: LETTERS_DATA[Math.floor(Math.random() * LETTERS_DATA.length)].color,
        speed: 8 + Math.random() * 4,
        size: 100 + Math.random() * 40,
      };
      setBubbles(prev => [...prev.slice(-15), nb]);
    };

    spawn();
    const interval = setInterval(spawn, 1200);
    return () => clearInterval(interval);
  }, [ld, mode]);

  const handlePop = useCallback((bubble: Bubble) => {
    if (popped.includes(bubble.id)) return;
    
    const isTarget = mode === 'both' 
      ? (bubble.letter.toUpperCase() === ld.letter)
      : (mode === 'upper' ? bubble.letter === ld.uppercase : bubble.letter === ld.lowercase);

    if (isTarget) {
      playPop();
      setPopped(p => [...p, bubble.id]);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore >= GOAL) {
        playDing();
        const key = `${ld.letter}-pop-the-bubble-${mode}`;
        awardStars(key, 3);
        incrementActivity(key);
        
        // Check if all modes are complete for total mastery
        const hasUpper = (progress.starsEarned[`${ld.letter}-pop-the-bubble-upper`] || 0) > 0 || mode === 'upper';
        const hasLower = (progress.starsEarned[`${ld.letter}-pop-the-bubble-lower`] || 0) > 0 || mode === 'lower';
        const hasBoth = (progress.starsEarned[`${ld.letter}-pop-the-bubble-both`] || 0) > 0 || mode === 'both';
        
        if (hasUpper && hasLower && hasBoth) {
          // Mastered all 3! Award final stars for the activity itself
          awardStars(`${ld.letter}-pop-the-bubble`, 3);
        }

        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      speak(`That's ${bubble.letter}! Find ${mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : ld.letter)}!`);
    }
  }, [popped, score, ld, mode, awardStars, incrementActivity, playPop, playDing, speak, progress.starsEarned]);

  if (!mode) {
    const modes = [
      { id: 'upper', label: 'Capital Letters', char: ld.uppercase, color: ld.color, bg: 'white', text: ld.color },
      { id: 'lower', label: 'Small Letters', char: ld.lowercase, color: ld.color, bg: 'white', text: ld.color },
      { id: 'both', label: 'Both Together', char: `${ld.uppercase}${ld.lowercase}`, color: '#f59e0b', bg: '#f59e0b', text: 'white' },
    ];

    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-transparent">
        <div className="absolute top-4 left-4 z-[110]">
          <BackButton onClick={() => navigate(-1)} color={ld.color} />
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card p-8 flex flex-col items-center gap-6 max-w-xl w-full shadow-2xl bg-white/95 backdrop-blur-md border-4"
          style={{ borderColor: ld.color }}
        >
          <BuddyBear mood="excited" size={100} speech={`Master all 3 modes to win full stars! 🌟`} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {modes.map((m) => {
              const stars = getStars(m.id);
              const isMastered = stars >= 3;
              return (
                <button 
                  key={m.id}
                  onClick={() => { setMode(m.id as any); speak(`Let's find ${m.label}!`); }}
                  className="p-4 flex flex-col items-center justify-center gap-2 rounded-3xl border-4 transition-all hover:scale-105 active:scale-95 shadow-lg relative group overflow-hidden"
                  style={{ 
                    borderColor: m.id === 'both' ? '#f59e0b' : ld.color,
                    background: isMastered ? '#F0FDF4' : 'white',
                    minHeight: '160px'
                  }}
                >
                  <div className="text-5xl font-black mb-1" style={{ color: m.id === 'both' ? '#f59e0b' : ld.color }}>{m.char}</div>
                  <div className="text-sm font-bold opacity-80" style={{ color: ld.color }}>{m.label}</div>
                  
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3].map(s => (
                      <span key={s} className="text-xl" style={{ filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>🌟</span>
                    ))}
                  </div>

                  {isMastered && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-bl-xl shadow-md">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <path d="M20 6L9 17L4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden select-none z-10 bg-transparent">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 relative z-[100]">
        <BackButton onClick={() => setMode(null)} color={ld.color} />
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={score} max={GOAL} color={ld.color} />
          <p className="text-[10px] font-black uppercase text-center mt-1 opacity-60">Bubbles: {score}/{GOAL}</p>
        </div>
        <div className="flex flex-col items-end">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Pop the Bubble!</h2>
          <p className="text-2xl font-black" style={{ color: ld.color }}>
            Find: {mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : `${ld.uppercase}/${ld.lowercase}`)}
          </p>
        </div>
      </div>

      <div className="relative z-[100] mt-2">
        <BuddyBear 
          mood="excited" 
          size={80} 
          speech={`Pop the ${mode === 'both' ? 'A and a' : (mode === 'upper' ? ld.uppercase : ld.lowercase)} bubbles! 🫧`} 
        />
      </div>

      {/* Bubbles Layer - Higher Z to be on top of UI */}
      <div className="absolute inset-0 z-[150] pointer-events-none">
        <AnimatePresence>
          {bubbles.map((bubble) => {
            const isPopped = popped.includes(bubble.id);
            if (isPopped) return null;
            
            return (
              <motion.div
                key={bubble.id}
                initial={{ y: '110vh', opacity: 0 }}
                animate={{ y: '-20vh', opacity: 1 }}
                exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
                whileTap={{ scale: 0.9 }}
                transition={{ 
                  y: { duration: bubble.speed, ease: "linear" },
                  exit: { duration: 0.2 }
                }}
                onPointerDown={(e) => { e.stopPropagation(); handlePop(bubble); }}
                className="absolute pointer-events-auto flex items-center justify-center rounded-full border-4 shadow-xl cursor-pointer"
                style={{
                  left: `${bubble.x}%`,
                  width: bubble.size,
                  height: bubble.size,
                  backgroundColor: `${bubble.color}44`,
                  borderColor: bubble.color,
                  boxShadow: `inset -8px -8px 16px ${bubble.color}66, 0 8px 16px rgba(0,0,0,0.1)`,
                }}
              >
                <span className="font-black" style={{ fontSize: bubble.size * 0.5, color: bubble.color, fontFamily: 'Nunito' }}>
                  {bubble.letter}
                </span>
                <div className="absolute top-[15%] left-[15%] w-[30%] h-[30%] bg-white/50 rounded-full blur-[1px]" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {showFact && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleWord} onClose={() => navigate(-1)} />
        </div>
      )}
      
      <CelebrationScreen 
        active={showCelebration} 
        stars={3} 
        message={`Bubble Master! 🫧💥`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} 
      />
    </div>
  );
}
