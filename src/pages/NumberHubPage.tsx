import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../constants/numbers';
import { NUMBER_ACTIVITIES } from '../constants/activities';
import { BackButton, StarRating } from '../components/SharedComponents';
import { BuddyBear } from '../components/BuddyBear';
import { useStore } from '../store';

export function NumberHubPage() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { progress } = useStore();

  const nd = NUMBERS_DATA.find(n => n.digit === Number(number));
  if (!nd) return <div>Number not found</div>;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: nd.bgColor }}>
      <div className="px-4 pt-6 pb-4 relative overflow-hidden" style={{ background: nd.color }}>
        <div className="flex items-center gap-3 mb-3">
          <BackButton onClick={() => navigate('/numbers')} color={nd.color} />
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.8rem', color: 'white' }}>
            Number {nd.digit}
          </h1>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20" style={{ background: 'white' }} />
      </div>

      <div className="flex flex-col items-center py-6 gap-3" style={{ background: nd.color }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="flex items-center gap-4"
        >
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '7rem', color: 'white', lineHeight: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.25))' }}>
            {nd.digit}
          </span>
          <div className="flex flex-col items-start gap-1">
            <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.8rem', color: 'white' }}>{nd.word}</span>
            <div className="flex flex-wrap gap-1" style={{ maxWidth: 160 }}>
              {nd.objects.map((obj, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                  style={{ fontSize: '1.6rem' }}
                >{obj}</motion.span>
              ))}
            </div>
          </div>
        </motion.div>
        <BuddyBear mood="excited" size={80} speech={`${nd.digit} is for ${nd.word}! ${nd.objects.slice(0,3).join(' ')}`} />
      </div>

      <div className="flex-1 p-4">
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.3rem', color: '#1C1917', marginBottom: '0.75rem' }}>
          Choose an Activity
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {NUMBER_ACTIVITIES.map((act, i) => {
            const key = `${nd.digit}-${act.id}`;
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
                onClick={() => navigate(`/numbers/${nd.digit}/${act.id}`)}
                className="card p-4 flex flex-col items-center gap-2 text-center"
                style={{ border: `2px solid ${stars > 0 ? nd.color : '#E7E5E4'}` }}
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
