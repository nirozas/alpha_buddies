import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton, CelebrationScreen, ProgressBar } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTERS_DATA } from '../../constants/letters';
import { BuddyBear } from '../../components/BuddyBear';

type PieceType =
  | 'longLine'
  | 'mediumLine'
  | 'shortLine'
  | 'bigCurve'
  | 'smallCurve'
  | 'diagL'
  | 'diagR'
  | 'cornerBL'
  | 'cornerBR'
  | 'hookLeft'
  | 'hookRight'
  | 'dot';

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
    { type: 'longLine', id: 'b1', x: -28, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'b2', x: 8, y: -34, rotate: 180 },
    { type: 'smallCurve', id: 'b3', x: 10, y: 34, rotate: 180 }
  ]},
  'C': { id: 'C', pieces: [
    { type: 'bigCurve', id: 'c1', x: 0, y: 0, rotate: 0 }
  ]},
  'D': { id: 'D', pieces: [
    { type: 'longLine', id: 'd1', x: -28, y: 0, rotate: 0 },
    { type: 'bigCurve', id: 'd2', x: 10, y: 0, rotate: 180 }
  ]},
  'E': { id: 'E', pieces: [
    { type: 'longLine', id: 'e1', x: -32, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'e2', x: 6, y: -60, rotate: 90 },
    { type: 'shortLine', id: 'e3', x: -2, y: 0, rotate: 90 },
    { type: 'shortLine', id: 'e4', x: 6, y: 60, rotate: 90 }
  ]},
  'F': { id: 'F', pieces: [
    { type: 'longLine', id: 'f1', x: -32, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'f2', x: 6, y: -60, rotate: 90 },
    { type: 'shortLine', id: 'f3', x: -2, y: -8, rotate: 90 }
  ]},
  'G': { id: 'G', pieces: [
    { type: 'bigCurve', id: 'g1', x: -8, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'g2', x: 32, y: 38, rotate: 0 },
    { type: 'shortLine', id: 'g3', x: 16, y: 8, rotate: 90 }
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
    { type: 'shortLine', id: 'j1', x: 10, y: -60, rotate: 90 },
    { type: 'hookLeft', id: 'j2', x: -2, y: 0, rotate: 0 }
  ]},
  'K': { id: 'K', pieces: [
    { type: 'longLine', id: 'k1', x: -25, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'k2', x: 0, y: -26, rotate: 40 },
    { type: 'shortLine', id: 'k3', x: 1, y: 26, rotate: -40 }
  ]},
  'L': { id: 'L', pieces: [
    { type: 'longLine', id: 'l1', x: -25, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'l2', x: 15, y: 62, rotate: 90 }
  ]},
  'M': { id: 'M', pieces: [
    { type: 'longLine', id: 'm1', x: -36, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'm2', x: -18, y: -26, rotate: -28 },
    { type: 'shortLine', id: 'm3', x: 18, y: -26, rotate: 28 },
    { type: 'longLine', id: 'm4', x: 36, y: 0, rotate: 0 }
  ]},
  'N': { id: 'N', pieces: [
    { type: 'longLine', id: 'n1', x: -35, y: 0, rotate: 0 },
    { type: 'diagR', id: 'n2', x: 0, y: 0, rotate: -28 },
    { type: 'longLine', id: 'n3', x: 35, y: 0, rotate: 0 }
  ]},
  'O': { id: 'O', pieces: [
    { type: 'bigCurve', id: 'o1', x: -12, y: 0, rotate: 0 },
    { type: 'bigCurve', id: 'o2', x: 12, y: 0, rotate: 180 }
  ]},
  'P': { id: 'P', pieces: [
    { type: 'longLine', id: 'p1', x: -28, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'p2', x: 8, y: -34, rotate: 180 }
  ]},
  'Q': { id: 'Q', pieces: [
    { type: 'bigCurve', id: 'q1', x: -12, y: -8, rotate: 0 },
    { type: 'bigCurve', id: 'q2', x: 12, y: -8, rotate: 180 },
    { type: 'shortLine', id: 'q3', x: 24, y: 46, rotate: -45 }
  ]},
  'R': { id: 'R', pieces: [
    { type: 'longLine', id: 'r1', x: -28, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'r2', x: 8, y: -34, rotate: 180 },
    { type: 'shortLine', id: 'r3', x: 6, y: 26, rotate: -40 }
  ]},
  'S': { id: 'S', pieces: [
    { type: 'smallCurve', id: 's1', x: 0, y: -28, rotate: 0 },
    { type: 'smallCurve', id: 's2', x: 10, y: 28, rotate: 180 }
  ]},
  'T': { id: 'T', pieces: [
    { type: 'longLine', id: 't1', x: 0, y: 15, rotate: 0 },
    { type: 'longLine', id: 't2', x: 0, y: -58, rotate: 90 }
  ]},
  'U': { id: 'U', pieces: [
    { type: 'hookRight', id: 'u1', x: -16, y: -10, rotate: 0 },
    { type: 'longLine', id: 'u2', x: 22, y: -10, rotate: 0 }
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
    { type: 'shortLine', id: 'y1', x: -20, y: -38, rotate: -35 },
    { type: 'shortLine', id: 'y2', x: 20, y: -38, rotate: 35 },
    { type: 'shortLine', id: 'y3', x: 0, y: 35, rotate: 0 }
  ]},
  'Z': { id: 'Z', pieces: [
    { type: 'shortLine', id: 'z1', x: 0, y: -60, rotate: 90 },
    { type: 'longLine', id: 'z2', x: 0, y: 0, rotate: 30 },
    { type: 'shortLine', id: 'z3', x: 0, y: 60, rotate: 90 }
  ]}
};

