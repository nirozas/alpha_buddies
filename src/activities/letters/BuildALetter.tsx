import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';

type PieceType = 'longLine' | 'shortLine' | 'bigCurve' | 'smallCurve' | 'diagL' | 'diagR';

interface LetterRecipe {
  id: string;
  pieces: { type: PieceType; id: string; x: number; y: number; rotate: number }[];
}

const RECIPES: Record<string, LetterRecipe> = {
  'A': { id: 'A', pieces: [
    { type: 'diagR', id: 'a1', x: -30, y: -20, rotate: 20 },
    { type: 'diagL', id: 'a2', x: 30, y: -20, rotate: -20 },
    { type: 'shortLine', id: 'a3', x: 0, y: 30, rotate: 90 }
  ]},
  'B': { id: 'B', pieces: [
    { type: 'longLine', id: 'b1', x: -40, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'b2', x: 10, y: -45, rotate: 0 },
    { type: 'smallCurve', id: 'b3', x: 10, y: 45, rotate: 0 }
  ]},
  'C': { id: 'C', pieces: [
    { type: 'bigCurve', id: 'c1', x: 0, y: 0, rotate: 180 }
  ]},
  'D': { id: 'D', pieces: [
    { type: 'longLine', id: 'd1', x: -40, y: 0, rotate: 0 },
    { type: 'bigCurve', id: 'd2', x: 20, y: 0, rotate: 0 }
  ]},
  'E': { id: 'E', pieces: [
    { type: 'longLine', id: 'e1', x: -40, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'e2', x: 10, y: -80, rotate: 90 },
    { type: 'shortLine', id: 'e3', x: 10, y: 0, rotate: 90 },
    { type: 'shortLine', id: 'e4', x: 10, y: 80, rotate: 90 }
  ]},
  'F': { id: 'F', pieces: [
    { type: 'longLine', id: 'f1', x: -40, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'f2', x: 10, y: -80, rotate: 90 },
    { type: 'shortLine', id: 'f3', x: 10, y: 0, rotate: 90 }
  ]},
  'H': { id: 'H', pieces: [
    { type: 'longLine', id: 'h1', x: -40, y: 0, rotate: 0 },
    { type: 'longLine', id: 'h2', x: 40, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'h3', x: 0, y: 0, rotate: 90 }
  ]},
  'I': { id: 'I', pieces: [
    { type: 'longLine', id: 'i1', x: 0, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'i2', x: 0, y: -80, rotate: 90 },
    { type: 'shortLine', id: 'i3', x: 0, y: 80, rotate: 90 }
  ]},
  'L': { id: 'L', pieces: [
    { type: 'longLine', id: 'l1', x: -30, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'l2', x: 20, y: 80, rotate: 90 }
  ]},
  'O': { id: 'O', pieces: [
    { type: 'bigCurve', id: 'o1', x: -30, y: 0, rotate: 180 },
    { type: 'bigCurve', id: 'o2', x: 30, y: 0, rotate: 0 }
  ]},
  'P': { id: 'P', pieces: [
    { type: 'longLine', id: 'p1', x: -30, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'p2', x: 20, y: -45, rotate: 0 }
  ]},
  'T': { id: 'T', pieces: [
    { type: 'longLine', id: 't1', x: 0, y: 0, rotate: 0 },
    { type: 'shortLine', id: 't2', x: 0, y: -80, rotate: 90 }
  ]}
};

const renderPiece = (type: PieceType, color: string = "#FBBF24") => {
  switch (type) {
    case 'longLine': return <div className="w-6 h-40 rounded-full border-2 border-amber-600 shadow-sm" style={{ backgroundColor: color }} />;
    case 'shortLine': return <div className="w-6 h-20 rounded-full border-2 border-amber-600 shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagR': return <div className="w-6 h-40 rounded-full border-2 border-amber-600 shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagL': return <div className="w-6 h-40 rounded-full border-2 border-amber-600 shadow-sm" style={{ backgroundColor: color }} />;
    case 'bigCurve': return <div className="w-20 h-40 rounded-[100px_0_0_100px] border-[12px] border-r-0 border-amber-600" style={{ borderColor: color, borderRightColor: 'transparent' }} />;
    case 'smallCurve': return <div className="w-16 h-20 rounded-[0_100px_100px_0] border-[12px] border-l-0 border-amber-600" style={{ borderColor: color, borderLeftColor: 'transparent' }} />;
  }
};

