import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../constants/numbers';
import { NUMBER_ACTIVITIES } from '../constants/activities';
import { BackButton, StarRating } from '../components/SharedComponents';
import { useStore } from '../store';

export function NumberSelectorPage() {
  const { activity } = useParams<{ activity: string }>();
  const navigate = useNavigate();
  const { progress } = useStore();

  const activityMeta = NUMBER_ACTIVITIES.find(a => a.id === activity);

  if (!activityMeta) return <div>Activity not found</div>;

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 bg-blue-50">
      <div className="w-full flex items-center p-4 sticky top-0 bg-blue-50/90 backdrop-blur z-10">
        <BackButton onClick={() => navigate('/numbers')} color="#2563EB" />
        <h1 className="flex-1 text-center text-2xl font-black text-blue-600 truncate px-2" style={{ fontFamily: 'Nunito', marginRight: 56 }}>
          {activityMeta.name} {activityMeta.icon}
        </h1>
      </div>

      <div className="text-center px-4 mt-2 mb-6">
        <p className="text-xl font-bold text-gray-700" style={{ fontFamily: 'Nunito' }}>
          Select a number to play!
        </p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 px-4 w-full max-w-4xl">
        {NUMBERS_DATA.map((nd) => {
          const starKey = `${nd.digit}-${activity}`;
          const stars = progress.starsEarned[starKey] || 0;

          return (
            <motion.button
              key={nd.digit}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/numbers/activity/${activity}/${nd.digit}`)}
              className="card flex flex-col items-center justify-center p-4 gap-2 aspect-square relative overflow-hidden"
              style={{ backgroundColor: nd.bgColor, border: `3px solid ${nd.color}` }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 opacity-10 bg-white rounded-bl-full" />
              <span className="text-5xl font-black" style={{ color: nd.color, fontFamily: 'Nunito' }}>
                {nd.digit}
              </span>
              {stars > 0 && (
                <div className="mt-1 scale-75">
                  <StarRating stars={stars} size={16} />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
