import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

export type MatchMode = 'identical' | 'case' | 'phonics';

interface Card {
  id: string;
  pairId: string;
  content: string; // Letter or image URL
  type: 'letter' | 'image';
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

// Helper: check condition stars for a letter (each condition gives 1 star, up to 3 total)
export function getLetterMemoryConditions(
  letter: string,
  starsEarned: Record<string, 1 | 2 | 3 | number | undefined>
): {
  identical: boolean;
  case: boolean;
  phonics: boolean;
  totalStars: 0 | 1 | 2 | 3;
} {
  const upper = letter.toUpperCase();
  let hasIdentical = Boolean(starsEarned[`memory_cond_${upper}_identical`]);
  let hasCase = Boolean(starsEarned[`memory_cond_${upper}_case`]);
  let hasPhonics = Boolean(starsEarned[`memory_cond_${upper}_phonics`]);

  // Backwards compatibility with legacy stars if condition keys are not yet set
  if (!hasIdentical && !hasCase && !hasPhonics) {
    const legacy = (starsEarned[`${upper}-memory-letters`] || starsEarned[`memory-letters-${upper}`] || 0) as number;
    if (legacy >= 3) {
      hasIdentical = true;
      hasCase = true;
      hasPhonics = true;
    } else if (legacy >= 2) {
      hasIdentical = true;
      hasCase = true;
    } else if (legacy >= 1) {
      hasIdentical = true;
    }
  }

  const count = (hasIdentical ? 1 : 0) + (hasCase ? 1 : 0) + (hasPhonics ? 1 : 0);
  return {
    identical: hasIdentical,
    case: hasCase,
    phonics: hasPhonics,
    totalStars: Math.min(3, count) as 0 | 1 | 2 | 3,
  };
}

export function MemoryLetters() {
  const navigate = useNavigate();
  const { letter } = useParams<{ letter?: string }>();
  const { progress, awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { speak, playPop, playDing, playSwoosh } = useAudio();

  const activeMastered = (masteredLetters && masteredLetters.length > 0)
    ? masteredLetters
    : (letter ? [letter.toUpperCase()] : (masteredLetter ? [masteredLetter] : []));

  const [matchMode, setMatchMode] = useState<MatchMode>('case');
  
  // Requirement: More than one letter MUST be picked (at least 2 letters)
  const [selectedLetters, setSelectedLetters] = useState<string[]>(() => {
    if (activeMastered.length >= 2) {
      return activeMastered;
    }
    if (activeMastered.length === 1) {
      const l1 = activeMastered[0];
      const nextLetter = l1 === 'Z' ? 'Y' : String.fromCharCode(l1.charCodeAt(0) + 1);
      return [l1, nextLetter];
    }
    return ['A', 'B', 'C', 'D'];
  });

  const [gameState, setGameState] = useState<'selection' | 'playing' | 'won'>('selection');
  const [cards, setCards] = useState<Card[]>([]);
  const [playingLetters, setPlayingLetters] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]); // IDs of currently flipped cards
  const [matches, setMatches] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const toggleLetter = (l: string) => {
    playPop();
    setSelectedLetters(prev => {
      if (prev.includes(l)) {
        // Enforce: more than one letter must remain selected (minimum 2)
        if (prev.length <= 2) {
          setWarningMessage('Memory game needs at least 2 letters!');
          speak('Pick at least 2 letters!');
          setTimeout(() => setWarningMessage(null), 2500);
          return prev;
        }
        return prev.filter(x => x !== l);
      } else {
        return [...prev, l];
      }
    });
  };

  const initGame = useCallback(() => {
    // Enforce: must have at least 2 letters to start
    if (selectedLetters.length < 2) {
      setWarningMessage('Please pick at least 2 letters to play!');
      speak('Please pick at least 2 letters!');
      return;
    }

    // Use up to 6 pairs
    const gameLetters = [...selectedLetters]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    setPlayingLetters(gameLetters);

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
    setMistakes(0);
    setGameState('playing');
  }, [selectedLetters, matchMode, speak]);

  const handleCardClick = (id: string) => {
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched || flipped.length >= 2) return;

