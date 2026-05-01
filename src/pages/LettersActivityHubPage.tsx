import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTER_ACTIVITIES } from '../constants/activities';
import { ActivityCard, BackButton } from '../components/SharedComponents';
import { BuddyBear } from '../components/BuddyBear';

export function LettersActivityHubPage() {
  const navigate = useNavigate();

  const recognition = LETTER_ACTIVITIES.filter(a => a.group === 'recognition');
  const formation = LETTER_ACTIVITIES.filter(a => a.group === 'formation');
  const usage = LETTER_ACTIVITIES.filter(a => a.group === 'usage');

  const renderGroup = (title: string, activities: typeof LETTER_ACTIVITIES, isWide = false) => (
    <div className={`mb-8 w-full ${isWide ? 'max-w-6xl' : 'max-w-lg'} px-4`}>
      <div 
        className="inline-block bg-[#8B4513] border-4 border-[#5C3A21] px-6 py-2 shadow-xl mb-6 relative overflow-hidden" 
        style={{ borderRadius: '12px 12px 24px 12px', transform: 'rotate(-2deg)' }}
      >
        <div className="absolute top-1 left-2 w-2 h-2 bg-[#4A2F1D] rounded-full shadow-inner" />
        <div className="absolute bottom-1 right-2 w-2 h-2 bg-[#4A2F1D] rounded-full shadow-inner" />
        <h3 className="text-xl md:text-2xl font-black text-[#FDE68A] drop-shadow-md" style={{ fontFamily: 'Nunito', textShadow: '1px 2px 2px rgba(0,0,0,0.4)' }}>
          {title}
        </h3>
      </div>
      <div className={`grid gap-6 ${isWide ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {activities.map((act) => (
          <ActivityCard
            key={act.id}
            name={act.name}
            description={act.description}
            icon={act.icon}
            onClick={() => navigate(`/letters/activity/${act.id}`)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="hub-bg" />
      <div className="min-h-dvh flex flex-col items-center pb-24 relative z-10">
        <div className="w-full flex items-center p-4 sticky top-0 z-50">
          <BackButton onClick={() => navigate('/')} color="#EA580C" />
          <h1 className="flex-1 text-center text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" style={{ fontFamily: 'Nunito', marginRight: 56 }}>
            Letter Games
          </h1>
        </div>

        {/* BuddyBear in Top-Right with Speech Bubble */}
        <div className="absolute top-4 right-4 z-[60]">
          <BuddyBear mood="happy" size={80} speech="Pick a game to play, then we'll choose a letter!" />
        </div>

        {/* Fluid Landscape Distribution */}
        <div className="w-full max-w-[1600px] px-8 flex flex-col gap-16">
          {/* Row 1: Left and Right Trees */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="w-full lg:w-auto">
              {renderGroup('1. Recognition', recognition)}
            </div>
            <div className="w-full lg:w-auto lg:text-right flex lg:justify-end">
              {renderGroup('2. Formation', formation)}
            </div>
          </div>

          {/* Row 2: Wide Spread Usage */}
          <div className="flex justify-center">
            {renderGroup('3. Usage', usage, true)}
          </div>
        </div>
      </div>
    </>
  );
}
