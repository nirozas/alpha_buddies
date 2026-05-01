import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

export function StampTheLetter() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playDing, playBoing } = useAudio();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [mode, setMode] = useState<'capital' | 'small' | 'both'>('both');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  
  const COLORS = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', 
    '#84CC16', '#22C55E', '#10B981', '#06B6D4', 
    '#3B82F6', '#6366F1', '#A855F7', '#EC4899'
  ];
  
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [stampedMap, setStampedMap] = useState<Record<string, string>>({});
  const [mistakes, setMistakes] = useState(0);
  const [shakeId, setShakeId] = useState<string | null>(null);

  const GRID_SIZE = 24;
  const TARGET_COUNT = 8;

  const gridLetters = useMemo(() => {
    const letters: { id: string; char: string; isTarget: boolean }[] = [];
    const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const targetChars = [];
    if (mode === 'capital' || mode === 'both') targetChars.push(ld.uppercase);
    if (mode === 'small' || mode === 'both') targetChars.push(ld.lowercase);

    for (let i = 0; i < TARGET_COUNT; i++) {
      letters.push({
        id: `target-${i}`,
        char: targetChars[i % targetChars.length],
        isTarget: true,
      });
    }

    let distractorId = 0;
    while (letters.length < GRID_SIZE) {
      const randomChar = allChars[Math.floor(Math.random() * allChars.length)];
      if (!targetChars.includes(randomChar) && randomChar.toUpperCase() !== ld.uppercase) {
        letters.push({
          id: `distractor-${distractorId++}`,
          char: randomChar,
          isTarget: false,
        });
      }
    }

    return letters.sort(() => Math.random() - 0.5);
  }, [ld.letter, mode]);

  const handleStamp = (id: string, isTarget: boolean, char: string) => {
    if (stampedMap[id]) return;

    if (isTarget) {
      playDing();
      speak(char);
      const newMap = { ...stampedMap, [id]: selectedColor };
      setStampedMap(newMap);
      if (Object.keys(newMap).length === TARGET_COUNT) {
        awardStars(`${ld.letter}-stamp-letter`, mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        incrementActivity(`${ld.letter}-stamp-letter`);
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      playBoing();
      speak(char);
      setMistakes(m => m + 1);
      setShakeId(id);
      setTimeout(() => setShakeId(null), 500);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Stamp the Letter</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="excited" size={90} speech={`Pick a color and stamp all the ${mode === 'both' ? 'big and small ' : ''}"${ld.letter}"s! 🖍️`} />

      <div className="flex gap-2 mt-4 bg-white/50 p-1 rounded-full border-2 border-white">
        {(['capital', 'small', 'both'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setStampedMap({}); setMistakes(0); }}
            className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-colors`}
            style={{
              background: mode === m ? ld.color : 'transparent',
              color: mode === m ? 'white' : '#78716C',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-6 px-4 items-center md:items-start max-w-4xl w-full justify-center">
        {/* Colors Panel */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border-4 flex flex-row md:flex-col flex-wrap justify-center gap-3 w-full md:w-24 shrink-0" style={{ borderColor: ld.color }}>
          {COLORS.map(color => (
            <motion.button
              key={color}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColor(color)}
              className="w-10 h-10 rounded-full border-4 shadow-sm relative"
              style={{ 
                backgroundColor: color, 
                borderColor: selectedColor === color ? '#44403C' : 'white',
              }}
            >
              {selectedColor === color && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-black drop-shadow-md">✓</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Board */}
        <div className="p-4 rounded-3xl bg-white shadow-xl border-4 w-full max-w-sm" style={{ borderColor: ld.color }}>
          <div className="flex justify-center items-center gap-6 pb-4 border-b-2" style={{ borderColor: ld.color + '30' }}>
            {(mode === 'capital' || mode === 'both') && <span className="text-6xl font-black text-gray-800">{ld.uppercase}</span>}
            {(mode === 'small' || mode === 'both') && <span className="text-6xl font-black text-gray-800">{ld.lowercase}</span>}
          </div>
          
          <div className="grid grid-cols-4 gap-2 pt-4">
            {gridLetters.map((item) => {
              const stampColor = stampedMap[item.id];
              return (
                <motion.button
                  key={item.id}
                  animate={shakeId === item.id ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onClick={() => handleStamp(item.id, item.isTarget, item.char)}
                  className="aspect-square w-full flex items-center justify-center border-2 border-gray-200 bg-gray-50 rounded-xl relative overflow-hidden"
                >
                  <span className="text-4xl font-bold font-sans" style={{ color: '#44403C' }}>{item.char}</span>
                  <AnimatePresence>
                    {stampColor && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.8 }}
                        className="absolute inset-1 rounded-full mix-blend-multiply"
                        style={{ background: stampColor }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1} message="All stamped! 🖍️"
        onContinue={() => navigate(-1)}
      >
        <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} />
      </CelebrationScreen>
    </div>
  );
}
