import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../constants/letters';
import { LETTER_ACTIVITIES } from '../constants/activities';
import { BackButton, StarRating } from '../components/SharedComponents';
import { useStore } from '../store';

export function LetterSelectorPage() {
  const { activity } = useParams<{ activity: string }>();
  const navigate = useNavigate();
  const { progress, masteredLetter, masteredLetters } = useStore();
  const activeMastered = masteredLetters && masteredLetters.length > 0 ? masteredLetters : (masteredLetter ? [masteredLetter] : []);
  const [selectedLetters, setSelectedLetters] = useState<string[]>(activeMastered);

  const activityMeta = LETTER_ACTIVITIES.find(a => a.id === activity);

  if (!activityMeta) return <div className="p-8 text-center font-bold">Activity not found</div>;

  const isMulti = !!activityMeta.multiSelect;

  const toggleLetter = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      setSelectedLetters(prev => prev.filter(l => l !== letter));
    } else {
      setSelectedLetters(prev => [...prev, letter]);
    }
  };

  const selectAll = () => {
    setSelectedLetters(LETTERS_DATA.map(l => l.letter));
  };

  const clearAll = () => {
    setSelectedLetters([]);
  };

  const handleRandomize = () => {
    const shuffled = [...LETTERS_DATA].sort(() => 0.5 - Math.random());
    setSelectedLetters(shuffled.slice(0, 4).map(l => l.letter));
  };

  const handlePlay = () => {
    if (isMulti) {
      if (selectedLetters.length === 0) return;
      navigate(`/letters/activity/${activity}/${selectedLetters.join(',')}`);
    }
  };

  const [lotd] = useState(() => LETTERS_DATA[Math.floor(Math.random() * LETTERS_DATA.length)]);
  const randomMasteredLetter = activeMastered.length > 0
    ? activeMastered[Math.floor(Math.random() * activeMastered.length)]
    : null;
  const masteredLD = randomMasteredLetter ? LETTERS_DATA.find(l => l.letter === randomMasteredLetter) : null;
  const featuredLetterData = masteredLD || lotd;

  return (
    <div className="h-dvh max-h-dvh flex flex-col justify-between overflow-hidden bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100 p-2 sm:p-4 select-none font-nunito">
      {/* Compact Header Bar */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <BackButton onClick={() => navigate('/letters')} color="#EA580C" />
        
        <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
          <span className="text-2xl shrink-0">{activityMeta.icon}</span>
          <h1 className="text-lg sm:text-2xl font-black text-orange-600 truncate">
            {activityMeta.name}
          </h1>
        </div>

        {/* Balance spacer matching back button */}
        <div className="w-10 sm:w-12 shrink-0" />
      </div>

      {/* Subtitle / Instructions & Random Letter Play under the title */}
      <div className="text-center shrink-0 my-1 flex flex-col items-center gap-1.5">
        <p className="text-xs sm:text-sm font-black text-slate-600">
          {isMulti
            ? `Tap letters to include in this activity (${selectedLetters.length} selected):`
            : "Tap any letter to start playing!"}
        </p>

        {/* Random letter play button directly under the title */}
        {!isMulti ? (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/letters/activity/${activity}/${featuredLetterData.letter}`)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black text-white shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-white/80 active:scale-95"
            style={{ backgroundColor: featuredLetterData.color }}
          >
            <span>⭐ Play {featuredLetterData.uppercase}</span>
            <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-black uppercase">
              Random →
            </span>
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              type="button"
              onClick={handleRandomize}
              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-black rounded-full border border-amber-300 transition-colors cursor-pointer shadow-xs flex items-center gap-1"
            >
              <span>🎲</span> Random 4
            </button>
            <button
              type="button"
              onClick={selectAll}
              className="px-3 py-1 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-black rounded-full border border-orange-300 transition-colors cursor-pointer shadow-xs"
            >
              Select All
            </button>
            {selectedLetters.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs font-bold rounded-full transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Letters Grid: Fits all 26 letters in screen view without scrolling */}
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-y-auto w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-2 py-1">
        <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 md:gap-3 w-full justify-items-stretch">
          {LETTERS_DATA.map((ld) => {
            const starKey1 = `${ld.letter}-${activity}`;
            const starKey2 = `${activity}-${ld.letter}`;
            const lotdKey = activity === 'learn-my-letters' ? `${ld.letter}-letter-of-the-day` : '';
            const stars = progress.starsEarned[starKey1] || progress.starsEarned[starKey2] || (lotdKey ? progress.starsEarned[lotdKey] : 0) || 0;
            const isSelected = selectedLetters.includes(ld.letter);
            const isMastered = activeMastered.includes(ld.letter);

            return (
              <motion.button
                key={ld.letter}
                type="button"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() =>
                  isMulti
                    ? toggleLetter(ld.letter)
                    : navigate(`/letters/activity/${activity}/${ld.letter}`)
                }
                className="aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center relative shadow-sm border-2 sm:border-3 transition-all cursor-pointer p-1 sm:p-2 overflow-hidden"
                style={{
                  backgroundColor: isSelected ? ld.color : ld.bgColor,
                  borderColor: isSelected ? '#10B981' : ld.color,
                  boxShadow: isSelected
                    ? '0 0 0 3px #10B98155, 0 6px 14px rgba(0,0,0,0.12)'
                    : undefined,
                }}
              >
                {/* Active Mastered badge */}
                {isMastered && (
                  <span className="absolute top-0.5 left-0.5 sm:top-1 sm:left-1 bg-amber-500 text-white rounded-full text-[8px] sm:text-[11px] font-black px-1 sm:px-1.5 leading-none shadow-sm">
                    🎯
                  </span>
                )}

                {/* Selected Checkmark badge */}
                {isSelected && (
                  <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 bg-emerald-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 text-[10px] sm:text-xs font-black flex items-center justify-center shadow-sm">
                    ✓
                  </span>
                )}

                {/* Letter Display */}
                <span
                  className="font-black leading-none tracking-tight"
                  style={{
                    color: isSelected ? 'white' : ld.color,
                    fontSize: 'clamp(1.1rem, 2.6vw, 2.4rem)',
                  }}
                >
                  {ld.uppercase}
                  <span className="opacity-80 text-[0.8em]">{ld.lowercase}</span>
                </span>

                {/* Stars indication (if single mode and stars earned) */}
                {!isMulti && stars > 0 && (
                  <div className="mt-0.5 sm:mt-1 scale-75 sm:scale-90">
                    <StarRating stars={stars} size={14} />
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Footer / Multi-select Action Bar */}
      <div className="shrink-0 pt-1 pb-1 flex justify-center">
        {isMulti ? (
          <button
            type="button"
            onClick={handlePlay}
            disabled={selectedLetters.length === 0}
            className={`w-full max-w-md py-3 rounded-2xl font-black text-base sm:text-lg shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedLetters.length > 0
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-400/30'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>🚀</span>
            <span>
              {selectedLetters.length > 0
                ? `Play with ${selectedLetters.length} letter${selectedLetters.length > 1 ? 's' : ''}!`
                : 'Select at least 1 letter'}
            </span>
          </button>
        ) : (
          <div className="h-2" />
        )}
      </div>
    </div>
  );
}
