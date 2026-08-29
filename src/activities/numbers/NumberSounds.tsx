import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

interface GameCard {
  id: string;
  digit: number;
  color: string;
}

export function NumberSounds() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();

  const [mode, setMode] = useState<'shape' | 'quantity'>('shape');
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  // Game Logic State
  const [currentTarget, setCurrentTarget] = useState<number>(0);
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(3);
  const [showFact, setShowFact] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleNumber = (n: number) => {
    playPop();
    setSelectedNumbers(prev => 
      prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]
    );
  };

  const buildRound = useCallback((target: number) => {
    const distractors = NUMBERS_DATA
      .filter(nd => nd.digit !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 7); // Show 8 cards for numbers to keep it clean

    const cards: GameCard[] = [
      { id: 'target', digit: target, color: NUMBERS_DATA.find(nd => nd.digit === target)!.color },
      ...distractors.map((nd, i) => ({
        id: `dist-${i}`,
        digit: nd.digit,
        color: nd.color
      }))
    ].sort(() => Math.random() - 0.5);

    setGameCards(cards);
  }, []);

  const startGame = () => {
    if (selectedNumbers.length === 0) return;
    setGameState('playing');
    setScore(0);
    setTries(3);
    const firstTarget = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
    setCurrentTarget(firstTarget);
    buildRound(firstTarget);
  };

  const playTargetSound = useCallback(() => {
    speak(currentTarget.toString());
  }, [currentTarget, speak]);

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setTimeout(() => playTargetSound(), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentTarget, playTargetSound]);

  const handleCardClick = (card: GameCard) => {
    if (card.digit === currentTarget) {
      playDing();
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        awardStars('number-sounds', 3);
        incrementActivity('number-sounds');
        setGameState('won');
      } else {
        const nextTarget = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
        setCurrentTarget(nextTarget);
        buildRound(nextTarget);
      }
    } else {
      playBoing();
      speak(`Oops! That's ${card.digit}. Try again!`);
      setTries(prev => Math.max(0, prev - 1));
      if (tries <= 1) setTries(3);
    }
  };

  // ── Render Selection ───────────────────────────────────────────────────────

  if (gameState === 'selection') {
    return (
      <div className="min-h-dvh flex flex-col items-center bg-[#F0F9FF] p-6 overflow-y-auto">
        <div className="w-full flex items-center justify-between max-w-5xl mb-6">
          <BackButton onClick={() => navigate(-1)} color="#0284C7" />
          <h2 className="text-2xl font-black text-[#0284C7]">Number Set Up</h2>
          <div style={{ width: 56 }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-2xl border-4 border-[#0284C7] max-w-4xl w-full flex flex-col items-center gap-6"
        >
          <BuddyBear mood="thinking" size={80} speech="Pick a mode and the numbers you want to find!" />
          
          {/* Mode Selector */}
          <div className="flex gap-4 p-2 bg-sky-100 rounded-3xl w-full max-w-md">
            {(['shape', 'quantity'] as const).map(m => (
              <button
                key={m}
                onClick={() => { playPop(); setMode(m); }}
                className={`flex-1 py-3 rounded-2xl font-black transition-all ${
                  mode === m ? 'bg-[#0284C7] text-white shadow-lg scale-105' : 'text-[#0284C7] hover:bg-white/50'
                }`}
              >
                {m === 'shape' ? '1 2 3' : '🍎 🍎'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-3 w-full max-w-2xl">
            {NUMBERS_DATA.map(nd => {
              const isSelected = selectedNumbers.includes(nd.digit);
              return (
                <button
                  key={nd.digit}
                  onClick={() => toggleNumber(nd.digit)}
                  className={`aspect-square rounded-2xl flex items-center justify-center font-black text-2xl transition-all border-4 ${
                    isSelected ? 'bg-[#0284C7] text-white scale-110 shadow-lg' : 'bg-white text-[#0284C7] border-gray-100 opacity-60'
                  }`}
                  style={{ borderColor: isSelected ? '#0284C7' : 'transparent' }}
                >
                  {nd.digit}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedNumbers(NUMBERS_DATA.map(l => l.digit))}
              className="text-[#0284C7] font-bold underline"
            >
              Select All
            </button>
            <button 
              onClick={() => setSelectedNumbers([])}
              className="text-[#0284C7] font-bold underline"
            >
              Clear
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={selectedNumbers.length === 0}
            onClick={startGame}
            className={`px-12 py-4 rounded-full font-black text-xl shadow-xl transition-all ${
              selectedNumbers.length > 0 ? 'bg-[#0284C7] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF] overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => setGameState('selection')} color="#0284C7" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <span key={i} className="text-2xl" style={{ filter: i <= score ? 'none' : 'grayscale(1) opacity(0.2)' }}>⭐</span>
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Score: {score}/5</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <span key={i} className="text-xl" style={{ filter: i <= tries ? 'none' : 'grayscale(1) opacity(0.3)' }}>❤️</span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="flex items-center gap-6">
          <BuddyBear mood="excited" size={80} speech="Where is this number?" />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={playTargetSound}
            className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-[#0284C7] text-[#0284C7] active:bg-[#0284C7] active:text-white transition-colors"
          >
            <div className="text-4xl">🔊</div>
          </motion.button>
        </div>

        <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
          {gameCards.map(card => {
            const nd = NUMBERS_DATA.find(n => n.digit === card.digit)!;
            return (
              <motion.button
                key={card.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card)}
                className="aspect-square rounded-[2rem] bg-white shadow-xl border-4 flex flex-wrap items-center justify-center p-2 transition-all relative overflow-hidden"
                style={{ borderColor: card.color }}
              >
                {mode === 'shape' ? (
                  <span className="text-6xl font-black" style={{ color: card.color }}>{card.digit}</span>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-1">
                    {card.digit === 0 ? (
                      <span className="text-xs font-black opacity-20 uppercase">Empty!</span>
                    ) : (
                      Array.from({ length: card.digit }).map((_, i) => (
                        <img 
                          key={i} 
                          src={nd.objects[i % nd.objects.length]?.image || nd.image} 
                          className="w-8 h-8 object-contain"
                          alt="count"
                        />
                      ))
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <CelebrationScreen 
        active={gameState === 'won'} 
        stars={3} 
        message="Number Expert! 🏆✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact="You're getting so good at recognizing numbers! Keep it up!" 
            emoji="🔢" 
            onClose={() => navigate(-1)} 
          />
        </div>
      )}
    </div>
  );
}
