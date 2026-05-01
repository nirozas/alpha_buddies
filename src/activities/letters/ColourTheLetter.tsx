import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

const COLORS = ['#EF4444', '#F97316', '#F59E0B', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];
const ZONES = [
  { id: 0, path: 'M50 10 L90 50 L10 50 Z', cx: 50, cy: 38 },
  { id: 1, path: 'M10 50 L90 50 L90 90 L10 90 Z', cx: 50, cy: 70 },
  { id: 2, path: 'M50 10 L90 10 L90 50 L50 50 Z', cx: 70, cy: 30 },
  { id: 3, path: 'M10 10 L50 10 L50 50 L10 50 Z', cx: 30, cy: 30 },
];

export function ColourTheLetter() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [zoneColors, setZoneColors] = useState<Record<number, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const handleZoneTap = (zoneId: number) => {
    const newColors = { ...zoneColors, [zoneId]: selectedColor };
    setZoneColors(newColors);
    if (Object.keys(newColors).length === ZONES.length && !showCelebration) {
      awardStars(`${ld.letter}-colour-the-letter`, 3);
      incrementActivity(`${ld.letter}-colour-the-letter`);
      setTimeout(() => setShowCelebration(true), 400);
    }
  };

  const filled = Object.keys(zoneColors).length;

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Colour the Letter</h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color }}>{filled}/{ZONES.length}</span>
      </div>

      <BuddyBear mood="happy" size={90}
        speech={`Pick a colour, then tap the letter to fill it in! 🎨`}
      />

      {/* Colour palette */}
      <div className="flex gap-3 my-4 flex-wrap justify-center px-4">
        {COLORS.map(color => (
          <motion.button
            key={color}
            whileTap={{ scale: 0.85 }}
            onClick={() => setSelectedColor(color)}
            className="rounded-full shadow-md"
            style={{
              width: 44, height: 44,
              background: color,
              border: selectedColor === color ? '4px solid #1C1917' : '4px solid transparent',
              transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.15s',
            }}
          />
        ))}
      </div>

      {/* Letter with tappable zones */}
      <motion.div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ width: 240, height: 240, background: 'white', border: `4px solid ${ld.color}` }}
        animate={filled === ZONES.length ? { rotate: [0, -5, 5, -3, 3, 0], scale: [1, 1.05, 1] } : {}}
      >
        {/* Background letter shape */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{
            fontFamily: 'Nunito', fontWeight: 900, fontSize: '11rem', color: ld.color + '15',
            lineHeight: 1, userSelect: 'none',
          }}>{ld.uppercase}</span>
        </div>
        {/* Tappable color zones */}
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {ZONES.map(zone => (
            <motion.path
              key={zone.id}
              d={zone.path}
              fill={zoneColors[zone.id] || 'transparent'}
              stroke={ld.color + '60'}
              strokeWidth="0.5"
              onClick={() => handleZoneTap(zone.id)}
              style={{ cursor: 'pointer' }}
              whileTap={{ opacity: 0.7 }}
              animate={zoneColors[zone.id] ? { opacity: [0.5, 1] } : {}}
            />
          ))}
        </svg>
        {/* Big letter overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '9rem', color: ld.color, lineHeight: 1, opacity: 0.15 }}>
            {ld.uppercase}
          </span>
        </div>
      </motion.div>

      {/* Paint zone buttons (large tap targets) */}
      <div className="grid grid-cols-2 gap-3 mt-5 px-6 w-full max-w-xs">
        {ZONES.map(zone => (
          <motion.button
            key={zone.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleZoneTap(zone.id)}
            className="rounded-2xl py-4 flex items-center justify-center shadow-md font-bold"
            style={{
              background: zoneColors[zone.id] || 'white',
              border: `3px solid ${zoneColors[zone.id] || ld.color}`,
              fontFamily: 'Nunito',
              fontSize: '1.1rem',
              color: zoneColors[zone.id] ? 'white' : ld.color,
              minHeight: 64,
            }}
          >
            {zoneColors[zone.id] ? '✅ Filled!' : `Zone ${zone.id + 1} 🎨`}
          </motion.button>
        ))}
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-3">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message="Beautiful colours! 🎨🌈"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
