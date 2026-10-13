import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LETTER_ACTIVITIES } from '../constants/activities';
import { ActivityCard, BackButton } from '../components/SharedComponents';
import { BuddyBear } from '../components/BuddyBear';
import { LetterMasterySelector } from '../components/LetterMasterySelector';
import { useStore } from '../store';

export function LettersActivityHubPage() {
  const navigate = useNavigate();
  const { masteredLetters, progress } = useStore();

  useEffect(() => {
    document.body.classList.add('full-opacity-bg');
    return () => document.body.classList.remove('full-opacity-bg');
  }, []);

  const recognition = LETTER_ACTIVITIES.filter(a => a.group === 'recognition');
  const formation = LETTER_ACTIVITIES.filter(a => a.group === 'formation');
  const usage = LETTER_ACTIVITIES.filter(a => a.group === 'usage');

  const hasMastery = masteredLetters && masteredLetters.length > 0;

  const MULTI_LETTER_ACTIVITIES = [
    'letter-caterpillar',
    'letter-sounds',
    'first-letter-sound',
    'memory-letters',
    'color-by-code',
    'flip-find',
    'letter-match',
    'mystery-reveal',
    'build-a-letter',
    'letter-dot-to-dot',
    'magic-trace',
    'trace-draw',
    'say-it-out-loud',
    'what-starts-with',
  ];

  const renderGroup = (title: string, activities: typeof LETTER_ACTIVITIES, isWide = false) => (
    <div className={`mb-4 w-full ${isWide ? 'max-w-6xl' : 'max-w-xl'} px-4`}>
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
      <div className={`grid gap-3 ${isWide ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'}`}>
        {activities.map((act) => {
          let description = act.description;
          const isMulti = MULTI_LETTER_ACTIVITIES.includes(act.id);

          if (hasMastery) {
            if (masteredLetters.length === 1) {
              description = `Letter ${masteredLetters[0]} · ${act.description}`;
            } else {
              description = isMulti
                ? `[${masteredLetters.join(', ')}] · All included`
                : `[${masteredLetters.join(', ')}] · 🎲 Shuffles`;
            }
          }

          return (
            <ActivityCard
              key={act.id}
              name={act.name}
              description={description}
              icon={act.icon}
              onClick={() => {
                if (hasMastery) {
                  if (isMulti) {
                    navigate(`/letters/activity/${act.id}/${masteredLetters.join(',')}`);
                  } else {
                    const chosenLetter = masteredLetters[Math.floor(Math.random() * masteredLetters.length)];
                    navigate(`/letters/activity/${act.id}/${chosenLetter}`);
                  }
                } else {
                  navigate(`/letters/activity/${act.id}`);
                }
              }}
              smaller={true}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-dvh flex flex-col items-center pb-24 relative z-10">
        <div className="w-full flex items-center justify-between p-4 sticky top-0 z-50">
          <div className="flex items-center gap-2.5">
            <BackButton onClick={() => navigate('/')} color="#EA580C" />
            <button
              onClick={() => navigate('/progress')}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg border-2 border-amber-300 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs sm:text-sm cursor-pointer active:scale-95 transition-transform"
              style={{ fontFamily: 'Nunito' }}
            >
              🏆 Player Dashboard
            </button>
          </div>
          <h1 className="text-center text-3xl sm:text-4xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mr-16 sm:mr-24" style={{ fontFamily: 'Nunito' }}>
            Letter Games
          </h1>
        </div>

        {/* Top Middle: Pick letters to master */}
        <div className="w-full flex justify-center -mt-1 mb-5 relative z-40">
          <LetterMasterySelector />
        </div>

        {/* BuddyBear in Top-Right with Speech Bubble */}
        <div className="absolute top-4 right-4 z-[60]">
          <BuddyBear 
            mood="happy" 
            size={80} 
            speech={
              hasMastery
                ? `Mastering ${masteredLetters.join(', ')}! Tap any game to practice! 🎲`
                : "Pick a game to play, or pick letters to master!"
            } 
          />
        </div>

        {/* Fluid Landscape Distribution */}
        <div className="w-full max-w-[1600px] px-8 flex flex-col gap-6">
          {/* Row 1: Left and Right Trees */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="w-full lg:w-auto">
              {renderGroup('1. Recognition', recognition)}
            </div>
            <div className="w-full lg:w-auto lg:text-left flex lg:justify-end">
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
