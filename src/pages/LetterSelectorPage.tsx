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
  const { progress } = useStore();
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

  const activityMeta = LETTER_ACTIVITIES.find(a => a.id === activity);

  if (!activityMeta) return <div>Activity not found</div>;

  const isMulti = !!activityMeta.multiSelect;

  const toggleLetter = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      setSelectedLetters(prev => prev.filter(l => l !== letter));
    } else {
      setSelectedLetters(prev => [...prev, letter]);
    }
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

  return (
    <div className="min-h-dvh flex flex-col items-center pb-32 bg-orange-50">
      <div className="w-full flex items-center p-4 sticky top-0 bg-orange-50/90 backdrop-blur z-10">
        <BackButton onClick={() => navigate('/letters')} color="#EA580C" />
        <h1 className="flex-1 text-center text-2xl font-black text-orange-600 truncate px-2" style={{ fontFamily: 'Nunito', marginRight: 56 }}>
          {activityMeta.name} {activityMeta.icon}
        </h1>
      </div>

      <div className="text-center px-4 mt-2 mb-6 flex flex-col items-center gap-3">
        <p className="text-xl font-bold text-gray-700" style={{ fontFamily: 'Nunito' }}>
          {isMulti ? "Select multiple letters to play!" : "Select a letter to play!"}
        </p>
        {isMulti && (
          <button 
            onClick={handleRandomize}
            className="px-6 py-2 bg-orange-200 text-orange-800 font-bold rounded-full border-2 border-orange-300 shadow-sm active:scale-95 transition-transform"
          >
            🎲 Randomize 4
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 px-4 w-full max-w-4xl">
        {LETTERS_DATA.map((ld) => {
          const starKey = `${ld.letter}-${activity}`;
          const stars = progress.starsEarned[starKey] || 0;
          const isSelected = selectedLetters.includes(ld.letter);

          return (
            <motion.button
              key={ld.letter}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => isMulti ? toggleLetter(ld.letter) : navigate(`/letters/activity/${activity}/${ld.letter}`)}
              className="card flex flex-col items-center justify-center p-4 gap-2 aspect-square relative overflow-hidden"
              style={{ 
                backgroundColor: ld.bgColor, 
                border: `4px solid ${isSelected ? '#10B981' : ld.color}`,
                boxShadow: isSelected ? '0 0 0 4px #10B98133' : undefined
              }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10 bg-white rounded-bl-full" />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-md">
                  ✓
                </div>
              )}
              <span className="text-4xl font-black" style={{ color: ld.color, fontFamily: 'Nunito' }}>
                {ld.uppercase}{ld.lowercase}
              </span>
              {!isMulti && stars > 0 && (
                <div className="mt-1 scale-75">
                  <StarRating stars={stars} size={16} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isMulti && selectedLetters.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-50 pointer-events-none"
          >
            <button
              onClick={handlePlay}
              className="btn-primary pointer-events-auto text-xl px-12 py-4 shadow-2xl flex items-center gap-3"
              style={{ backgroundColor: '#10B981', color: 'white' }}
            >
              Play with {selectedLetters.length} letter{selectedLetters.length > 1 ? 's' : ''}! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