export function BuildALetter() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playPop, playDing, playBoing, playFanfare, speak } = useAudio();

  const lData = LETTERS_DATA.find(l => l.letter === letter);
  const recipe = RECIPES[letter || ''];

  const [placedPieces, setPlacedPieces] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (letter) speak(letter);
  }, [letter, speak]);

  if (!lData) return null;

  if (!recipe) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-orange-50 p-8 font-nunito">
        <BackButton onClick={() => navigate('/letters/activity/build-a-letter')} color="#EA580C" />
        <BuddyBear mood="sad" speech={`Oops! I don't have wooden blocks for ${letter} yet.`} />
        <button onClick={() => navigate('/letters/activity/build-a-letter')} className="mt-8 px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-xl shadow-lg">Back to List</button>
      </div>
    );
  }

  const handlePlace = (pieceId: string) => {
    if (placedPieces.includes(pieceId)) return;
    const newPlaced = [...placedPieces, pieceId];
    setPlacedPieces(newPlaced);
    playDing();

    if (newPlaced.length === recipe.pieces.length) {
      setTimeout(() => {
        playFanfare();
        awardStars(`build-a-letter-${letter}`, 3);
        incrementActivity(`build-a-letter-${letter}`);
        setShowCelebration(true);
      }, 500);
    }
  };

  const handleDragEnd = (event: any, info: any, pieceId: string) => {
    const rect = targetRefs.current[pieceId]?.getBoundingClientRect();
    if (!rect) return;

    const { x, y } = info.point;
    // Check if drop is near the target slot
    const isInside = x >= rect.left - 20 && x <= rect.right + 20 && y >= rect.top - 20 && y <= rect.bottom + 20;

    if (isInside) {
      handlePlace(pieceId);
    } else {
      playBoing();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-orange-50 relative font-nunito pb-8">
      <div className="w-full flex items-center p-4 sticky top-0 z-10">
        <BackButton onClick={() => navigate('/letters/activity/build-a-letter')} color="#EA580C" />
        <h1 className="flex-1 text-center text-4xl font-black text-orange-600 drop-shadow-sm" style={{ marginRight: 56 }}>
          Build {letter}
        </h1>
      </div>

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center">
        {/* Canvas */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-3xl shadow-xl border-4 border-orange-200 flex items-center justify-center mb-12">
          {/* Blueprint pieces */}
          {recipe.pieces.map((p) => (
            <motion.div 
              key={`blueprint-${p.id}`}
              ref={el => { targetRefs.current[p.id] = el; }}
              className="absolute flex items-center justify-center opacity-30 grayscale"
              style={{ x: p.x, y: p.y, rotate: p.rotate }}
            >
              {renderPiece(p.type, '#94A3B8')}
            </motion.div>
          ))}

          {/* Placed pieces */}
          {recipe.pieces.map((p) => (
            <AnimatePresence key={`placed-${p.id}`}>
              {placedPieces.includes(p.id) && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute flex items-center justify-center z-10"
                  style={{ x: p.x, y: p.y, rotate: p.rotate }}
                >
                  {renderPiece(p.type, '#F59E0B')}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Piece Bank */}
        <div className="w-full max-w-2xl bg-white p-6 rounded-3xl shadow-xl border-4 border-orange-100">
          <h2 className="text-center text-xl font-bold text-orange-800 mb-6">Drag the pieces to build the letter!</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 min-h-32">
            {recipe.pieces.map((p) => {
              if (placedPieces.includes(p.id)) return null;
              
              return (
                <motion.div
                  key={`bank-${p.id}`}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(event, info) => handleDragEnd(event, info, p.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, cursor: 'grabbing' }}
                  className="relative cursor-grab transition-transform drop-shadow-lg p-2 bg-slate-50 rounded-xl border-2 border-slate-200 flex items-center justify-center w-24 h-24 z-20"
                >
                  <div style={{ transform: `scale(0.5) rotate(${p.rotate}deg)` }}>
                    {renderPiece(p.type, '#F59E0B')}
                  </div>
                </motion.div>
              );
            })}
            {recipe.pieces.every(p => placedPieces.includes(p.id)) && (
              <div className="w-full text-center text-2xl font-black text-emerald-500 animate-bounce">
                Letter {letter} Complete!
              </div>
            )}
          </div>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={3} message="Master Builder! 🧱"
        onContinue={() => navigate('/letters/activity/build-a-letter')} />
    </div>
  );
}
