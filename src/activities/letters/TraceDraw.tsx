import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { getLetterPathData, type PathPoint } from '../../constants/letterPaths';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';

type Point = { x: number; y: number };

export function TraceDraw() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [coverage, setCoverage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [brushColor, setBrushColor] = useState(ld.color);
  const [nextPointIndex, setNextPointIndex] = useState(0);
  const [mode, setMode] = useState<'upper' | 'lower' | 'word'>('upper');

  const BASE_SIZE = Math.min(window.innerWidth - 64, 380);
  const WORD_LETTER_WIDTH = BASE_SIZE * 0.6; // Slightly smaller letters in words
  const CANVAS_WIDTH = mode === 'word' ? (ld.exampleWord.length * WORD_LETTER_WIDTH + 40) : BASE_SIZE;
  const CANVAS_HEIGHT = BASE_SIZE;

  const COLORS = Array.from(new Set([
    ld.color, '#EF4444', '#F97316', '#FBBF24', '#22C55E', 
    '#3B82F6', '#8B5CF6', '#EC4899', '#78350F', '#1F2937'
  ]));

  const { speak, playDing, playBoing, playPop, playSwoosh } = useAudio();

  // Generate the path and strokes based on mode
  const { dots, guideStrokes } = useMemo(() => {
    const chars = mode === 'word' ? ld.exampleWord.toUpperCase().split('') : [mode === 'upper' ? ld.uppercase : ld.lowercase];
    const allDots: Point[] = [];
    const allStrokes: { points: Point[], label?: string }[] = [];

    chars.forEach((char, charIdx) => {
      const data = getLetterPathData(char);
      
      // Calculate scaling and offsets
      const scale = mode === 'word' ? (WORD_LETTER_WIDTH * 0.8) / 100 : (BASE_SIZE * 0.8) / 100;
      const offsetX = mode === 'word' ? (charIdx * WORD_LETTER_WIDTH + 40) : (BASE_SIZE * 0.1);
      const offsetY = BASE_SIZE * 0.1; // 10% padding top

      data.strokes.forEach(stroke => {
        const scaledPoints = stroke.points.map(p => ({
          x: offsetX + p.x * scale,
          y: offsetY + p.y * scale
        }));
        allStrokes.push({ points: scaledPoints, label: stroke.label });
        
        // INTERPOLATE points for dense checkpoints
        for (let i = 0; i < scaledPoints.length - 1; i++) {
          const p1 = scaledPoints[i];
          const p2 = scaledPoints[i + 1];
          const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const steps = Math.max(1, Math.floor(dist / 15));
          
          for (let s = 0; s < steps; s++) {
            allDots.push({
              x: p1.x + (p2.x - p1.x) * (s / steps),
              y: p1.y + (p2.y - p1.y) * (s / steps)
            });
          }
        }
        allDots.push(scaledPoints[scaledPoints.length - 1]);
      });
    });

    return { dots: allDots, guideStrokes: allStrokes };
  }, [ld.letter, mode, BASE_SIZE, ld.exampleWord, WORD_LETTER_WIDTH]);

  useEffect(() => {
    drawGuide();
    setNextPointIndex(0);
    setCoverage(0);
  }, [cleared, ld.letter, mode]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  const getPos = (e: React.TouchEvent | React.MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.cancelable) e.preventDefault();
    setDrawing(true);
    const p = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    checkTrace(p);
  };

  const checkTrace = (p: Point) => {
    if (nextPointIndex >= dots.length) return;

    // Multi-point lookahead for smoother progress
    for (let i = 0; i < 6; i++) { // Increased lookahead for interpolated points
      const idx = nextPointIndex + i;
      if (idx >= dots.length) break;
      const target = dots[idx];
      const dist = Math.hypot(target.x - p.x, target.y - p.y);
      if (dist < 60) { // More generous for dense points
        const newIdx = idx + 1;
        setNextPointIndex(newIdx);
        setCoverage((newIdx / dots.length) * 100);
        if (newIdx === dots.length) {
          playDing();
          awardStars(`${ld.letter}-trace-draw-${mode}`, 3);
          incrementActivity(`${ld.letter}-trace-draw-${mode}`);
          setTimeout(() => setShowCelebration(true), 500);
        }
        break;
      }
    }
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!drawing) return;
    const p = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = mode === 'word' ? 14 : 28; // Slightly thicker for easier tracing
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw glitter
    ctx.save();
    ctx.fillStyle = brushColor;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    const r = mode === 'word' ? 8 : 14;
    ctx.arc(p.x + (Math.random()-0.5)*r, p.y + (Math.random()-0.5)*r, mode === 'word' ? 2 : 3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    
    checkTrace(p);
  };

  const stopDraw = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.cancelable) e.preventDefault();
    setDrawing(false);
  };

  const handleClear = () => {
    setCleared(c => !c);
    setDrawing(false);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 relative z-10 bg-transparent">
      <div className="w-full flex items-center justify-between p-4 flex-wrap gap-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        
        <div className="flex gap-2 p-1 bg-white/50 rounded-2xl shadow-inner">
          {(['upper', 'lower', 'word'] as const).map(m => (
            <button
              key={m}
              onClick={() => { playPop(); setMode(m); }}
              className={`px-4 py-2 rounded-xl font-black transition-all ${
                mode === m ? 'bg-white text-[#DB2777] shadow-md scale-105' : 'text-gray-500 hover:text-[#DB2777]'
              }`}
            >
              {m === 'upper' ? 'ABC' : m === 'lower' ? 'abc' : 'Word'}
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="rounded-full px-4 py-2 font-black shadow-lg"
          style={{ background: ld.color, color: 'white', fontFamily: 'Nunito' }}
        >Clear</motion.button>
      </div>

      <div className="flex items-center gap-4 px-6">
        <BuddyBear mood="thinking" size={70}
          speech={mode === 'word' ? `Let's write ${ld.exampleWord.toUpperCase()}! 🍎` : `Trace the letter ${mode === 'upper' ? ld.uppercase : ld.lowercase}! ✏️`}
        />
        {mode === 'word' && (
          <motion.div 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            className="w-20 h-20 bg-white rounded-3xl shadow-xl border-4 p-2"
            style={{ borderColor: ld.color }}
          >
            <img src={ld.exampleImage} alt={ld.exampleWord} className="w-full h-full object-contain" />
          </motion.div>
        )}
      </div>

      {/* Color Palette */}
      <div className="flex flex-wrap justify-center gap-2 px-4 mb-4 mt-4">
        {COLORS.map(c => (
          <motion.button
            key={c}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { playPop(); setBrushColor(c); }}
            className={`w-8 h-8 rounded-full border-2 transition-all ${brushColor === c ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-60'}`}
            style={{ background: c }}
          />
        ))}
      </div>

      <div className="w-full px-4 flex justify-center">
        <div className={`w-full max-w-full overflow-x-auto pb-8 custom-scrollbar flex ${mode === 'word' ? 'justify-start lg:justify-center' : 'justify-center'}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="rounded-[2.5rem] overflow-hidden shadow-2xl relative flex-shrink-0"
            style={{ border: `6px solid ${ld.color}`, background: 'white', touchAction: 'none' }}
          >
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onMouseOut={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              onTouchCancel={stopDraw}
              style={{ display: 'block', touchAction: 'none' }}
            />

            {/* SVG Directional Guide Overlay */}
            <svg 
              className="absolute inset-0 pointer-events-none" 
              width={CANVAS_WIDTH} 
              height={CANVAS_HEIGHT}
            >
              {guideStrokes.map((stroke, sIdx) => {
                const pathData = `M ${stroke.points.map(p => `${p.x},${p.y}`).join(' L ')}`;
                const start = stroke.points[0];
                const end = stroke.points[stroke.points.length - 1];
                const angle = stroke.points.length > 1 
                  ? Math.atan2(stroke.points[1].y - start.y, stroke.points[1].x - start.x)
                  : 0;

                return (
                  <g key={sIdx}>
                    {/* Ghost Guide (The thick letter shape) */}
                    <path 
                      d={pathData} 
                      fill="none" 
                      stroke={ld.color + '15'} 
                      strokeWidth={mode === 'word' ? '28' : '56'} 
                      strokeLinecap="round"
                    />

                    {/* Dashed Line */}
                    <path 
                      d={pathData} 
                      fill="none" 
                      stroke={ld.color + '40'} 
                      strokeWidth="4" 
                      strokeDasharray="10,10"
                      strokeLinecap="round"
                    />
                    
                    {/* Stroke Label (Number) */}
                    <g transform={`translate(${start.x - 25 * Math.cos(angle + Math.PI/4)}, ${start.y - 25 * Math.sin(angle + Math.PI/4)})`}>
                      <circle r="14" fill={ld.color} stroke="white" strokeWidth="2" />
                      <text 
                        fill="white" 
                        fontSize="16" 
                        fontWeight="900" 
                        textAnchor="middle" 
                        dominantBaseline="middle"
                        style={{ fontFamily: 'Nunito' }}
                      >
                        {stroke.label}
                      </text>
                    </g>

                    {/* End Arrow */}
                    <path
                      d="M -8,-8 L 0,0 L -8,8"
                      fill="none"
                      stroke={ld.color}
                      strokeWidth="4"
                      strokeLinecap="round"
                      transform={`translate(${end.x}, ${end.y}) rotate(${
                        stroke.points.length > 1 
                          ? Math.atan2(end.y - stroke.points[stroke.points.length-2].y, end.x - stroke.points[stroke.points.length-2].x) * 180 / Math.PI 
                          : 0
                      })`}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Pulsing Target Dot (BLACK for high contrast) */}
            {nextPointIndex < dots.length && (
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  style={{ 
                    position: 'absolute', 
                    left: dots[nextPointIndex].x, 
                    top: dots[nextPointIndex].y,
                    width: 22,
                    height: 22,
                    background: '#1F2937', // Black/Dark Gray
                    borderRadius: '50%',
                    border: '3px solid white',
                    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4 w-full max-w-xs px-4 pb-10">
        <div className="flex justify-between mb-1">
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: ld.color, fontWeight: 700 }}>Tracing Progress</span>
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: ld.color, fontWeight: 800 }}>
            {Math.round(coverage)}%
          </span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: ld.color + '30' }}>
          <motion.div className="h-full rounded-full" style={{ background: ld.color }}
            animate={{ width: `${coverage}%` }} transition={{ type: 'spring', stiffness: 200 }} />
        </div>
      </div>

      {showFact && (
        <div className="p-4 w-full max-w-sm mt-2">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message={`Brilliant tracing! ✏️`}
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
