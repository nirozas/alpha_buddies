// N2 Trace Number, N4 Number Match, N6 Number Road, N9 Counting Song
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

// ── N2 Trace the Number ──────────────────────────────────────────────────────
export function TraceNumber() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const targetMaskRef = useRef<{ mask: Uint8Array; total: number } | null>(null);
  const lastCheckRef = useRef<number>(0);
  
  const [drawing, setDrawing] = useState(false);
  const [coverage, setCoverage] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [cleared, setCleared] = useState(false);
  const SIZE = Math.min(window.innerWidth - 48, 300);

  const initTargetMask = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = SIZE;
    offscreen.height = SIZE;
    const ctx = offscreen.getContext('2d')!;
    ctx.font = `bold ${SIZE * 0.72}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 40; // generous tracing area
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'black';
    ctx.strokeText(String(nd.digit), SIZE / 2, SIZE / 2);
    ctx.fillText(String(nd.digit), SIZE / 2, SIZE / 2);

    const imgData = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const mask = new Uint8Array(SIZE * SIZE);
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
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.font = `bold ${SIZE * 0.72}px Nunito, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.setLineDash([8, 6]); ctx.strokeStyle = nd.color + '60'; ctx.lineWidth = 3;
    ctx.strokeText(String(nd.digit), SIZE / 2, SIZE / 2);
    ctx.setLineDash([]); ctx.fillStyle = nd.color + '18';
    ctx.fillText(String(nd.digit), SIZE / 2, SIZE / 2);
    initTargetMask();
  }, [cleared]);

  const getPos = (e: React.TouchEvent | React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top };
  };

  const checkCoverage = () => {
    if (!canvasRef.current || !targetMaskRef.current) return;
    const ctx = canvasRef.current.getContext('2d')!;
    const imgData = ctx.getImageData(0, 0, SIZE, SIZE).data;
    const { mask, total } = targetMaskRef.current;
    
    let covered = 0;
    for (let i = 0; i < mask.length; i++) {
      if (mask[i] === 1 && imgData[i * 4 + 3] > 150) {
        covered++;
      }
    }

    if (total === 0) return;
    const newCoverage = Math.min(100, (covered / total) * 100);
    setCoverage(newCoverage);
    
    if (newCoverage >= 85 && !showCelebration) {
      awardStars(`${nd.digit}-trace-number`, 3);
      incrementActivity(`${nd.digit}-trace-number`);
      setTimeout(() => setShowCelebration(true), 400);
    }
  };

  const startDraw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); setDrawing(true);
    const p = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); if (!drawing) return;
    const p = getPos(e);
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.lineTo(p.x, p.y); ctx.strokeStyle = nd.color; ctx.lineWidth = 24;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    
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

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Trace the Number</h2>
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setCoverage(0); setCleared(c => !c); setDrawing(false); }}
          className="rounded-full px-3 py-1 text-sm font-bold"
          style={{ background: nd.color, color: 'white', fontFamily: 'Nunito' }}>Clear</motion.button>
      </div>
      <BuddyBear mood="thinking" size={90} speech={`Trace the number ${nd.digit} with your finger! ✏️`} />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mt-2 rounded-3xl overflow-hidden shadow-2xl" style={{ border: `4px solid ${nd.color}`, background: 'white', touchAction: 'none' }}>
        <canvas ref={canvasRef} width={SIZE} height={SIZE}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} onMouseOut={stopDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} onTouchCancel={stopDraw}
          style={{ display: 'block', touchAction: 'none' }} />
      </motion.div>
      <div className="mt-3 w-full max-w-xs px-4">
        <div className="flex justify-between mb-1">
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: nd.color, fontWeight: 700 }}>Tracing Progress</span>
          <span style={{ fontFamily: 'Nunito', fontSize: '0.9rem', color: nd.color, fontWeight: 800 }}>{Math.round(coverage)}%</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ background: nd.color + '30' }}>
          <motion.div className="h-full rounded-full" style={{ background: nd.color }}
            animate={{ width: `${coverage}%` }} transition={{ type: 'spring' }} />
        </div>
      </div>
      {showFact && <div className="p-4 w-full max-w-sm mt-2"><FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} /></div>}
      <CelebrationScreen active={showCelebration} stars={3} message="Great tracing! ✏️" onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}

// ── N4 Number Match ──────────────────────────────────────────────────────────
export function NumberMatch() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;
  const [selected, setSelected] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [shake, setShake] = useState<number | null>(null);

  const target = nd.digit > 0 ? nd.digit : 3;
  const allNums = NUMBERS_DATA.filter(n => n.digit !== nd.digit && n.digit > 0).sort(() => Math.random() - 0.5).slice(0, 2);
  const [options] = useState(() => [...allNums, nd].sort(() => Math.random() - 0.5));

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Number Match</h2>
        <div style={{ width: 56 }} />
      </div>
      <BuddyBear mood="thinking" size={90} speech={`Find the card that shows ${target} objects! 🔍`} />
      <div className="flex flex-wrap gap-4 justify-center px-4 mt-4">
        {options.map((opt, i) => {
          const isCorrect = opt.digit === nd.digit;
          const isChosen = selected === i;
          return (
            <motion.button key={opt.digit}
              animate={shake === i ? { x: [-6, 6, -4, 4, 0] } : isChosen && isCorrect ? { scale: [1, 1.1, 1] } : { y: [0, -4, 0] }}
              transition={shake === i ? { duration: 0.4 } : isChosen ? { duration: 0.4 } : { repeat: Infinity, duration: 2 + i * 0.4 }}
              onClick={() => {
                if (selected !== null && options[selected].digit === nd.digit) return;
                setSelected(i);
                if (isCorrect) {
                  awardStars(`${nd.digit}-number-match`, mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1);
                  incrementActivity(`${nd.digit}-number-match`);
                  setTimeout(() => setShowCelebration(true), 500);
                } else {
                  setMistakes(m => m + 1); setShake(i);
                  setTimeout(() => { setShake(null); setSelected(null); }, 700);
                }
              }}
              className="card p-4 flex flex-col items-center gap-2"
              style={{ width: 140, minHeight: 160, border: `3px solid ${isChosen && isCorrect ? nd.color : '#E7E5E4'}`, background: isChosen && isCorrect ? nd.color + '15' : 'white' }}
            >
              <div className="flex flex-wrap gap-1 justify-center">
                {opt.objects.slice(0, opt.digit).map((o, j) => <span key={j} style={{ fontSize: '1.8rem' }}>{o}</span>)}
                {opt.digit === 0 && <span style={{ fontSize: '2rem' }}>🥚</span>}
              </div>
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: nd.color }}>{opt.digit}</span>
            </motion.button>
          );
        })}
      </div>
      {showFact && <div className="p-4 w-full max-w-sm mt-4"><FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} /></div>}
      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 1 ? 2 : 1} message="Number matched! 🔢"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}

