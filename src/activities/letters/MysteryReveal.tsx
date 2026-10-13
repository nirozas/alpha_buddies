import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type MatchMode = 'to-lowercase' | 'to-capital' | 'both';

// ─────────────────────────────────────────────────────────────
// SETUP SCREEN COMPONENT
// ─────────────────────────────────────────────────────────────
interface SetupScreenProps {
  initialLetters: string[];
  mode: MatchMode;
  onModeChange: (mode: MatchMode) => void;
  onStart: (letters: string[], mode: MatchMode) => void;
  onExit: () => void;
}

function MysteryRevealSetup({
  initialLetters,
  mode,
  onModeChange,
  onStart,
  onExit,
}: SetupScreenProps) {
  const [selectedLetters, setSelectedLetters] = useState<string[]>(
    initialLetters.length > 0 ? initialLetters : ['A']
  );

  const toggleLetter = (l: string) => {
    setSelectedLetters(prev => {
      if (prev.includes(l)) {
        return prev.length > 1 ? prev.filter(x => x !== l) : prev;
      } else {
        return [...prev, l];
      }
    });
  };

  const selectAll = () => setSelectedLetters([...ALPHABET]);
  const resetToInitial = () => setSelectedLetters(initialLetters.length > 0 ? initialLetters : ['A']);

  const primaryLetter = selectedLetters[0] || 'A';
  const primaryLD = LETTERS_DATA.find(l => l.letter === primaryLetter) || LETTERS_DATA[0];

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between overflow-hidden bg-gradient-to-b from-sky-50 via-indigo-50 to-blue-100 p-2 sm:p-4 select-none font-nunito">
      <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between">
        {/* Header Bar */}
        <div className="flex items-center justify-between shrink-0 mb-1">
          <BackButton onClick={onExit} color="#4F46E5" />
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">❄️</span>
            <h1 className="text-xl sm:text-2xl font-black text-indigo-700 tracking-tight">
              Mystery Reveal
            </h1>
          </div>
          <div style={{ width: 44 }} />
        </div>

        {/* Mode Selector - Compact Segmented Row */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 shadow-md border border-indigo-100 shrink-0 mb-2">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="font-black text-xs sm:text-sm text-indigo-950 flex items-center gap-1">
              <span>🎯</span> Match Goal:
            </span>
            <span className="text-[11px] font-bold text-indigo-500">
              {mode === 'to-lowercase' ? 'Scratch Capital ➔ Pick Lowercase' : mode === 'to-capital' ? 'Scratch Lowercase ➔ Pick Capital' : 'Mixed Alternating'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Mode 1: To Lowercase */}
            <button
              type="button"
              onClick={() => onModeChange('to-lowercase')}
              className={`py-2 px-1 rounded-xl text-center font-black transition-all cursor-pointer border-2 ${
                mode === 'to-lowercase'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-indigo-100 hover:bg-indigo-50'
              }`}
            >
              <div className="text-sm sm:text-base font-black">A ➔ a</div>
              <div className="text-[10px] sm:text-xs opacity-90">Find Lowercase</div>
            </button>

            {/* Mode 2: To Capital */}
            <button
              type="button"
              onClick={() => onModeChange('to-capital')}
              className={`py-2 px-1 rounded-xl text-center font-black transition-all cursor-pointer border-2 ${
                mode === 'to-capital'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-indigo-100 hover:bg-indigo-50'
              }`}
            >
              <div className="text-sm sm:text-base font-black">a ➔ A</div>
              <div className="text-[10px] sm:text-xs opacity-90">Find Capital</div>
            </button>

            {/* Mode 3: Mix Both */}
            <button
              type="button"
              onClick={() => onModeChange('both')}
              className={`py-2 px-1 rounded-xl text-center font-black transition-all cursor-pointer border-2 ${
                mode === 'both'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-indigo-100 hover:bg-indigo-50'
              }`}
            >
              <div className="text-sm sm:text-base font-black">A ⇄ a</div>
              <div className="text-[10px] sm:text-xs opacity-90">Mix Both</div>
            </button>
          </div>
        </div>

        {/* Letter Selector Grid: Fits all 26 letters in screen view without scrolling */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 shadow-md border border-indigo-100 flex-1 flex flex-col justify-between min-h-0 mb-2">
          <div className="flex items-center justify-between mb-1 shrink-0 px-1">
            <span className="font-black text-xs sm:text-sm text-indigo-950 flex items-center gap-1">
              <span>🔤</span> Selected ({selectedLetters.length}/26):
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={selectAll}
                className="text-xs font-black px-2.5 py-0.5 rounded-full border border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
              >
                All
              </button>
              <button
                type="button"
                onClick={resetToInitial}
                className="text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto py-1">
            <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 w-full justify-items-stretch">
              {ALPHABET.map(l => {
                const ld = LETTERS_DATA.find(x => x.letter === l) || LETTERS_DATA[0];
                const isSelected = selectedLetters.includes(l);
                return (
                  <motion.button
                    key={l}
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleLetter(l)}
                    className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-black transition-all shadow-sm border-2 cursor-pointer ${
                      isSelected
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                    }`}
                    style={{
                      backgroundColor: isSelected ? ld.color : undefined,
                      fontSize: 'clamp(1rem, 2.4vw, 1.6rem)',
                    }}
                  >
                    {mode === 'to-capital'
                      ? ld.lowercase
                      : mode === 'both'
                      ? `${ld.uppercase}`
                      : ld.uppercase}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="shrink-0 pt-1 pb-1">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(selectedLetters, mode)}
            className="w-full py-3 sm:py-3.5 rounded-2xl text-white font-black text-base sm:text-lg shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer"
            style={{
              backgroundColor: primaryLD.color || '#4F46E5',
            }}
          >
            <span>❄️</span>
            <span>Start Mystery Reveal ({selectedLetters.length} letter{selectedLetters.length > 1 ? 's' : ''})</span>
            <span>🔍</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN MYSTERY REVEAL GAME
// ─────────────────────────────────────────────────────────────
export function MysteryReveal() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const rawLetters = useMemo(() => {
    return letter
      ? letter.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
      : (masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : ['A']));
  }, [letter, masteredLetters, masteredLetter]);

  const [gameStarted, setGameStarted] = useState(false);
  const [matchMode, setMatchMode] = useState<MatchMode>('to-lowercase');
  const [activeLetters, setActiveLetters] = useState<string[]>(rawLetters.length > 0 ? rawLetters : ['A']);

  const [letterIndex, setLetterIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [guessed, setGuessed] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [shakeOption, setShakeOption] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const currentLetter = activeLetters[letterIndex] || activeLetters[0] || 'A';
  const lData = LETTERS_DATA.find(l => l.letter === currentLetter) || LETTERS_DATA[0];

  // Determine the direction for the current round
  const currentDirection: 'to-lowercase' | 'to-capital' = useMemo(() => {
    if (matchMode === 'to-lowercase') return 'to-lowercase';
    if (matchMode === 'to-capital') return 'to-capital';
    // Both mode: alternate per index
    return letterIndex % 2 === 0 ? 'to-lowercase' : 'to-capital';
  }, [matchMode, letterIndex]);

  // Hidden letter display vs options display
  const hiddenLetterDisplay = currentDirection === 'to-lowercase' ? lData.uppercase : lData.lowercase;
  const targetMatchAnswer = currentDirection === 'to-lowercase' ? lData.lowercase : lData.uppercase;

  // Initialize canvas frost & options for the active round
  useEffect(() => {
    if (!gameStarted || !lData) return;

    setGuessed(false);
    setScratchPercent(0);
    setShakeOption(null);

    // Build 3 or 4 choices (1 correct, 2 or 3 distractors)
    const distractorLetters: string[] = [];
    const pool = ALPHABET.filter(l => l !== currentLetter);
    while (distractorLetters.length < 3) {
      const rand = pool[Math.floor(Math.random() * pool.length)];
      if (!distractorLetters.includes(rand)) {
        distractorLetters.push(rand);
      }
    }

    const distractorOptions = distractorLetters.map(dl => {
      const dld = LETTERS_DATA.find(x => x.letter === dl) || LETTERS_DATA[0];
      return currentDirection === 'to-lowercase' ? dld.lowercase : dld.uppercase;
    });

    const allOpts = [targetMatchAnswer, ...distractorOptions].sort(() => Math.random() - 0.5);
    setOptions(allOpts);

    // Frost Canvas initialization
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.globalCompositeOperation = 'source-over';
        
        // Ice gradient
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#7DD3FC'); // light sky blue
        grad.addColorStop(0.5, '#BAE6FD'); // frost blue
        grad.addColorStop(1, '#93C5FD'); // cool ice
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw snowy frost crystal specks
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        for (let i = 0; i < 90; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 3.5 + 1.2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }

        // Draw light frosty cross-hatching
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < 15; i++) {
          ctx.beginPath();
          const startX = Math.random() * canvas.width;
          const startY = Math.random() * canvas.height;
          ctx.moveTo(startX, startY);
          ctx.lineTo(startX + (Math.random() * 40 - 20), startY + (Math.random() * 40 - 20));
          ctx.stroke();
        }
      }
    }
  }, [gameStarted, currentLetter, currentDirection, targetMatchAnswer, lData]);

  // Scratch handler with smooth line strokes
  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || guessed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 55;

    if (lastPoint.current) {
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, 27.5, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPoint.current = { x, y };

    // Increment scratch feedback
    setScratchPercent(prev => Math.min(100, prev + 1.2));
  };

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    lastPoint.current = null;
    playPop();
    scratch(e);
  };

  const handleEndDraw = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const handleGuess = (opt: string) => {
    if (guessed) return;

    if (opt === targetMatchAnswer) {
      setGuessed(true);
      playDing();

      // Voice prompt celebration
      if (currentDirection === 'to-lowercase') {
        speak(`Correct! Capital ${lData.uppercase} matches lowercase ${lData.lowercase}!`);
      } else {
        speak(`Correct! Lowercase ${lData.lowercase} matches capital ${lData.uppercase}!`);
      }

      // Completely clear canvas to display the full beautiful letter
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      setTimeout(() => {
        const stars: 1 | 2 | 3 = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
        awardStars(`mystery-reveal-${currentLetter}`, stars);
        incrementActivity(`mystery-reveal-${currentLetter}`);

        if (letterIndex < activeLetters.length - 1) {
          setLetterIndex(i => i + 1);
          setMistakes(0);
        } else {
          playFanfare();
          activeLetters.forEach(l => {
            awardStars(`mystery-reveal-${l}`, 3);
            incrementActivity(`mystery-reveal-${l}`);
          });
          awardStars('mystery-reveal', 3);
          incrementActivity('mystery-reveal');
          setShowCelebration(true);
        }
      }, 1200);
    } else {
      playBoing();
      setShakeOption(opt);
      setMistakes(m => m + 1);
      setTimeout(() => setShakeOption(null), 500);
    }
  };

  // If game hasn't started yet, render Setup Screen
  if (!gameStarted) {
    return (
      <MysteryRevealSetup
        initialLetters={rawLetters}
        mode={matchMode}
        onModeChange={setMatchMode}
        onStart={(letters, mode) => {
          setActiveLetters(letters.length > 0 ? letters : ['A']);
          setMatchMode(mode);
          setLetterIndex(0);
          setMistakes(0);
          setGameStarted(true);
        }}
        onExit={() => navigate('/letters')}
      />
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center bg-gradient-to-b from-sky-50 via-indigo-50 to-blue-100 relative font-nunito pb-8 select-none">
      {/* Top Navigation & Status Bar */}
      <div className="w-full flex items-center justify-between p-4 sticky top-0 z-20 backdrop-blur-md bg-white/70 border-b border-indigo-100">
        <BackButton onClick={() => setGameStarted(false)} color="#4F46E5" />

        <div className="flex flex-col items-center">
          <h1 className="text-xl md:text-2xl font-black text-indigo-700">
            Mystery Reveal
          </h1>
          <span className="text-xs font-bold text-indigo-500">
            {currentDirection === 'to-lowercase'
              ? 'Find lowercase pair'
              : 'Find capital pair'}
          </span>
        </div>

        {activeLetters.length > 1 ? (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur rounded-full shadow-md border-2 border-indigo-300">
            <span className="text-xs font-black text-indigo-900">
              {letterIndex + 1}/{activeLetters.length}:
            </span>
            <div className="flex items-center gap-1">
              {activeLetters.map((tl, idx) => (
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
          <div style={{ width: 44 }} />
        )}
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4 pt-2">
        {/* BuddyBear Mascot with helpful direction speech */}
        <div className="mb-3">
          <BuddyBear
            mood={guessed ? 'celebrating' : 'happy'}
            size={95}
            speech={
              guessed
                ? `Wonderful! You found the matching letter! 🎉`
                : currentDirection === 'to-lowercase'
                ? `Rub the frost to reveal Capital "${hiddenLetterDisplay}", then tap its lowercase buddy! 👇`
                : `Rub the frost to reveal Lowercase "${hiddenLetterDisplay}", then tap its capital buddy! 👇`
            }
          />
        </div>

        <h2 className="text-base md:text-xl font-extrabold text-indigo-900 mb-4 text-center">
          {currentDirection === 'to-lowercase'
            ? `Scratch to uncover the letter, then pick its lowercase buddy!`
            : `Scratch to uncover the letter, then pick its capital buddy!`}
        </h2>

        {/* Scratch Area */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-[3rem] shadow-2xl border-8 border-indigo-200 overflow-hidden mb-6 flex items-center justify-center">
          {/* Revealed Secret Letter Background */}
          <motion.div
            animate={guessed ? { scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center select-none"
          >
            <span
              className="font-black drop-shadow-md select-none"
              style={{
                fontSize: currentDirection === 'to-lowercase' ? '9.5rem' : '10.5rem',
                color: lData.color || '#4F46E5',
                lineHeight: 1,
              }}
            >
              {hiddenLetterDisplay}
            </span>
            <span className="text-xs md:text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">
              {lData.exampleWord}
            </span>
          </motion.div>

          {/* Interactive Frost Canvas */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
            onMouseDown={handleStartDraw}
            onMouseUp={handleEndDraw}
            onMouseLeave={handleEndDraw}
            onMouseMove={scratch}
            onTouchStart={e => {
              if (e.cancelable) e.preventDefault();
              handleStartDraw(e);
            }}
            onTouchEnd={handleEndDraw}
            onTouchCancel={handleEndDraw}
            onTouchMove={e => {
              if (e.cancelable) e.preventDefault();
              scratch(e);
            }}
          />

          {/* Sparkle badge when clear */}
          {guessed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 bg-amber-400 text-white rounded-full p-2 shadow-lg z-20"
            >
              ⭐
            </motion.div>
          )}
        </div>

        {/* Scratch Prompt / Instruction Bar */}
        <div className="flex items-center gap-2 mb-4 bg-white/80 px-4 py-1.5 rounded-full shadow-sm border border-indigo-100">
          <span className="text-sm">👆</span>
          <span className="text-xs md:text-sm font-bold text-indigo-700">
            {scratchPercent > 40
              ? 'Great peeking! Now tap the match below!'
              : 'Scratch the frosty card with your finger or mouse!'}
          </span>
        </div>

        {/* Match Choices Options */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 max-w-lg w-full mb-6">
          <AnimatePresence>
            {options.map((opt) => {
              const isMatch = opt === targetMatchAnswer;
              const isShaking = shakeOption === opt;

              return (
                <motion.button
                  key={`${currentLetter}-${opt}`}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  animate={
                    isShaking
                      ? { x: [-12, 12, -10, 10, -5, 5, 0] }
                      : guessed && isMatch
                      ? { scale: [1, 1.2, 1.1] }
                      : {}
                  }
                  transition={{ duration: 0.35 }}
                  onClick={() => handleGuess(opt)}
                  disabled={guessed}
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center font-black text-4xl md:text-5xl shadow-xl border-4 transition-all cursor-pointer ${
                    guessed && isMatch
                      ? 'bg-emerald-500 border-emerald-600 text-white ring-4 ring-emerald-200'
                      : 'bg-white border-indigo-100 text-indigo-900 hover:border-indigo-300 hover:bg-indigo-50 shadow-indigo-100'
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      <CelebrationScreen
        active={showCelebration}
        stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1}
        message="Magnificent! You matched all the mystery letters!"
        onContinue={() => navigate('/letters/activity/mystery-reveal')}
        onMenu={() => navigate('/letters')}
      />
    </div>
  );
}
