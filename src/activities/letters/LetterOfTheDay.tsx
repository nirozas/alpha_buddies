import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';
import { BackButton, CelebrationScreen, AudioButton, ProgressBar } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

export function LetterOfTheDay() {
  const { letter: letterParam } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity, markLetterComplete } = useStore();
  const { speak, playPop } = useAudio();
  
  // Pick a random letter if not provided
  const [ld, setLd] = useState(() => {
    if (letterParam) {
      return LETTERS_DATA.find(l => l.letter === letterParam.toUpperCase()) || LETTERS_DATA[0];
    }
    return LETTERS_DATA[Math.floor(Math.random() * LETTERS_DATA.length)];
  });

  const [tappedItems, setTappedItems] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [letterBounce, setLetterBounce] = useState(false);

  useEffect(() => {
    if (letterParam) {
      const found = LETTERS_DATA.find(l => l.letter === letterParam.toUpperCase());
      if (found) setLd(found);
    }
  }, [letterParam]);

  const checkCelebration = (newList: string[]) => {
    // Letter + 6 words = 7 items
    if (newList.length >= 7 && !showCelebration) {
      const key = `${ld.letter}-letter-of-the-day`;
      awardStars(key, 3);
      incrementActivity(key);
      markLetterComplete(ld.letter);
      setTimeout(() => setShowCelebration(true), 1000);
    }
  };

  const handleLetterTap = () => {
    setLetterBounce(true);
    setTimeout(() => setLetterBounce(false), 600);
    speak(`Letter ${ld.letter}. It makes the sound ${ld.phoneme}`);
    playPop();

    if (!tappedItems.includes('letter')) {
      const newList = [...tappedItems, 'letter'];
      setTappedItems(newList);
      checkCelebration(newList);
    }
  };

  const handleWordTap = (word: string) => {
    speak(word);
    playPop();

    if (!tappedItems.includes(word)) {
      const newList = [...tappedItems, word];
      setTappedItems(newList);
      checkCelebration(newList);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 bg-transparent relative z-10">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between p-4 max-w-5xl">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate(-1)} color={ld.color} />
        </div>
        
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={tappedItems.length} max={7} color={ld.color} />
          <p className="text-[10px] font-black uppercase text-center mt-1 opacity-60">Activity Progress</p>
        </div>

        <AudioButton onClick={() => speak(`Today's letter is ${ld.letter}`)} color={ld.color} />
      </div>

      {/* Buddy */}
      <BuddyBear mood={tappedItems.length >= 7 ? 'celebrating' : 'excited'} size={90}
        speech={tappedItems.length >= 7 ? "You're a superstar! 🌟" : `Meet the letter ${ld.uppercase}! Tap the letter and all 6 words to finish!`}
      />

      {/* Giant letter display */}
      <motion.button
        onClick={handleLetterTap}
        animate={letterBounce ? { scale: [1, 1.2, 0.9, 1.1, 1], rotate: [0, -5, 5, -3, 0] } : { y: [0, -10, 0] }}
        transition={letterBounce ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex flex-col items-center mt-4 mb-8"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <div
          className="rounded-[3rem] flex items-center justify-center shadow-2xl border-8 border-white relative overflow-hidden"
          style={{ 
            width: 260, 
            height: 180, 
            background: `linear-gradient(135deg, ${ld.color}, ${ld.color}dd)` 
          }}
        >
          {/* Decorative shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 skew-y-[-10deg] -translate-y-1/2" />
          
          <span style={{ 
            fontFamily: 'Nunito', 
            fontWeight: 900, 
            fontSize: '8rem', 
            color: 'white', 
            lineHeight: 1, 
            letterSpacing: '-0.05em',
            filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))'
          }}>
            {ld.uppercase}{ld.lowercase}
          </span>
        </div>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: '1.1rem', color: ld.color, marginTop: 12 }}>
          Progress: {Math.round((tappedItems.length / 7) * 100)}% 🔊
        </span>
      </motion.button>

      {/* 6 Words Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 px-4 w-full max-w-3xl">
        {ld.objects.slice(0, 6).map((obj, i) => {
          const isTapped = tappedItems.includes(obj.word);
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -2 : 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300 }}
              onClick={() => handleWordTap(obj.word)}
              className={`relative overflow-hidden group rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center gap-4 border-4 transition-all bg-white/80 backdrop-blur-sm hover:shadow-2xl ${
                isTapped ? 'border-green-400' : 'border-white'
              }`}
              style={{ minHeight: '180px' }}
            >
              {isTapped && <div className="absolute top-2 right-2 text-xl">✅</div>}
              {/* Animated background blob */}
              <div 
                className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: ld.color }}
              />
              
              <motion.img 
                src={obj.image}
                alt={obj.word}
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 2 + i, ease: 'easeInOut' }}
                style={{ width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              />
              
              <div className="bg-white/90 px-4 py-1 rounded-full shadow-inner border border-gray-100 w-full">
                <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.4rem', color: '#333', textAlign: 'center' }}>
                  <span style={{ color: ld.color, fontWeight: 900, textDecoration: 'underline' }}>{obj.word[0]}</span>
                  {obj.word.slice(1)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <CelebrationScreen
        active={showCelebration}
        stars={3}
        message={`Amazing! You've learned the letter ${ld.letter}! 🎉`}
        onContinue={() => navigate(-1)}
      />
    </div>
  );
}
