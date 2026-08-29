import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

interface Card {
  id: string;
  pairId: string;
  content: string; // Letter or image URL
  type: 'letter' | 'image';
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

export function MemoryLetters() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playPop, playDing, playSwoosh } = useAudio();

  const [matchMode, setMatchMode] = useState<'identical' | 'case' | 'phonics'>('case');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]); // IDs of currently flipped cards
  const [matches, setMatches] = useState(0);
  const [showFact, setShowFact] = useState(false);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleLetter = (l: string) => {
    playPop();
    setSelectedLetters(prev => 
      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
    );
  };

  const initGame = useCallback(() => {
    if (selectedLetters.length === 0) return;

    // We use up to 6 pairs
    const gameLetters = [...selectedLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    let deck: Card[] = [];

    gameLetters.forEach((l) => {
      const ld = LETTERS_DATA.find(x => x.letter === l)!;
      const pairId = l;

      if (matchMode === 'identical') {
        deck.push({ id: `${l}-1`, pairId, content: ld.uppercase, type: 'letter', isFlipped: false, isMatched: false, color: ld.color });
        deck.push({ id: `${l}-2`, pairId, content: ld.uppercase, type: 'letter', isFlipped: false, isMatched: false, color: ld.color });
      } else if (matchMode === 'case') {
        deck.push({ id: `${l}-u`, pairId, content: ld.uppercase, type: 'letter', isFlipped: false, isMatched: false, color: ld.color });
        deck.push({ id: `${l}-l`, pairId, content: ld.lowercase, type: 'letter', isFlipped: false, isMatched: false, color: ld.color });
      } else {
        const obj = ld.objects[Math.floor(Math.random() * ld.objects.length)];
        deck.push({ id: `${l}-txt`, pairId, content: ld.uppercase, type: 'letter', isFlipped: false, isMatched: false, color: ld.color });
        deck.push({ id: `${l}-img`, pairId, content: obj.image, type: 'image', isFlipped: false, isMatched: false, color: ld.color });
      }
    });

    setCards(deck.sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatches(0);
    setGameState('playing');
  }, [selectedLetters, matchMode]);

  const handleCardClick = (id: string) => {
    const card = cards.find(c => c.id === id)!;
    if (card.isFlipped || card.isMatched || flipped.length >= 2) return;

    playSwoosh();
    if (card.type === 'letter') speak(card.content);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Update cards state to show flipped
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1)!;
      const card2 = cards.find(c => c.id === id ? { ...c, isFlipped: true } : c)!; // This is a bit messy, let's use card from new state

      // Actually, I should use the find on the updated state or the original objects
      // but simpler: compare card1 and current click
      if (card1.pairId === card.pairId) {
        // MATCH!
        setTimeout(() => {
          playDing();
          speak(`Match! ${card.pairId}!`);
          setCards(prev => prev.map(c => c.pairId === card.pairId ? { ...c, isMatched: true } : c));
          setFlipped([]);
          const newMatchCount = matches + 1;
          setMatches(newMatchCount);
          if (newMatchCount >= cards.length / 2) {
            awardStars('memory-letters', 3);
            incrementActivity('memory-letters');
            setTimeout(() => setGameState('won'), 1000);
          }
        }, 600);
      } else {
        // NO MATCH
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c));
          setFlipped([]);
        }, 1200);
      }
    }
  };

  // ── Render Selection ───────────────────────────────────────────────────────

  if (gameState === 'selection') {
    return (
      <div className="min-h-dvh flex flex-col items-center bg-[#FDF2F8] p-6 overflow-y-auto">
        <div className="w-full flex items-center justify-between max-w-5xl mb-6">
          <BackButton onClick={() => navigate(-1)} color="#DB2777" />
          <h2 className="text-2xl font-black text-[#DB2777]">Memory Setup</h2>
          <div style={{ width: 56 }} />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-2xl border-4 border-[#DB2777] max-w-4xl w-full flex flex-col items-center gap-6"
        >
          <BuddyBear mood="thinking" size={80} speech="Pick a mode and your letters!" />
          
          <div className="flex gap-4 p-2 bg-pink-100 rounded-3xl w-full max-w-md">
            {(['identical', 'case', 'phonics'] as const).map(m => (
              <button
                key={m}
                onClick={() => { playPop(); setMatchMode(m); }}
                className={`flex-1 py-3 rounded-2xl font-black transition-all ${
                  matchMode === m ? 'bg-[#DB2777] text-white shadow-lg scale-105' : 'text-[#DB2777]'
                }`}
              >
                {m === 'identical' ? 'A = A' : m === 'case' ? 'A = a' : 'A = 🍎'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-6 md:grid-cols-9 gap-2 w-full">
            {LETTERS_DATA.map(ld => {
              const isSelected = selectedLetters.includes(ld.letter);
              return (
                <button
                  key={ld.letter}
                  onClick={() => toggleLetter(ld.letter)}
                  className={`aspect-square rounded-xl flex items-center justify-center font-black transition-all border-4 ${
                    isSelected ? 'bg-[#DB2777] text-white scale-110 shadow-lg' : 'bg-white text-[#DB2777] border-gray-100 opacity-60'
                  }`}
                  style={{ borderColor: isSelected ? '#DB2777' : 'transparent' }}
                >
                  {ld.uppercase}
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
            onClick={initGame}
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
    <div className="min-h-dvh flex flex-col bg-[#FDF2F8] overflow-hidden">
      <div className="w-full flex items-center justify-between p-4 relative z-10">
        <BackButton onClick={() => setGameState('selection')} color="#DB2777" />
        <div className="flex-1 flex flex-col items-center gap-1">
          <p className="text-xl font-black text-[#DB2777]">Matches: {matches} / {cards.length / 2}</p>
          <div className="w-48 h-3 bg-white/50 rounded-full overflow-hidden border-2 border-[#DB2777]">
             <motion.div 
               className="h-full bg-[#DB2777]"
               initial={{ width: 0 }}
               animate={{ width: `${(matches / (cards.length / 2)) * 100}%` }}
             />
          </div>
        </div>
        <div style={{ width: 56 }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-4 w-full max-w-5xl">
          {cards.map((card) => (
            <motion.button
              key={card.id}
              whileHover={!card.isMatched && !card.isFlipped ? { scale: 1.05 } : {}}
              whileTap={!card.isMatched && !card.isFlipped ? { scale: 0.95 } : {}}
              onClick={() => handleCardClick(card.id)}
              className="aspect-[3/4] relative perspective-1000"
            >
              <motion.div
                className="w-full h-full transition-all duration-500 preserve-3d"
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              >
                {/* Back of Card */}
                <div className="absolute inset-0 backface-hidden bg-[#DB2777] rounded-3xl border-8 border-white shadow-xl flex items-center justify-center">
                  <span className="text-white text-6xl opacity-20">?</span>
                </div>

                {/* Front of Card */}
                <div 
                  className="absolute inset-0 backface-hidden bg-white rounded-3xl border-8 shadow-xl flex items-center justify-center overflow-hidden"
                  style={{ borderColor: card.color, transform: 'rotateY(180deg)' }}
                >
                  {card.type === 'letter' ? (
                    <span className="text-6xl font-black" style={{ color: card.color }}>{card.content}</span>
                  ) : (
                    <img src={card.content} alt="match" className="w-full h-full object-contain p-4" />
                  )}
                  {card.isMatched && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                      <span className="text-6xl">✅</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.button>
          ))}
        </div>
      </div>

      <CelebrationScreen 
        active={gameState === 'won'} 
        stars={3} 
        message="Memory Master! 🧠✨"
        onContinue={() => { setGameState('won'); setShowFact(true); }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard 
            fact="Your brain is like a muscle, and memory games help it get stronger!" 
            emoji="🧠" 
            onClose={() => navigate(-1)} 
          />
        </div>
      )}
    </div>
  );
}
