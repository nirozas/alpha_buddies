import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

export function MagicTrace() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { playPop, playDing, playFanfare, speak } = useAudio();

  const rawLetters = letter
    ? letter.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : (masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : ['A']));
  const targetLetters = rawLetters.length > 0 ? rawLetters : ['A'];

  const [letterIndex, setLetterIndex] = useState(0);
  const currentLetter = targetLetters[letterIndex] || targetLetters[0];
  const lData = LETTERS_DATA.find(l => l.letter === currentLetter) || LETTERS_DATA[0];

  const [particles, setParticles] = useState<Particle[]>([]);
  const [isTracing, setIsTracing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const particleId = useRef(0);

  useEffect(() => {
    if (currentLetter) {
      speak(`Trace the magic ${currentLetter}!`);
      setProgress(0);
      setParticles([]);
    }
  }, [currentLetter, speak]);

  const addParticle = (x: number, y: number) => {
    const colors = ['#F472B6', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA'];
    const newParticle: Particle = {
      id: particleId.current++,
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 15 + 10
    };
    setParticles(prev => [...prev.slice(-100), newParticle]);
    setProgress(p => Math.min(100, p + 0.8));
  };

  useEffect(() => {
    if (progress >= 100 && !showCelebration) {
      awardStars(`magic-trace-${currentLetter}`, 3);
      incrementActivity(`magic-trace-${currentLetter}`);

      if (letterIndex < targetLetters.length - 1) {
        playDing();
        speak(`Magic! Now let's trace letter ${targetLetters[letterIndex + 1]}!`);
        setTimeout(() => {
          setLetterIndex(i => i + 1);
        }, 500);
      } else {
        playFanfare();
        targetLetters.forEach(l => {
          awardStars(`magic-trace-${l}`, 3);
          incrementActivity(`magic-trace-${l}`);
        });
        awardStars('magic-trace', 3);
        incrementActivity('magic-trace');
        setShowCelebration(true);
      }
    }
  }, [progress, currentLetter, letterIndex, targetLetters, showCelebration]);

  const handleInteraction = (e: any) => {
    if (!isTracing) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX, clientY;
    if (e.touches) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    addParticle(clientX - rect.left, clientY - rect.top);
  };

  if (!lData) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center bg-fuchsia-50 font-nunito relative overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 z-10">
        <BackButton onClick={() => navigate('/letters')} color="#C026D3" />
        <h1 className="text-3xl md:text-4xl font-black text-fuchsia-700">Magic Trace {currentLetter}</h1>
        {targetLetters.length > 1 ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur rounded-full shadow-md border-2 border-fuchsia-300">
            <span className="text-xs font-black text-fuchsia-950">
              Letter {letterIndex + 1}/{targetLetters.length}:
            </span>
            <div className="flex items-center gap-1">
              {targetLetters.map((tl, idx) => (
                <span
                  key={tl}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    idx < letterIndex
                      ? 'bg-emerald-500 text-white'
                      : idx === letterIndex
                      ? 'bg-fuchsia-600 text-white scale-110 shadow-md ring-2 ring-fuchsia-300'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx < letterIndex ? '✓' : tl}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ width: 56 }} />
        )}
      </div>

      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center relative p-6">
        {/* Hollow Letter Outline */}
        <div 
          ref={containerRef}
          onMouseDown={() => setIsTracing(true)}
          onMouseUp={() => setIsTracing(false)}
          onMouseMove={handleInteraction}
          onTouchStart={() => setIsTracing(true)}
          onTouchEnd={() => setIsTracing(false)}
          onTouchMove={(e) => { e.preventDefault(); handleInteraction(e); }}
          className="relative w-full aspect-square bg-white rounded-[4rem] shadow-2xl border-8 border-fuchsia-200 flex items-center justify-center cursor-crosshair touch-none select-none overflow-hidden"
        >
          <span 
            className="text-[20rem] md:text-[25rem] font-black text-fuchsia-50 select-none pointer-events-none"
            style={{ WebkitTextStroke: '4px #F5D0FE' }}
          >
            {lData.uppercase}
          </span>

          {/* Particles */}
          <AnimatePresence>
            {particles.map(p => (
              <motion.div
                key={p.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.8 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute rounded-full shadow-[0_0_10px_white]"
                style={{ 
                  left: p.x, 
                  top: p.y, 
                  width: p.size, 
                  height: p.size, 
                  backgroundColor: p.color,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-10 px-4">
          <div className="w-full h-6 bg-fuchsia-200 rounded-full overflow-hidden shadow-inner border-2 border-fuchsia-300">
            <motion.div 
              className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-500"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center font-bold text-fuchsia-800 mt-2">Magic Power: {Math.round(progress)}%</p>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={3} message="Pure Magic! ✨"
        onContinue={() => navigate('/letters/activity/magic-trace')} />
    </div>
  );
}
