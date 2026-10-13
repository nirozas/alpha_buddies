import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen, ProgressBar } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';

type PieceType = 'longLine' | 'shortLine' | 'bigCurve' | 'smallCurve' | 'diagL' | 'diagR' | 'dot';

interface LetterRecipe {
  id: string;
  pieces: { type: PieceType; id: string; x: number; y: number; rotate: number }[];
}

export const RECIPES_UPPER: Record<string, LetterRecipe> = {
  'A': { id: 'A', pieces: [
    { type: 'diagR', id: 'a1', x: -30, y: 5, rotate: 16 },
    { type: 'diagL', id: 'a2', x: 30, y: 5, rotate: -16 },
    { type: 'shortLine', id: 'a3', x: 0, y: 20, rotate: 90 }
  ]},
  'B': { id: 'B', pieces: [
    { type: 'longLine', id: 'b1', x: -25, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'b2', x: 5, y: -36, rotate: 180 },
    { type: 'smallCurve', id: 'b3', x: 5, y: 36, rotate: 180 }
  ]},
  'C': { id: 'C', pieces: [
    { type: 'bigCurve', id: 'c1', x: 5, y: 0, rotate: 0 }
  ]},
  'D': { id: 'D', pieces: [
    { type: 'longLine', id: 'd1', x: -25, y: 0, rotate: 0 },
    { type: 'bigCurve', id: 'd2', x: 12, y: 0, rotate: 180 }
  ]},
  'E': { id: 'E', pieces: [
    { type: 'longLine', id: 'e1', x: -35, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'e2', x: 5, y: -62, rotate: 90 },
    { type: 'shortLine', id: 'e3', x: -2, y: 0, rotate: 90 },
    { type: 'shortLine', id: 'e4', x: 5, y: 62, rotate: 90 }
  ]},
  'F': { id: 'F', pieces: [
    { type: 'longLine', id: 'f1', x: -35, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'f2', x: 5, y: -62, rotate: 90 },
    { type: 'shortLine', id: 'f3', x: -2, y: -5, rotate: 90 }
  ]},
  'G': { id: 'G', pieces: [
    { type: 'bigCurve', id: 'g1', x: -5, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'g2', x: 16, y: 20, rotate: 90 },
    { type: 'shortLine', id: 'g3', x: 30, y: 40, rotate: 0 }
  ]},
  'H': { id: 'H', pieces: [
    { type: 'longLine', id: 'h1', x: -35, y: 0, rotate: 0 },
    { type: 'longLine', id: 'h2', x: 35, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'h3', x: 0, y: 0, rotate: 90 }
  ]},
  'I': { id: 'I', pieces: [
    { type: 'longLine', id: 'i1', x: 0, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'i2', x: 0, y: -62, rotate: 90 },
    { type: 'shortLine', id: 'i3', x: 0, y: 62, rotate: 90 }
  ]},
  'J': { id: 'J', pieces: [
    { type: 'shortLine', id: 'j1', x: 10, y: -62, rotate: 90 },
    { type: 'longLine', id: 'j2', x: 25, y: -10, rotate: 0 },
    { type: 'smallCurve', id: 'j3', x: 5, y: 45, rotate: 90 }
  ]},
  'K': { id: 'K', pieces: [
    { type: 'longLine', id: 'k1', x: -28, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'k2', x: 10, y: -32, rotate: -45 },
    { type: 'shortLine', id: 'k3', x: 10, y: 32, rotate: 45 }
  ]},
  'L': { id: 'L', pieces: [
    { type: 'longLine', id: 'l1', x: -25, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'l2', x: 15, y: 62, rotate: 90 }
  ]},
  'M': { id: 'M', pieces: [
    { type: 'longLine', id: 'm1', x: -45, y: 0, rotate: 0 },
    { type: 'longLine', id: 'm2', x: -16, y: -5, rotate: 20 },
    { type: 'longLine', id: 'm3', x: 16, y: -5, rotate: -20 },
    { type: 'longLine', id: 'm4', x: 45, y: 0, rotate: 0 }
  ]},
  'N': { id: 'N', pieces: [
    { type: 'longLine', id: 'n1', x: -35, y: 0, rotate: 0 },
    { type: 'diagR', id: 'n2', x: 0, y: 0, rotate: 26 },
    { type: 'longLine', id: 'n3', x: 35, y: 0, rotate: 0 }
  ]},
  'O': { id: 'O', pieces: [
    { type: 'bigCurve', id: 'o1', x: -15, y: 0, rotate: 0 },
    { type: 'bigCurve', id: 'o2', x: 15, y: 0, rotate: 180 }
  ]},
  'P': { id: 'P', pieces: [
    { type: 'longLine', id: 'p1', x: -25, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'p2', x: 5, y: -36, rotate: 180 }
  ]},
  'Q': { id: 'Q', pieces: [
    { type: 'bigCurve', id: 'q1', x: -15, y: -10, rotate: 0 },
    { type: 'bigCurve', id: 'q2', x: 15, y: -10, rotate: 180 },
    { type: 'shortLine', id: 'q3', x: 28, y: 55, rotate: 45 }
  ]},
  'R': { id: 'R', pieces: [
    { type: 'longLine', id: 'r1', x: -25, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'r2', x: 5, y: -36, rotate: 180 },
    { type: 'shortLine', id: 'r3', x: 10, y: 35, rotate: 40 }
  ]},
  'S': { id: 'S', pieces: [
    { type: 'smallCurve', id: 's1', x: 0, y: -30, rotate: 0 },
    { type: 'smallCurve', id: 's2', x: 0, y: 30, rotate: 180 }
  ]},
  'T': { id: 'T', pieces: [
    { type: 'longLine', id: 't1', x: 0, y: 15, rotate: 0 },
    { type: 'longLine', id: 't2', x: 0, y: -58, rotate: 90 }
  ]},
  'U': { id: 'U', pieces: [
    { type: 'longLine', id: 'u1', x: -30, y: -15, rotate: 0 },
    { type: 'smallCurve', id: 'u2', x: 0, y: 40, rotate: 90 },
    { type: 'longLine', id: 'u3', x: 30, y: -15, rotate: 0 }
  ]},
  'V': { id: 'V', pieces: [
    { type: 'diagR', id: 'v1', x: -22, y: 0, rotate: -16 },
    { type: 'diagL', id: 'v2', x: 22, y: 0, rotate: 16 }
  ]},
  'W': { id: 'W', pieces: [
    { type: 'longLine', id: 'w1', x: -45, y: 0, rotate: -15 },
    { type: 'longLine', id: 'w2', x: -15, y: 0, rotate: 15 },
    { type: 'longLine', id: 'w3', x: 15, y: 0, rotate: -15 },
    { type: 'longLine', id: 'w4', x: 45, y: 0, rotate: 15 }
  ]},
  'X': { id: 'X', pieces: [
    { type: 'diagR', id: 'x1', x: 0, y: 0, rotate: 35 },
    { type: 'diagL', id: 'x2', x: 0, y: 0, rotate: -35 }
  ]},
  'Y': { id: 'Y', pieces: [
    { type: 'shortLine', id: 'y1', x: -20, y: -40, rotate: -35 },
    { type: 'shortLine', id: 'y2', x: 20, y: -40, rotate: 35 },
    { type: 'shortLine', id: 'y3', x: 0, y: 35, rotate: 0 }
  ]},
  'Z': { id: 'Z', pieces: [
    { type: 'shortLine', id: 'z1', x: 0, y: -62, rotate: 90 },
    { type: 'diagL', id: 'z2', x: 0, y: 0, rotate: -42 },
    { type: 'shortLine', id: 'z3', x: 0, y: 62, rotate: 90 }
  ]}
};

