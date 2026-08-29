import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const { awardStars, incrementActivity } = useStore();
  const { speak, playPop, playDing, playBoing } = useAudio();

  const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'both'>('upper');
  const [playMode, setPlayMode] = useState<'word' | 'picture' | 'both'>('both');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  // Game Logic State
  const [currentTarget, setCurrentTarget] = useState<string>('');
  const [currentObject, setCurrentObject] = useState<{ word: string, image: string } | null>(null);
  const [usedObjects, setUsedObjects] = useState<string[]>([]); // Array of "letter-word" strings
  
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

  const handleCardClick = (card: GameCard) => {
    if (card.letter === currentTarget) {
      playDing();
      const newScore = score + 1;
      setScore(newScore);
      
      if (newScore >= 5) {
        awardStars('first-letter-sound', 3);
        incrementActivity('first-letter-sound');
        setGameState('won');
      } else {
        const { letter, object } = pickNewTarget(selectedLetters, usedObjects);
        setCurrentTarget(letter);
        setCurrentObject(object);
        setUsedObjects(prev => [...prev, `${letter}-${object.word}`]);
        buildRound(letter, caseMode);
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
      <div className="min-h-dvh flex flex-col items-center bg-[#FDF2F8] p-6 overflow-y-auto">
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
          <BuddyBear mood="thinking" size={80} speech="Choose how you want to play!" />
          
          <div className="flex flex-col md:flex-row gap-8 w-full">
            {/* Case Mode */}
            <div className="flex-1 flex flex-col gap-3">
              <p className="font-black text-[#DB2777] text-center">Letter Style</p>
              <div className="flex gap-2 p-2 bg-pink-100 rounded-2xl">
                {(['upper', 'lower', 'both'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { playPop(); setCaseMode(m); }}
                    className={`flex-1 py-3 rounded-xl font-black transition-all ${
                      caseMode === m ? 'bg-[#DB2777] text-white' : 'text-[#DB2777]'
                    }`}
                  >
                    {m === 'upper' ? 'ABC' : m === 'lower' ? 'abc' : 'Aa'}
                  </button>
                ))}
              </div>
            </div>

            {/* Play Mode */}
            <div className="flex-1 flex flex-col gap-3">
              <p className="font-black text-[#DB2777] text-center">Game Hint</p>
              <div className="flex gap-2 p-2 bg-pink-100 rounded-2xl">
                {(['word', 'picture', 'both'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => { playPop(); setPlayMode(m); }}
                    className={`flex-1 py-3 rounded-xl font-black transition-all ${
                      playMode === m ? 'bg-[#DB2777] text-white' : 'text-[#DB2777]'
                    }`}
                  >
                    {m === 'word' ? '🔊' : m === 'picture' ? '🖼️' : '🔊+🖼️'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-2 w-full">
            {LETTERS_DATA.map(ld => {
              const isSelected = selectedLetters.includes(ld.letter);
              const display = caseMode === 'upper' ? ld.uppercase : (caseMode === 'lower' ? ld.lowercase : `${ld.uppercase}${ld.lowercase}`);
              return (
                <button
                  key={ld.letter}
                  onClick={() => toggleLetter(ld.letter)}
                  className={`aspect-square rounded-xl flex items-center justify-center font-black transition-all border-4 ${
                    isSelected ? 'bg-[#DB2777] text-white scale-110 shadow-lg' : 'bg-white text-[#DB2777] border-gray-100 opacity-60'
                  }`}
                  style={{ borderColor: isSelected ? '#DB2777' : 'transparent', fontSize: caseMode === 'both' ? '0.75rem' : '1rem' }}
                >
                  {display}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setSelectedLetters(LETTERS_DATA.map(l => l.letter))} className="text-[#DB2777] font-bold underline">Select All</button>
            <button onClick={() => setSelectedLetters([])} className="text-[#DB2777] font-bold underline">Clear</button>
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
        stars={3} 
        message="Phonics Pro! 🔤✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact={`Great job! You know that ${currentObject?.word} starts with ${currentLD.letter}!`} 
            emoji={currentLD.exampleEmoji} 
            onClose={() => navigate(-1)} 
          />
        </div>
      )}
    </div>
  );
}