export const RECIPES_LOWER: Record<string, LetterRecipe> = {
  'A': { id: 'a', pieces: [
    { type: 'smallCurve', id: 'la1', x: -8, y: 20, rotate: 0 },
    { type: 'mediumLine', id: 'la2', x: 18, y: 25, rotate: 0 }
  ]},
  'B': { id: 'b', pieces: [
    { type: 'longLine', id: 'lb1', x: -20, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'lb2', x: 6, y: 34, rotate: 180 }
  ]},
  'C': { id: 'c', pieces: [
    { type: 'smallCurve', id: 'lc1', x: 0, y: 20, rotate: 0 }
  ]},
  'D': { id: 'd', pieces: [
    { type: 'smallCurve', id: 'ld1', x: -8, y: 34, rotate: 0 },
    { type: 'longLine', id: 'ld2', x: 18, y: 0, rotate: 0 }
  ]},
  'E': { id: 'e', pieces: [
    { type: 'shortLine', id: 'le1', x: 0, y: 8, rotate: 90 },
    { type: 'smallCurve', id: 'le2', x: 0, y: -10, rotate: 90 },
    { type: 'cornerBL', id: 'le3', x: 0, y: 32, rotate: 0 }
  ]},
  'F': { id: 'f', pieces: [
    { type: 'hookLeft', id: 'lf1', x: 0, y: 15, rotate: 180 },
    { type: 'shortLine', id: 'lf2', x: -5, y: -10, rotate: 90 }
  ]},
  'G': { id: 'g', pieces: [
    { type: 'smallCurve', id: 'lg1', x: -8, y: -5, rotate: 0 },
    { type: 'hookLeft', id: 'lg2', x: 0, y: 20, rotate: 0 }
  ]},
  'H': { id: 'h', pieces: [
    { type: 'longLine', id: 'lh1', x: -22, y: 0, rotate: 0 },
    { type: 'smallCurve', id: 'lh2', x: 8, y: 24, rotate: 90 }
  ]},
  'I': { id: 'i', pieces: [
    { type: 'shortLine', id: 'li1', x: 0, y: 22, rotate: 0 },
    { type: 'dot', id: 'li2', x: 0, y: -32, rotate: 0 }
  ]},
  'J': { id: 'j', pieces: [
    { type: 'hookLeft', id: 'lj1', x: -8, y: 20, rotate: 0 },
    { type: 'dot', id: 'lj2', x: 11, y: -62, rotate: 0 }
  ]},
  'K': { id: 'k', pieces: [
    { type: 'longLine', id: 'lk1', x: -22, y: 0, rotate: 0 },
    { type: 'shortLine', id: 'lk2', x: -1, y: 8, rotate: 42 },
    { type: 'shortLine', id: 'lk3', x: 1, y: 39, rotate: -42 }
  ]},
  'L': { id: 'l', pieces: [
    { type: 'longLine', id: 'll1', x: 0, y: 0, rotate: 0 }
  ]},
  'M': { id: 'm', pieces: [
    { type: 'shortLine', id: 'lm1', x: -38, y: 24, rotate: 0 },
    { type: 'smallCurve', id: 'lm2', x: -13, y: 24, rotate: 90 },
    { type: 'smallCurve', id: 'lm3', x: 37, y: 24, rotate: 90 }
  ]},
  'N': { id: 'n', pieces: [
    { type: 'shortLine', id: 'ln1', x: -20, y: 24, rotate: 0 },
    { type: 'smallCurve', id: 'ln2', x: 8, y: 24, rotate: 90 }
  ]},
  'O': { id: 'o', pieces: [
    { type: 'smallCurve', id: 'lo1', x: -8, y: 20, rotate: 0 },
    { type: 'smallCurve', id: 'lo2', x: 8, y: 20, rotate: 180 }
  ]},
  'P': { id: 'p', pieces: [
    { type: 'longLine', id: 'lp1', x: -20, y: 35, rotate: 0 },
    { type: 'smallCurve', id: 'lp2', x: 6, y: 15, rotate: 180 }
  ]},
  'Q': { id: 'q', pieces: [
    { type: 'smallCurve', id: 'lq1', x: -8, y: 15, rotate: 0 },
    { type: 'longLine', id: 'lq2', x: 18, y: 35, rotate: 0 }
  ]},
  'R': { id: 'r', pieces: [
    { type: 'shortLine', id: 'lr1', x: -26, y: 14, rotate: 0 },
    { type: 'cornerBL', id: 'lr2', x: -2, y: 18, rotate: 90 }
  ]},
  'S': { id: 's', pieces: [
    { type: 'smallCurve', id: 'ls1', x: 0, y: -1, rotate: 0 },
    { type: 'smallCurve', id: 'ls2', x: 10, y: 47, rotate: 180 }
  ]},
  'T': { id: 't', pieces: [
    { type: 'hookRight', id: 'lt1', x: -14, y: 15, rotate: 0 },
    { type: 'shortLine', id: 'lt2', x: -28, y: -10, rotate: 90 }
  ]},
  'U': { id: 'u', pieces: [
    { type: 'smallCurve', id: 'lu1', x: -5, y: 18, rotate: 270 },
    { type: 'shortLine', id: 'lu2', x: 20, y: 18, rotate: 0 }
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
    { type: 'shortLine', id: 'lz2', x: 0, y: 25, rotate: 45 },
    { type: 'shortLine', id: 'lz3', x: 0, y: 45, rotate: 90 }
  ]}
};