// ── N6 Number Road ───────────────────────────────────────────────────────────
export function NumberRoad() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;
  const [nextSign, setNextSign] = useState(1);
  const [carPos, setCarPos] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const SIGNS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const handleSign = (n: number) => {
    if (n === nextSign) {
      const newNext = nextSign + 1;
      setCarPos(((nextSign) / 9) * 100);
      setNextSign(newNext);
      if (nextSign >= 5) {
        awardStars(`${nd.digit}-number-road`, 3);
        incrementActivity(`${nd.digit}-number-road`);
        setTimeout(() => setShowCelebration(true), 600);
      }
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Number Road</h2>
        <div style={{ width: 56 }} />
      </div>
      <BuddyBear mood="excited" size={90} speech={`Tap the signs in order! Next: ${nextSign}! 🚗`} />
      <div className="relative w-full px-4 mt-4" style={{ height: 80 }}>
        <div className="absolute inset-x-4" style={{ top: '50%', height: 12, background: '#D4C5F9', borderRadius: 6 }} />
        <motion.div animate={{ left: `${carPos}%` }} transition={{ type: 'spring', stiffness: 200 }}
          style={{ position: 'absolute', top: '10%', fontSize: '2.5rem', transform: 'translateX(-50%)' }}>🚗</motion.div>
        <div style={{ position: 'absolute', right: 16, top: '20%', fontSize: '2rem' }}>🏁</div>
      </div>
      <div className="flex flex-wrap gap-3 justify-center px-4 mt-6">
        {SIGNS.map(n => (
          <motion.button key={n} whileTap={{ scale: 0.9 }}
            onClick={() => handleSign(n)}
            className="rounded-2xl flex items-center justify-center shadow-md"
            style={{ width: 64, height: 64, background: nextSign > n ? nd.color : 'white', border: `3px solid ${nd.color}` }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.5rem', color: nextSign > n ? 'white' : nd.color }}>
              {n}
            </span>
          </motion.button>
        ))}
      </div>
      {showFact && <div className="p-4 w-full max-w-sm mt-4"><FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} /></div>}
      <CelebrationScreen active={showCelebration} stars={3} message="Road champion! 🚗🏁"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}

// ── N9 Counting Song ─────────────────────────────────────────────────────────
export function CountingSong() {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const nd = NUMBERS_DATA.find(n => n.digit === Number(number))!;
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [tapped, setTapped] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const handleTap = (n: number) => {
    setHighlighted(n);
    if (!tapped.includes(n)) {
      const newTapped = [...tapped, n];
      setTapped(newTapped);
      if (newTapped.length >= 5) {
        awardStars(`${nd.digit}-counting-song`, 3);
        incrementActivity(`${nd.digit}-counting-song`);
        setTimeout(() => setShowCelebration(true), 300);
      }
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: nd.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={nd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: nd.color }}>Counting Song</h2>
        <div style={{ width: 56 }} />
      </div>
      <BuddyBear mood="excited" size={90} speech="Tap each number as we count together! 🎶 1, 2, 3..." />
      <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: nd.color, fontSize: '1.1rem', marginTop: 4 }}>🎵 One, Two, Three, Four, Five... 🎵</p>
      <div className="grid grid-cols-5 gap-3 px-6 mt-4 w-full max-w-sm">
        {NUMBERS_DATA.map((n) => (
          <motion.button key={n.digit}
            whileTap={{ scale: 0.85 }}
            animate={highlighted === n.digit ? { scale: [1, 1.35, 1.1], rotate: [0, -15, 15, 0] } :
              tapped.includes(n.digit) ? { scale: 1 } : { y: [0, -4, 0] }}
            transition={highlighted === n.digit ? { duration: 0.5 } :
              { repeat: Infinity, duration: 1.5 + n.digit * 0.15, ease: 'easeInOut' }}
            onClick={() => handleTap(n.digit)}
            className="aspect-square rounded-2xl flex flex-col items-center justify-center shadow-md"
            style={{ background: tapped.includes(n.digit) ? n.color : 'white', border: `3px solid ${n.color}` }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.4rem', color: tapped.includes(n.digit) ? 'white' : n.color }}>
              {n.digit}
            </span>
            <span style={{ fontSize: '0.9rem' }}>{n.emoji}</span>
          </motion.button>
        ))}
      </div>
      {showFact && <div className="p-4 w-full max-w-sm mt-4"><FunFactCard fact={nd.funFact} emoji={nd.emoji} onClose={() => navigate(-1)} /></div>}
      <CelebrationScreen active={showCelebration} stars={3} message="Counting superstar! 🎶🔢"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
