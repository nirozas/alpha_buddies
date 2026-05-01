import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../constants/letters';
import { BackButton } from '../components/SharedComponents';
import { useStore } from '../store';

export function LettersHubPage() {
  const navigate = useNavigate();
  const { progress } = useStore();

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#EDE9FB' }}>
      {/* Header */}
      <div className="gradient-letters px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <BackButton onClick={() => navigate('/')} color="#6C3CE1" />
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: 'white' }}>
            🔤 The Alphabet
          </h1>
        </div>
        <p style={{ fontFamily: 'Nunito', color: '#EDE9FB', fontSize: '1rem', fontWeight: 600, paddingLeft: 4 }}>
          Tap a letter to start learning!
        </p>
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: 'white' }} />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15" style={{ background: 'white' }} />
      </div>

      {/* Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 max-w-2xl mx-auto">
          {LETTERS_DATA.map((ld, i) => {
            const completed = !!progress.lettersCompleted[ld.letter];
            const stars = progress.starsEarned[`${ld.letter}-letter-of-the-day`] || 0;
            return (
              <motion.button
                key={ld.letter}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03, type: 'spring', stiffness: 400, damping: 18 }}
                whileHover={{ scale: 1.12, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(`/letters/${ld.letter}`)}
                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md relative"
                style={{ background: completed ? ld.color : 'white', border: `3px solid ${ld.color}` }}
              >
                <span
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 900,
                    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                    color: completed ? 'white' : ld.color,
                    lineHeight: 1,
                  }}
                >
                  {ld.letter}
                </span>
                <span style={{ fontSize: '0.65rem', color: completed ? 'rgba(255,255,255,0.8)' : '#78716C', fontFamily: 'Nunito', fontWeight: 600 }}>
                  {ld.lowercase}
                </span>
                {completed && (
                  <span className="absolute -top-1 -right-1 text-sm">⭐</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
