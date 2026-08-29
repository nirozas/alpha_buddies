import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

export function AlphabetTrain() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const [sequence, setSequence] = useState<string[]>([]);
  const [missingIndex, setMissingIndex] = useState<number>(0);
  const [options, setOptions] = useState<string[]>([]);
  const [placed, setPlaced] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [animatingTrain, setAnimatingTrain] = useState(false);
  const [level, setLevel] = useState(1);
  const totalLevels = 40;
  const missingCarRef = useRef<HTMLDivElement>(null);

  const generateRound = (lvl: number) => {
    // Progressive starting point: 0 to 22
    // We have 40 levels, so we cycle through the alphabet roughly twice
    const startIdx = Math.floor((lvl - 1) / 1.8) % 23;
    const seq = LETTERS_DATA.slice(startIdx, startIdx + 4).map(l => l.letter);
    
    // Vary the missing index based on level so it's not always the same position
    const mIdx = (lvl - 1) % 4;
    
    // Generate 3 wrong options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 3) {
      const randLetter = LETTERS_DATA[Math.floor(Math.random() * 26)].letter;
      if (!seq.includes(randLetter) && !wrongOptions.includes(randLetter)) {
        wrongOptions.push(randLetter);
      }
    }
    
    const allOptions = [...wrongOptions, seq[mIdx]].sort(() => Math.random() - 0.5);

    setSequence(seq);
    setMissingIndex(mIdx);
    setOptions(allOptions);
    setPlaced(false);
    setMistakes(0);
    setAnimatingTrain(false);
  };

  useEffect(() => {
    generateRound(level);
  }, [level]);

  const handleDragEnd = (event: any, info: any, optionLetter: string) => {
    if (placed || animatingTrain) return;
    
    const rect = missingCarRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Check if the point is within the drop zone (missing car)
    const { x, y } = info.point;
    const isInside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    if (isInside) {
      if (optionLetter === sequence[missingIndex]) {
        // Correct!
        setPlaced(true);
        playDing();
        speak(optionLetter);
        
        setTimeout(() => {
          setAnimatingTrain(true);
          
          if (level < totalLevels) {
            // Move to next level after animation
            setTimeout(() => {
              setLevel(l => l + 1);
            }, 2000);
          } else {
            // Final Victory
            playFanfare();
            const stars = mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1;
            awardStars('alphabet-train', stars);
            incrementActivity('alphabet-train');
            setTimeout(() => setShowCelebration(true), 2000);
          }
        }, 1000);
      } else {
        // Wrong!
        playBoing();
        setMistakes(m => m + 1);
      }
    }
  };

  // Keep handleOptionClick for accessibility/keyboard if needed, but primary is drag
  const handleOptionClick = (optionLetter: string) => {
    if (placed) return;
    speak(optionLetter); // Just speak on tap, don't place
  };

  if (sequence.length === 0) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center bg-gradient-to-b from-sky-300 to-green-400 relative overflow-hidden font-nunito pb-8">
      {/* Clouds */}
      <div className="absolute top-10 left-10 text-6xl opacity-80">☁️</div>
      <div className="absolute top-20 right-20 text-8xl opacity-60">☁️</div>
      
      <div className="w-full flex items-center p-4 sticky top-0 z-10">
        <BackButton onClick={() => navigate('/letters')} color="#FFFFFF" />
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-4xl font-black text-white drop-shadow-md">Alphabet Train</h1>
          <div className="bg-white/30 backdrop-blur px-4 py-1 rounded-full text-white font-bold text-sm border border-white/50 mt-1">
            Level {level} / {totalLevels}
          </div>
        </div>
        <div className="w-14" />
      </div>

      <div className="flex-1 w-full max-w-5xl flex flex-col items-center justify-center relative mt-12 px-4">
        
        {/* Track */}
        <div className="absolute top-[60%] left-0 right-0 h-4 bg-slate-800 z-0 flex gap-2 overflow-hidden px-4">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="w-4 h-full bg-slate-600 skew-x-[30deg]"></div>
          ))}
        </div>

        {/* Train Sequence */}
        <motion.div 
          className="flex items-end gap-2 md:gap-4 z-10"
          animate={animatingTrain ? { x: '150%' } : { x: 0 }}
          transition={{ duration: 2, ease: "easeIn" }}
        >
          {/* Engine */}
          <div className="w-24 h-32 md:w-32 md:h-40 bg-red-500 rounded-tr-3xl rounded-tl-xl border-4 border-slate-800 relative flex flex-col justify-end p-2 shadow-xl">
            <div className="absolute -top-12 right-4 w-8 h-16 bg-slate-300 rounded-t-full border-4 border-slate-800 flex justify-center">
              <motion.div 
                animate={{ y: [-5, -20], opacity: [1, 0], scale: [1, 2] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 bg-white rounded-full absolute -top-4"
              />
            </div>
            <div className="w-full h-1/2 bg-red-600 rounded border-2 border-red-800"></div>
            <div className="flex justify-between mt-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-400"></div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-400"></div>
            </div>
          </div>

          {/* Cars */}
          {sequence.map((letter, idx) => {
            const isMissing = idx === missingIndex;
            return (
              <div key={idx} className="relative flex items-end">
                {/* Connector */}
                <div className="w-4 h-2 bg-slate-800 absolute -left-4 bottom-4"></div>
                
                {/* Car */}
                <div 
                  ref={isMissing ? missingCarRef : null}
                  onClick={() => (!isMissing || placed) && speak(letter)}
                  className={`w-20 h-24 md:w-28 md:h-32 rounded-xl border-4 border-slate-800 flex flex-col items-center justify-between p-2 shadow-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 ${['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'][idx]}`}
                >
                  <div className="w-full flex-1 bg-white/50 rounded-lg flex items-center justify-center border-2 border-white overflow-hidden relative">
                    <AnimatePresence>
                      {(!isMissing || placed) && (
                        <motion.span 
                          initial={isMissing ? { scale: 0, y: -50 } : false}
                          animate={{ scale: 1, y: 0 }}
                          className="text-4xl md:text-6xl font-black text-slate-800"
                        >
                          {letter}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isMissing && !placed && (
                      <span className="text-4xl md:text-6xl font-black text-slate-800/20">?</span>
                    )}
                  </div>
                  <div className="flex justify-between w-full mt-2 px-2">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 border-2 border-slate-400"></div>
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-800 border-2 border-slate-400"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Options */}
      <div className="mt-auto w-full max-w-2xl bg-white/90 backdrop-blur-md p-6 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] border-t-4 border-white z-20">
        <h2 className="text-center text-xl font-bold text-slate-600 mb-4">Drag the letter to the train!</h2>
        <div className="flex justify-center gap-4 md:gap-8">
          {options.map((opt, i) => (
            <motion.div
              key={i}
              drag={!placed && !animatingTrain}
              dragSnapToOrigin
              onDragEnd={(event, info) => handleDragEnd(event, info, opt)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9, cursor: 'grabbing' }}
              onClick={() => handleOptionClick(opt)}
              className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-black text-white shadow-lg border-b-4 cursor-grab z-30 transition-opacity ${placed && opt === sequence[missingIndex] ? 'opacity-50' : 'bg-indigo-500 border-indigo-600 hover:bg-indigo-400'}`}
            >
              {opt}
            </motion.div>
          ))}
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 3 ? 2 : 1} message="Amazing! 🚂 You finished all levels!"
        onContinue={() => {
          setShowCelebration(false);
          setLevel(1);
        }} />
    </div>
  );
}