export const RECIPES_LOWER: Record<string, LetterRecipe> = {
  'A': { id: 'a', pieces: [
    { type: 'smallCurve', id: 'la1', x: -10, y: 20, rotate: 0 },
    { type: 'shortLine', id: 'la2', x: 18, y: 20, rotate: 0 }
  ]},
  'B': { id: 'b', pieces: [
    { type: 'longLine', id: 'lb1', x: -25, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'lb2', x: 5, y: 36, rotate: 180 }
  ]},
  'C': { id: 'c', pieces: [
    { type: 'smallCurve', id: 'lc1', x: 0, y: 20, rotate: 0 }
  ]},
  'D': { id: 'd', pieces: [
    { type: 'smallCurve', id: 'ld1', x: -5, y: 36, rotate: 0 },
    { type: 'longLine', id: 'ld2', x: 25, y: 0, rotate: 0 }
  ]},
  'E': { id: 'e', pieces: [
    { type: 'shortLine', id: 'le1', x: 0, y: 10, rotate: 90 },
    { type: 'smallCurve', id: 'le2', x: 0, y: 20, rotate: 0 }
  ]},
  'F': { id: 'f', pieces: [
    { type: 'longLine', id: 'lf1', x: 0, y: 15, rotate: 0 },
    { type: 'smallCurve', id: 'lf2', x: 14, y: -45, rotate: -90 },
    { type: 'shortLine', id: 'lf3', x: 0, y: -10, rotate: 90 }
  ]},
  'G': { id: 'g', pieces: [
    { type: 'smallCurve', id: 'lg1', x: -5, y: 10, rotate: 0 },
    { type: 'longLine', id: 'lg2', x: 20, y: 30, rotate: 0 },
    { type: 'smallCurve', id: 'lg3', x: 0, y: 80, rotate: 90 }
  ]},
  'H': { id: 'h', pieces: [
    { type: 'longLine', id: 'lh1', x: -25, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'lh2', x: 10, y: 25, rotate: -90 }
  ]},
  'I': { id: 'i', pieces: [
    { type: 'shortLine', id: 'li1', x: 0, y: 25, rotate: 0 },
    { type: 'dot', id: 'li2', x: 0, y: -30, rotate: 0 }
  ]},
  'J': { id: 'j', pieces: [
    { type: 'longLine', id: 'lj1', x: 10, y: 25, rotate: 0 },
    { type: 'smallCurve', id: 'lj2', x: -10, y: 75, rotate: 90 },
    { type: 'dot', id: 'lj3', x: 10, y: -30, rotate: 0 }
  ]},
  'K': { id: 'k', pieces: [
    { type: 'longLine', id: 'lk1', x: -25, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'lk2', x: 10, y: 10, rotate: -45 },
    { type: 'shortLine', id: 'lk3', x: 10, y: 40, rotate: 45 }
  ]},
  'L': { id: 'l', pieces: [
    { type: 'longLine', id: 'll1', x: 0, y: 0, rotate: 0 }
  ]},
  'M': { id: 'm', pieces: [
    { type: 'shortLine', id: 'lm1', x: -35, y: 25, rotate: 0 },
    { type: 'smallCurve', id: 'lm2', x: -10, y: 25, rotate: -90 },
    { type: 'smallCurve', id: 'lm3', x: 22, y: 25, rotate: -90 }
  ]},
  'N': { id: 'n', pieces: [
    { type: 'shortLine', id: 'ln1', x: -20, y: 25, rotate: 0 },
    { type: 'smallCurve', id: 'ln2', x: 10, y: 25, rotate: -90 }
  ]},
  'O': { id: 'o', pieces: [
    { type: 'smallCurve', id: 'lo1', x: -10, y: 20, rotate: 0 },
    { type: 'smallCurve', id: 'lo2', x: 10, y: 20, rotate: 180 }
  ]},
  'P': { id: 'p', pieces: [
    { type: 'longLine', id: 'lp1', x: -25, y: 35, rotate: 0 },
    { type: 'smallCurve', id: 'lp2', x: 5, y: 15, rotate: 180 }
  ]},
  'Q': { id: 'q', pieces: [
    { type: 'smallCurve', id: 'lq1', x: -5, y: 15, rotate: 0 },
    { type: 'longLine', id: 'lq2', x: 25, y: 35, rotate: 0 }
  ]},
  'R': { id: 'r', pieces: [
    { type: 'shortLine', id: 'lr1', x: -15, y: 25, rotate: 0 },
    { type: 'smallCurve', id: 'lr2', x: 10, y: 10, rotate: -90 }
  ]},
  'S': { id: 's', pieces: [
    { type: 'smallCurve', id: 'ls1', x: 0, y: 10, rotate: 0 },
    { type: 'smallCurve', id: 'ls2', x: 0, y: 40, rotate: 180 }
  ]},
  'T': { id: 't', pieces: [
    { type: 'longLine', id: 'lt1', x: 0, y: 15, rotate: 0 },
    { type: 'shortLine', id: 'lt2', x: 0, y: -10, rotate: 90 }
  ]},
  'U': { id: 'u', pieces: [
    { type: 'shortLine', id: 'lu1', x: -25, y: 20, rotate: 0 },
    { type: 'smallCurve', id: 'lu2', x: 0, y: 40, rotate: 90 },
    { type: 'shortLine', id: 'lu3', x: 25, y: 20, rotate: 0 }
  ]},
  'V': { id: 'v', pieces: [
    { type: 'shortLine', id: 'lv1', x: -15, y: 25, rotate: -22 },
    { type: 'shortLine', id: 'lv2', x: 15, y: 25, rotate: 22 }
  ]},
  'W': { id: 'w', pieces: [
    { type: 'shortLine', id: 'lw1', x: -30, y: 25, rotate: -18 },
    { type: 'shortLine', id: 'lw2', x: -10, y: 25, rotate: 18 },
    { type: 'shortLine', id: 'lw3', x: 10, y: 25, rotate: -18 },
    { type: 'shortLine', id: 'lw4', x: 30, y: 25, rotate: 18 }
  ]},
  'X': { id: 'x', pieces: [
    { type: 'shortLine', id: 'lx1', x: 0, y: 25, rotate: 45 },
    { type: 'shortLine', id: 'lx2', x: 0, y: 25, rotate: -45 }
  ]},
  'Y': { id: 'y', pieces: [
    { type: 'shortLine', id: 'ly1', x: -15, y: 15, rotate: -25 },
    { type: 'longLine', id: 'ly2', x: 10, y: 35, rotate: 25 }
  ]},
  'Z': { id: 'z', pieces: [
    { type: 'shortLine', id: 'lz1', x: 0, y: 5, rotate: 90 },
    { type: 'shortLine', id: 'lz2', x: 0, y: 25, rotate: -45 },
    { type: 'shortLine', id: 'lz3', x: 0, y: 45, rotate: 90 }
  ]}
};