const renderPiece = (type: PieceType, color: string = "#F59E0B") => {
  switch (type) {
    case 'longLine':
      return <div className="w-5 h-36 rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'mediumLine':
      return <div className="w-5 h-[92px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'shortLine':
      return <div className="w-5 h-[72px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagR':
      return <div className="w-5 h-[175px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'diagL':
      return <div className="w-5 h-[175px] rounded-full shadow-sm" style={{ backgroundColor: color }} />;
    case 'bigCurve':
      return (
        <svg width="100" height="150" viewBox="0 0 100 150" className="overflow-visible drop-shadow-sm">
          <path
            d="M 92 16 L 42 16 A 38 59 0 0 0 42 134 L 92 134"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'smallCurve':
      return (
        <svg width="76" height="78" viewBox="0 0 76 78" className="overflow-visible drop-shadow-sm">
          <path
            d="M 64 14 L 34 14 A 25 25 0 0 0 34 64 L 64 64"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'cornerBL':
      return (
        <svg width="76" height="72" viewBox="0 0 76 72" className="overflow-visible drop-shadow-sm">
          <path
            d="M 12 12 L 12 36 A 24 24 0 0 0 36 60 L 64 60"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'cornerBR':
      return (
        <svg width="76" height="72" viewBox="0 0 76 72" className="overflow-visible drop-shadow-sm">
          <path
            d="M 12 60 L 40 60 A 24 24 0 0 0 64 36 L 64 12"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'hookLeft':
      return (
        <svg width="66" height="144" viewBox="0 0 66 144" className="overflow-visible drop-shadow-sm">
          <path
            d="M 52 12 L 52 108 A 24 24 0 0 1 28 132 L 14 132"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'hookRight':
      return (
        <svg width="66" height="144" viewBox="0 0 66 144" className="overflow-visible drop-shadow-sm">
          <path
            d="M 14 12 L 14 108 A 24 24 0 0 0 38 132 L 52 132"
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

  const [draggingPieceType, setDraggingPieceType] = useState<PieceType | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Stars tracking per condition
  const hasCapital = Boolean(progress.starsEarned[`build_letter_${currentLetter}_capital`]);
  const hasLowercase = Boolean(progress.starsEarned[`build_letter_${currentLetter}_lowercase`]);

  useEffect(() => {
    setPlacedPieces([]);
    setDraggingPieceType(null);
    if (caseMode === 'capital') {
      speak(`Build capital ${currentLetter}!`);
    } else {
      speak(`Build lowercase ${currentLetter.toLowerCase()}!`);
    }
  }, [currentLetter, caseMode, speak]);

  const isPieceCompatible = (typeA: PieceType, typeB: PieceType): boolean => {
    if (typeA === typeB) return true;
    if ((typeA === 'diagR' || typeA === 'diagL') && (typeB === 'diagR' || typeB === 'diagL')) {
      return true;
    }
    if ((typeA === 'shortLine' || typeA === 'mediumLine') && (typeB === 'shortLine' || typeB === 'mediumLine')) {
      return true;
    }
    if ((typeA === 'cornerBL' || typeA === 'cornerBR') && (typeB === 'cornerBL' || typeB === 'cornerBR')) {
      return true;
    }
    if ((typeA === 'hookLeft' || typeA === 'hookRight') && (typeB === 'hookLeft' || typeB === 'hookRight')) {
      return true;
    }
    return false;
  };

  const handlePlace = (pieceId: string) => {
    if (placedPieces.includes(pieceId)) return;
    const newPlaced = [...placedPieces, pieceId];
    setPlacedPieces(newPlaced);
    setDraggingPieceType(null);
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

  const handleDragEnd = (_event: any, info: any, draggedPiece: typeof recipe.pieces[0]) => {
    setDraggingPieceType(null);

    // Find all unplaced slots that match or are compatible with this piece type
    const unplacedSlots = recipe.pieces.filter(
      slot => !placedPieces.includes(slot.id) && isPieceCompatible(draggedPiece.type, slot.type)
    );

    if (unplacedSlots.length === 0) {
      playBoing();
      return;
    }

    const { x, y } = info.point;
    const canvasEl = canvasRef.current;
    const canvasRect = canvasEl?.getBoundingClientRect();
    const isInsideCanvas = canvasRect ? (
      x >= canvasRect.left - 25 &&
      x <= canvasRect.right + 25 &&
      y >= canvasRect.top - 25 &&
      y <= canvasRect.bottom + 25
    ) : false;

    let bestSlot: typeof recipe.pieces[0] | null = null;
    let minDistance = Infinity;

    for (const slot of unplacedSlots) {
      const slotEl = targetRefs.current[slot.id];
      if (!slotEl) continue;
      const rect = slotEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distToCenter = Math.hypot(x - centerX, y - centerY);

      // Distance to bounding box edges
      const dx = Math.max(rect.left - x, 0, x - rect.right);
      const dy = Math.max(rect.top - y, 0, y - rect.bottom);
      const distToBox = Math.hypot(dx, dy);

      const effectiveDist = Math.min(distToCenter, distToBox * 1.4);
      if (effectiveDist < minDistance) {
        minDistance = effectiveDist;
        bestSlot = slot;
      }
    }

    // Generous snap radius: within 125px of center/box, or inside canvas within 185px, or sole remaining slot in canvas
    const isCloseEnough = (minDistance <= 125) ||
      (isInsideCanvas && minDistance <= 185) ||
      (isInsideCanvas && unplacedSlots.length === 1);

    if (bestSlot && isCloseEnough) {
      handlePlace(bestSlot.id);
    } else {
      setMistakes(m => m + 1);
      playBoing();
    }
  };

  const handleTapPiece = (piece: typeof recipe.pieces[0]) => {
    const unplacedSlot = recipe.pieces.find(
      slot => !placedPieces.includes(slot.id) && isPieceCompatible(piece.type, slot.type)
    );
    if (unplacedSlot) {
      handlePlace(unplacedSlot.id);
    }
  };

  return (
    <div className="h-dvh max-h-dvh w-full overflow-hidden flex flex-col justify-between items-center bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100/90 relative font-nunito select-none p-2 sm:p-3">
      {/* Top Header Row with Back Button, Mode Toggle, and Progress */}
      <div className="w-full flex items-center justify-between gap-2 max-w-4xl px-1 sm:px-2 z-20 shrink-0">
        <BackButton onClick={() => navigate('/letters/activity/build-a-letter')} color="#EA580C" />

        {/* Mode Toggle: Capital & Lowercase directly in the top header */}
        <div className="flex bg-white/80 backdrop-blur rounded-full p-1 shadow-sm border border-orange-200">
          <button
            onClick={() => setCaseMode('capital')}
            className={`px-3 sm:px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              caseMode === 'capital'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-orange-950 opacity-60 hover:opacity-100'
            }`}
          >
            <span>🔠 Capital ({currentLetter})</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full font-black">
              {hasCapital ? '⭐ Done' : '+1⭐'}
            </span>
          </button>
          <button
            onClick={() => setCaseMode('lowercase')}
            className={`px-3 sm:px-4 py-1 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              caseMode === 'lowercase'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-orange-950 opacity-60 hover:opacity-100'
            }`}
          >
            <span>🔡 Lowercase ({currentLetter.toLowerCase()})</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded-full font-black">
              {hasLowercase ? '⭐⭐ Done' : '+2⭐⭐'}
            </span>
          </button>
        </div>

        {/* Pieces Counter Badge */}
        <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-orange-200 text-xs font-black text-orange-900 shadow-sm shrink-0">
          <span>🧱</span>
          <span>{placedPieces.length}/{recipe.pieces.length}</span>
        </div>
      </div>

      {/* Compact BuddyBear cheer bubble */}
      <div className="w-full max-w-2xl flex items-center justify-center shrink-0 my-0.5 sm:my-1">
        <BuddyBear
          mood={placedPieces.length === recipe.pieces.length ? 'celebrating' : 'thinking'}
          size={52}
          speech={`Drag or tap sticks to build ${caseMode === 'capital' ? 'Capital' : 'Lowercase'} ${
            caseMode === 'capital' ? currentLetter : currentLetter.toLowerCase()
          }! 🧱`}
        />
      </div>

      {/* Main Play Arena: Side-by-side on wide screens/landscape (e.g. Galaxy Z Fold, tablets), balanced stack on mobile */}
      <div className="flex-1 w-full max-w-4xl min-h-0 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8 px-2 py-1 overflow-hidden">
        {/* Letter Canvas */}
        <div
          ref={canvasRef}
          className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-white rounded-3xl shadow-lg border-4 border-orange-200 flex items-center justify-center shrink-0 overflow-visible"
        >
          {/* Blueprint slots with active drag glowing highlight */}
          {recipe.pieces.map((p) => {
            const isPlaced = placedPieces.includes(p.id);
            const isCompatible = draggingPieceType && isPieceCompatible(draggingPieceType, p.type);
            const isHighlighted = !isPlaced && isCompatible;

            return (
              <div
                key={`blueprint-${p.id}`}
                ref={el => { targetRefs.current[p.id] = el; }}
                className={`absolute flex items-center justify-center pointer-events-none transition-all duration-200 ${
                  isPlaced
                    ? 'opacity-0'
                    : isHighlighted
                    ? 'opacity-90 scale-105'
                    : 'opacity-30 grayscale'
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translate(${p.x}px, ${p.y}px) rotate(${p.rotate}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                {/* Glowing halo when a matching piece is currently dragged */}
                {isHighlighted && (
                  <div className="absolute inset-0 -m-3 rounded-full bg-amber-400/35 blur-sm animate-pulse pointer-events-none" />
                )}
                {renderPiece(p.type, isHighlighted ? '#F59E0B' : '#94A3B8')}
              </div>
            );
          })}

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

        {/* Piece Bank: Responsive, clear, tap or drag with instant feedback */}
        <div className="w-full max-w-sm sm:max-w-md md:max-w-md bg-white/80 backdrop-blur-md px-4 py-3 sm:py-4 rounded-3xl border-2 border-orange-200 shadow-md flex flex-col items-center justify-center shrink-0 min-h-[195px] sm:min-h-[215px]">
          <p className="text-center text-xs sm:text-sm font-black text-orange-900 mb-1">
            🪵 Pick up or tap a stick to place:
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 min-h-[150px] sm:min-h-[165px] py-1">
            {recipe.pieces.map((p) => {
              if (placedPieces.includes(p.id)) return null;

              return (
                <motion.div
                  key={`bank-${p.id}`}
                  drag
                  dragSnapToOrigin
                  onDragStart={() => setDraggingPieceType(p.type)}
                  onDragEnd={(event, info) => handleDragEnd(event, info, p)}
                  onTap={() => handleTapPiece(p)}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  whileDrag={{ scale: 1.15, zIndex: 50 }}
                  className="relative cursor-grab active:cursor-grabbing bg-transparent flex items-center justify-center p-0 z-30 touch-none select-none transition-transform"
                  style={{
                    width: 75,
                    height: 152,
                  }}
                  title="Drag or tap to place!"
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
              <div className="w-full text-center text-lg sm:text-xl font-black text-emerald-600 animate-bounce">
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