    playSwoosh();
    if (card.type === 'letter') speak(card.content);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    // Update cards state to show flipped
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));

    if (newFlipped.length === 2) {
      const [id1] = newFlipped;
      const card1 = cards.find(c => c.id === id1)!;
      const card2 = card;

      if (card1.pairId === card2.pairId) {
        // MATCH!
        setTimeout(() => {
          playDing();
          speak(`Match! ${card2.pairId}!`);
          setCards(prev => prev.map(c => c.pairId === card2.pairId ? { ...c, isMatched: true } : c));
          setFlipped([]);
          const newMatchCount = matches + 1;
          setMatches(newMatchCount);

          // All pairs matched -> Victory!
          if (newMatchCount >= cards.length / 2) {
            // Condition mastered: each letter earns 1 star per condition mastered
            playingLetters.forEach(l => {
              // 1. Award this condition
              awardStars(`memory_cond_${l}_${matchMode}`, 1);

              // 2. Compute total conditions mastered for this letter (1, 2, or 3)
              const updatedConds = getLetterMemoryConditions(l, {
                ...useStore.getState().progress.starsEarned,
                [`memory_cond_${l}_${matchMode}`]: 1,
              });

              // 3. Award overall stars for this letter in memory-letters
              const totalStarsForLetter = Math.max(1, updatedConds.totalStars) as 1 | 2 | 3;
              awardStars(`${l}-memory-letters`, totalStarsForLetter);
              incrementActivity(`${l}-memory-letters`);
            });

            // Award general memory-letters activity
            awardStars('memory-letters', 3);
            incrementActivity('memory-letters');

            setTimeout(() => setGameState('won'), 1000);
          }
        }, 500);
      } else {
        // NO MATCH -> flip back after delay
        setMistakes(m => m + 1);
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c));
          setFlipped([]);
        }, 1100);
      }
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
              <span className="text-2xl sm:text-3xl">🃏</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#DB2777]">Memory Setup</h2>
            </div>
            <div style={{ width: 44 }} />
          </div>

          {/* Mode Selector */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 shadow-md border border-pink-100 shrink-0 mb-2">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="font-black text-xs sm:text-sm text-pink-950 flex items-center gap-1">
                <span>🎯</span> Matching Match Type (1⭐ per condition):
              </span>
              <span className="text-[11px] font-bold text-[#DB2777]">
                {matchMode === 'identical'
                  ? 'A = A (Condition 1: Same)'
                  : matchMode === 'case'
                  ? 'A = a (Condition 2: Upper/Lower)'
                  : 'A = 🍎 (Condition 3: Phonics)'}
              </span>
            </div>
            <div className="flex gap-2">
              {(
                [
                  { id: 'identical', label: 'A = A', desc: 'Same' },
                  { id: 'case', label: 'A = a', desc: 'Case' },
                  { id: 'phonics', label: 'A = 🍎', desc: 'Phonics' },
                ] as const
              ).map(m => {
                const isSelectedMode = matchMode === m.id;
                // Check if all selected letters have completed this condition
                const allSelectedCompleted =
                  selectedLetters.length > 0 &&
                  selectedLetters.every(
                    l => getLetterMemoryConditions(l, progress.starsEarned)[m.id]
                  );

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { playPop(); setMatchMode(m.id); }}
                    className={`flex-1 py-1.5 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer border-2 flex items-center justify-center gap-1.5 ${
                      isSelectedMode
                        ? 'bg-[#DB2777] text-white border-[#DB2777] shadow-md scale-[1.02]'
                        : 'bg-white text-[#DB2777] border-pink-100 hover:bg-pink-50'
                    }`}
                  >
                    <span>{m.label}</span>
                    {allSelectedCompleted && (
                      <span className="text-amber-300 text-xs drop-shadow" title="Mastered by selected letters!">⭐</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Letters Grid */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-2.5 sm:p-3 shadow-md border border-pink-100 flex-1 flex flex-col justify-between min-h-0 mb-2">
            <div className="flex items-center justify-between mb-1 shrink-0 px-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-black text-xs sm:text-sm text-pink-950 flex items-center gap-1">
                  <span>🔤</span> Selected Letters ({selectedLetters.length}/26):
                </span>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  Pick 2+ letters
                </span>
              </div>
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
                  onClick={() => setSelectedLetters(['A', 'B', 'C', 'D'])}
                  className="text-xs font-black px-2.5 py-0.5 rounded-full border border-slate-300 text-slate-600 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                  title="Reset to 4 letters"
                >
                  Reset (4)
                </button>
              </div>
            </div>

            {/* Warning Message if user tries to pick fewer than 2 */}
            <AnimatePresence>
              {warningMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-amber-100 border border-amber-400 text-amber-900 text-xs font-extrabold px-3 py-1 rounded-xl text-center shadow-sm shrink-0 mb-1"
                >
                  ⚠️ {warningMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto py-1">
              <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 w-full justify-items-stretch">
                {LETTERS_DATA.map(ld => {
                  const isSelected = selectedLetters.includes(ld.letter);
                  const conds = getLetterMemoryConditions(ld.letter, progress.starsEarned);

                  return (
                    <motion.button
                      key={ld.letter}
                      type="button"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => toggleLetter(ld.letter)}
                      className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all border-2 cursor-pointer p-0.5 relative ${
                        isSelected
                          ? 'bg-[#DB2777] text-white border-[#DB2777] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-black leading-none" style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.5rem)' }}>
                        {ld.uppercase}
                      </span>
                      {/* Condition Stars indicator (0-3 stars) */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map(starNum => {
                          const earned = conds.totalStars >= starNum;
                          return (
                            <span
                              key={starNum}
                              className={`text-[8px] sm:text-[10px] leading-none ${
                                earned
                                  ? 'text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] font-black'
                                  : isSelected
                                  ? 'opacity-25 text-white'
                                  : 'opacity-20 text-gray-400'
                              }`}
                            >
                              ★
                            </span>
                          );
                        })}
                      </div>
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
              whileHover={selectedLetters.length >= 2 ? { scale: 1.02 } : {}}
              whileTap={selectedLetters.length >= 2 ? { scale: 0.98 } : {}}
              disabled={selectedLetters.length < 2}
              onClick={initGame}
              className={`w-full py-3 rounded-2xl font-black text-base sm:text-lg shadow-xl transition-all cursor-pointer ${
                selectedLetters.length >= 2
                  ? 'bg-[#DB2777] hover:bg-[#BE185D] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              {selectedLetters.length < 2
                ? 'Pick at least 2 letters! 🃏'
                : `Start Game (${selectedLetters.length} letters)! 🚀`}
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render Playing ─────────────────────────────────────────────────────────

  const totalPairs = cards.length / 2;

  return (
    <div className="min-h-dvh flex flex-col bg-[#FDF2F8] overflow-hidden">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-3 sm:p-4 relative z-10">
        <BackButton onClick={() => activeMastered.length > 0 ? navigate('/letters') : setGameState('selection')} color="#DB2777" />
        <div className="flex-1 max-w-xs sm:max-w-md mx-auto flex flex-col items-center">
          <ProgressBar
            value={matches}
            max={totalPairs}
            color="#DB2777"
            label={`Matches: ${matches}/${totalPairs}`}
          />
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Cards Board */}
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 w-full max-w-5xl justify-items-center">
          {cards.map((card) => {
            const isCardRevealed = card.isFlipped || card.isMatched;

            return (
              <motion.div
                key={card.id}
                role="button"
                tabIndex={0}
                aria-label={`Card ${isCardRevealed ? card.content : 'hidden'}`}
                whileHover={!isCardRevealed ? { scale: 1.05 } : {}}
                whileTap={!isCardRevealed ? { scale: 0.95 } : {}}
                onClick={() => handleCardClick(card.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(card.id);
                  }
                }}
                className="w-full aspect-[3/4] relative cursor-pointer select-none"
                style={{ perspective: 1000, WebkitPerspective: 1000 }}
              >
                <motion.div
                  className="w-full h-full relative"
                  style={{
                    transformStyle: 'preserve-3d',
                    WebkitTransformStyle: 'preserve-3d',
                  }}
                  animate={{ rotateY: isCardRevealed ? 180 : 0 }}
                  transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  {/* Card Back (Pink with ?) */}
                  <div
                    className="absolute inset-0 bg-gradient-to-br from-[#EC4899] to-[#BE185D] rounded-2xl sm:rounded-3xl border-4 sm:border-6 border-white shadow-xl flex items-center justify-center pointer-events-none"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <span className="text-white text-4xl sm:text-6xl font-black opacity-35 select-none drop-shadow">
                      ?
                    </span>
                  </div>

                  {/* Card Front (Revealed: Letter or Image) */}
                  <div
                    className="absolute inset-0 bg-white rounded-2xl sm:rounded-3xl border-4 sm:border-6 shadow-xl flex flex-col items-center justify-center overflow-hidden pointer-events-none p-2"
                    style={{
                      borderColor: card.color,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      WebkitTransform: 'rotateY(180deg)',
                    }}
                  >
                    {card.type === 'letter' ? (
                      <span
                        className="text-5xl sm:text-7xl font-black drop-shadow-sm select-none"
                        style={{ color: card.color, fontFamily: 'Nunito' }}
                      >
                        {card.content}
                      </span>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-1 sm:p-2">
                        <img
                          src={card.content}
                          alt="match object"
                          className="w-full h-full max-h-20 sm:max-h-28 object-contain drop-shadow"
                          onError={(e) => {
                            // Fallback to emoji if remote image fails
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.img-fallback') as HTMLElement;
                            if (fallback) fallback.style.display = 'block';
                          }}
                        />
                        <span className="img-fallback text-4xl sm:text-5xl hidden select-none">
                          {LETTERS_DATA.find((l) => l.letter === card.pairId)?.exampleEmoji || '🌟'}
                        </span>
                      </div>
                    )}

                    {card.isMatched && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center backdrop-blur-[1px]"
                      >
                        <span className="text-4xl sm:text-6xl drop-shadow-lg">✅</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CelebrationScreen
        active={gameState === 'won'}
        stars={3}
        message={`Condition Mastered: ${
          matchMode === 'identical' ? 'A = A' : matchMode === 'case' ? 'A = a' : 'A = 🍎'
        }! ⭐ Each letter gets a condition star!`}
        onContinue={() => {
          setGameState('selection');
          navigate('/letters/activity/memory-letters');
        }}
        onMenu={() => {
          navigate('/letters');
        }}
      />

      {showFact && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard
            fact="Your brain is like a muscle, and memory games help it get stronger!"
            emoji="🧠"
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
