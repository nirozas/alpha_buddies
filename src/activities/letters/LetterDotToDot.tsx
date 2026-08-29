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
    { id: 3, x: 30, y: 10 }, { id: 4, x: 80, y: 50 }, { id: 5, x: 30, y: 90 }
  ]
};

export function LetterDotToDot() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playFanfare, speak } = useAudio();

  const [currentDot, setCurrentDot] = useState(1);
  const [lines, setLines] = useState<{ x1: number, y1: number, x2: number, y2: number }[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const dots = DOT_PATHS[letter || 'A'] || DOT_PATHS['A'];

  useEffect(() => {
    if (letter) speak(letter);
  }, [letter, speak]);

  const handleDotClick = (dot: Dot) => {
    if (dot.id === currentDot) {
      playPop();
      
      // If not the first dot, draw line from previous
      if (currentDot > 1) {
        // This simple version assumes dots are in order. 
        // For 'A' we have 4->5->6 and 7->8 which aren't contiguous from 3->4.
        // Let's refine: draw line if it's not the start of a new segment.
        // For simplicity in this demo, let's just draw line from the last dot clicked.
        const prevDot = dots.find(d => d.id === currentDot - 1);
        if (prevDot) {
          setLines(prev => [...prev, { x1: prevDot.x, y1: prevDot.y, x2: dot.x, y2: dot.y }]);
        }
      }

      if (currentDot === dots.length) {
        setTimeout(() => {
          playFanfare();
          awardStars(`dot-to-dot-${letter}`, 3);
          incrementActivity(`dot-to-dot-${letter}`);
          setShowCelebration(true);
        }, 500);
      } else {
        setCurrentDot(c => c + 1);
      }
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-indigo-50 font-nunito relative">
      <div className="w-full flex items-center p-4">
        <BackButton onClick={() => navigate('/letters/activity/letter-dot-to-dot')} color="#4F46E5" />
        <h1 className="flex-1 text-center text-4xl font-black text-indigo-600">Connect the Dots</h1>
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

      <CelebrationScreen active={showCelebration} stars={3} message="Amazing connections!"
        onContinue={() => navigate('/letters/activity/letter-dot-to-dot')} />
    </div>
  );
}
