import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
type Mode = 'capital' | 'small' | 'both';

interface FallingLetter {
  id: number;
  display: string;  // what to show (A / a / Aa)
  isTarget: boolean;
  x: number;
  duration: number;
  color: string;
  startTime: number;
}

let gId = 0;

// Speech helper
function speak(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.9;
  utt.pitch = 1.1;
  window.speechSynthesis.speak(utt);
}

// Wrong-tap sound (short buzzer)
function playWrongSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {}
}

// Inject CSS once
const STYLE_ID = 'caterpillar-fall-style';
function injectFallStyle() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes catFall {
      from { top: -110px; }
      to   { top: calc(100vh + 30px); }
    }
    .cat-fall, .cat-target {
      position: fixed;
      animation: catFall var(--fall-dur, 6s) linear forwards;
    }
  `;
  document.head.appendChild(style);
}

// ─────────────────────────────────────────────────────────────
// SETUP SCREEN
// ─────────────────────────────────────────────────────────────
function SetupScreen({
  initialLetter,
  onStart,
}: {
  initialLetter: string;
  onStart: (selected: string[], mode: Mode) => void;
}) {
  const [selected, setSelected] = useState<string[]>([initialLetter]);
  const [mode, setMode] = useState<Mode>('capital');

  const toggle = (l: string) => {
    setSelected(prev =>
      prev.includes(l)
        ? prev.length > 1 ? prev.filter(x => x !== l) : prev   // keep at least 1
        : prev.length < 27 ? [...prev, l] : prev
    );
  };

  const selectAll = () => setSelected([...ALPHABET]);
  const clearAll  = () => setSelected([initialLetter]);

  const ld0 = LETTERS_DATA.find(l => l.letter === initialLetter) || LETTERS_DATA[0];

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8 bg-transparent relative z-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 pt-6 pb-4">
          <span style={{ fontSize: '2.5rem' }}>🐛</span>
          <div>
            <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.8rem', color: ld0.color, margin: 0 }}>
              Letter Caterpillar
            </h1>
            <p style={{ fontFamily: 'Nunito', fontWeight: 600, color: '#666', margin: 0 }}>
              Pick letters to catch, then grow your caterpillar!
            </p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 mb-4 shadow-lg border border-white/60">
          <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1rem', color: '#555', marginBottom: 10 }}>
            Show letters as:
          </p>
          <div className="flex gap-3">
            {(['capital', 'small', 'both'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 rounded-xl font-bold capitalize transition-all border-2"
                style={{
                  fontFamily: 'Nunito',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  background: mode === m ? ld0.color : 'white',
                  color: mode === m ? 'white' : '#555',
                  borderColor: mode === m ? ld0.color : '#ddd',
                }}
              >
                {m === 'capital' ? 'A' : m === 'small' ? 'a' : 'Aa'}
                <span style={{ fontSize: '0.7rem', display: 'block', fontWeight: 600, opacity: 0.8 }}>
                  {m === 'capital' ? 'Capital' : m === 'small' ? 'Lowercase' : 'Both'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Letters grid */}
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 shadow-lg border border-white/60 mb-5">
          <div className="flex justify-between items-center mb-3">
            <p style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1rem', color: '#555' }}>
              Select letters ({selected.length}/27):
            </p>
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-xs font-bold px-3 py-1 rounded-full border-2 transition-all"
                style={{ fontFamily: 'Nunito', borderColor: ld0.color, color: ld0.color, background: 'white' }}
              >All</button>
              <button
                onClick={clearAll}
                className="text-xs font-bold px-3 py-1 rounded-full border-2 transition-all"
                style={{ fontFamily: 'Nunito', borderColor: '#ccc', color: '#888', background: 'white' }}
              >Reset</button>
            </div>
          </div>

          <div className="grid grid-cols-9 gap-1.5">
            {ALPHABET.map(l => {
              const ld2 = LETTERS_DATA.find(x => x.letter === l)!;
              const sel = selected.includes(l);
              return (
                <motion.button
                  key={l}
                  whileTap={{ scale: 0.88 }}
                  onClick={() => toggle(l)}
                  className="aspect-square rounded-xl flex items-center justify-center font-black text-lg border-2 transition-all shadow-sm"
                  style={{
                    fontFamily: 'Nunito',
                    background: sel ? ld2.color : 'white',
                    color: sel ? 'white' : '#888',
                    borderColor: sel ? ld2.color : '#e5e5e5',
                    fontSize: '1.1rem',
                  }}
                >
                  {l}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Start */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onStart(selected, mode)}
          className="w-full py-4 rounded-2xl text-white font-black text-xl shadow-2xl border-4 border-white"
          style={{ fontFamily: 'Nunito', background: ld0.color, fontSize: '1.4rem' }}
        >
          🐛 Start Catching!
        </motion.button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// GAME SCREEN
// ─────────────────────────────────────────────────────────────
function GameScreen({
  targetLetters,
  mode,
  onBack,
  activityKey,
}: {
  targetLetters: string[];
  mode: Mode;
  onBack: () => void;
  activityKey: string;
}) {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();

  // Pick first target's color as accent
  const accentLd = LETTERS_DATA.find(l => l.letter === targetLetters[0]) || LETTERS_DATA[0];

  // Pick a random letter from the selected list to start
  const randomTarget = () => targetLetters[Math.floor(Math.random() * targetLetters.length)];

  const [currentTargetLetter, setCurrentTargetLetter] = useState<string>(() => randomTarget());
  const [caught, setCaught] = useState(0);          // how many caught so far
  const [segments, setSegments] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [fallingLetters, setFallingLetters] = useState<FallingLetter[]>([]);
  const GOAL = 10;

  const getDisplay = (letter: string) => {
    const ld2 = LETTERS_DATA.find(l => l.letter === letter) || LETTERS_DATA[0];
    if (mode === 'capital') return ld2.uppercase;
    if (mode === 'small')   return ld2.lowercase;
    return `${ld2.uppercase}${ld2.lowercase}`;
  };

  useEffect(() => { injectFallStyle(); }, []);

  // Auto-remove expired
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setFallingLetters(prev => prev.filter(fl => now - fl.startTime < fl.duration * 1000 + 500));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Spawn letters: ~60% chance current target, rest random from full alphabet
  useEffect(() => {
    if (showCelebration) return;
    const t = setInterval(() => {
      const shouldBeTarget = Math.random() < 0.35;
      const spawnLetter = shouldBeTarget
        ? currentTargetLetter
        : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      // isTarget = only the ONE letter currently shown in the Catch badge
      const isTarget = spawnLetter === currentTargetLetter;
      const ld2 = LETTERS_DATA.find(l => l.letter === spawnLetter) || LETTERS_DATA[0];
      const duration = 5 + Math.random() * 4;

      setFallingLetters(prev => [
        ...prev.slice(-35),
        {
          id: gId++,
          display: getDisplay(spawnLetter),
          isTarget,
          x: 5 + Math.random() * 88,
          duration,
          color: ld2.color,
          startTime: Date.now(),
        }
      ]);
    }, 600);
    return () => clearInterval(t);
  }, [currentTargetLetter, mode, showCelebration]);

  const handleTap = (fl: FallingLetter) => {
    if (!fl.isTarget) {
      playWrongSound();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      speak(`Not the right letter. This is ${fl.display}. You need ${currentTargetDisplay}.`);
      return;
    }

    // Correct catch!
    setFallingLetters(f => f.filter(x => x.id !== fl.id));
    setSegments(s => [...s, fl.display]);
    const newCaught = caught + 1;
    setCaught(newCaught);

    if (newCaught >= GOAL) {
      awardStars(activityKey, 3);
      incrementActivity(activityKey);
      setTimeout(() => setShowCelebration(true), 500);
    } else {
      // Pick a new random target (prefer different from current if possible)
      const others = targetLetters.filter(l => l !== currentTargetLetter);
      const next = others.length > 0
        ? others[Math.floor(Math.random() * others.length)]
        : currentTargetLetter;
      setCurrentTargetLetter(next);
      // Clear falling letters so the new target can appear fresh
      setFallingLetters([]);
    }
  };

  const currentTargetDisplay = getDisplay(currentTargetLetter);

  return (
    <div className="h-screen w-full flex flex-col relative z-10 overflow-hidden bg-transparent">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 z-10 relative">
        <BackButton onClick={onBack} color={accentLd.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: accentLd.color }}>
          Letter Caterpillar
        </h2>
        <span style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1rem', color: accentLd.color }}>
          {caught}/{GOAL} 🐛
        </span>
      </div>

      {/* Bear — right side */}
      <div className="absolute top-16 right-3 z-10">
        <BuddyBear
          mood="excited"
          size={85}
          speech={
            caught < GOAL
              ? `Catch the "${currentTargetDisplay}"! Let others fall 🐛`
              : `You're amazing! 🌟`
          }
        />
      </div>

      {/* Next target badge */}
      <div className="flex justify-center mt-2 z-10 relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex items-center gap-3 px-6 py-3 rounded-full border-4 border-white shadow-2xl"
          style={{ background: accentLd.color, fontFamily: 'Nunito', color: 'white', fontWeight: 900 }}
        >
          <span style={{ fontSize: '1rem' }}>Catch:</span>
          <span
            className="bg-white/25 rounded-full px-3 py-0.5"
            style={{ fontSize: '2rem', lineHeight: 1.2 }}
          >
            {currentTargetDisplay}
          </span>
        </motion.div>
      </div>

      {/* Mode chip */}
      <div className="flex justify-center mt-1 z-10 relative">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full bg-white/60 backdrop-blur"
          style={{ fontFamily: 'Nunito', color: '#555' }}
        >
          {mode === 'capital' ? 'Capital letters' : mode === 'small' ? 'Lowercase letters' : 'Both cases'} · Catch {GOAL}!
        </span>
      </div>

      {/* Caterpillar body — no gaps, segments touch each other */}
      <motion.div
        animate={shake ? { x: [-8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center mt-5 z-10 relative"
        style={{ flexWrap: 'wrap', gap: 0 }}
      >
        {/* Head */}
        <motion.div
          animate={{ x: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
          className="rounded-full flex items-center justify-center"
          style={{ width: 56, height: 56, background: accentLd.color, fontSize: '1.8rem', flexShrink: 0 }}
        >🐛</motion.div>

        {/* Segments — slightly overlapping so they appear connected */}
        <AnimatePresence>
          {segments.map((seg, i) => (
            <motion.div
              key={`seg-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="rounded-full flex items-center justify-center"
              style={{
                width: 52,
                height: 52,
                background: LETTERS_DATA[i % LETTERS_DATA.length].color,
                flexShrink: 0,
                marginLeft: -4,
              }}
            >
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.2rem', color: 'white' }}>
                {seg}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {createPortal(
        fallingLetters.map(fl => (
          <button
            key={fl.id}
            onClick={() => handleTap(fl)}
            className={fl.isTarget ? 'cat-target' : 'cat-fall'}
            style={{
              '--fall-dur': `${fl.duration}s`,
              left: `${fl.x}%`,
              top: '-110px',
              zIndex: 9999,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: fl.color,
              border: '4px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontFamily: 'Nunito',
              fontWeight: 900,
              fontSize: '1.8rem',
              color: 'white',
              opacity: 1,
            } as React.CSSProperties}
          >
            {fl.display}
          </button>
        )),
        document.body
      )}

      {showFact && (
        <div className="fixed inset-x-4 bottom-8 z-[10000]">
          <FunFactCard fact={accentLd.funFact} emoji={accentLd.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen
        active={showCelebration}
        stars={3}
        message="Super caterpillar! 🐛🌟"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export function LetterCaterpillar() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const initialLetter = letter?.toUpperCase() || 'A';
  const ld = LETTERS_DATA.find(l => l.letter === initialLetter) || LETTERS_DATA[0];

  const [gameConfig, setGameConfig] = useState<{ letters: string[]; mode: Mode } | null>(null);

  if (!gameConfig) {
    return (
      <>
        <div className="absolute top-4 left-4 z-20">
          <BackButton onClick={() => navigate(-1)} color={ld.color} />
        </div>
        <SetupScreen
          initialLetter={initialLetter}
          onStart={(letters, mode) => setGameConfig({ letters, mode })}
        />
      </>
    );
  }

  return (
    <GameScreen
      targetLetters={gameConfig.letters}
      mode={gameConfig.mode}
      onBack={() => setGameConfig(null)}
      activityKey={`caterpillar`}
    />
  );
}
