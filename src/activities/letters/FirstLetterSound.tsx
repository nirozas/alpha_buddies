import { calculateStars } from '../../utils/scoring';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

interface GameCard {
  id: string;
  letter: string;
  display: string;
  color: string;
}

export function FirstLetterSound() {
  const navigate = useNavigate();
  const { letter } = useParams<{ letter?: string }>();
  const { awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();

  const activeMastered = (masteredLetters && masteredLetters.length > 0)
    ? masteredLetters
    : (letter ? [letter.toUpperCase()] : (masteredLetter ? [masteredLetter] : []));

  const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'both'>('upper');
  const [playMode, setPlayMode] = useState<'word' | 'picture' | 'both'>('both');
  const [selectedLetters, setSelectedLetters] = useState<string[]>(activeMastered.length > 0 ? activeMastered : ['A']);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  // Game Logic State
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [currentObject, setCurrentObject] = useState<{ word: string, image: string } | null>(null);
  const [usedObjects, setUsedObjects] = useState<string[]>([]); // Array of "letter-word" strings
  
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

  const pickNewTarget = useCallback((selected: string[], used: string[]) => {
    // 1. Pick a random letter from the selection
    const randomLetter = selected[Math.floor(Math.random() * selected.length)];
    const ld = LETTERS_DATA.find(x => x.letter === randomLetter)!;
    
    // 2. Filter out used objects for this letter
    const availableObjects = ld.objects.filter(obj => !used.includes(`${randomLetter}-${obj.word}`));
    
    // 3. If no objects left for this letter, reset used for THIS letter or pick another letter
    // For now, we assume 12 objects is plenty for 5 rounds.
    const chosenObj = availableObjects.length > 0 
      ? availableObjects[Math.floor(Math.random() * availableObjects.length)]
      : ld.objects[Math.floor(Math.random() * ld.objects.length)];

    return { letter: randomLetter, object: chosenObj };
  }, []);

  const buildRound = useCallback((target: string, currentCase: 'upper' | 'lower' | 'both') => {
    const targetLD = LETTERS_DATA.find(ld => ld.letter === target)!;
    const getDisplay = (ld: typeof targetLD, m: typeof currentCase) => {
      if (m === 'upper') return ld.uppercase;
      if (m === 'lower') return ld.lowercase;
      return Math.random() < 0.5 ? ld.uppercase : ld.lowercase;
    };

    const distractors = LETTERS_DATA
      .filter(ld => ld.letter !== target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 11);

    const cards: GameCard[] = [
      { id: 'target', letter: targetLD.letter, display: getDisplay(targetLD, currentCase), color: targetLD.color },
      ...distractors.map((ld, i) => ({
        id: `dist-${i}`,
        letter: ld.letter,
        display: getDisplay(ld, currentCase),
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
    setUsedObjects([]);
    
    const { letter, object } = pickNewTarget(selectedLetters, []);
    setCurrentTarget(letter);
    setCurrentObject(object);
    setUsedObjects([`${letter}-${object.word}`]);
    buildRound(letter, caseMode);
  };

  const playStimulus = useCallback(() => {
    if (currentObject && (playMode === 'word' || playMode === 'both')) {
      speak(currentObject.word);
    }
  }, [currentObject, speak, playMode]);

  useEffect(() => {
    if (gameState === 'playing' && currentObject) {
      const timer = setTimeout(() => playStimulus(), 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, currentObject, playStimulus]);

  useEffect(() => {
    if (activeMastered.length > 0) {
      setGameState('playing');
      setScore(0);
      setTries(3);
      setUsedObjects([]);
      const { letter: chosenLetter, object } = pickNewTarget(activeMastered, []);
      setCurrentTarget(chosenLetter);
      setCurrentObject(object);
      setUsedObjects([`${chosenLetter}-${object.word}`]);
      buildRound(chosenLetter, caseMode);
    }
  }, [activeMastered.length, pickNewTarget, buildRound, caseMode]);

  const handleCardClick = (card: GameCard) => {
    if (card.letter === currentTarget) {
      playDing();
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        const earnedStars = calculateStars(mistakes);
        if (activeMastered.length > 0) {
          activeMastered.forEach(l => {
            awardStars(`${l}-first-letter-sound`, earnedStars);
            incrementActivity(`${l}-first-letter-sound`);
          });
        }
        awardStars('first-letter-sound', earnedStars);
        incrementActivity('first-letter-sound');
        setGameState('won');
      } else {
        const nextLetterList = activeMastered.length > 0 ? activeMastered : selectedLetters;
        const { letter, object } = pickNewTarget(nextLetterList, usedObjects);
        setCurrentTarget(letter);
        setCurrentObject(object);
        setUsedObjects(prev => [...prev, `${letter}-${object.word}`]);
        buildRound(letter, caseMode);
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
      <div className="h-dvh max-h-dvh flex flex-col justify-between overflow-hidden p-2 sm:p-4 relative z-10 select-none font-nunito bg-[#FDF2F8]">
        <div className="w-full max-w-3xl mx-auto flex flex-col h-full justify-between">
          {/* Header */}
          <div className="flex items-center justify-between shrink-0 mb-1">
            <BackButton color="#DB2777" />
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">🔤</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#DB2777]">First Letter Sound</h2>
            </div>
            <div style={{ width: 44 }} />
          </div>

          {/* Mode Selectors in Compact Row */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2 sm:p-2.5 shadow-md border border-pink-100 shrink-0 mb-1.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Case Mode */}
              <div>
                <p className="font-black text-xs text-pink-950 mb-1">Letter Style:</p>
                <div className="flex gap-1.5 bg-pink-50 p-1 rounded-xl">
                  {(['upper', 'lower', 'both'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { playPop(); setCaseMode(m); }}
                      className={`flex-1 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                        caseMode === m ? 'bg-[#DB2777] text-white shadow-sm' : 'text-[#DB2777] hover:bg-white'
                      }`}
                    >
                      {m === 'upper' ? 'ABC' : m === 'lower' ? 'abc' : 'Aa'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Play Hint Mode */}
              <div>
                <p className="font-black text-xs text-pink-950 mb-1">Game Hint:</p>
                <div className="flex gap-1.5 bg-pink-50 p-1 rounded-xl">
                  {(['word', 'picture', 'both'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { playPop(); setPlayMode(m); }}
                      className={`flex-1 py-1 rounded-lg font-black text-xs transition-all cursor-pointer ${
                        playMode === m ? 'bg-[#DB2777] text-white shadow-sm' : 'text-[#DB2777] hover:bg-white'
                      }`}
                    >
                      {m === 'word' ? '🔊 Sound' : m === 'picture' ? '🖼️ Picture' : '🔊+🖼️ Both'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Letters Grid: Fits all 26 letters in screen view without scrolling */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 shadow-md border border-pink-100 flex-1 flex flex-col justify-between min-h-0 mb-1.5">
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
                  const display = caseMode === 'upper' ? ld.uppercase : (caseMode === 'lower' ? ld.lowercase : `${ld.uppercase}${ld.lowercase}`);
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
                      style={{ fontSize: caseMode === 'both' ? 'clamp(0.85rem, 2vw, 1.3rem)' : 'clamp(1rem, 2.4vw, 1.7rem)' }}
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

  const currentLD = LETTERS_DATA.find(ld => ld.letter === currentTarget)!;

  return (
    <div className="min-h-dvh flex flex-col bg-[#FDF2F8] overflow-hidden">
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
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-6">
        <div className="flex flex-col items-center gap-4">
          <BuddyBear mood="excited" size={80} speech="What letter does this start with?" />
          
          <div className="flex items-center gap-6">
            {(playMode === 'picture' || playMode === 'both') && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                key={currentObject?.image}
                className="w-40 h-40 bg-white rounded-[2rem] shadow-2xl border-4 border-[#DB2777] p-4 flex items-center justify-center overflow-hidden"
              >
                <img src={currentObject?.image} alt={currentObject?.word} className="w-full h-full object-contain" />
              </motion.div>
            )}

            {(playMode === 'word' || playMode === 'both') && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={playStimulus}
                className="w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-[#DB2777] text-[#DB2777] active:bg-[#DB2777] active:text-white transition-colors"
              >
                <div className="text-4xl">🔊</div>
              </motion.button>
            )}
          </div>
          
          {playMode === 'word' && (
             <p className="text-2xl font-black text-[#DB2777] uppercase tracking-widest">Listen closely!</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl mt-4">
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
        message="Phonics Pro! 🔤✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact={`Great job! You know that ${currentObject?.word} starts with ${currentLD.letter}!`} 
            emoji={currentLD.exampleEmoji} 
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