const renderPiece = (type: PieceType, color: string = "#F59E0B") => {
  switch (type) {
    case 'longLine':
      return <div className="w-5 h-36 rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'shortLine':
      return <div className="w-5 h-[72px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagR':
      return <div className="w-5 h-[175px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagL':
      return <div className="w-5 h-[175px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'bigCurve':
      return (
        <svg width="76" height="144" viewBox="0 0 76 144" className="overflow-visible drop-shadow-sm">
          <path
            d="M 64 12 A 52 60 0 0 0 64 132"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'smallCurve':
      return (
        <svg width="56" height="74" viewBox="0 0 56 74" className="overflow-visible drop-shadow-sm">
          <path
            d="M 44 12 A 32 25 0 0 0 44 62"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'dot':
      return <div className="w-6 h-6 rounded-full shadow-sm" style={{ backgroundColor: color }} />;
  }
};

export function BuildALetter() {
  const { letter } = useParams<{ letter?: string }>();
  const navigate = useNavigate();
  const { progress, awardStars, incrementActivity, masteredLetter, masteredLetters } = useStore();
  const { playDing, playBoing, playFanfare, speak } = useAudio();

  // Requirement: select only one letter to play
  const targetLetter = (letter ? letter.split(',')[0].trim().toUpperCase() : null)
    || (masteredLetters && masteredLetters[0])
    || masteredLetter
    || 'A';

  const currentLetter = targetLetter.toUpperCase();
  const lData = LETTERS_DATA.find(l => l.letter === currentLetter) || LETTERS_DATA[0];

  const [caseMode, setCaseMode] = useState<'capital' | 'lowercase'>('capital');
  const recipe = (caseMode === 'capital' ? RECIPES_UPPER[currentLetter] : RECIPES_LOWER[currentLetter])
    || RECIPES_UPPER['A'];

  const [placedPieces, setPlacedPieces] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const targetRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Stars tracking per condition
  const hasCapital = Boolean(progress.starsEarned[`build_letter_${currentLetter}_capital`]);
  const hasLowercase = Boolean(progress.starsEarned[`build_letter_${currentLetter}_lowercase`]);

  useEffect(() => {
    setPlacedPieces([]);
    if (caseMode === 'capital') {
      speak(`Build capital ${currentLetter}!`);
    } else {
      speak(`Build lowercase ${currentLetter.toLowerCase()}!`);
    }
  }, [currentLetter, caseMode, speak]);

  const handlePlace = (pieceId: string) => {
    if (placedPieces.includes(pieceId)) return;
    const newPlaced = [...placedPieces, pieceId];
    setPlacedPieces(newPlaced);
    playDing();

    if (newPlaced.length === recipe.pieces.length) {
      setTimeout(() => {
        playFanfare();
        const isCapital = caseMode === 'capital';
        const earnedCond = isCapital ? 1 : 2;
        const condKey = isCapital ? 'capital' : 'lowercase';

        // 1. Award condition star(s)
        awardStars(`build_letter_${currentLetter}_${condKey}`, earnedCond);

        // 2. Combined stars: capital = 1, lowercase = 2, both = 3
        const updatedHasCap = isCapital ? true : hasCapital;
        const updatedHasLow = !isCapital ? true : hasLowercase;
        const totalLetterStars = (updatedHasCap ? 1 : 0) + (updatedHasLow ? 2 : 0);

        awardStars(`build-a-letter-${currentLetter}`, Math.min(3, totalLetterStars) as 1 | 2 | 3);
        awardStars(`${currentLetter}-build-a-letter`, Math.min(3, totalLetterStars) as 1 | 2 | 3);
        incrementActivity(`build-a-letter-${currentLetter}`);
        awardStars('build-a-letter', Math.min(3, totalLetterStars) as 1 | 2 | 3);
        incrementActivity('build-a-letter');

        setShowCelebration(true);
      }, 600);
    }
  };

  const handleDragEnd = (_event: any, info: any, pieceId: string) => {
    const targetEl = targetRefs.current[pieceId];
    if (!targetEl) return;
    const rect = targetEl.getBoundingClientRect();

    const { x, y } = info.point;
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const distance = Math.hypot(x - targetCenterX, y - targetCenterY);

    // Generous snap radius for children (<= 80px)
    if (distance <= 80) {
      handlePlace(pieceId);
    } else {
      setMistakes(m => m + 1);
      playBoing();
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center bg-orange-50 relative font-nunito pb-8 select-none">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between p-3 sm:p-4 sticky top-0 z-20">
        <BackButton onClick={() => navigate('/letters/activity/build-a-letter')} color="#EA580C" />
        <div className="flex-1 max-w-xs sm:max-w-md mx-auto flex flex-col items-center">
          <ProgressBar
            value={placedPieces.length}
            max={recipe.pieces.length}
            color="#EA580C"
            label={`Pieces: ${placedPieces.length}/${recipe.pieces.length}`}
          />
        </div>
        <div style={{ width: 44 }} />
      </div>

      {/* Mode Toggle: Capital & Lowercase with star rewards */}
      <div className="flex bg-white/70 backdrop-blur rounded-[2rem] p-1.5 shadow-md border-2 border-orange-200 mb-3 scale-105 sm:scale-115">
        <button
          onClick={() => setCaseMode('capital')}
          className={`px-4 sm:px-5 py-1.5 rounded-[1.5rem] text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            caseMode === 'capital'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-orange-950 opacity-60 hover:opacity-100'
          }`}
        >
          <span>🔠 Capital ({currentLetter})</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-black">
            {hasCapital ? '⭐ Done' : '+1⭐'}
          </span>
        </button>
        <button
          onClick={() => setCaseMode('lowercase')}
          className={`px-4 sm:px-5 py-1.5 rounded-[1.5rem] text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            caseMode === 'lowercase'
              ? 'bg-orange-500 text-white shadow-md'
              : 'text-orange-950 opacity-60 hover:opacity-100'
          }`}
        >
          <span>🔡 Lowercase ({currentLetter.toLowerCase()})</span>
          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-black">
            {hasLowercase ? '⭐⭐ Done' : '+2⭐⭐'}
          </span>
        </button>
      </div>

      <BuddyBear
        mood={placedPieces.length === recipe.pieces.length ? 'celebrating' : 'thinking'}
        size={90}
        speech={`Drag the sticks to build ${caseMode === 'capital' ? 'Capital' : 'Lowercase'} ${
          caseMode === 'capital' ? currentLetter : currentLetter.toLowerCase()
        }! 🧱`}
      />

      <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center px-4 mt-2">
        {/* Letter Canvas */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 bg-white rounded-3xl shadow-xl border-4 border-orange-200 flex items-center justify-center mb-6 overflow-visible">
          {/* Blueprint slots */}
          {recipe.pieces.map((p) => (
            <div
              key={`blueprint-${p.id}`}
              ref={el => { targetRefs.current[p.id] = el; }}
              className="absolute flex items-center justify-center opacity-30 grayscale pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {renderPiece(p.type, '#94A3B8')}
            </div>
          ))}

          {/* Placed sticks */}
          {recipe.pieces.map((p) => (
            <AnimatePresence key={`placed-${p.id}`}>
              {placedPieces.includes(p.id) && (
                <div
                  key={`placed-${p.id}`}
                  className="absolute flex items-center justify-center z-10 pointer-events-none"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`,
                    transformOrigin: 'center center',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  >
                    {renderPiece(p.type, '#F59E0B')}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Piece Bank: completely clear / transparent background, pieces fit 1:1 slot size */}
        <div className="w-full max-w-xl bg-orange-100/40 backdrop-blur-sm p-4 rounded-3xl border-2 border-orange-200 shadow-sm">
          <p className="text-center text-xs sm:text-sm font-black text-orange-900 mb-2">
            🪵 Pick up a stick and place it in the letter:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 min-h-36 py-4">
            {recipe.pieces.map((p) => {
              if (placedPieces.includes(p.id)) return null;

              return (
                <motion.div
                  key={`bank-${p.id}`}
                  drag
                  dragSnapToOrigin
                  onDragEnd={(event, info) => handleDragEnd(event, info, p.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ cursor: 'grabbing' }}
                  className="relative cursor-grab bg-transparent flex items-center justify-center p-0 z-30 touch-none select-none"
                  style={{
                    width: 70,
                    height: 120,
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(${p.rotate}deg)`,
                      transformOrigin: 'center center',
                      pointerEvents: 'none',
                    }}
                  >
                    {renderPiece(p.type, '#F59E0B')}
                  </div>
                </motion.div>
              );
            })}
            {recipe.pieces.every(p => placedPieces.includes(p.id)) && (
              <div className="w-full text-center text-xl font-black text-emerald-600 animate-bounce">
                🎉 Letter {caseMode === 'capital' ? currentLetter : currentLetter.toLowerCase()} Built!
              </div>
            )}
          </div>
        </div>
      </div>

      <CelebrationScreen
        active={showCelebration}
        stars={caseMode === 'capital' ? 1 : 2}
        message={
          caseMode === 'capital'
            ? `Capital ${currentLetter} Complete! +1⭐ Earned!`
            : `Lowercase ${currentLetter.toLowerCase()} Complete! +2⭐⭐ Earned!`
        }
        onContinue={() => navigate('/letters/activity/build-a-letter')}
        onMenu={() => navigate('/letters')}
      />
    </div>
  );
}
