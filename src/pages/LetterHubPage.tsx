import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../constants/letters';
import { LETTER_ACTIVITIES } from '../constants/activities';
import { BackButton, StarRating } from '../components/SharedComponents';
import { BuddyBear } from '../components/BuddyBear';
import { useStore } from '../store';

export function LetterHubPage() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { progress } = useStore();

  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase());
  if (!ld) return <div>Letter not found</div>;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: ld.bgColor }}>
      {/* Header */}
      <div className="px-4 pt-6 pb-4 relative overflow-hidden" style={{ background: ld.color }}>
        <div className="flex items-center gap-3 mb-3">
          <BackButton onClick={() => navigate('/letters')} color={ld.color} />
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.8rem', color: 'white' }}>
            Letter {ld.letter}
          </h1>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
      </div>

      {/* Letter hero */}
      <div className="flex flex-col items-center py-6 gap-3" style={{ background: ld.color }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex items-center gap-4"
        >
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '6rem', color: 'white', lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}>
            {ld.uppercase}
          </span>
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '6rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>
            {ld.lowercase}
          </span>
        </motion.div>
        <div className="flex items-center gap-3 text-white">
          <span style={{ fontFamily: 'Nunito', fontSize: '1.2rem', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 999 }}>
            {ld.phoneme}
          </span>
          <span style={{ fontSize: '2rem' }}>{ld.exampleEmoji}</span>
          <span style={{ fontFamily: 'Nunito', fontSize: '1.3rem', fontWeight: 800, color: 'white' }}>
            {ld.exampleWord}
          </span>
        </div>
        <BuddyBear mood="happy" size={80} speech={`${ld.uppercase} says "${ld.phoneme}" like ${ld.exampleWord}!`} />
      </div>

      {/* Activities grid */}
      <div className="flex-1 p-4">
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.3rem', color: '#1C1917', marginBottom: '0.75rem' }}>
          Choose an Activity
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {LETTER_ACTIVITIES.map((act, i) => {
            const key = `${ld.letter}-${act.id}`;
            const stars = (progress.starsEarned[key] || 0) as 0|1|2|3;
            const count = progress.activitiesCompleted[key] || 0;
            return (
              <motion.button
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate(`/letters/${ld.letter}/${act.id}`)}
                className="card p-4 flex flex-col items-center gap-2 text-center"
                style={{ border: `2px solid ${stars > 0 ? ld.color : '#E7E5E4'}` }}
              >
                <span className="text-4xl">{act.icon}</span>
                <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '0.85rem', color: '#1C1917', lineHeight: 1.2 }}>{act.name}</p>
                <p style={{ fontFamily: 'Nunito', fontSize: '0.7rem', color: '#78716C' }}>{act.description}</p>
                {stars > 0 ? <StarRating stars={stars} size={16} /> : (
                  <span style={{ fontSize: '0.65rem', color: '#A8A29E', fontFamily: 'Nunito' }}>{count > 0 ? `${count}x played` : 'Not played yet'}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
