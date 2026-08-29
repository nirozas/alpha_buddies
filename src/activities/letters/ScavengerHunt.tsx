import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';

interface HiddenItem {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
}

interface ScavengerLevel {
  background: string;
  items: HiddenItem[];
}

const LEVELS: Record<string, ScavengerLevel[]> = {
  'A': [
    { background: '/scavenger/playroom.png', items: [{ id: 'a1', name: 'Airplane', emoji: '✈️', x: 75, y: 25 }, { id: 'a2', name: 'Apple', emoji: '🍎', x: 20, y: 70 }, { id: 'a3', name: 'Astronaut', emoji: '👩‍🚀', x: 50, y: 45 }] },
    { background: '/scavenger/garden.png', items: [{ id: 'a4', name: 'Ant', emoji: '🐜', x: 35, y: 85 }, { id: 'a5', name: 'Axe', emoji: '🪓', x: 10, y: 65 }, { id: 'a6', name: 'Acorn', emoji: '🌰', x: 65, y: 80 }] },
    { background: '/scavenger/beach.png', items: [{ id: 'a7', name: 'Anchor', emoji: '⚓', x: 20, y: 85 }, { id: 'a8', name: 'Angelfish', emoji: '🐠', x: 55, y: 40 }, { id: 'a9', name: 'Alligator', emoji: '🐊', x: 85, y: 70 }] }
  ],
  'B': [
    { background: '/scavenger/playroom.png', items: [{ id: 'b1', name: 'Ball', emoji: '⚽', x: 80, y: 80 }, { id: 'b2', name: 'Bear', emoji: '🧸', x: 30, y: 60 }, { id: 'b3', name: 'Boat', emoji: '⛵', x: 15, y: 35 }] },
    { background: '/scavenger/garden.png', items: [{ id: 'b4', name: 'Bee', emoji: '🐝', x: 45, y: 30 }, { id: 'b5', name: 'Butterfly', emoji: '🦋', x: 70, y: 20 }, { id: 'b6', name: 'Bird', emoji: '🐦', x: 25, y: 15 }] },
    { background: '/scavenger/beach.png', items: [{ id: 'b7', name: 'Banana', emoji: '🍌', x: 40, y: 75 }, { id: 'b8', name: 'Bucket', emoji: '🪣', x: 60, y: 85 }, { id: 'b9', name: 'Ball', emoji: '🏐', x: 10, y: 65 }] }
  ],
  'C': [
    { background: '/scavenger/playroom.png', items: [{ id: 'c1', name: 'Car', emoji: '🚗', x: 65, y: 85 }, { id: 'c2', name: 'Cup', emoji: '🥤', x: 40, y: 70 }, { id: 'c3', name: 'Cat', emoji: '🐱', x: 90, y: 45 }] },
    { background: '/scavenger/garden.png', items: [{ id: 'c4', name: 'Caterpillar', emoji: '🐛', x: 20, y: 80 }, { id: 'c5', name: 'Cherry', emoji: '🍒', x: 80, y: 30 }, { id: 'c6', name: 'Carrot', emoji: '🥕', x: 50, y: 90 }] },
    { background: '/scavenger/beach.png', items: [{ id: 'c7', name: 'Crab', emoji: '🦀', x: 75, y: 85 }, { id: 'c8', name: 'Coconut', emoji: '🥥', x: 25, y: 15 }, { id: 'c9', name: 'Castle', emoji: '🏰', x: 50, y: 65 }] }
  ]
};

const DEFAULT_LEVELS = (l: string): ScavengerLevel[] => [
  { background: '/scavenger/playroom.png', items: [{ id: 'd1', name: l, emoji: '✨', x: 30, y: 30 }, { id: 'd2', name: l, emoji: '✨', x: 70, y: 50 }, { id: 'd3', name: l, emoji: '✨', x: 50, y: 80 }] },
  { background: '/scavenger/garden.png', items: [{ id: 'd4', name: l, emoji: '✨', x: 20, y: 60 }, { id: 'd5', name: l, emoji: '✨', x: 80, y: 20 }, { id: 'd6', name: l, emoji: '✨', x: 60, y: 70 }] },
  { background: '/scavenger/beach.png', items: [{ id: 'd7', name: l, emoji: '✨', x: 15, y: 85 }, { id: 'd8', name: l, emoji: '✨', x: 45, y: 35 }, { id: 'd9', name: l, emoji: '✨', x: 80, y: 60 }] }
];

