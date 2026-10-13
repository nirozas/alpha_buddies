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
      if (found) {
        setLd(found);
        setTappedItems([]);
        setShowCelebration(false);
      }
    }
  }, [letterParam]);

  const checkCelebration = (newList: string[]) => {
    // Letter + 6 words = 7 items
    if (newList.length >= 7 && !showCelebration) {
      const key = `${ld.letter}-learn-my-letters`;
      awardStars(key, 3);
      incrementActivity(key);
      markLetterComplete(ld.letter);
      setTimeout(() => setShowCelebration(true), 1000);
    }
  };

  const handleContinue = () => {
    const currentIndex = LETTERS_DATA.findIndex(l => l.letter === ld.letter);
    if (currentIndex >= 0 && currentIndex < LETTERS_DATA.length - 1) {
      const nextLetter = LETTERS_DATA[currentIndex + 1].letter;
      setShowCelebration(false);
      setTappedItems([]);
      navigate(`/letters/activity/learn-my-letters/${nextLetter}`);
    } else {
      navigate('/letters');
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
    <div className="h-dvh max-h-dvh flex flex-col justify-between items-center overflow-hidden p-2 sm:p-3 bg-transparent relative z-10 select-none font-nunito">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between px-2 sm:px-4 py-1 max-w-5xl shrink-0">
        <div className="flex items-center gap-3">
          <BackButton color={ld.color} />
        </div>
        
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={tappedItems.length} max={7} color={ld.color} />
          <p className="text-[10px] font-black uppercase text-center mt-0.5 opacity-60">Activity Progress</p>
        </div>

        <AudioButton onClick={() => speak(`Today's letter is ${ld.letter}`)} color={ld.color} />
      </div>

      {/* Buddy Bear */}
      <div className="shrink-0 my-0.5 sm:my-1">
        <BuddyBear mood={tappedItems.length >= 7 ? 'celebrating' : 'excited'} size={68}
          speech={tappedItems.length >= 7 ? "You're a superstar! 🌟" : `Meet the letter ${ld.uppercase}! Tap the letter and all 6 words to finish!`}
        />
      </div>

      {/* Giant letter display */}
      <motion.button
        type="button"
        onClick={handleLetterTap}
        animate={letterBounce ? { scale: [1, 1.15, 0.95, 1.05, 1], rotate: [0, -4, 4, -2, 0] } : { y: [0, -4, 0] }}
        transition={letterBounce ? { duration: 0.5 } : { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        className="flex flex-col items-center my-0.5 sm:my-1 shrink-0 cursor-pointer"
        style={{ background: 'none', border: 'none' }}
      >
        <div
          className="rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg sm:shadow-xl border-4 sm:border-6 border-white relative overflow-hidden transition-all"
          style={{ 
            height: 'clamp(64px, 12vh, 120px)',
            aspectRatio: '1.4 / 1',
            background: `linear-gradient(135deg, ${ld.color}, ${ld.color}dd)` 
          }}
        >
          {/* Decorative shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 skew-y-[-10deg] -translate-y-1/2" />
          
          <span 
            className="font-black text-white leading-none tracking-tight"
            style={{ 
              fontFamily: 'Nunito', 
              fontSize: 'clamp(2.8rem, 7vh, 5.5rem)', 
              filter: 'drop-shadow(0 3px 0 rgba(0,0,0,0.12))'
            }}
          >
            {ld.uppercase}{ld.lowercase}
          </span>
        </div>
        <span 
          className="font-bold text-xs sm:text-sm mt-1"
          style={{ fontFamily: 'Nunito', color: ld.color }}
        >
          Progress: {Math.round((tappedItems.length / 7) * 100)}% 🔊
        </span>
      </motion.button>

      {/* 6 Words Grid: Fits comfortably in screen view without scrolling */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5 md:gap-4 px-2 sm:px-4 w-full max-w-3xl flex-1 min-h-0 py-1">
        {ld.objects.slice(0, 6).map((obj, i) => {
          const isTapped = tappedItems.includes(obj.word);
          return (
            <motion.button
              key={i}
              type="button"
              initial={{ opacity: 0, y: 15, rotate: i % 2 === 0 ? -1 : 1 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ delay: i * 0.04, type: 'spring', stiffness: 350 }}
              onClick={() => handleWordTap(obj.word)}
              className={`relative overflow-hidden group rounded-2xl sm:rounded-3xl p-2 sm:p-3 shadow-md sm:shadow-lg flex flex-col items-center justify-between border-3 sm:border-4 transition-all bg-white/85 backdrop-blur-sm hover:shadow-xl cursor-pointer h-full min-h-0 ${
                isTapped ? 'border-green-400 bg-green-50/70' : 'border-white'
              }`}
            >
              {isTapped && <div className="absolute top-1 right-1 sm:top-2 sm:right-2 text-sm sm:text-base">✅</div>}
              
              {/* Animated background blob */}
              <div 
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
                style={{ background: ld.color }}
              />
              
              <div className="flex-1 min-h-0 flex items-center justify-center w-full py-0.5">
                <motion.img 
                  src={obj.image}
                  alt={obj.word}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 2 + i, ease: 'easeInOut' }}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  style={{ 
                    height: 'clamp(36px, 7.5vh, 72px)',
                    width: 'auto',
                    aspectRatio: '1 / 1'
                  }}
                />
              </div>
              
              <div className="bg-white/95 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-inner border border-gray-100 w-full shrink-0">
                <p 
                  className="font-extrabold text-slate-800 text-center truncate"
                  style={{ 
                    fontFamily: 'Nunito', 
                    fontSize: 'clamp(0.85rem, 1.8vh, 1.25rem)'
                  }}
                >
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
        onContinue={handleContinue}
      />
    </div>
  );
}
