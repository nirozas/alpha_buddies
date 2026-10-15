import { calculateStars } from '../../utils/scoring';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

interface Dot { x: number; y: number; id: number }

const DOT_PATHS: Record<string, Dot[]> = {
  'A': [
    { id: 1, x: 18, y: 85 }, { id: 2, x: 34, y: 48 }, { id: 3, x: 50, y: 12 },
    { id: 4, x: 66, y: 48 }, { id: 5, x: 82, y: 85 }, { id: 6, x: 68, y: 60 }, { id: 7, x: 32, y: 60 }
  ],
  'B': [
    { id: 1, x: 25, y: 86 }, { id: 2, x: 25, y: 50 }, { id: 3, x: 25, y: 14 },
    { id: 4, x: 55, y: 14 }, { id: 5, x: 76, y: 32 }, { id: 6, x: 31, y: 50 },
    { id: 7, x: 78, y: 68 }, { id: 8, x: 55, y: 86 }, { id: 9, x: 31, y: 86 }
  ],
  'C': [
    { id: 1, x: 78, y: 22 }, { id: 2, x: 50, y: 12 }, { id: 3, x: 22, y: 32 },
    { id: 4, x: 18, y: 50 }, { id: 5, x: 22, y: 68 }, { id: 6, x: 50, y: 88 }, { id: 7, x: 78, y: 78 }
  ],
  'D': [
    { id: 1, x: 25, y: 86 }, { id: 2, x: 25, y: 50 }, { id: 3, x: 25, y: 14 },
    { id: 4, x: 55, y: 14 }, { id: 5, x: 78, y: 32 }, { id: 6, x: 80, y: 50 },
    { id: 7, x: 78, y: 68 }, { id: 8, x: 55, y: 86 }, { id: 9, x: 31, y: 86 }
  ],
  'E': [
    { id: 1, x: 75, y: 14 }, { id: 2, x: 25, y: 14 }, { id: 3, x: 25, y: 47 },
    { id: 4, x: 65, y: 50 }, { id: 5, x: 25, y: 52 }, { id: 6, x: 25, y: 86 }, { id: 7, x: 75, y: 86 }
  ],
  'F': [
    { id: 1, x: 25, y: 86 }, { id: 2, x: 25, y: 53 }, { id: 3, x: 65, y: 50 },
    { id: 4, x: 25, y: 48 }, { id: 5, x: 25, y: 14 }, { id: 6, x: 75, y: 14 }
  ],
  'G': [
    { id: 1, x: 75, y: 22 }, { id: 2, x: 50, y: 12 }, { id: 3, x: 20, y: 32 },
    { id: 4, x: 18, y: 50 }, { id: 5, x: 22, y: 68 }, { id: 6, x: 50, y: 88 },
    { id: 7, x: 78, y: 85 }, { id: 8, x: 78, y: 55 }, { id: 9, x: 55, y: 55 }
  ],
  'H': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 25, y: 46 }, { id: 3, x: 25, y: 86 },
    { id: 4, x: 31, y: 50 }, { id: 5, x: 75, y: 50 }, { id: 6, x: 75, y: 14 },
    { id: 7, x: 75, y: 86 }
  ],
  'I': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 75, y: 14 }, { id: 3, x: 50, y: 14 },
    { id: 4, x: 50, y: 50 }, { id: 5, x: 47, y: 86 }, { id: 6, x: 25, y: 86 },
    { id: 7, x: 53, y: 86 }, { id: 8, x: 75, y: 86 }
  ],
  'J': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 75, y: 14 }, { id: 3, x: 50, y: 14 },
    { id: 4, x: 50, y: 48 }, { id: 5, x: 50, y: 68 }, { id: 6, x: 36, y: 86 }, { id: 7, x: 22, y: 70 }
  ],
  'K': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 25, y: 46 }, { id: 3, x: 25, y: 86 },
    { id: 4, x: 25, y: 54 }, { id: 5, x: 75, y: 14 }, { id: 6, x: 31, y: 50 },
    { id: 7, x: 78, y: 86 }
  ],
  'L': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 25, y: 50 }, { id: 3, x: 25, y: 86 },
    { id: 4, x: 55, y: 86 }, { id: 5, x: 80, y: 86 }
  ],
  'M': [
    { id: 1, x: 18, y: 86 }, { id: 2, x: 18, y: 48 }, { id: 3, x: 18, y: 14 },
    { id: 4, x: 50, y: 55 }, { id: 5, x: 82, y: 14 }, { id: 6, x: 82, y: 48 }, { id: 7, x: 82, y: 86 }
  ],
  'N': [
    { id: 1, x: 22, y: 86 }, { id: 2, x: 22, y: 48 }, { id: 3, x: 22, y: 14 },
    { id: 4, x: 50, y: 50 }, { id: 5, x: 78, y: 86 }, { id: 6, x: 78, y: 48 }, { id: 7, x: 78, y: 14 }
  ],
  'O': [
    { id: 1, x: 50, y: 12 }, { id: 2, x: 22, y: 32 }, { id: 3, x: 16, y: 50 },
    { id: 4, x: 22, y: 68 }, { id: 5, x: 50, y: 88 }, { id: 6, x: 78, y: 68 },
    { id: 7, x: 84, y: 50 }, { id: 8, x: 78, y: 32 }, { id: 9, x: 55, y: 13 }
  ],
  'P': [
    { id: 1, x: 25, y: 86 }, { id: 2, x: 25, y: 50 }, { id: 3, x: 25, y: 14 },
    { id: 4, x: 55, y: 14 }, { id: 5, x: 78, y: 32 }, { id: 6, x: 55, y: 50 }, { id: 7, x: 31, y: 50 }
  ],
  'Q': [
    { id: 1, x: 56, y: 62 }, { id: 2, x: 85, y: 88 }, { id: 3, x: 70, y: 74 },
    { id: 4, x: 76, y: 70 }, { id: 5, x: 84, y: 50 }, { id: 6, x: 78, y: 32 },
    { id: 7, x: 50, y: 14 }, { id: 8, x: 22, y: 32 }, { id: 9, x: 16, y: 50 },
    { id: 10, x: 22, y: 68 }, { id: 11, x: 50, y: 86 }, { id: 12, x: 72, y: 82 }
  ],
  'R': [
    { id: 1, x: 25, y: 86 }, { id: 2, x: 25, y: 50 }, { id: 3, x: 25, y: 14 },
    { id: 4, x: 55, y: 14 }, { id: 5, x: 78, y: 32 }, { id: 6, x: 55, y: 50 },
    { id: 7, x: 31, y: 50 }, { id: 8, x: 58, y: 65 }, { id: 9, x: 80, y: 86 }
  ],
  'S': [
    { id: 1, x: 75, y: 22 }, { id: 2, x: 50, y: 12 }, { id: 3, x: 25, y: 28 },
    { id: 4, x: 50, y: 50 }, { id: 5, x: 75, y: 72 }, { id: 6, x: 50, y: 88 }, { id: 7, x: 25, y: 78 }
  ],
  'T': [
    { id: 1, x: 15, y: 14 }, { id: 2, x: 47, y: 14 }, { id: 3, x: 85, y: 14 },
    { id: 4, x: 53, y: 14 }, { id: 5, x: 50, y: 50 }, { id: 6, x: 50, y: 86 }
  ],
  'U': [
    { id: 1, x: 25, y: 14 }, { id: 2, x: 25, y: 48 }, { id: 3, x: 25, y: 72 },
    { id: 4, x: 50, y: 88 }, { id: 5, x: 75, y: 72 }, { id: 6, x: 75, y: 48 }, { id: 7, x: 75, y: 14 }
  ],
  'V': [
    { id: 1, x: 20, y: 14 }, { id: 2, x: 35, y: 50 }, { id: 3, x: 50, y: 86 },
    { id: 4, x: 65, y: 50 }, { id: 5, x: 80, y: 14 }
  ],
  'W': [
    { id: 1, x: 15, y: 14 }, { id: 2, x: 25, y: 86 }, { id: 3, x: 50, y: 42 },
    { id: 4, x: 75, y: 86 }, { id: 5, x: 85, y: 14 }
  ],
  'X': [
    { id: 1, x: 20, y: 14 }, { id: 2, x: 50, y: 50 }, { id: 3, x: 80, y: 86 },
    { id: 4, x: 54, y: 47 }, { id: 5, x: 80, y: 14 }, { id: 6, x: 46, y: 53 },
    { id: 7, x: 20, y: 86 }
  ],
  'Y': [
    { id: 1, x: 20, y: 14 }, { id: 2, x: 47, y: 48 }, { id: 3, x: 80, y: 14 },
    { id: 4, x: 53, y: 48 }, { id: 5, x: 50, y: 86 }
  ],
  'Z': [
    { id: 1, x: 22, y: 14 }, { id: 2, x: 50, y: 14 }, { id: 3, x: 78, y: 14 },
    { id: 4, x: 50, y: 50 }, { id: 5, x: 22, y: 86 }, { id: 6, x: 50, y: 86 }, { id: 7, x: 78, y: 86 }
  ]
};

