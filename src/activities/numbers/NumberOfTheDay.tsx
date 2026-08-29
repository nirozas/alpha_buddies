import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, AudioButton, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

const COUNTABLE_ITEMS = [
  { emoji: '🍎', name: 'Apples' },
  { emoji: '🐶', name: 'Puppies' },
  { emoji: '🚗', name: 'Cars' },
  { emoji: '⚽', name: 'Balls' },
  { emoji: '🎈', name: 'Balloons' },
  { emoji: '🍦', name: 'Ice Creams' },
  { emoji: '🧸', name: 'Bears' },
  { emoji: '🍭', name: 'Lollipops' },
  { emoji: '🐱', name: 'Kittens' },
  { emoji: '🌟', name: 'Stars' },
  { emoji: '🦋', name: 'Butterflies' },
  { emoji: '🌸', name: 'Flowers' },
];

export function NumberOfTheDay() {
  const { number: numberParam } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, markNumberComplete } = useStore();
  const { speak, playPop } = useAudio();

  const [nd, setNd] = useState(() => {
    if (numberParam) {
      return NUMBERS_DATA.find(n => n.digit === Number(numberParam)) || NUMBERS_DATA[1];
    }
    return NUMBERS_DATA[Math.floor(Math.random() * (NUMBERS_DATA.length - 1)) + 1]; // Skip 0 for "of the day" usually
  });

  const [taps, setTaps] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [numberBounce, setNumberBounce] = useState(false);
  const [selectedItems] = useState(() => {
    const shuffled = [...COUNTABLE_ITEMS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  });

  useEffect(() => {
    if (numberParam) {
      const found = NUMBERS_DATA.find(n => n.digit === Number(numberParam));
      if (found) setNd(found);
    }
  }, [numberParam]);

  const handleNumberTap = () => {
    setNumberBounce(true);
    setTimeout(() => setNumberBounce(false), 500);
    
    speak(`Number ${nd.digit}. ${nd.word}`);
    playPop();

    const newTaps = taps + 1;
    setTaps(newTaps);
    if (newTaps >= 3 && !showCelebration) {
      const key = `${nd.digit}-number-of-the-day`;
      awardStars(key, 3);
      incrementActivity(key);
      markNumberComplete(nd.digit);
      setTimeout(() => setShowCelebration(true), 1000);
    }
  };

  const handleCardTap = (itemName: string) => {
    speak(`${nd.digit} ${itemName}`);
    playPop();
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4 max-w-5xl">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} color={nd.color} />
        </div>
        
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={taps} max={3} color={nd.color} />
          <p className="text-[10px] font-black uppercase text-center mt-1 opacity-60">Activity Progress</p>
        </div>

        <AudioButton onClick={() => speak(`Today's number is ${nd.digit}`)} color={nd.color} />
      </div>

      <BuddyBear mood="excited" size={90}
        speech={`This is the number ${nd.digit}! It's spelled "${nd.word}"! Tap it or the cards! 🔢`}
      />

      {/* Giant number */}
      <motion.button
        onClick={handleNumberTap}
        animate={numberBounce ? { scale: [1, 1.3, 0.9, 1.1, 1], rotate: [0, -8, 8, -4, 0] } : { y: [0, -8, 0] }}
        transition={numberBounce ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        className="mt-4 mb-8"
      >
        <div className="rounded-[3rem] flex flex-col items-center justify-center shadow-2xl border-8 border-white relative overflow-hidden"
          style={{ 
            width: 200, 
            height: 200, 
            background: `linear-gradient(135deg, ${nd.color}, ${nd.color}dd)` 
          }}>
          {/* Decorative shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 skew-y-[-10deg] -translate-y-1/2" />
          
          <span style={{ 
            fontFamily: 'Nunito', 
            fontWeight: 900, 
            fontSize: '8rem', 
            color: 'white', 
            lineHeight: 1,
            filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))'
          }}>
            {nd.digit}
          </span>
        </div>
        <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color, marginTop: 12, fontSize: '1.2rem' }}>
          {nd.word} — Tap me! 🔊
        </p>
      </motion.button>

      {/* 6 Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 w-full max-w-4xl">
        {selectedItems.map((item, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -8 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => handleCardTap(item.name)}
            className="group relative overflow-hidden bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center min-h-[180px] border-4 border-white hover:shadow-2xl transition-all"
          >
            {/* Colorful accent at bottom */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-2 opacity-30 group-hover:h-4 transition-all"
              style={{ background: nd.color }}
            />

            <div className="flex flex-wrap justify-center items-center gap-2 mb-4 w-full max-w-[200px]">
              {Array.from({ length: nd.digit }).map((_, idx) => (
                <motion.span 
                  key={idx}
                  animate={{ 
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 2 + Math.random(), 
                    delay: idx * 0.1,
                    ease: 'easeInOut' 
                  }}
                  style={{ 
                    fontSize: nd.digit > 5 ? '40px' : '60px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                >
                  {item.emoji}
                </motion.span>
              ))}
              {nd.digit === 0 && (
                <span className="text-gray-400 font-black text-2xl italic opacity-50">Nothing!</span>
              )}
            </div>
            
            <div className="mt-auto px-4 py-1.5 rounded-2xl bg-gray-50 border border-gray-100 shadow-inner group-hover:bg-white transition-colors">
              <p className="text-lg font-black text-gray-700" style={{ fontFamily: 'Nunito' }}>
                <span style={{ color: nd.color }}>{nd.digit}</span> {item.name}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <CelebrationScreen active={showCelebration} stars={3}
        message={`Fantastic! You know the number ${nd.digit}! 🎉`}
        onContinue={() => navigate(-1)}
      />
    </div>
  );
}
