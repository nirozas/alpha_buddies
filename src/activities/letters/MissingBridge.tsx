import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';

interface BridgePuzzle {
  word: string;
  missingIndex: number;
  options: string[];
}

const PUZZLES: BridgePuzzle[] = [
  { word: 'CAT', missingIndex: 1, options: ['A', 'E', 'O'] },
  { word: 'DOG', missingIndex: 1, options: ['O', 'U', 'I'] },
  { word: 'SUN', missingIndex: 1, options: ['U', 'A', 'E'] },
  { word: 'PIG', missingIndex: 1, options: ['I', 'O', 'A'] },
  { word: 'BED', missingIndex: 1, options: ['E', 'I', 'U'] },
];

export function MissingBridge() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [bearMoving, setBearMoving] = useState(false);
  
  const currentPuzzle = PUZZLES[puzzleIdx];
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    speak(`Help Buddy Bear cross the river! What letter is missing in ${currentPuzzle.word}?`);
  }, [puzzleIdx]);

  const handleDragEnd = (event: any, info: any, option: string) => {
    if (placed || bearMoving) return;
    const rect = targetRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { x, y } = info.point;
    const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isInside && option === currentPuzzle.word[currentPuzzle.missingIndex]) {
      setPlaced(true);
      playDing();
      speak(option);
      
      setTimeout(() => {
        setBearMoving(true);
        setTimeout(() => {
          if (puzzleIdx < PUZZLES.length - 1) {
            setPuzzleIdx(p => p + 1);
            setPlaced(false);
            setBearMoving(false);
            setMistakes(0);
          } else {
            playFanfare();
            awardStars('missing-bridge', 3);
            incrementActivity('missing-bridge');
            setShowCelebration(true);
          }
        }, 2000);
      }, 1000);
    } else if (isInside) {
      playBoing();
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-blue-50 font-nunito relative overflow-hidden pb-10">
      <div className="w-full flex items-center p-4 z-10">
        <BackButton onClick={() => navigate('/letters')} color="#2563EB" />
        <h1 className="flex-1 text-center text-4xl font-black text-blue-700">Missing Bridge</h1>
      </div>

      {/* River Environment */}
      <div className="flex-1 w-full relative flex items-center justify-center">
        {/* Grass Banks */}
        <div className="absolute inset-y-0 left-0 w-1/4 bg-green-400 border-r-8 border-green-600" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-green-400 border-l-8 border-green-600" />
        
        {/* Water */}
        <div className="absolute inset-y-0 left-1/4 right-1/4 bg-blue-400 overflow-hidden">
          <motion.div 
            animate={{ x: [-20, 20] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-[200%] h-full opacity-30"
            style={{ background: 'repeating-linear-gradient(45deg, #FFF, #FFF 10px, transparent 10px, transparent 40px)' }}
          />
        </div>

        {/* Bridge Logs */}
        <div className="relative z-10 flex gap-4">
          {currentPuzzle.word.split('').map((char, i) => {
            const isMissing = i === currentPuzzle.missingIndex;
            return (
              <div 
                key={i}
                ref={isMissing ? targetRef : null}
                className={`w-24 h-32 md:w-32 md:h-40 bg-[#8B4513] rounded-2xl border-4 border-[#5C3A21] flex items-center justify-center shadow-2xl relative ${isMissing && !placed ? 'bg-opacity-40 border-dashed' : ''}`}
              >
                <div className="absolute inset-2 border-2 border-[#5C3A21] rounded-lg opacity-30" />
                <AnimatePresence>
                  {(!isMissing || placed) && (
                    <motion.span 
                      initial={isMissing ? { y: -100, opacity: 0 } : false}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-6xl md:text-8xl font-black text-white drop-shadow-lg"
                    >
                      {char}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isMissing && !placed && <span className="text-4xl text-white opacity-20">?</span>}
              </div>
            );
          })}
        </div>

        {/* Buddy Bear */}
        <motion.div 
          initial={{ x: -300 }}
          animate={bearMoving ? { x: 300 } : { x: -300 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="absolute left-1/2 bottom-1/4 z-20"
        >
          <BuddyBear mood={placed ? 'happy' : 'neutral'} />
        </motion.div>
      </div>

      {/* Options */}
      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-t-8 border-blue-200 z-30">
        <h2 className="text-center text-xl font-bold text-blue-900 mb-6 uppercase tracking-widest">Pick the missing log!</h2>
        <div className="flex justify-center gap-8">
          {currentPuzzle.options.map((opt, i) => (
            <motion.div
              key={i}
              drag={!placed && !bearMoving}
              dragSnapToOrigin
              onDragEnd={(event, info) => handleDragEnd(event, info, opt)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, cursor: 'grabbing' }}
              className={`w-20 h-20 md:w-28 md:h-28 bg-[#8B4513] rounded-2xl flex items-center justify-center text-4xl md:text-6xl font-black text-white shadow-xl border-4 border-[#5C3A21] cursor-grab transition-opacity ${placed && opt === currentPuzzle.word[currentPuzzle.missingIndex] ? 'opacity-30' : ''}`}
            >
              {opt}
            </motion.div>
          ))}
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={3} message="Bridge Fixed! 🌉"
        onContinue={() => navigate('/letters')} />
    </div>
  );
}