const getDotsForChar = (c: string): Dot[] => {
  const char = c.toUpperCase();
  return DOT_PATHS[char] || DOT_PATHS['A'];
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
  const [hintActive, setHintActive] = useState(true);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [mistakes, setMistakes] = useState(0);
  const [lines, setLines] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const dots = getDotsForChar(currentLetter);

  const clearHintTimer = () => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (currentLetter) {
      speak(currentLetter);
      setCurrentDot(1);
      setLines([]);
      setHintActive(true);
      clearHintTimer();
    }
  }, [currentLetter, speak]);

  // Manage 6-second inactivity hint
  useEffect(() => {
    clearHintTimer();

    // Dot 1 is immediately highlighted in yellow at the start
    if (currentDot === 1) {
      setHintActive(true);
      return;
    }

    // For dot 2 and beyond, do NOT show yellow initially
    setHintActive(false);

    // If 6 seconds pass without selecting the correct next dot, turn it yellow
    if (currentDot <= dots.length) {
      hintTimerRef.current = setTimeout(() => {
        setHintActive(true);
      }, 6000);
    }

    return () => clearHintTimer();
  }, [currentDot, dots.length]);

  const handleDotClick = (dot: Dot) => {
    if (dot.id === currentDot) {
      playPop();
      clearHintTimer();
      
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
        
        <div className="relative w-full aspect-square bg-white rounded-3xl shadow-xl border-4 border-indigo-200 overflow-hidden flex items-center justify-center">
          {/* Real Background Letter scaled & placed to fit the letter bounds */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100">
            {currentLetter === 'J' ? (
              <g stroke="#4F46E5" strokeOpacity="0.08" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <line x1="25" y1="14" x2="75" y2="14" />
                <path d="M 50,14 L 50,66 C 50,84 22,84 22,70" />
              </g>
            ) : currentLetter === 'I' ? (
              <g stroke="#4F46E5" strokeOpacity="0.08" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none">
                <line x1="25" y1="14" x2="75" y2="14" />
                <line x1="50" y1="14" x2="50" y2="86" />
                <line x1="25" y1="86" x2="75" y2="86" />
              </g>
            ) : (
              <text
                x="50"
                y="86"
                textAnchor="middle"
                fontSize="102"
                fontWeight="900"
                fontFamily="Nunito, system-ui, sans-serif"
                fill="#4F46E5"
                fillOpacity="0.08"
                className="select-none"
              >
                {currentLetter}
              </text>
            )}
          </svg>

          {/* SVG for lines drawn by player */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100">
            {lines.map((line, i) => (
              <motion.line
                key={i}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="#4F46E5" strokeWidth="5" strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Dots */}
          {dots.map((dot) => {
            const isDone = dot.id < currentDot;
            const isNext = dot.id === currentDot;
            const isYellow = isNext && (currentDot === 1 || hintActive);

            return (
              <motion.button
                key={dot.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={isNext ? { scale: 1.15 } : {}}
                whileTap={isNext ? { scale: 0.95 } : {}}
                onClick={() => handleDotClick(dot)}
                className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg md:text-xl border-2 -translate-x-1/2 -translate-y-1/2 transition-all ${
                  isDone
                    ? 'bg-indigo-600 border-indigo-700 text-white shadow-md z-20'
                    : isYellow
                    ? 'bg-amber-300 border-amber-400 text-amber-950 shadow-md ring-4 ring-amber-100/90 animate-pulse scale-105 z-30'
                    : 'bg-white border-2 border-indigo-300 text-indigo-700 shadow-sm z-10'
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
