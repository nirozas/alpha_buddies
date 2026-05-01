import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

export function ColorByCode() {
  const { letter } = useParams<{ letter: string }>(); // e.g. "A,B,C"
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playDing, playBoing, playPop } = useAudio();

  const selectedLettersList = letter?.split(',') || ['A'];
  const lds = LETTERS_DATA.filter(l => selectedLettersList.includes(l.letter));
  const mainLd = lds[0] || LETTERS_DATA[0];

  const [mode, setMode] = useState<'capital' | 'small' | 'both'>('capital');
  const [selectedColor, setSelectedColor] = useState<string>(lds[0]?.color || '#000');
  const [filledMap, setFilledMap] = useState<Record<number, string>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [mistakes, setMistakes] = useState(0);

  // Generate a deformed grid for the stained-glass effect
  const COLS = 4;
  const ROWS = 5;
  const WIDTH = 320;
  const HEIGHT = 400;

  const polygons = useMemo(() => {
    // Generate jittered vertices
    const points: [number, number][] = [];
    const cellW = WIDTH / COLS;
    const cellH = HEIGHT / ROWS;

    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        let x = c * cellW;
        let y = r * cellH;
        // Jitter internal points
        if (c > 0 && c < COLS && r > 0 && r < ROWS) {
          x += (Math.random() - 0.5) * (cellW * 0.8);
          y += (Math.random() - 0.5) * (cellH * 0.8);
        }
        points.push([x, y]);
      }
    }

    // Assign letters to cells
    const cells = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p1 = points[r * (COLS + 1) + c];
        const p2 = points[r * (COLS + 1) + c + 1];
        const p3 = points[(r + 1) * (COLS + 1) + c + 1];
        const p4 = points[(r + 1) * (COLS + 1) + c];
        
        const centerX = (p1[0] + p2[0] + p3[0] + p4[0]) / 4;
        const centerY = (p1[1] + p2[1] + p3[1] + p4[1]) / 4;

        // Pick a random letter from the selected list
        const targetLd = lds[Math.floor(Math.random() * lds.length)];
        
        let char = targetLd.uppercase;
        if (mode === 'small') char = targetLd.lowercase;
        if (mode === 'both') char = Math.random() > 0.5 ? targetLd.uppercase : targetLd.lowercase;

        cells.push({
          id: r * COLS + c,
          points: `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]}`,
          centerX,
          centerY,
          targetLd,
          char
        });
      }
    }
    return cells;
  }, [lds, mode]);

  const handlePolygonClick = (cellId: number, targetColor: string) => {
    if (filledMap[cellId]) return;

    if (selectedColor === targetColor) {
      playDing();
      const newMap = { ...filledMap, [cellId]: selectedColor };
      setFilledMap(newMap);
      
      if (Object.keys(newMap).length === polygons.length) {
        awardStars(`color-by-code-${letter}`, mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        incrementActivity(`color-by-code-${letter}`);
        setTimeout(() => setShowCelebration(true), 600);
      }
    } else {
      playBoing();
      setMistakes(m => m + 1);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 bg-gray-50">
      <div className="w-full flex items-center justify-between p-4 bg-white/80 backdrop-blur sticky top-0 z-10 shadow-sm">
        <BackButton onClick={() => navigate(-1)} color={mainLd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: '#44403C' }}>Color by Code</h2>
        <div style={{ width: 56 }} />
      </div>

      <BuddyBear mood="happy" size={80} speech="Match the paint color to the letter! 🎨" />

      <div className="flex gap-2 mt-4 bg-white p-1 rounded-full border-2 border-gray-200">
        {(['capital', 'small', 'both'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setFilledMap({}); setMistakes(0); playPop(); }}
            className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize transition-colors`}
            style={{
              background: mode === m ? mainLd.color : 'transparent',
              color: mode === m ? 'white' : '#78716C',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Palette */}
      <div className="flex gap-3 mt-6 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-100 flex-wrap justify-center max-w-md">
        {lds.map(l => (
          <motion.button
            key={l.letter}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setSelectedColor(l.color); playPop(); }}
            className="flex flex-col items-center gap-1"
          >
            <div 
              className="w-12 h-12 rounded-full border-4 shadow-sm relative flex items-center justify-center"
              style={{ backgroundColor: l.color, borderColor: selectedColor === l.color ? '#1C1917' : 'white' }}
            >
              {selectedColor === l.color && <span className="text-white font-bold">✓</span>}
            </div>
            <span className="font-bold font-sans text-lg" style={{ color: l.color }}>
              {mode === 'small' ? l.lowercase : mode === 'both' ? `${l.uppercase}${l.lowercase}` : l.uppercase}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Canvas */}
      <div className="mt-8 p-4 bg-white rounded-3xl shadow-xl border-4" style={{ borderColor: selectedColor }}>
        <svg width={WIDTH} height={HEIGHT} className="rounded-xl overflow-hidden touch-none" style={{ backgroundColor: '#F3F4F6' }}>
          {polygons.map(cell => {
            const isFilled = !!filledMap[cell.id];
            return (
              <g key={cell.id} onClick={() => handlePolygonClick(cell.id, cell.targetLd.color)} style={{ cursor: 'pointer' }}>
                <motion.polygon
                  points={cell.points}
                  fill={isFilled ? filledMap[cell.id] : '#FFFFFF'}
                  stroke="#1C1917"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  whileHover={{ fill: isFilled ? filledMap[cell.id] : '#F3F4F6' }}
                  whileTap={{ scale: 0.98 }}
                />
                {!isFilled && (
                  <text
                    x={cell.centerX}
                    y={cell.centerY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="24"
                    fontWeight="900"
                    fontFamily="Nunito"
                    fill="#1C1917"
                    pointerEvents="none"
                  >
                    {cell.char}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1} message="Beautiful Painting! 🎨"
        onContinue={() => navigate(-1)} />
    </div>
  );
}
