import { calculateStars } from '../../utils/scoring';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

interface Dot { x: number; y: number; id: number }

const DOT_PATHS: Record<string, Dot[]> = {
  'A': [
    { id: 1, x: 50, y: 10 }, { id: 2, x: 30, y: 50 }, { id: 3, x: 10, y: 90 },
    { id: 4, x: 50, y: 10 }, { id: 5, x: 70, y: 50 }, { id: 6, x: 90, y: 90 },
    { id: 7, x: 30, y: 60 }, { id: 8, x: 70, y: 60 }
  ],
  'B': [
    { id: 1, x: 30, y: 10 }, { id: 2, x: 30, y: 50 }, { id: 3, x: 30, y: 90 },
    { id: 4, x: 30, y: 10 }, { id: 5, x: 70, y: 25 }, { id: 6, x: 30, y: 50 },
    { id: 7, x: 70, y: 70 }, { id: 8, x: 30, y: 90 }
  ],
  'C': [
    { id: 1, x: 80, y: 20 }, { id: 2, x: 50, y: 10 }, { id: 3, x: 20, y: 30 },
    { id: 4, x: 20, y: 70 }, { id: 5, x: 50, y: 90 }, { id: 6, x: 80, y: 80 }
  ],
  'D': [
    { id: 1, x: 30, y: 10 }, { id: 2, x: 30, y: 90 },
    { id: 3, x: 75, y: 70 }, { id: 4, x: 75, y: 30 }, { id: 5, x: 30, y: 10 }
  ],
  'E': [
    { id: 1, x: 75, y: 15 }, { id: 2, x: 25, y: 15 }, { id: 3, x: 25, y: 50 },
    { id: 4, x: 65, y: 50 }, { id: 5, x: 25, y: 50 }, { id: 6, x: 25, y: 85 }, { id: 7, x: 75, y: 85 }
  ],
  'F': [
    { id: 1, x: 75, y: 15 }, { id: 2, x: 25, y: 15 }, { id: 3, x: 25, y: 50 },
    { id: 4, x: 65, y: 50 }, { id: 5, x: 25, y: 50 }, { id: 6, x: 25, y: 85 }
  ],
  'G': [
    { id: 1, x: 80, y: 20 }, { id: 2, x: 45, y: 10 }, { id: 3, x: 20, y: 45 },
    { id: 4, x: 45, y: 85 }, { id: 5, x: 80, y: 85 }, { id: 6, x: 80, y: 55 }, { id: 7, x: 55, y: 55 }
  ],
  'H': [
    { id: 1, x: 25, y: 15 }, { id: 2, x: 25, y: 85 },
    { id: 3, x: 25, y: 50 }, { id: 4, x: 75, y: 50 },
    { id: 5, x: 75, y: 15 }, { id: 6, x: 75, y: 85 }
  ],
  'L': [
    { id: 1, x: 25, y: 15 }, { id: 2, x: 25, y: 85 }, { id: 3, x: 75, y: 85 }
  ],
  'O': [
    { id: 1, x: 50, y: 10 }, { id: 2, x: 20, y: 35 }, { id: 3, x: 20, y: 65 },
    { id: 4, x: 50, y: 90 }, { id: 5, x: 80, y: 65 }, { id: 6, x: 80, y: 35 }, { id: 7, x: 50, y: 10 }
  ],
  'T': [
    { id: 1, x: 15, y: 15 }, { id: 2, x: 85, y: 15 }, { id: 3, x: 50, y: 15 }, { id: 4, x: 50, y: 85 }
  ]
};

const getDotsForChar = (c: string): Dot[] => {
  if (DOT_PATHS[c]) return DOT_PATHS[c];
  return [
    { id: 1, x: 30, y: 15 },
    { id: 2, x: 70, y: 15 },
    { id: 3, x: 70, y: 50 },
    { id: 4, x: 30, y: 50 },
    { id: 5, x: 30, y: 85 },
    { id: 6, x: 70, y: 85 },
  ];
};

