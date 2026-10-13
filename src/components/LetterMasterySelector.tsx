import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTERS_DATA } from '../constants/letters';
import { useStore } from '../store';
import { useAudio } from '../hooks/useAudio';

export function LetterMasterySelector() {
  const { masteredLetters, setMasteredLetters, progress } = useStore();
  const { playPop, playBoing, playDing, speak } = useAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<string[]>([]);
  const [limitNotice, setLimitNotice] = useState(false);

  // Sync tempSelection whenever modal opens or masteredLetters changes
  useEffect(() => {
    if (isOpen) {
      setTempSelection(masteredLetters || []);
    }
  }, [isOpen, masteredLetters]);

  const activeLettersData = (masteredLetters || [])
    .map((letter) => LETTERS_DATA.find((l) => l.letter === letter))
    .filter(Boolean);

  const toggleLetter = (letter: string) => {
    if (tempSelection.includes(letter)) {
      playPop();
      setTempSelection((prev) => prev.filter((l) => l !== letter));
    } else {
      if (tempSelection.length >= 4) {
        playBoing();
        setLimitNotice(true);
        setTimeout(() => setLimitNotice(false), 2000);
        return;
      }
      playPop();
      speak(`Letter ${letter}`);
      setTempSelection((prev) => [...prev, letter]);
    }
  };

  const handleApply = () => {
    playDing();
    setMasteredLetters(tempSelection);
    setIsOpen(false);
  };

  const handleClear = () => {
    playPop();
    setTempSelection([]);
    setMasteredLetters([]);
    setIsOpen(false);
  };

  const handleRandomize = () => {
    playPop();
    const shuffled = [...LETTERS_DATA].sort(() => 0.5 - Math.random());
    const randomFour = shuffled.slice(0, 4).map((l) => l.letter);
    setTempSelection(randomFour);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 z-40">
      {/* Active Selector Pill */}
      {activeLettersData.length === 0 ? (
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            playPop();
            setIsOpen(true);
          }}
          className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-xl border-4 border-amber-400 hover:border-amber-500 transition-all cursor-pointer"
        >
          <span className="text-2xl animate-bounce">🎯</span>
          <div className="flex flex-col items-start text-left">
            <span
              className="font-black text-amber-950 text-base md:text-lg leading-tight"
              style={{ fontFamily: 'Nunito' }}
            >
              Pick letters to master
            </span>
            <span className="text-xs font-bold text-amber-800/80" style={{ fontFamily: 'Nunito' }}>
              Choose up to 4 letters · Shuffles across games
            </span>
          </div>
          <span className="text-amber-800 text-sm font-black px-2 py-0.5 bg-amber-100 rounded-full ml-1">
            ▼
          </span>
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-wrap items-center justify-center gap-2 p-2 px-4 rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border-4 border-amber-400"
        >
          {/* Label & Shuffle hint */}
          <div className="flex items-center gap-1.5 mr-1">
            <span className="text-xl">🎯</span>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 leading-none" style={{ fontFamily: 'Nunito' }}>
                Mastering ({activeLettersData.length}/4):
              </span>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 leading-tight" style={{ fontFamily: 'Nunito' }}>
                <span>🎲 Shuffles in games</span>
              </span>
            </div>
          </div>

          {/* Letter Badges */}
          <div className="flex items-center gap-1.5">
            {activeLettersData.map((ld: any) => (
              <motion.div
                key={ld.letter}
                whileHover={{ scale: 1.1, rotate: 2 }}
                className="w-10 h-10 rounded-2xl flex flex-col items-center justify-center text-white font-black shadow-md relative"
                style={{ backgroundColor: ld.color, fontFamily: 'Nunito' }}
                title={`${ld.uppercase} (${ld.exampleWord})`}
              >
                <span className="text-base leading-none">{ld.uppercase}</span>
                <span className="text-[9px] opacity-80 leading-none">{ld.lowercase}</span>
              </motion.div>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          {/* Change button */}
          <button
            onClick={() => {
              playPop();
              setIsOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-100 hover:bg-amber-200 text-amber-900 active:scale-95 transition-all cursor-pointer"
            style={{ fontFamily: 'Nunito' }}
          >
            Change ▾
          </button>

          {/* Clear / All letters button */}
          <button
            onClick={handleClear}
            title="Reset to all letters"
            className="px-3 py-1.5 rounded-full text-xs font-black bg-rose-50 hover:bg-rose-100 text-rose-600 active:scale-95 transition-all border border-rose-200 cursor-pointer"
            style={{ fontFamily: 'Nunito' }}
          >
            ✕ Clear
          </button>
        </motion.div>
      )}

      {/* Modal Multi-Letter Picker */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border-4 border-amber-400"
            >
              {/* Modal Header */}
              <div className="p-3 sm:p-5 pb-2 sm:pb-3 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 flex items-center justify-between border-b border-amber-200 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl sm:text-3xl">🎯</span>
                  <div>
                    <h2
                      className="text-lg sm:text-2xl font-black text-amber-950 leading-tight"
                      style={{ fontFamily: 'Nunito' }}
                    >
                      Pick letters to master!
                    </h2>
                    <p className="text-[11px] sm:text-xs font-bold text-amber-800" style={{ fontFamily: 'Nunito' }}>
                      Choose up to 4 letters to focus your games on.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/80 hover:bg-white text-gray-600 font-black text-base sm:text-lg flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Selection Bar & Controls */}
              <div className="px-3 sm:px-6 py-2 bg-amber-50/70 flex items-center justify-between gap-2 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-black text-gray-700" style={{ fontFamily: 'Nunito' }}>
                    Selected ({tempSelection.length}/4):
                  </span>
                  <div className="flex gap-1">
                    {tempSelection.map((l) => {
                      const ld = LETTERS_DATA.find((x) => x.letter === l);
                      return (
                        <span
                          key={l}
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm"
                          style={{ backgroundColor: ld?.color || '#EA580C', fontFamily: 'Nunito' }}
                        >
                          {l}
                        </span>
                      );
                    })}
                    {tempSelection.length === 0 && (
                      <span className="text-xs font-bold text-gray-400 italic">None selected</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleRandomize}
                    className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-800 border border-orange-300 transition-all cursor-pointer"
                    style={{ fontFamily: 'Nunito' }}
                  >
                    🎲 Random 4
                  </button>
                  <button
                    onClick={() => {
                      playPop();
                      setTempSelection([]);
                    }}
                    className="text-xs font-black px-2.5 py-1 rounded-full bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 transition-all cursor-pointer"
                    style={{ fontFamily: 'Nunito' }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* 4 letters limit notice */}
              <AnimatePresence>
                {limitNotice && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-amber-500 text-white text-center py-1 px-4 text-xs font-black shrink-0"
                    style={{ fontFamily: 'Nunito' }}
                  >
                    ⚠️ You can select up to 4 letters! Tap a selected letter to unselect it first.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Letters Grid: Fits all 26 letters in screen view without scrolling */}
              <div className="p-2 sm:p-4 flex-1 grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2.5 items-center justify-items-stretch max-w-4xl mx-auto w-full">
                {LETTERS_DATA.map((ld) => {
                  const isSelected = tempSelection.includes(ld.letter);
                  const isMaxedOut = tempSelection.length >= 4 && !isSelected;
                  const completed = !!progress.lettersCompleted[ld.letter];

                  return (
                    <motion.button
                      key={ld.letter}
                      whileHover={isMaxedOut ? {} : { scale: 1.08 }}
                      whileTap={isMaxedOut ? {} : { scale: 0.92 }}
                      onClick={() => toggleLetter(ld.letter)}
                      className={`aspect-square rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-0.5 sm:p-1 relative shadow-sm transition-all cursor-pointer overflow-hidden border-2 ${
                        isMaxedOut ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected ? ld.color : ld.bgColor,
                        borderColor: isSelected ? '#10B981' : ld.color,
                        boxShadow: isSelected ? `0 0 0 2px #10B98155, 0 4px 10px rgba(0,0,0,0.12)` : undefined,
                      }}
                    >
                      {/* Checkmark badge */}
                      {isSelected && (
                        <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                          <span className="text-[9px] font-black">✓</span>
                        </div>
                      )}

                      <span
                        className="font-black leading-none"
                        style={{
                          color: isSelected ? 'white' : ld.color,
                          fontFamily: 'Nunito',
                          fontSize: 'clamp(1rem, 2.4vw, 1.8rem)',
                        }}
                      >
                        {ld.uppercase}
                        <span className="opacity-80 text-[0.8em]">{ld.lowercase}</span>
                      </span>

                      <span className="text-xs sm:text-sm mt-0.5 leading-none">{ld.exampleEmoji}</span>

                      {completed && !isSelected && (
                        <span className="absolute bottom-0.5 right-0.5 text-[10px]">⭐</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="p-2.5 sm:p-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
                <button
                  onClick={handleClear}
                  className="px-5 py-2.5 rounded-full font-black text-rose-600 hover:bg-rose-50 text-sm transition-colors cursor-pointer"
                  style={{ fontFamily: 'Nunito' }}
                >
                  Show All Letters (Reset)
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 rounded-full font-black text-gray-600 hover:bg-gray-200 text-sm transition-colors cursor-pointer"
                    style={{ fontFamily: 'Nunito' }}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleApply}
                    className="px-7 py-2.5 rounded-full font-black text-white text-base shadow-lg transition-transform active:scale-95 cursor-pointer"
                    style={{
                      backgroundColor: tempSelection.length > 0 ? '#10B981' : '#EA580C',
                      fontFamily: 'Nunito',
                    }}
                  >
                    {tempSelection.length > 0
                      ? `Master ${tempSelection.length} Letter${tempSelection.length > 1 ? 's' : ''}! 🚀`
                      : 'Show All Letters 🌟'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
