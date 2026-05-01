import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

type Point = { x: number; y: number };

export function TraceDraw() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const [coverage, setCoverage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [cleared, setCleared] = useState(false);

  const CANVAS_SIZE = Math.min(window.innerWidth - 48, 320);

  const targetMaskRef = useRef<{ mask: Uint8Array; total: number } | null>(null);
  const lastCheckRef = useRef<number>(0);

  const initTargetMask = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = CANVAS_SIZE;
    offscreen.height = CANVAS_SIZE;
    const ctx = offscreen.getContext('2d')!;
    ctx.font = `bold ${CANVAS_SIZE * 0.72}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 40; // generous tracing area
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
    ctx.strokeText(ld.uppercase, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.fillText(ld.uppercase, CANVAS_SIZE / 2, CANVAS_SIZE / 2);

    const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
    const mask = new Uint8Array(CANVAS_SIZE * CANVAS_SIZE);
    let total = 0;
    for (let i = 0; i < mask.length; i++) {
      if (imgData[i * 4 + 3] > 50) {
        mask[i] = 1;
        total++;
      }
    }
    targetMaskRef.current = { mask, total };
  };

  useEffect(() => {
    drawGuide();
    initTargetMask();
  }, [cleared]);

  const drawGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    // Draw dotted letter guide
    ctx.save();
    ctx.font = `bold ${CANVAS_SIZE * 0.72}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = ld.color + '60'; // max alpha 96
    ctx.lineWidth = 3;
    ctx.strokeText(ld.uppercase, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.setLineDash([]);
    ctx.fillStyle = ld.color + '18'; // max alpha 24
    ctx.fillText(ld.uppercase, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    ctx.restore();
  };

  const getPos = (e: React.TouchEvent | React.MouseEvent): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const checkCoverage = () => {
    if (!canvasRef.current || !targetMaskRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const imgData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
    const { mask, total } = targetMaskRef.current;
    
    let covered = 0;
    for (let i = 0; i < mask.length; i++) {
      // Guide alpha is <= 96. User strokes are 255. So checking > 150 isolates user strokes.
      if (mask[i] === 1 && imgData[i * 4 + 3] > 150) {
        covered++;
      }
    }

    if (total === 0) return;
    const newCoverage = Math.min(100, (covered / total) * 100);
    setCoverage(newCoverage);
    
    if (newCoverage >= 85 && !showCelebration) {
      const key = `${ld.letter}-trace-draw`;
      awardStars(key, 3);
      incrementActivity(key);
      setTimeout(() => setShowCelebration(true), 400);
    }
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setDrawing(true);
    const p = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const p = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = ld.color;
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    // Draw glitter
    ctx.save();
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(p.x + (Math.random()-0.5)*12, p.y + (Math.random()-0.5)*12, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    
    const now = Date.now();
    if (now - lastCheckRef.current > 150) {
      checkCoverage();
      lastCheckRef.current = now;
    }
  };

  const stopDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (drawing) checkCoverage();
    setDrawing(false);
  };

  const handleClear = () => {
    setCoverage(0);
    setCleared(c => !c);
    setDrawing(false);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Trace &amp; Draw</h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="rounded-full px-3 py-1 text-sm font-bold"
          style={{ background: ld.color, color: 'white', fontFamily: 'Nunito' }}
        >Clear</motion.button>
      </div>

      <BuddyBear mood="thinking" size={90}
        speech={`Trace the letter ${ld.uppercase} with your finger! Follow the dotted lines! ✏️`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="mt-2 rounded-3xl overflow-hidden shadow-2xl"
        style={{ border: `4px solid ${ld.color}`, background: 'white', touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
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
      </motion.div>

      {/* Progress bar */}
      <div className="mt-4 w-full max-w-xs px-4">
        <div className="flex justify-between mb-1">
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: ld.color, fontWeight: 700 }}>Tracing Progress</span>
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: ld.color, fontWeight: 800 }}>{Math.round(coverage)}%</span>
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
