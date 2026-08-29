import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

export function MysteryReveal() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const lData = LETTERS_DATA.find(l => l.letter === letter);

  const [options, setOptions] = useState<string[]>([]);
  const [guessed, setGuessed] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (!lData) return;

    // Generate options
    const wrongOptions: string[] = [];
    while (wrongOptions.length < 2) {
      const randLetter = LETTERS_DATA[Math.floor(Math.random() * 26)].letter;
      if (randLetter !== letter && !wrongOptions.includes(randLetter)) {
        wrongOptions.push(randLetter);
      }
    }
    setOptions([...wrongOptions, letter!].sort(() => Math.random() - 0.5));

    // Initialize Canvas Frost
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#BAE6FD'; // Light frosty blue
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some noise or snowflake dots for frost effect
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 100; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3 + 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }, [letter, lData]);

  const scratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || guessed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // 25px brush radius
    ctx.fill();
  };

  const handleGuess = (opt: string) => {
    if (guessed) return;
    
    if (opt === letter) {
      setGuessed(true);
      playDing();
      speak(opt);
      
      // Clear the whole canvas instantly
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }

      setTimeout(() => {
        playFanfare();
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        awardStars(`mystery-reveal-${letter}`, stars);
        incrementActivity(`mystery-reveal-${letter}`);
        setShowCelebration(true);
      }, 1000);
    } else {
      playBoing();
      setMistakes(m => m + 1);
    }
  };

  if (!lData) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center bg-indigo-50 relative font-nunito pb-8 select-none">
      <div className="w-full flex items-center p-4 sticky top-0 z-10">
        <BackButton onClick={() => navigate('/letters')} color="#4F46E5" />
        <h1 className="flex-1 text-center text-4xl font-black text-indigo-600 drop-shadow-sm" style={{ marginRight: 56 }}>
          Mystery Reveal
        </h1>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        <h2 className="text-xl md:text-2xl font-bold text-indigo-800 mb-8 text-center px-4">
          Rub the frost away and guess the letter!
        </h2>

        {/* Scratch Area */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-[3rem] shadow-2xl border-8 border-indigo-200 overflow-hidden mb-12 flex items-center justify-center">
          
          {/* The Hidden Letter */}
          <span className="text-[10rem] md:text-[12rem] font-black text-slate-800" style={{ color: lData.color }}>
            {lData.uppercase}
          </span>

          {/* The Scratch Canvas Overlay */}
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            className="absolute inset-0 w-full h-full cursor-pointer touch-none"
            onMouseDown={() => { isDrawing.current = true; }}
            onMouseUp={() => { isDrawing.current = false; }}
            onMouseLeave={() => { isDrawing.current = false; }}
            onMouseMove={scratch}
            onTouchStart={(e) => { isDrawing.current = true; scratch(e); }}
            onTouchEnd={() => { isDrawing.current = false; }}
            onTouchCancel={() => { isDrawing.current = false; }}
            onTouchMove={(e) => {
              // Prevent scrolling while scratching on mobile
              if (e.cancelable) e.preventDefault();
              scratch(e);
            }}
          />
        </div>

        {/* Options */}
        <div className="flex gap-4 md:gap-8">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleGuess(opt)}
              disabled={guessed}
              className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-black shadow-lg border-b-4 transition-colors ${guessed && opt === letter ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-white border-slate-200 text-indigo-900 hover:border-indigo-300 hover:bg-indigo-50'}`}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1} message="You guessed it!"
        onContinue={() => navigate('/letters')} />
    </div>
  );
}
