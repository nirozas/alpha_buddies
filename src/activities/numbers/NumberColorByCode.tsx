import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NUMBERS_DATA } from '../../constants/numbers';
import type { NumberData } from '../../types';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { TEMPLATES, type ColorTemplate } from '../letters/colorByCodeTemplates';

export function NumberColorByCode() {
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { playDing, playBoing, playPop, speak } = useAudio();

  // Setup state
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: picture, 2: numbers, 3: game
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ColorTemplate>(TEMPLATES[0]);

  // Game state
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [filledRegions, setFilledRegions] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [autoFillRest, setAutoFillRest] = useState(false);

  // Map colorIds to number objects based on selection
  const colorMapping = useMemo(() => {
    const map: Record<number, NumberData> = {};
    const availableColorIds = Object.keys(selectedTemplate.palette).map(Number).sort();
    
    // Assign a color to each selected number up to the max colors available
    selectedNumbers.forEach((numDigit, idx) => {
      if (idx < availableColorIds.length) {
        const nd = NUMBERS_DATA.find(n => n.digit === numDigit);
        if (nd) map[availableColorIds[idx]] = nd;
      }
    });
    return map;
  }, [selectedNumbers, selectedTemplate]);

  // Total targets to win
  const targetRegions = useMemo(() => {
    return selectedTemplate.regions.filter(r => !!colorMapping[r.colorId]);
  }, [selectedTemplate, colorMapping]);

  const handleStart = () => {
    if (selectedNumbers.length === 0) return;
    setStep(3);
    playPop();
  };

  const handleRegionClick = (regionId: string, regionColorId: number) => {
    if (filledRegions.includes(regionId) || autoFillRest) return;

    const assignedNumber = colorMapping[regionColorId];
    if (!assignedNumber) {
      // It's a locked region, can't click it
      playBoing();
      return;
    }

    if (selectedColorId === regionColorId) {
      playDing();
      const newFilled = [...filledRegions, regionId];
      setFilledRegions(newFilled);

      if (newFilled.length === targetRegions.length) {
        // Win!
        setAutoFillRest(true);
        const lKey = selectedNumbers.join('-');
        awardStars(`color-by-code-${lKey}`, mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
        incrementActivity(`color-by-code-${lKey}`);
        setTimeout(() => setShowCelebration(true), 1500);
      }
    } else {
      playBoing();
      setMistakes(m => m + 1);
      // Read the number that belongs here
      speak(assignedNumber.digit.toString());
    }
  };

  const handleCrayonClick = (colorId: number) => {
    const assignedNumber = colorMapping[colorId];
    if (assignedNumber) {
      setSelectedColorId(colorId);
      playPop();
      speak(assignedNumber.digit.toString());
    } else {
      playBoing(); // Locked
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center p-8 relative z-10 font-nunito">
        <div className="w-full flex items-center justify-between mb-8 max-w-5xl">
          <BackButton onClick={() => navigate(-1)} color="#475569" />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Step 1: Choose a Picture</h1>
          <div className="w-12" />
        </div>

        <div className="max-w-5xl w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TEMPLATES.map(t => (
            <motion.button
              key={t.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedTemplate(t); setSelectedNumbers([]); setStep(2); playPop(); }}
              className="bg-white rounded-[2rem] p-4 shadow-xl border-4 border-slate-100 flex flex-col items-center gap-4 group hover:border-blue-400 transition-colors"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-[1.5rem] overflow-hidden border-2 border-slate-200">
                <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none">
                  {t.regions.map((r: any) => (
                    <path key={r.id} d={r.d} fill={t.palette[r.colorId]} stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
                  ))}
                </svg>
              </div>
              <span className="font-bold text-lg text-slate-700 group-hover:text-blue-600">{t.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center p-8 relative z-10 font-nunito">
        <div className="w-full flex items-center justify-between mb-8 max-w-4xl">
          <BackButton onClick={() => setStep(1)} color="#475569" />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Step 2: Setup Game</h1>
          <div className="w-12" />
        </div>

        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Preview & Mode */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-slate-100 flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-700 mb-4 text-center">Selected Picture</h2>
              <div className="w-48 h-48 mx-auto bg-slate-50 rounded-[1.5rem] overflow-hidden border-4 border-slate-200">
                <svg viewBox="0 0 400 400" className="w-full h-full pointer-events-none">
                  {selectedTemplate.regions.map(r => (
                    <path key={r.id} d={r.d} fill="#FFFFFF" stroke="#1E293B" strokeWidth="4" strokeLinejoin="round" />
                  ))}
                </svg>
              </div>
              <p className="text-center mt-2 font-bold text-slate-600">{selectedTemplate.name}</p>
            </div>

          </div>

          {/* Right: Numbers */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-slate-100 flex flex-col">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex justify-between items-center">
              <span>Pick up to {Object.keys(selectedTemplate.palette).length} Numbers</span>
              <span className="text-sm bg-slate-100 px-3 py-1 rounded-full">{selectedNumbers.length} / {Object.keys(selectedTemplate.palette).length}</span>
            </h2>
            <div className="flex flex-wrap gap-2 overflow-y-auto max-h-64 pr-2">
              {NUMBERS_DATA.map(nd => {
                const maxAllowed = Object.keys(selectedTemplate.palette).length;
                const isSelected = selectedNumbers.includes(nd.digit);
                const isDisabled = !isSelected && selectedNumbers.length >= maxAllowed;

                return (
                  <motion.button
                    key={nd.digit}
                    whileHover={isDisabled ? {} : { scale: 1.1 }}
                    whileTap={isDisabled ? {} : { scale: 0.9 }}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedNumbers(selectedNumbers.filter(n => n !== nd.digit));
                        playPop();
                      } else if (!isDisabled) {
                        setSelectedNumbers([...selectedNumbers, nd.digit]);
                        playPop();
                      } else {
                        playBoing();
                      }
                    }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-colors border-2
                      ${isSelected ? 'bg-indigo-500 text-white border-indigo-600 shadow-md' : 
                        isDisabled ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed' : 
                        'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                  >
                    {nd.digit}
                  </motion.button>
                );
              })}
            </div>
            
            <motion.button
              whileHover={selectedNumbers.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedNumbers.length > 0 ? { scale: 0.98 } : {}}
              onClick={handleStart}
              className={`mt-auto pt-6 w-full py-4 rounded-xl font-black text-xl uppercase tracking-widest transition-all ${selectedNumbers.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
            >
              Start Coloring
            </motion.button>
          </div>
        </div>
      </div>
    );
  }

  // GAME UI
  const availableColorIds = Object.keys(selectedTemplate.palette).map(Number).sort();

  return (
    <div className="min-h-dvh flex flex-col items-center bg-transparent relative z-10 font-nunito pb-8">
      <div className="w-full flex items-center justify-between p-4 sticky top-0 z-10 bg-white/50 backdrop-blur-md border-b border-white/20">
        <BackButton onClick={() => { setStep(2); setFilledRegions([]); setMistakes(0); setAutoFillRest(false); setSelectedColorId(null); }} color="#334155" />
        <h2 className="text-xl font-black text-slate-700 tracking-tight">{selectedTemplate.name}</h2>
        <div className="w-12" />
      </div>

      <div className="w-full max-w-4xl px-4 flex flex-col items-center mt-6">
        {/* Crayons */}
        <div className="flex flex-wrap justify-center gap-4 bg-white/80 backdrop-blur p-4 rounded-3xl shadow-xl border-4 border-white mb-8">
          {availableColorIds.map(cid => {
            const hex = selectedTemplate.palette[cid];
            const isAssigned = !!colorMapping[cid];
            const isSelected = selectedColorId === cid;
            
            return (
              <motion.button
                key={cid}
                whileHover={isAssigned ? { y: -10 } : {}}
                whileTap={isAssigned ? { scale: 0.95 } : {}}
                onClick={() => handleCrayonClick(cid)}
                className={`relative focus:outline-none transition-all duration-300 ${!isAssigned ? 'opacity-50 grayscale' : ''} ${isSelected ? '-translate-y-4' : ''}`}
              >
                <svg viewBox="0 0 40 160" className={`w-12 h-32 md:w-16 md:h-40 drop-shadow-xl ${isSelected ? 'drop-shadow-2xl' : ''}`}>
                  {/* Wax Body */}
                  <path d="M5,40 L35,40 L35,155 Q35,160 30,160 L10,160 Q5,160 5,155 Z" fill={isAssigned ? hex : '#94A3B8'} />
                  {/* Tip */}
                  <path d="M5,40 L15,5 Q20,0 25,5 L35,40 Z" fill={isAssigned ? hex : '#94A3B8'} />
                  
                  {/* Wrapper (Paper label) */}
                  <path d="M5,60 L35,60 L35,140 L5,140 Z" fill="#F8FAFC" />
                  
                  {/* Wrapper stripes/details */}
                  <path d="M5,65 L35,65 L35,75 L5,75 Z" fill="#1E293B" opacity="0.8" />
                  <path d="M5,125 L35,125 L35,135 L5,135 Z" fill="#1E293B" opacity="0.8" />
                  
                  {/* Oval cutouts in paper wrapper (classic crayon look) */}
                  <ellipse cx="20" cy="100" rx="10" ry="25" fill="#1E293B" opacity="0.1" />
                  <ellipse cx="20" cy="100" rx="8" ry="23" fill={isAssigned ? hex : '#94A3B8'} />
                  
                  {/* 3D Highlight / Shading overlay */}
                  <path d="M5,40 L15,5 Q20,0 25,5 L35,40 L35,155 Q35,160 30,160 L10,160 Q5,160 5,155 Z" fill="none" stroke="#1E293B" strokeWidth="1.5" opacity={isSelected ? "1" : "0.4"} />
                  <rect x="5" y="40" width="8" height="120" fill="white" opacity="0.3" />
                  <rect x="27" y="40" width="8" height="120" fill="black" opacity="0.2" />
                  <path d="M5,40 L15,5 L20,5 L10,40 Z" fill="white" opacity="0.3" />
                  <path d="M35,40 L25,5 L20,5 L30,40 Z" fill="black" opacity="0.2" />
                </svg>
                
                {/* Locked Icon Overlay */}
                {!isAssigned && (
                  <div className="absolute inset-0 flex items-center justify-center top-6">
                    <span className="text-2xl drop-shadow-md">🔒</span>
                  </div>
                )}
                
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-md z-10" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Canvas */}
        <div className="bg-white p-4 rounded-[3rem] shadow-2xl border-8 border-slate-100 w-full max-w-[500px] aspect-square relative">
          <svg viewBox="0 0 400 400" className="w-full h-full rounded-[2rem] overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>
            {/* Draw all background regions first */}
            {selectedTemplate.regions.map(region => {
              const assignedNumber = colorMapping[region.colorId];
              const isFilled = filledRegions.includes(region.id) || autoFillRest;
              const fillHex = isFilled ? selectedTemplate.palette[region.colorId] : '#FFFFFF';

              return (
                <motion.path
                  key={`path-${region.id}`}
                  onClick={() => handleRegionClick(region.id, region.colorId)}
                  className={assignedNumber && !autoFillRest ? "cursor-pointer" : ""}
                  d={region.d}
                  fill={fillHex}
                  stroke="#1E293B"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  whileHover={assignedNumber && !isFilled && !autoFillRest ? { fill: '#F1F5F9' } : {}}
                  whileTap={assignedNumber && !isFilled && !autoFillRest ? { scale: 0.99 } : {}}
                />
              );
            })}

            {/* Draw all texts on TOP of everything */}
            {selectedTemplate.regions.map(region => {
              const assignedNumber = colorMapping[region.colorId];
              const isFilled = filledRegions.includes(region.id) || autoFillRest;

              let char = '';
              if (assignedNumber && !isFilled) {
                char = assignedNumber.digit.toString();
              }

              if (!char) return null;

              // Calculate dynamic font size based on bounding box
              let fontSize = 20;
              const matches = region.d.match(/-?\d+(\.\d+)?/g);
              if (matches && matches.length >= 4) {
                const coords = matches.map(Number);
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                for (let i = 0; i < coords.length; i += 2) {
                  const x = coords[i];
                  const y = coords[i+1];
                  if (!isNaN(x) && !isNaN(y)) {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                  }
                }
                const width = maxX - minX;
                const height = maxY - minY;
                const minDim = Math.min(width, height);
                
                if (minDim < 20) fontSize = 10;
                else if (minDim < 35) fontSize = 14;
                else if (minDim < 50) fontSize = 16;
              }

              return (
                <text
                  key={`text-${region.id}`}
                  x={region.textX}
                  y={region.textY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight="900"
                  fontFamily="Nunito"
                  fill="#334155"
                  pointerEvents="none"
                >
                  {char}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1} message="Masterpiece! 🎨"
        onContinue={() => {
          setStep(1);
          setFilledRegions([]);
          setMistakes(0);
          setAutoFillRest(false);
          setSelectedColorId(null);
          setShowCelebration(false);
          setSelectedNumbers([]);
        }} />
    </div>
  );
}
