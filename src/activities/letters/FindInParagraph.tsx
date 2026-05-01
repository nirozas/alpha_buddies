import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { LETTER_STORIES } from '../../constants/letterStories';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

export function FindInParagraph() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playDing, playBoing } = useAudio();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const story = LETTER_STORIES[ld.letter] || `A story about ${ld.letter}.`;

  const [foundIndices, setFoundIndices] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  // Parse the story into an array of letters (including spaces and punctuation)
  const parsedStory = useMemo(() => {
    let targetCount = 0;
    const chars = story.split('').map((char, index) => {
      const isTarget = char.toLowerCase() === ld.lowercase;
      if (isTarget) targetCount++;
      return { char, index, isTarget };
    });
    return { chars, targetCount };
  }, [story, ld.lowercase]);

  const handleCharClick = (charObj: { char: string; index: number; isTarget: boolean }) => {
    // Ignore clicks on spaces/punctuation
    if (!charObj.char.match(/[a-zA-Z]/)) return;
    if (foundIndices.includes(charObj.index)) return;

    if (charObj.isTarget) {
      playDing();
      speak(charObj.char);
      const newFound = [...foundIndices, charObj.index];
      setFoundIndices(newFound);
      
      if (newFound.length === parsedStory.targetCount) {
        awardStars(`${ld.letter}-find-in-paragraph`, mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        incrementActivity(`${ld.letter}-find-in-paragraph`);
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      playBoing();
      speak(charObj.char);
      setMistakes(m => m + 1);
      setShakeIndex(charObj.index);
      setTimeout(() => setShakeIndex(null), 500);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Find the Letter</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="thinking" size={90} speech={`Read the story and tap every "${ld.uppercase}" or "${ld.lowercase}" you see! 🕵️‍♀️`} />

      <div className="mt-6 px-6 w-full max-w-2xl">
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-xl" style={{ border: `4px solid ${ld.color}` }}>
          <p className="text-2xl md:text-4xl leading-relaxed md:leading-loose text-center font-medium" style={{ fontFamily: 'Nunito', color: '#44403C' }}>
            {parsedStory.chars.map((charObj) => {
              const isFound = foundIndices.includes(charObj.index);
              const isSpaceOrPunctuation = !charObj.char.match(/[a-zA-Z]/);

              if (isSpaceOrPunctuation) {
                return <span key={charObj.index}>{charObj.char}</span>;
              }

              return (
                <motion.span
                  key={charObj.index}
                  animate={shakeIndex === charObj.index ? { x: [-3, 3, -2, 2, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCharClick(charObj)}
                  className="cursor-pointer inline-block"
                  style={{
                    color: isFound ? '#EF4444' : 'inherit', // Red when found
                    fontWeight: isFound ? 900 : 'inherit',  // Bold when found
                    textDecoration: isFound ? 'underline' : 'none'
                  }}
                  whileHover={!isFound ? { scale: 1.1, color: ld.color } : {}}
                  whileTap={!isFound ? { scale: 0.9 } : {}}
                >
                  {charObj.char}
                </motion.span>
              );
            })}
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-bold" style={{ fontFamily: 'Nunito', color: ld.color }}>
            Found: {foundIndices.length} / {parsedStory.targetCount}
          </p>
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