export function LetterDotToDot() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const rawLetters = letter
    ? letter.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : (masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : ['A']));
  const targetLetters = rawLetters.length > 0 ? rawLetters : ['A'];

  const [letterIndex, setLetterIndex] = useState(0);
  const currentLetter = targetLetters[letterIndex] || targetLetters[0];
  const ld = LETTERS_DATA.find(l => l.letter === currentLetter) || LETTERS_DATA[0];

  const [currentDot, setCurrentDot] = useState(1);
  const [mistakes, setMistakes] = useState(0);
  const [lines, setLines] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const dots = getDotsForChar(currentLetter);

  useEffect(() => {
    if (currentLetter) {
      speak(currentLetter);
      setCurrentDot(1);
      setLines([]);
    }
  }, [currentLetter, speak]);

  const handleDotClick = (dot: Dot) => {
    if (dot.id === currentDot) {
      playPop();
      
      if (currentDot > 1) {
        const prevDot = dots.find(d => d.id === currentDot - 1);
        if (prevDot) {
          setLines(prev => [...prev, { x1: prevDot.x, y1: prevDot.y, x2: dot.x, y2: dot.y }]);
        }
      }

      if (currentDot === dots.length) {
        setTimeout(() => {
          awardStars(`dot-to-dot-${currentLetter}`, 3);
          incrementActivity(`dot-to-dot-${currentLetter}`);

          if (letterIndex < targetLetters.length - 1) {
            speak(`Awesome! Now let's connect letter ${targetLetters[letterIndex + 1]}!`);
            setLetterIndex(i => i + 1);
          } else {
            playFanfare();
            const earnedStars = calculateStars(mistakes);
            targetLetters.forEach(l => {
              awardStars(`dot-to-dot-${l}`, earnedStars);
              incrementActivity(`dot-to-dot-${l}`);
            });
            awardStars('letter-dot-to-dot', earnedStars);
            incrementActivity('letter-dot-to-dot');
            setShowCelebration(true);
          }
        }, 600);
      } else {
        setCurrentDot(c => c + 1);
      }
    } else {
      setMistakes(m => m + 1);
      playBoing();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-indigo-50 font-nunito relative">
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate('/letters')} color="#4F46E5" />
        <h1 className="text-3xl md:text-4xl font-black text-indigo-600">Connect {currentLetter}</h1>
        {targetLetters.length > 1 ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur rounded-full shadow-md border-2 border-indigo-300">
            <span className="text-xs font-black text-indigo-900">
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
                      ? 'bg-indigo-600 text-white scale-110 shadow-md ring-2 ring-indigo-300'
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

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl px-4 pb-20">
        <h2 className="text-xl font-bold text-indigo-800 mb-8">Tap the numbers in order!</h2>
        
        <div className="relative w-full aspect-square bg-white rounded-3xl shadow-xl border-4 border-indigo-200 overflow-hidden">
          {/* SVG for lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {lines.map((line, i) => (
              <motion.line
                key={i}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Dots */}
          {dots.map((dot) => {
            const isNext = dot.id === currentDot;
            const isDone = dot.id < currentDot;
            return (
              <motion.button
                key={dot.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={isNext ? { scale: 1.2 } : {}}
                whileTap={isNext ? { scale: 0.9 } : {}}
                onClick={() => handleDotClick(dot)}
                className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg border-2 z-10 -translate-x-1/2 -translate-y-1/2 ${
                  isNext ? 'bg-yellow-400 border-yellow-600 text-yellow-950' :
                  isDone ? 'bg-indigo-500 border-indigo-700 text-white' :
                  'bg-white border-slate-200 text-slate-400'
                }`}
                style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
              >
                {dot.id}
              </motion.button>
            );
          })}
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={calculateStars(mistakes)} message="Amazing connections!"
        onContinue={() => navigate('/letters/activity/letter-dot-to-dot')} />
    </div>
  );
}
