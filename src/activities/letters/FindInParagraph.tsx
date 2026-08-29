import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { LETTER_STORIES } from '../../constants/letterStories';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

type Mode = 'capital' | 'small' | 'both';

export function FindInParagraph() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playDing, playBoing, playPop } = useAudio();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [mode, setMode] = useState<Mode | null>(null);
  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const storyPack = LETTER_STORIES[ld.letter];
  const story = useMemo(() => {
    if (!mode || !storyPack) return "";
    return storyPack[mode];
  }, [mode, storyPack]);

  // Read story when it becomes available
  useEffect(() => {
    if (story && mode && !showCelebration) {
      // Small delay to let the screen transition
      const timer = setTimeout(() => speak(story), 500);
      return () => clearTimeout(timer);
    }
  }, [story, mode, showCelebration]);

  // Parse story into words, then chars
  const parsedWords = useMemo(() => {
    if (!story) return { words: [], totalTargets: 0 };
    
    let charIndexCounter = 0;
    let totalTargets = 0;
    
    // Split by space but keep punctuation attached
    const words = story.split(' ').map(wordStr => {
      const chars = wordStr.split('').map(char => {
        let isTarget = false;
        if (mode === 'capital') isTarget = char === ld.uppercase;
        else if (mode === 'small') isTarget = char === ld.lowercase;
        else isTarget = char.toLowerCase() === ld.lowercase;
        
        if (isTarget) totalTargets++;
        return { char, index: charIndexCounter++, isTarget };
      });
      return { wordStr, chars };
    });
    
    return { words, totalTargets };
  }, [story, ld.letter, mode]);

  const handleCharClick = (charObj: { char: string; index: number; isTarget: boolean }, fullWord: string) => {
    if (!charObj.char.match(/[a-zA-Z]/)) return;
    if (foundIndices.includes(charObj.index)) return;

    if (charObj.isTarget) {
      playDing();
      // Say letter name AND read the word
      speak(`${charObj.char}... ${fullWord.replace(/[.,!?;:]/g, '')}`);
      
      const newFound = [...foundIndices, charObj.index];
      setFoundIndices(newFound);
      
      if (newFound.length === parsedWords.totalTargets) {
        awardStars(`${ld.letter}-find-in-paragraph-${mode}`, mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        incrementActivity(`${ld.letter}-find-in-paragraph-${mode}`);
        setTimeout(() => setShowCelebration(true), 1500); // Wait for speech to finish
      }
    } else {
      playBoing();
      speak(charObj.char);
      setMistakes(m => m + 1);
      setShakeIndex(charObj.index);
      setTimeout(() => setShakeIndex(null), 500);
    }
  };

  if (!mode) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-8 relative z-10">
        <div className="absolute top-4 left-4">
          <BackButton onClick={() => navigate(-1)} color={ld.color} />
        </div>
        
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-white drop-shadow-lg" style={{ fontFamily: 'Nunito' }}>
            Find in Story
          </h1>
          <p className="text-white/80 text-xl font-bold">Choose your story mode for letter {ld.letter}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {[
            { id: 'capital', label: 'CAPITAL', desc: 'ABC...', icon: '🅰️' },
            { id: 'small', label: 'small', desc: 'abc...', icon: 'ⓐ' },
            { id: 'both', label: 'Both', desc: 'Aa Bb...', icon: '🔤' }
          ].map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode(m.id as Mode); playPop(); }}
              className="bg-white/95 backdrop-blur p-8 rounded-[2.5rem] shadow-2xl border-4 border-transparent hover:border-white transition-all text-center group"
            >
              <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{m.icon}</div>
              <div className="text-3xl font-black mb-2" style={{ fontFamily: 'Nunito', color: ld.color }}>{m.label}</div>
              <div className="text-gray-500 font-bold">{m.desc}</div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 bg-transparent relative z-10">
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Find the Letter</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear 
        mood="thinking" 
        size={90} 
        onClick={() => speak(story)}
        speech={
          mode === 'capital' ? `Read the story and tap every CAPITAL "${ld.uppercase}" you see! 🕵️‍♀️` :
          mode === 'small' ? `Read the story and tap every small "${ld.lowercase}" you see! 🕵️‍♀️` :
          `Read the story and tap every "${ld.uppercase}" or "${ld.lowercase}" you see! 🕵️‍♀️`
        } 
      />

      <div className="mt-6 px-6 w-full max-w-3xl">
        <div className="bg-white p-6 md:p-12 rounded-[3rem] shadow-2xl" style={{ border: `4px solid ${ld.color}` }}>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 text-2xl md:text-4xl font-medium text-center" style={{ fontFamily: 'Nunito', color: '#44403C' }}>
            {parsedWords.words.map((word, wIdx) => (
              <span key={`word-${wIdx}`} className="inline-block whitespace-nowrap">
                {word.chars.map((charObj) => {
                  const isFound = foundIndices.includes(charObj.index);
                  const isLetter = charObj.char.match(/[a-zA-Z]/);

                  if (!isLetter) {
                    return <span key={charObj.index} className="opacity-60">{charObj.char}</span>;
                  }

                  return (
                    <motion.span
                      key={charObj.index}
                      animate={shakeIndex === charObj.index ? { x: [-3, 3, -2, 2, 0] } : {}}
                      transition={{ duration: 0.3 }}
                      onClick={() => handleCharClick(charObj, word.wordStr)}
                      className="cursor-pointer inline-block"
                      style={{
                        color: isFound ? '#EF4444' : 'inherit',
                        fontWeight: isFound ? 900 : 'inherit',
                        textDecoration: isFound ? 'underline' : 'none',
                        padding: '0 1px'
                      }}
                      whileHover={!isFound ? { scale: 1.2, color: ld.color } : {}}
                      whileTap={!isFound ? { scale: 0.8 } : {}}
                    >
                      {charObj.char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center bg-white/30 backdrop-blur-sm rounded-full py-2 px-6 inline-block mx-auto flex items-center justify-center gap-4">
          <p className="text-2xl font-black" style={{ fontFamily: 'Nunito', color: ld.color }}>
            Found: {foundIndices.length} / {parsedWords.totalTargets}
          </p>
          <button onClick={() => speak(story)} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Read Again">
            🔊
          </button>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1} message="You found them all! 🕵️‍♂️"
        onContinue={() => navigate(-1)}
      >
        <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} />
      </CelebrationScreen>
    </div>
  );
}
