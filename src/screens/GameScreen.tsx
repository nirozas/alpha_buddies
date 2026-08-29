import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ArrowLeft, Image, Lightbulb, Unlock, ChevronRight, Maximize } from 'lucide-react';
import { useStore } from '../store/useStore';
import { buildGrid, getCellKey, isWordComplete } from '../utils/gridUtils';
import Confetti from '../components/Confetti';
import FunFactOverlay from '../components/FunFactOverlay';
import Keyboard from '../components/Keyboard';

export default function GameScreen() {
  const {
    currentPuzzle, session, selectedWordId,
    setScreen, setSelectedWord, updateCell, revealLetter, revealWord, completeWord, endPuzzle, completedWordIds,
  } = useStore();

  const [showImageHint, setShowImageHint] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [puzzleDone, setPuzzleDone] = useState(false);
  const [activeCell, setActiveCell] = useState<[number, number] | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [scale, setScale] = useState(1);
  const [lastPinchDist, setLastPinchDist] = useState<number | null>(null);
  const inputRefs = useRef<Record<string, HTMLInputElement>>({});

  const controls = useAnimation();

  const puzzle = currentPuzzle;
  if (!puzzle || !session) return null;

  useEffect(() => {
    controls.start({ opacity: 1, scale: scale, x: 0, y: 0 });
  }, [puzzle.id, controls, resetKey, scale]);

  const handleResetView = () => {
    setResetKey(prev => prev + 1);
    setScale(1);
  };

  const grid = useMemo(() => buildGrid(puzzle), [puzzle]);
  const selectedWord = puzzle.words.find(w => w.id === selectedWordId) ?? puzzle.words[0];

  const cellState = useCallback((r: number, c: number) =>
    session.cellStates[getCellKey(r, c)] ?? { userInput: '', revealed: false, correct: false },
  [session.cellStates]);

  const isCellInWord = (r: number, c: number, wordId: string) => {
    const w = puzzle.words.find(x => x.id === wordId);
    if (!w) return false;
    if (w.direction === 'across') return r === w.row && c >= w.col && c < w.col + w.answer.length;
    return c === w.col && r >= w.row && r < w.row + w.answer.length;
  };

  const handleCellInput = (r: number, c: number, val: string) => {
    const key = getCellKey(r, c);
    const letter = val.slice(-1).toUpperCase();
    
    // Only update if it's a valid letter or empty (backspace)
    if (val !== '' && !/^[A-Z]$/.test(letter)) return;
    
    updateCell(key, letter);

    const cell = grid[r][c];
    const correctLetter = cell.letter;

    if (letter && letter !== correctLetter) {
      setShake(key);
      setTimeout(() => setShake(null), 500);
    }

    if (letter) {
      // advance to next cell
      if (selectedWord) {
        for (let i = 0; i < selectedWord.answer.length; i++) {
          const nr = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
          const nc = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
          if (nr === r && nc === c && i < selectedWord.answer.length - 1) {
            const nextr = selectedWord.direction === 'across' ? r : r + 1;
            const nextc = selectedWord.direction === 'across' ? c + 1 : c;
            setActiveCell([nextr, nextc]);
            inputRefs.current[getCellKey(nextr, nextc)]?.focus();
            break;
          }
        }
        // check word done
        const testStates = { ...session.cellStates, [key]: { userInput: letter, revealed: false, correct: false } };
        if (isWordComplete(selectedWord.id, puzzle, testStates) && !completedWordIds.includes(selectedWord.id)) {
          setTimeout(() => {
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
            completeWord(selectedWord.id);
            // check puzzle done
            const allDone = puzzle.words.every(w =>
              completedWordIds.includes(w.id) || w.id === selectedWord.id
            );
            if (allDone) {
              endPuzzle();
              setTimeout(() => setPuzzleDone(true), 800);
            }
          }, 100);
        }
      }
    } else {
      // Handle backspace - move back one cell
      if (selectedWord) {
        for (let i = 1; i < selectedWord.answer.length; i++) {
          const nr = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
          const nc = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
          if (nr === r && nc === c) {
            const prevr = selectedWord.direction === 'across' ? r : r - 1;
            const prevc = selectedWord.direction === 'across' ? c - 1 : c;
            setActiveCell([prevr, prevc]);
            inputRefs.current[getCellKey(prevr, prevc)]?.focus();
            break;
          }
        }
      }
    }
  };

  const handlePinchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setLastPinchDist(dist);
    }
  };

  const handlePinchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist !== null) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const delta = dist / lastPinchDist;
      setScale(s => Math.min(2.5, Math.max(0.5, s * delta)));
      setLastPinchDist(dist);
    }
  };

  const handleVirtualKeyPress = (key: string) => {
    if (activeCell) {
      handleCellInput(activeCell[0], activeCell[1], key);
    } else if (selectedWord) {
      handleCellInput(selectedWord.row, selectedWord.col, key);
    }
  };

  const handleVirtualBackspace = () => {
    if (activeCell) {
      handleCellInput(activeCell[0], activeCell[1], '');
    }
  };

  const handleRevealLetter = () => {
    if (!selectedWord) return;
    for (let i = 0; i < selectedWord.answer.length; i++) {
      const r = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
      const c = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
      const st = cellState(r, c);
      if (!st.revealed && st.userInput !== selectedWord.answer[i]) {
        updateCell(getCellKey(r, c), selectedWord.answer[i]);
        revealLetter(selectedWord.id, i);
        break;
      }
    }
  };

  const handleRevealWord = () => {
    if (!selectedWord) return;
    for (let i = 0; i < selectedWord.answer.length; i++) {
      const r = selectedWord.direction === 'across' ? selectedWord.row : selectedWord.row + i;
      const c = selectedWord.direction === 'across' ? selectedWord.col + i : selectedWord.col;
      updateCell(getCellKey(r, c), selectedWord.answer[i]);
    }
    revealWord(selectedWord.id);
    if (!completedWordIds.includes(selectedWord.id)) {
      setTimeout(() => completeWord(selectedWord.id), 300);
    }
  };

  const cellSize = Math.min(Math.floor((Math.min(window.innerWidth, 420) - 40) / puzzle.gridSize), 44);

  return (
    <div className="bg-app h-dvh flex flex-col w-full md:max-w-2xl lg:max-w-4xl mx-auto relative overflow-hidden">
      <Confetti active={confetti} />
      <FunFactOverlay />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-3">
        <button onClick={() => setScreen('puzzle-select')}
          className="p-2 rounded-xl" style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}>
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <p className="text-muted text-xs font-semibold uppercase tracking-wide">{puzzle.theme}</p>
          <div className="flex items-center gap-2">
            <h1 className="font-head text-app font-black text-lg" style={{ fontFamily: 'var(--font-head)' }}>
              {puzzle.title}
            </h1>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
              <button 
                onClick={() => setScale(s => Math.max(0.5, s - 0.2))}
                className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white"
              >–</button>
              <span className="text-[10px] font-bold text-white/30 w-8 text-center">{Math.round(scale * 100)}%</span>
              <button 
                onClick={() => setScale(s => Math.min(2.5, s + 0.2))}
                className="w-6 h-6 flex items-center justify-center text-white/50 hover:text-white"
              >+</button>
              <div className="w-[1px] h-3 bg-white/10 mx-1" />
              <button 
                onClick={handleResetView}
                className="p-1 text-white/50 hover:text-white transition-colors"
                title="Reset View"
              >
                <Maximize size={14} />
              </button>
            </div>
          </div>
        </div>
        <span className="text-2xl">{puzzle.themeEmoji}</span>
      </div>

      {/* Active clue */}
      <motion.div
        key={selectedWordId}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-3 p-3 rounded-2xl"
        style={{ background: 'var(--c-surface)' }}
      >
        <p className="text-muted text-xs font-bold uppercase mb-0.5">
          {selectedWord?.number} {selectedWord?.direction.toUpperCase()}
        </p>
        <p className="text-app font-semibold text-sm">{selectedWord?.clue}</p>
      </motion.div>

      {/* Grid container with isolated Pan/Zoom support */}
      <div 
        onWheel={(e) => {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setScale(s => Math.min(2.5, Math.max(0.5, s + delta)));
        }}
        onTouchStart={handlePinchStart}
        onTouchMove={handlePinchMove}
        onTouchEnd={() => setLastPinchDist(null)}
        className="flex-[2] overflow-hidden relative touch-none cursor-grab active:cursor-grabbing px-4 mb-4 flex items-center justify-center bg-black/20 rounded-3xl mx-4"
      >
        <motion.div
          drag
          dragMomentum={false}
          dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
          dragElastic={0.05}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={controls}
          transition={{ duration: 0.4, staggerChildren: 0.01 }}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${puzzle.gridSize}, ${cellSize}px)`, 
            gap: 2,
            padding: 40 
          }}
        >
          {grid.flat().map((cell, idx) => {
            if (cell.isBlack) {
              return <motion.div 
                key={`${cell.row}-${cell.col}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.001 }}
                style={{ width: cellSize, height: cellSize, background: 'var(--c-bg)', borderRadius: 4 }} 
              />;
            }
            const key = getCellKey(cell.row, cell.col);
            const st = cellState(cell.row, cell.col);
            const inSelected = selectedWord ? isCellInWord(cell.row, cell.col, selectedWord.id) : false;
            const isCorrect = st.userInput.toUpperCase() === cell.letter && st.userInput !== '';
            const isShaking = shake === key;
            const isActive = activeCell && activeCell[0] === cell.row && activeCell[1] === cell.col;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: isShaking ? [-4, 4, -4, 4, 0] : 0 
                }}
                transition={{ 
                  opacity: { duration: 0.3, delay: idx * 0.001 },
                  scale: { duration: 0.3, delay: idx * 0.001 },
                  x: { duration: 0.35 }
                }}
                style={{ position: 'relative', width: cellSize, height: cellSize }}
              >
                {cell.number && (
                  <span style={{
                    position: 'absolute', top: 1, left: 2, fontSize: 8,
                    color: 'var(--c-muted)', fontWeight: 700, lineHeight: 1, zIndex: 2,
                  }}>{cell.number}</span>
                )}
                <input
                  ref={el => { if (el) inputRefs.current[key] = el; }}
                  value={st.userInput}
                  maxLength={1}
                  inputMode="none"
                  onChange={e => handleCellInput(cell.row, cell.col, e.target.value)}
                  onFocus={() => setActiveCell([cell.row, cell.col])}
                  onClick={() => {
                    setActiveCell([cell.row, cell.col]);
                    const wordId = cell.wordIds.length > 1 && selectedWord && cell.wordIds.includes(selectedWord.id)
                      ? selectedWord.id
                      : cell.wordIds[0];
                    if (wordId) setSelectedWord(wordId);
                  }}
                  style={{
                    width: '100%', height: '100%',
                    textAlign: 'center', textTransform: 'uppercase',
                    fontSize: Math.max(cellSize * 0.45, 14),
                    fontWeight: 900,
                    background: isActive ? 'var(--c-accent)' : isCorrect ? '#16a34a' : inSelected ? '#4338ca' : 'var(--c-card)',
                    color: (isActive || inSelected || isCorrect) ? '#ffffff' : 'var(--c-text)',
                    border: `2px solid ${isActive ? '#ffffff' : inSelected ? 'var(--c-accent)' : 'var(--c-surface)'}`,
                    borderRadius: 6,
                    outline: 'none',
                    cursor: 'pointer',
                    caretColor: 'transparent',
                    boxShadow: isActive ? '0 0 0 2px var(--c-bg), 0 0 0 4px var(--c-accent)' : 'none',
                  }}
                  readOnly={st.revealed || completedWordIds.includes(cell.wordIds[0] ?? '')}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Hint controls */}
      <div className="flex gap-2 px-4 mb-4">
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={() => {
            if (showImageHint) {
              setShowImageHint(null);
            } else if (selectedWord) {
              setShowImageHint(selectedWord.id);
            }
          }}
          className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl text-sm font-bold border-2"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-card)', color: 'var(--c-text)' }}
        >
          <Image size={16} /> Hint
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleRevealLetter}
          className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl text-sm font-bold border-2"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-card)', color: 'var(--c-text)' }}
        >
          <Lightbulb size={16} /> Letter (-1⭐)
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={handleRevealWord}
          className="flex-1 flex items-center justify-center gap-1 py-3 rounded-2xl text-sm font-bold border-2"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-card)', color: 'var(--c-text)' }}
        >
          <Unlock size={16} /> Word (-3⭐)
        </motion.button>
      </div>

      <AnimatePresence>
        {showImageHint && selectedWord && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 bottom-32 z-50 p-6 rounded-3xl overflow-hidden shadow-2xl"
            style={{ 
              background: 'var(--c-surface)',
              border: '2px solid var(--c-accent)',
            }}
          >
            {/* Background Image based on category (placeholder for now) */}
            <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-indigo-500 to-purple-600" />
            
            <div className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="text-6xl mb-2">{selectedWord.imageHint}</div>
              <div>
                <h3 className="font-head text-xl font-black mb-2" style={{ color: 'var(--c-accent)' }}>
                  A Visual Clue
                </h3>
                <p className="text-app font-medium leading-relaxed">
                  {selectedWord.funFact.imageDescription || "Look closely at the clue and think about the theme!"}
                </p>
              </div>
              
              <button 
                onClick={() => {
                  const speech = new SpeechSynthesisUtterance(selectedWord.funFact.imageDescription || selectedWord.clue);
                  window.speechSynthesis.speak(speech);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10"
              >
                <span className="text-lg">🔊</span>
                <span className="font-bold text-sm text-white">Listen to Hint</span>
              </button>
              
              <button 
                onClick={() => setShowImageHint(null)}
                className="mt-2 text-xs font-bold text-muted hover:text-white transition-colors"
              >
                Close Hint
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clue lists */}
      <div className="flex gap-3 px-4 pb-8 flex-1 overflow-y-auto">
        {(['across','down'] as const).map(dir => (
          <div key={dir} className="flex-1 min-w-0">
            <p className="text-muted text-xs font-bold uppercase mb-2 tracking-wide">{dir}</p>
            <div className="flex flex-col gap-1">
              {puzzle.words.filter(w => w.direction === dir).map(w => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWord(w.id)}
                  className="text-left px-2 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: selectedWordId === w.id ? 'var(--c-accent)33' : 'transparent',
                    color: completedWordIds.includes(w.id) ? 'var(--c-correct, #4ade80)' : 'var(--c-text)',
                    fontWeight: selectedWordId === w.id ? 700 : 400,
                    borderLeft: selectedWordId === w.id ? '3px solid var(--c-accent)' : '3px solid transparent',
                  }}
                >
                  <span className="font-bold">{w.number}.</span> {w.clue}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Keyboard */}
      <AnimatePresence>
        {activeCell && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-40 bg-[var(--c-bg)] border-t-2 border-[var(--c-surface)] pt-2 pb-4 px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] md:bg-transparent md:border-t-0 md:static md:shadow-none"
          >
            <div className="flex justify-end mb-1 max-w-md mx-auto">
              <button 
                onClick={() => setActiveCell(null)}
                className="text-xs font-bold text-muted px-3 py-1 bg-[var(--c-surface)] rounded-full mr-2"
              >
                Hide Keyboard
              </button>
            </div>
            <Keyboard onKeyPress={handleVirtualKeyPress} onBackspace={handleVirtualBackspace} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle Complete overlay */}
      <AnimatePresence>
        {puzzleDone && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 px-6"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              style={{ fontSize: 80 }}
            >🏆</motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-head text-white text-4xl font-black text-center"
              style={{ fontFamily: 'var(--font-head)' }}
            >
              Puzzle Complete!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/70 text-lg text-center"
            >
              Amazing job! You&apos;re a word wizard! 🌟
            </motion.p>
            <div className="flex gap-3 w-full max-w-xs">
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setPuzzleDone(false); setScreen('puzzle-select'); }}
                className="flex-1 py-4 rounded-2xl font-bold text-white"
                style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))' }}
              >
                Next Puzzle <ChevronRight size={18} className="inline" />
              </motion.button>
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setPuzzleDone(false); setScreen('word-collection'); }}
                className="flex-1 py-4 rounded-2xl font-bold border-2"
                style={{ borderColor: 'var(--c-accent)', color: 'var(--c-accent)' }}
              >
                My Words
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
