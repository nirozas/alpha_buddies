import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NUMBERS_DATA } from '../constants/numbers';
import { BackButton } from '../components/SharedComponents';
import { useStore } from '../store';

export function NumbersHubPage() {
  const navigate = useNavigate();
  const { progress } = useStore();

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#E0F5EE' }}>
      <div className="gradient-numbers px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-3">
          <BackButton onClick={() => navigate('/')} color="#0D9E75" />
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: 'white' }}>
            🔢 Numbers 0–9
          </h1>
        </div>
        <p style={{ fontFamily: 'Nunito', color: '#E0F5EE', fontSize: '1rem', fontWeight: 600, paddingLeft: 4 }}>
          Tap a number to start learning!
        </p>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20" style={{ background: 'white' }} />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15" style={{ background: 'white' }} />
      </div>

      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 max-w-2xl mx-auto">
          {NUMBERS_DATA.map((nd, i) => {
            const completed = !!progress.numbersCompleted[nd.digit];
            return (
              <motion.button
                key={nd.digit}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 350, damping: 16 }}
                whileHover={{ scale: 1.1, y: -6 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate(`/numbers/${nd.digit}`)}
                className="aspect-square rounded-3xl flex flex-col items-center justify-center gap-2 shadow-lg relative"
                style={{ background: completed ? nd.color : 'white', border: `4px solid ${nd.color}` }}
              >
                <span
                  style={{
                    fontFamily: 'Nunito',
                    fontWeight: 900,
                    fontSize: 'clamp(2.5rem, 8vw, 3.5rem)',
                    color: completed ? 'white' : nd.color,
                    lineHeight: 1,
                  }}
                >
                  {nd.digit}
                </span>
                <span style={{ fontSize: '1.5rem' }}>{nd.emoji}</span>
                {completed && (
                  <span className="absolute -top-2 -right-2 text-lg">⭐</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
