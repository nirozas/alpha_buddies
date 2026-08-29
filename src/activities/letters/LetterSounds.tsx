import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { Illustration } from '../../components/Illustration';

interface GameCard {
  id: string;
  letter: string;
  display: string;
  color: string;
}

export function LetterSounds() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity, progress } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();

  const [mode, setMode] = useState<'upper' | 'lower' | 'both'>('upper');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  // Game Logic State
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(3);
  const [showFact, setShowFact] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleLetter = (l: string) => {
    playPop();
    setSelectedLetters(prev => 
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    );
  };

  const buildRound = useCallback((target: string, currentMode: 'upper' | 'lower' | 'both') => {
    const targetLD = LETTERS_DATA.find(ld => ld.letter === target)!;
    
    const getDisplay = (ld: typeof targetLD, m: typeof currentMode) => {
      if (m === 'upper') return ld.uppercase;
      if (m === 'lower') return ld.lowercase;
      return Math.random() < 0.5 ? ld.uppercase : ld.lowercase;
    };

    const distractors = LETTERS_DATA
      .filter(ld => ld.letter !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 11);

    const cards: GameCard[] = [
      { id: 'target', letter: targetLD.letter, display: getDisplay(targetLD, currentMode), color: targetLD.color },
      ...distractors.map((ld, i) => ({
        id: `dist-${i}`,
        letter: ld.letter,
        display: getDisplay(ld, currentMode),
        color: ld.color
      }))
    ].sort(() => Math.random() - 0.5);

    setGameCards(cards);
  }, []);

  const startGame = () => {
    if (selectedLetters.length === 0) return;
    setGameState('playing');
    setScore(0);
    setTries(3);
    const firstTarget = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
    setCurrentTarget(firstTarget);
    buildRound(firstTarget, mode);
  };

  const playTargetSound = useCallback(() => {
    const ld = LETTERS_DATA.find(x => x.letter === currentTarget);
    if (ld) {
      speak(ld.letter);
    }
  }, [currentTarget, speak]);

  useEffect(() => {
    if (gameState === 'playing' && currentTarget) {
      const timer = setTimeout(() => playTargetSound(), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentTarget, playTargetSound]);

  const handleCardClick = (card: GameCard) => {
    if (card.letter === currentTarget) {
      playDing();
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        awardStars('letter-sounds', 3);
        incrementActivity('letter-sounds');
        setGameState('won');
      } else {
        const nextTarget = selectedLetters[Math.floor(Math.random() * selectedLetters.length)];
        setCurrentTarget(nextTarget);
        buildRound(nextTarget, mode);
      }
    } else {
      playBoing();
      speak(`Oops! That's ${card.letter}. Try again!`);
      setTries(prev => Math.max(0, prev - 1));
      if (tries <= 1) setTries(3);
    }
  };

  // ── Render Selection ───────────────────────────────────────────────────────

  if (gameState === 'selection') {
    return (
      <div className="min-h-dvh flex flex-col items-center p-6 overflow-y-auto relative z-10" style={{ backgroundColor: 'rgba(255, 242, 248, 0.15)' }}>
        <div className="w-full flex items-center justify-between max-w-5xl mb-6">
          <BackButton onClick={() => navigate(-1)} color="#DB2777" />
          <h2 className="text-2xl font-black text-[#DB2777]">Set Up Your Game</h2>
          <div style={{ width: 56 }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-2xl border-4 border-[#DB2777] max-w-4xl w-full flex flex-col items-center gap-6"
        >
          <BuddyBear mood="thinking" size={80} speech="Pick a mode and the letters you want to learn!" />
          
          {/* Mode Selector */}
          <div className="flex gap-4 p-2 bg-pink-100 rounded-3xl w-full max-w-md">
            {(['upper', 'lower', 'both'] as const).map(m => (
              <button
                key={m}
                onClick={() => { playPop(); setMode(m); }}
                className={`flex-1 py-3 rounded-2xl font-black transition-all ${
                  mode === m ? 'bg-[#DB2777] text-white shadow-lg scale-105' : 'text-[#DB2777] hover:bg-white/50'
                }`}
              >
                {m === 'upper' ? 'ABC' : m === 'lower' ? 'abc' : 'Aa'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-2 w-full">
            {LETTERS_DATA.map(ld => {
              const isSelected = selectedLetters.includes(ld.letter);
              const display = mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : `${ld.uppercase}${ld.lowercase}`);
              return (
                <button
                  key={ld.letter}
                  onClick={() => toggleLetter(ld.letter)}
                  className={`aspect-square rounded-xl flex items-center justify-center font-black transition-all border-4 ${
                    isSelected ? 'bg-[#DB2777] text-white scale-110 shadow-lg' : 'bg-white text-[#DB2777] border-gray-100 opacity-60'
                  }`}
                  style={{ borderColor: isSelected ? '#DB2777' : 'transparent', fontSize: mode === 'both' ? '0.75rem' : '1rem' }}
                >
                  {display}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedLetters(LETTERS_DATA.map(l => l.letter))}
              className="text-[#DB2777] font-bold underline"
            >
              Select All
            </button>
            <button 
              onClick={() => setSelectedLetters([])}
              className="text-[#DB2777] font-bold underline"
            >
              Clear
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={selectedLetters.length === 0}
            onClick={startGame}
            className={`px-12 py-4 rounded-full font-black text-xl shadow-xl transition-all ${
              selectedLetters.length > 0 ? 'bg-[#DB2777] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Game! 🚀
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Render Playing ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh flex flex-col overflow-hidden relative z-10" style={{ backgroundColor: 'rgba(255, 242, 248, 0.15)' }}>
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => setGameState('selection')} color="#DB2777" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className="text-2xl" style={{ filter: i <= score ? 'none' : 'grayscale(1) opacity(0.2)' }}>⭐</span>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Progress: {score}/5</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <span key={i} className="text-xl" style={{ filter: i <= tries ? 'none' : 'grayscale(1) opacity(0.3)' }}>❤️</span>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Tries Left</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="flex items-center gap-6">
          <BuddyBear mood="excited" size={80} speech="Which letter makes this sound?" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playTargetSound}
            className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-[#DB2777] active:bg-[#DB2777] active:text-white transition-colors"
          >
            <div className="text-4xl text-[#DB2777] hover:text-inherit">🔊</div>
          </motion.button>
        </div>

        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
          {gameCards.map(card => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(card)}
              className="aspect-[3/4] rounded-3xl bg-white shadow-xl border-4 flex items-center justify-center text-5xl font-black transition-all"
              style={{ borderColor: card.color, color: card.color }}
            >
              {card.display}
            </motion.button>
          ))}
        </div>
      </div>

      <CelebrationScreen 
        active={gameState === 'won'} 
        stars={3} 
        message="Sound Master! 🔊✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact="You matched all the sounds perfectly! You're an alphabet expert!" 
            emoji="🎓" 
            onClose={() => navigate(-1)} 
          />
        </div>
      )}
    </div>
  );
}