export function ScavengerHunt() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playFanfare, speak } = useAudio();

  const [currentLevel, setCurrentLevel] = useState(0);
  const [foundItems, setFoundItems] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const letterLevels = LEVELS[letter || 'A'] || DEFAULT_LEVELS(letter || 'A');
  const activeLevel = letterLevels[currentLevel];

  useEffect(() => {
    if (letter) speak(`Can you find three things starting with ${letter}?`);
  }, [letter, currentLevel]);

  const handleItemClick = (item: HiddenItem) => {
    if (foundItems.includes(item.id)) return;
    
    playPop();
    speak(item.name);
    setFoundItems(prev => [...prev, item.id]);

    if (foundItems.length + 1 === activeLevel.items.length) {
      playDing();
      setTimeout(() => {
        if (currentLevel < letterLevels.length - 1) {
          setCurrentLevel(prev => prev + 1);
          setFoundItems([]);
        } else {
          playFanfare();
          awardStars(`scavenger-${letter}`, 3);
          incrementActivity(`scavenger-${letter}`);
          setShowCelebration(true);
        }
      }, 1500);
    }
  };

  if (!activeLevel) return null;

  return (
    <div className="min-h-dvh flex flex-col items-center bg-sky-50 font-nunito relative overflow-hidden">
      <div className="w-full flex items-center p-4 z-10">
        <BackButton onClick={() => navigate('/letters/activity/scavenger-hunt')} color="#0EA5E9" />
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-3xl font-black text-sky-700">Digital Scavenger</h1>
          <div className="flex gap-2 mt-1">
            {letterLevels.map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full border-2 border-sky-400 ${i <= currentLevel ? 'bg-sky-500' : 'bg-white'}`} 
              />
            ))}
          </div>
        </div>
        <div className="w-14" />
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center p-4">
        {/* The Scene */}
        <div className="relative w-full aspect-video bg-white rounded-[3rem] shadow-2xl border-8 border-sky-200 overflow-hidden group">
          <img 
            src={activeLevel.background} 
            className="w-full h-full object-cover select-none pointer-events-none" 
            alt="Scavenger Scene" 
          />
          
          {/* Hidden Items */}
          {activeLevel.items.map((item) => (
            <motion.button
              key={item.id}
              initial={false}
              animate={foundItems.includes(item.id) ? { scale: 1.2, opacity: 1 } : { scale: 1, opacity: 0.1 }}
              whileHover={!foundItems.includes(item.id) ? { opacity: 0.3, scale: 1.1 } : {}}
              onClick={() => handleItemClick(item)}
              className="absolute flex items-center justify-center"
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`, 
                width: '12%', 
                height: '12%', 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <span className="text-4xl md:text-6xl filter drop-shadow-lg">{item.emoji}</span>
              {foundItems.includes(item.id) && (
                <motion.div 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 shadow-lg border-2 border-white"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Targets Checklist */}
        <div className="mt-8 flex gap-6">
          {activeLevel.items.map((item) => (
            <div 
              key={item.id} 
              className={`flex flex-col items-center p-3 rounded-2xl transition-all border-b-4 ${foundItems.includes(item.id) ? 'bg-emerald-100 border-emerald-300 opacity-100' : 'bg-white border-slate-200 opacity-40'}`}
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-xs font-bold text-slate-600 mt-1">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={3} message={`You found all the ${letter} things!`}
        onContinue={() => navigate('/letters/activity/scavenger-hunt')} />
    </div>
  );
}
