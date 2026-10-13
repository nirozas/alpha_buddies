import { calculateStars } from '../../utils/scoring';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
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
  const { letter } = useParams<{ letter?: string }>();
  const { awardStars, incrementActivity, progress, masteredLetter, masteredLetters } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();

  const activeMastered = (masteredLetters && masteredLetters.length > 0)
    ? masteredLetters
    : (letter ? [letter.toUpperCase()] : (masteredLetter ? [masteredLetter] : []));

  const [mode, setMode] = useState<'upper' | 'lower' | 'both'>('upper');
  const [selectedLetters, setSelectedLetters] = useState<string[]>(activeMastered.length > 0 ? activeMastered : ['A']);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  // Game Logic State
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(3);
  const [mistakes, setMistakes] = useState(0);
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

  useEffect(() => {
    if (activeMastered.length > 0) {
      setSelectedLetters(activeMastered);
      const initialTarget = activeMastered[Math.floor(Math.random() * activeMastered.length)];
      setCurrentTarget(initialTarget);
      buildRound(initialTarget, mode);
    }
  }, [activeMastered.length, buildRound, mode]);

  const handleCardClick = (card: GameCard) => {
    if (card.letter === currentTarget) {
      playDing();
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        const earnedStars = calculateStars(mistakes);
        if (activeMastered.length > 0) {
          activeMastered.forEach(l => {
            awardStars(`${l}-letter-sounds`, earnedStars);
            incrementActivity(`${l}-letter-sounds`);
          });
        }
        awardStars('letter-sounds', earnedStars);
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
      setMistakes(m => m + 1);
      setTries(prev => Math.max(0, prev - 1));
      if (tries <= 1) setTries(3);
    }
  };

  // ── Render Selection ───────────────────────────────────────────────────────

  if (gameState === 'selection') {
    return (
      <div className="h-dvh max-h-dvh flex flex-col justify-between overflow-hidden p-2 sm:p-4 relative z-10 select-none font-nunito" style={{ backgroundColor: '#FDF2F8' }}>
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0 mb-1">
            <BackButton color="#DB2777" />
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🔊</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#DB2777]">Letter Sounds</h2>
            </div>
            <div style={{ width: 44 }} />
          </div>

          {/* Mode Selector */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 shadow-md border border-pink-100 shrink-0 mb-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="font-black text-xs sm:text-sm text-pink-950 flex items-center gap-1">
                <span>🔤</span> Letter Case Mode:
              </span>
              <span className="text-[11px] font-bold text-[#DB2777]">
                {mode === 'upper' ? 'Uppercase Only' : mode === 'lower' ? 'Lowercase Only' : 'Both (Aa)'}
              </span>
            </div>
            <div className="flex gap-2">
              {(['upper', 'lower', 'both'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => { playPop(); setMode(m); }}
                  className={`flex-1 py-1.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer border-2 ${
                    mode === m ? 'bg-[#DB2777] text-white border-[#DB2777] shadow-md scale-[1.02]' : 'bg-white text-[#DB2777] border-pink-100 hover:bg-pink-50'
                  }`}
                >
                  {m === 'upper' ? 'ABC (Capital)' : m === 'lower' ? 'abc (Small)' : 'Aa (Both)'}
                </button>
              ))}
            </div>
          </div>

          {/* Letters Grid: Fits all 26 letters in screen view without scrolling */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 shadow-md border border-pink-100 flex-1 flex flex-col justify-between min-h-0 mb-2">
            <div className="flex items-center justify-between mb-1 shrink-0 px-1">
              <span className="font-black text-xs sm:text-sm text-pink-950 flex items-center gap-1">
                <span>🎯</span> Selected Letters ({selectedLetters.length}/26):
              </span>
              <div className="flex gap-1.5">
                <button 
                  type="button"
                  onClick={() => setSelectedLetters(LETTERS_DATA.map(l => l.letter))}
                  className="text-xs font-black px-2.5 py-0.5 rounded-full border border-pink-300 text-[#DB2777] bg-pink-50 hover:bg-pink-100 cursor-pointer"
                >
                  All
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedLetters([])}
                  className="text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto py-1">
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 w-full justify-items-stretch">
                {LETTERS_DATA.map(ld => {
                  const isSelected = selectedLetters.includes(ld.letter);
                  const display = mode === 'upper' ? ld.uppercase : (mode === 'lower' ? ld.lowercase : `${ld.uppercase}${ld.lowercase}`);
                  return (
                    <motion.button
                      key={ld.letter}
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleLetter(ld.letter)}
                      className={`aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-black transition-all border-2 cursor-pointer ${
                        isSelected ? 'bg-[#DB2777] text-white border-[#DB2777] shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                      style={{ fontSize: mode === 'both' ? 'clamp(0.85rem, 2vw, 1.3rem)' : 'clamp(1rem, 2.4vw, 1.7rem)' }}
                    >
                      {display}
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
              disabled={selectedLetters.length === 0}
              onClick={startGame}
              className={`w-full py-3 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all cursor-pointer ${
                selectedLetters.length > 0 ? 'bg-[#DB2777] text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Start Game ({selectedLetters.length} letter{selectedLetters.length > 1 ? 's' : ''})! 🚀
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Playing ─────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh flex flex-col overflow-hidden relative z-10" style={{ backgroundColor: 'rgba(255, 242, 248, 0.15)' }}>
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => activeMastered.length > 0 ? navigate('/letters') : setGameState('selection')} color="#DB2777" />
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
        stars={calculateStars(mistakes)} 
        message="Sound Master! 🔊✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact="You matched all the sounds perfectly! You're an alphabet expert!" 
            emoji="🎓" 
            onClose={() => {
            const parts = window.location.pathname.split('/').filter(Boolean);
            if (parts.length >= 4) {
              navigate(`/${parts[0]}/${parts[1]}/${parts[2]}`);
            } else {
              navigate('/letters');
            }
          }} 
          />
        </div>
      )}
    </div>
  );
}
