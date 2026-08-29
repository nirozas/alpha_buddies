// Version: 5.0.0 - Multi-Palette Color System
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen } from '../../components/SharedComponents';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { 
  LucideX, LucideUndo, LucideTrash2, LucideCheck, LucideSearch, 
  LucideZoomIn, LucideZoomOut, LucidePalette, LucideLayers, LucideImage,
  LucideChevronLeft, LucideChevronRight
} from 'lucide-react';

type BrushType = 'standard' | 'soft' | 'glow' | 'crayon' | 'splatter' | 'laser';

interface BrushConfig {
  size: number;
  opacity: number;
  glow: number;
  icon: string;
  name: string;
}

const BRUSH_CONFIGS: Record<BrushType, BrushConfig> = {
  standard: { size: 15, opacity: 1, glow: 0, icon: '🎨', name: 'Pen' },
  soft: { size: 40, opacity: 0.2, glow: 0, icon: '💨', name: 'Airbrush' },
  glow: { size: 25, opacity: 0.7, glow: 20, icon: '✨', name: 'Neon' },
  laser: { size: 4, opacity: 1, glow: 8, icon: '⚡', name: 'Laser' },
  crayon: { size: 20, opacity: 0.8, glow: 0, icon: '🖍️', name: 'Crayon' },
  splatter: { size: 30, opacity: 0.9, glow: 0, icon: '💥', name: 'Splash' },
};

const PALETTES = {
  Standard: [
    '#EF4444', '#F97316', '#FBBF24', '#22C55E', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899',
    '#991B1B', '#92400E', '#92400E', '#166534', '#1E40AF', '#3730A3', '#5B21B6', '#9D174D',
    '#FFFFFF', '#94A3B8', '#475569', '#000000'
  ],
  Pastel: [
    '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F3D1F4', '#FF9AA2', '#B2E2F2',
    '#FBC4AB', '#FFD8BE', '#ECE4DB', '#D0F4DE', '#A9DEF9', '#E4C1F9', '#FF99C8', '#FCF6BD',
    '#F8F9FA', '#E9ECEF', '#DEE2E6', '#ADB5BD'
  ],
  Earthy: [
    '#4A3728', '#7B5E43', '#A68069', '#C1A391', '#2D4B31', '#556B2F', '#8F9779', '#B4BCB0',
    '#D2B48C', '#BC8F8F', '#CD853F', '#8B4513', '#A0522D', '#5D4037', '#3E2723', '#212121',
    '#EDE7E3', '#D8E2DC', '#FFE5D9', '#FFCAD4'
  ],
  Dark: [
    '#1A1A1A', '#2D2D2D', '#3F3F3F', '#000000', '#0F172A', '#1E293B', '#334155', '#475569',
    '#1E1B4B', '#312E81', '#3730A3', '#4338CA', '#4C1D95', '#5B21B6', '#6D28D9', '#7C3AED',
    '#500724', '#700B2E', '#831843', '#9D174D'
  ],
  Neon: [
    '#FF00FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000', '#0000FF', '#FF8000', '#8000FF',
    '#FF1493', '#00FA9A', '#ADFF2F', '#FFD700', '#FF4500', '#1E90FF', '#9370DB', '#00CED1',
    '#FFFFFF', '#C0C0C0', '#808080', '#000000'
  ]
};

const STYLES = [
  { id: 'classic', name: 'Classic Letter', type: 'text', font: '900 800px Nunito' },
  { id: 'prince', name: 'Prince & Poinsettias', type: 'individual', path: '/prince', ext: 'png' },
  { id: 'letters1', name: 'Bubble Letters', type: 'individual', path: '/letters1', ext: 'png' },
  { id: 'letters2', name: 'Letters Collection 2', type: 'individual', path: '/letters2', ext: 'png' },
  { id: 'floral', name: 'Floral Garden', type: 'individual', path: '/floral', ext: 'auto' },
  { id: 'animals', name: 'Wild Animals', type: 'individual', path: '/animals', ext: 'auto' },
];

export function ColourTheLetter() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
  const [brushType, setBrushType] = useState<BrushType>('standard');
  const [brushSettings, setBrushSettings] = useState<Record<BrushType, { size: number; opacity: number }>>(
    Object.keys(BRUSH_CONFIGS).reduce((acc, key) => ({
      ...acc, [key]: { size: BRUSH_CONFIGS[key as BrushType].size, opacity: BRUSH_CONFIGS[key as BrushType].opacity }
    }), {} as any)
  );
  
  const [color, setColor] = useState(PALETTES.Standard[0]);
  const [currentPaletteName, setCurrentPaletteName] = useState<keyof typeof PALETTES>('Standard');
  const [toolMode, setToolMode] = useState<'color' | 'fill'>('color');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });
  
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const { playDing, playPop } = useAudio();

  // Generate previews for the gallery
  useEffect(() => {
    const loadPreviews = async () => {
      const p = await Promise.all(STYLES.map(style => {
        return new Promise<string>((resolve) => {
          const tempCanvas = document.createElement('canvas');
          const ctx = tempCanvas.getContext('2d')!;
          tempCanvas.width = 300;
          tempCanvas.height = 300;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 300, 300);

          if (style.type === 'text') {
            ctx.font = '900 200px Nunito';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 10;
            ctx.strokeStyle = '#000000';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(ld.letter, 150, 150);
            ctx.strokeText(ld.letter, 150, 150);
            resolve(tempCanvas.toDataURL());
          } else if (style.type === 'individual') {
            const img = new Image();
            const ext = (style as any).ext || 'jpg';
            
            const tryExtensions = async (extensions: string[]) => {
              for (const e of extensions) {
                const success = await new Promise<boolean>((resolve) => {
                  img.src = `${style.path}/${ld.letter}.${e}`;
                  img.onload = () => resolve(true);
                  img.onerror = () => resolve(false);
                });
                if (success) {
                  ctx.drawImage(img, 10, 10, 280, 280);
                  return true;
                }
              }
              return false;
            };

            const exts = ext === 'auto' ? ['webp', 'jpg', 'png', 'jpeg', 'gif'] : [ext];
            tryExtensions(exts).then(() => {
              try { resolve(tempCanvas.toDataURL()); } catch(e) { resolve(''); }
            });
          } else if (style.type === 'sheet') {
            const img = new Image();
            img.src = style.file!;
            img.onload = () => {
              const { l, t, r, b } = style.crop!;
              const sheetW = r - l;
              const sheetH = b - t;
              const letterW = sheetW / style.cols!;
              const letterH = sheetH / style.rows!;
              const letterIndex = ld.letter.charCodeAt(0) - 65;
              const col = letterIndex % style.cols!;
              const row = Math.floor(letterIndex / style.cols!);
              ctx.drawImage(img, l + col * letterW, t + row * letterH, letterW, letterH, 10, 10, 280, 280);
              try { resolve(tempCanvas.toDataURL()); } catch(e) { resolve(''); }
            };
            img.onerror = () => { try { resolve(tempCanvas.toDataURL()); } catch(e) { resolve(''); } };
          }
        });
      }));
      setPreviews(p);
    };
    loadPreviews();
  }, [ld.letter]);

  // Handle style selection
  useEffect(() => {
    if (selectedStyleIndex === null) {
      setCroppedImage(null);
      return;
    }
    const currentStyle = STYLES[selectedStyleIndex];
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d')!;
    tempCanvas.width = 1200; // High res for studio
    tempCanvas.height = 1200;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1200, 1200);

    if (currentStyle.type === 'text') {
      ctx.font = (currentStyle as any).font || '900 800px Nunito';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#000000';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(ld.letter, 600, 600);
      ctx.strokeText(ld.letter, 600, 600);
      try { setCroppedImage(tempCanvas.toDataURL()); } catch(e) { console.error(e); }
    } else if (currentStyle.type === 'individual') {
      const img = new Image();
      const ext = (currentStyle as any).ext || 'jpg';
      
      const tryExtensions = async (extensions: string[]) => {
        for (const e of extensions) {
          const success = await new Promise<boolean>((resolve) => {
            img.src = `${currentStyle.path}/${ld.letter}.${e}`;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
          });
          if (success) {
            const aspect = img.width / img.height;
            let w = 1000;
            let h = 1000;
            if (aspect > 1) h = w / aspect;
            else w = h * aspect;
            const x = (1200 - w) / 2;
            const y = (1200 - h) / 2;
            ctx.drawImage(img, x, y, w, h);
            return true;
          }
        }
        return false;
      };

      const exts = ext === 'auto' ? ['webp', 'jpg', 'png', 'jpeg', 'gif'] : [ext];
      tryExtensions(exts).then((found) => {
        if (found) {
          try { setCroppedImage(tempCanvas.toDataURL()); } catch(e) { console.error(e); }
        }
      });
    } else if (currentStyle.type === 'sheet') {
      const img = new Image();
      img.src = currentStyle.file!;
      img.onload = () => {
        const { l, t, r, b } = currentStyle.crop!;
        const sheetW = r - l;
        const sheetH = b - t;
        const letterW = sheetW / currentStyle.cols!;
        const letterH = sheetH / currentStyle.rows!;
        const letterIndex = ld.letter.charCodeAt(0) - 65;
        const col = letterIndex % currentStyle.cols!;
        const row = Math.floor(letterIndex / currentStyle.cols!);
        ctx.drawImage(img, l + col * letterW, t + row * letterH, letterW, letterH, 100, 100, 1000, 1000);
        try { setCroppedImage(tempCanvas.toDataURL()); } catch(e) { console.error(e); }
      };
    }
  }, [selectedStyleIndex, ld.letter]);

  // Initial canvas resize
  useEffect(() => {
    if (!croppedImage) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = rect.width;
        canvas.height = rect.height;
        ctx.putImageData(temp, 0, 0);
      }
    };
    setTimeout(resize, 100); 
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [croppedImage]);

  const saveHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d')!;
    const img = new Image();
    img.src = history[historyIndex - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(img, 0, 0);
      setHistoryIndex(historyIndex - 1);
    };
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d')!;
    if (ctx) ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    setHistory([]);
    setHistoryIndex(-1);
  };

  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = ('touches' in e) ? e.touches[0].clientX : e.clientX;
    const clientY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const doFloodFill = async (startX: number, startY: number) => {
    if (!croppedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    };
    const fillRgb = hexToRgb(color);

    const bgImg = new Image();
    bgImg.src = croppedImage;
    await new Promise(r => { bgImg.onload = r; });

    const width = canvas.width;
    const height = canvas.height;

    const compCanvas = document.createElement('canvas');
    compCanvas.width = width;
    compCanvas.height = height;
    const compCtx = compCanvas.getContext('2d', { willReadFrequently: true })!;
    
    compCtx.fillStyle = 'white';
    compCtx.fillRect(0, 0, width, height);
    compCtx.drawImage(bgImg, 0, 0, width, height);
    compCtx.drawImage(canvas, 0, 0);

    const imgData = compCtx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sy < 0 || sx >= width || sy >= height) return;

    const startPos = (sy * width + sx) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    if ((startR + startG + startB) / 3 < 80) return; // Don't fill dark lines

    if (Math.abs(startR - fillRgb.r) < 10 && Math.abs(startG - fillRgb.g) < 10 && Math.abs(startB - fillRgb.b) < 10) return;

    const matchStartColor = (pos: number) => {
      const r = data[pos];
      const g = data[pos + 1];
      const b = data[pos + 2];
      const dR = r - startR;
      const dG = g - startG;
      const dB = b - startB;
      return dR*dR + dG*dG + dB*dB < 5000; 
    };

    const stack = [[sx, sy]];
    const newImgData = new ImageData(width, height);
    const newData = newImgData.data;
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      let currentX = x;
      let currentY = y;
      
      while (currentY >= 0 && matchStartColor((currentY * width + currentX) * 4) && !visited[currentY * width + currentX]) {
        currentY--;
      }
      currentY++;

      let spanLeft = false;
      let spanRight = false;

      while (currentY < height && matchStartColor((currentY * width + currentX) * 4) && !visited[currentY * width + currentX]) {
        const pos = (currentY * width + currentX) * 4;
        visited[currentY * width + currentX] = 1;
        
        newData[pos] = fillRgb.r;
        newData[pos + 1] = fillRgb.g;
        newData[pos + 2] = fillRgb.b;
        newData[pos + 3] = 255;

        if (currentX > 0) {
          if (matchStartColor((currentY * width + currentX - 1) * 4) && !visited[currentY * width + currentX - 1]) {
            if (!spanLeft) {
              stack.push([currentX - 1, currentY]);
              spanLeft = true;
            }
          } else if (spanLeft) {
            spanLeft = false;
          }
        }

        if (currentX < width - 1) {
          if (matchStartColor((currentY * width + currentX + 1) * 4) && !visited[currentY * width + currentX + 1]) {
            if (!spanRight) {
              stack.push([currentX + 1, currentY]);
              spanRight = true;
            }
          } else if (spanRight) {
            spanRight = false;
          }
        }
        currentY++;
      }
    }

    const resultCanvas = document.createElement('canvas');
    resultCanvas.width = width;
    resultCanvas.height = height;
    resultCanvas.getContext('2d')!.putImageData(newImgData, 0, 0);
    const ctx = canvas.getContext('2d')!;
    ctx.globalAlpha = 1; // Ensure full opacity for fill
    ctx.drawImage(resultCanvas, 0, 0);
    saveHistory();
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e && e.touches.length >= 2) {
      setIsPanning(true);
      setIsDrawing(false);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      startPanRef.current = { x: midX - pan.x, y: midY - pan.y };
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCoords(e);

    if (toolMode === 'fill') {
      doFloodFill(x, y);
      return;
    }

    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setIsPanning(false);
    const settings = brushSettings[brushType];
    const config = BRUSH_CONFIGS[brushType];
    ctx.strokeStyle = color;
    ctx.lineWidth = settings.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = settings.opacity;
    if (config.glow > 0) {
      ctx.shadowBlur = config.glow;
      ctx.shadowColor = color;
    } else {
      ctx.shadowBlur = 0;
    }
    if (brushType === 'crayon') ctx.setLineDash([2, 4]);
    else ctx.setLineDash([]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPanning && 'touches' in e && e.touches.length >= 2) {
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      setPan({
        x: midX - startPanRef.current.x,
        y: midY - startPanRef.current.y
      });
      return;
    }

    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d')!;
    const { x, y } = getCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    if (brushType === 'splatter' && Math.random() > 0.8) {
      const settings = brushSettings[brushType];
      for (let i = 0; i < 5; i++) {
        const rx = x + (Math.random() - 0.5) * settings.size * 3;
        const ry = y + (Math.random() - 0.5) * settings.size * 3;
        ctx.beginPath();
        ctx.arc(rx, ry, Math.random() * settings.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const endDrawing = (e?: React.MouseEvent | React.TouchEvent) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing) {
      saveHistory();
      setIsDrawing(false);
    }
  };

  const nextPalette = () => {
    const names = Object.keys(PALETTES) as (keyof typeof PALETTES)[];
    const idx = names.indexOf(currentPaletteName);
    setCurrentPaletteName(names[(idx + 1) % names.length]);
    playPop();
  };

  const prevPalette = () => {
    const names = Object.keys(PALETTES) as (keyof typeof PALETTES)[];
    const idx = names.indexOf(currentPaletteName);
    setCurrentPaletteName(names[(idx - 1 + names.length) % names.length]);
    playPop();
  };

  if (selectedStyleIndex === null) {
    return (
      <div className="min-h-dvh bg-transparent flex flex-col items-center justify-center p-8 font-nunito text-white relative z-10">
        <div className="absolute top-4 left-4 z-50">
          <BackButton onClick={() => navigate(-1)} color="white" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Pick a Style! 🎨</h1>
          <p className="text-white/40 text-xl font-bold italic">Which {ld.letter} would you like to color today?</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8 max-w-6xl">
          {STYLES.map((style, idx) => (
            <motion.button
              key={style.id}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedStyleIndex(idx); playPop(); }}
              className="group relative bg-[#1a1a1a] p-6 rounded-[3rem] border-4 border-white/5 hover:border-emerald-500/50 transition-all shadow-2xl"
            >
              <div className="w-64 h-64 bg-white rounded-[2rem] overflow-hidden mb-6">
                {previews[idx] ? (
                  <img src={previews[idx]} alt={style.name} className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-200">Loading...</div>
                )}
              </div>
              <div className="text-2xl font-black tracking-tight">{style.name}</div>
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <LucideCheck />
              </div>
            </motion.button>
          ))}
        </div>
        
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-transparent text-white overflow-hidden select-none font-nunito relative z-10">
      {/* Top Header */}
      <div className="h-16 flex items-center justify-between px-4 bg-[#1a1a1a] border-b border-white/5 z-50">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => setSelectedStyleIndex(null)} color="white" smaller={true} />
          <div className="w-px h-6 bg-white/10 mx-1" />
          <h2 className="text-lg font-black tracking-tight hidden md:block">Letter {ld.letter} Studio</h2>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl items-center gap-1">
          <button 
            onClick={() => setToolMode('color')} 
            className={`px-4 py-1.5 rounded-lg font-black text-sm transition-all ${toolMode === 'color' ? 'bg-white text-black shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            ✏️ Color
          </button>
          <button 
            onClick={() => setToolMode('fill')} 
            className={`px-4 py-1.5 rounded-lg font-black text-sm transition-all ${toolMode === 'fill' ? 'bg-emerald-400 text-black shadow-md' : 'text-white/50 hover:text-white'}`}
          >
            🪣 Fill
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={undo} className="p-2 hover:bg-white/5 rounded-lg active:scale-90 transition-transform">
            <LucideUndo size={22} className={historyIndex <= 0 ? 'opacity-20' : ''} />
          </button>
          <button onClick={clear} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg active:scale-90 transition-transform">
            <LucideTrash2 size={22} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2" />
          <button onClick={() => awardStars('color', 3) || setShowCelebration(true)} className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
            <LucideCheck size={20} /> Finish
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        {/* Left Toolbar - Brushes */}
        <div className="w-20 md:w-24 bg-[#1a1a1a] border-r border-white/5 flex flex-col items-center py-4 gap-4 z-40">
          {toolMode === 'color' && Object.entries(BRUSH_CONFIGS).map(([id, cfg]) => (
            <motion.button
              key={id}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setBrushType(id as BrushType); playPop(); }}
              className={`flex flex-col items-center gap-1 p-2 rounded-2xl w-16 md:w-20 transition-all ${brushType === id ? 'bg-white/10' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl ${brushType === id ? 'bg-white text-black' : 'bg-white/5'}`}>
                {cfg.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter">{cfg.name}</span>
            </motion.button>
          ))}
          
          <div className="mt-auto flex flex-col items-center gap-2 py-4 border-t border-white/5 w-full">
            <button onClick={() => setZoom(z => Math.min(z + 0.25, 4))} className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/50 hover:text-white">
              <LucideZoomIn size={20} />
            </button>
            <div className="text-[10px] font-black text-amber-500">{Math.round(zoom * 100)}%</div>
            <button onClick={() => {
              setZoom(z => {
                const newZ = Math.max(z - 0.25, 1);
                if (newZ === 1) setPan({ x: 0, y: 0 });
                return newZ;
              });
            }} className="p-2 rounded-xl hover:bg-white/10 transition-all text-white/50 hover:text-white">
              <LucideZoomOut size={20} />
            </button>
          </div>
        </div>

        {/* Center Canvas Area */}
        <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
          <motion.div 
            className="relative w-full max-w-3xl aspect-square bg-white rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden cursor-crosshair"
            animate={{ scale: zoom, x: pan.x, y: pan.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {croppedImage && (
              <>
                <img src={croppedImage} className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none" />
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={endDrawing}
                  onMouseLeave={endDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={endDrawing}
                  className="absolute inset-0 w-full h-full touch-none z-10"
                />
                <img src={croppedImage} className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none mix-blend-multiply z-20" />
              </>
            )}
          </motion.div>

          {/* Pan Slide Bars */}
          {zoom > 1 && (
            <>
              {/* Vertical Pan (Y-axis) */}
              <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-1/2 z-50 flex items-center justify-center">
                <input 
                  type="range" 
                  min={-300 * zoom} 
                  max={300 * zoom} 
                  value={-pan.y} 
                  onChange={(e) => setPan({ ...pan, y: -parseInt(e.target.value) })}
                  className="accent-amber-500 cursor-pointer"
                  style={{ transform: 'rotate(90deg)', width: '40vh' }}
                  title="Shift Up/Down"
                />
              </div>

              {/* Horizontal Pan (X-axis) */}
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 w-1/2 z-50 flex items-center justify-center">
                <input 
                  type="range" 
                  min={-300 * zoom} 
                  max={300 * zoom} 
                  value={pan.x} 
                  onChange={(e) => setPan({ ...pan, x: parseInt(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                  title="Shift Left/Right"
                />
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Settings & Palettes */}
        <div className="w-64 bg-[#1a1a1a] border-l border-white/5 p-6 flex flex-col gap-8 z-40 overflow-y-auto no-scrollbar">
          {toolMode === 'color' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-white/30 font-black text-xs uppercase tracking-widest">
                <LucidePalette size={14} /> Brush Settings
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-white/60">
                    <span>Size</span>
                    <span>{brushSettings[brushType].size}px</span>
                  </div>
                  <input 
                    type="range" min="2" max="150" value={brushSettings[brushType].size}
                    onChange={(e) => setBrushSettings({...brushSettings, [brushType]: {...brushSettings[brushType], size: parseInt(e.target.value)}})}
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase text-white/60">
                    <span>Opacity</span>
                    <span>{Math.round(brushSettings[brushType].opacity * 100)}%</span>
                  </div>
                  <input 
                    type="range" min="0.05" max="1" step="0.01" value={brushSettings[brushType].opacity}
                    onChange={(e) => setBrushSettings({...brushSettings, [brushType]: {...brushSettings[brushType], opacity: parseFloat(e.target.value)}})}
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-white/30 font-black text-xs uppercase tracking-widest">Palettes</div>
              <div className="flex items-center gap-1">
                <button onClick={prevPalette} className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
                  <LucideChevronLeft size={16} />
                </button>
                <button onClick={nextPalette} className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
                  <LucideChevronRight size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center py-2 px-3 bg-white/5 rounded-xl">
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">{currentPaletteName}</span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {PALETTES[currentPaletteName].map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setColor(c); playPop(); }}
                  className={`aspect-square rounded-xl border-2 transition-all ${color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-80'}`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <CelebrationScreen active={showCelebration} stars={3} message="Amazing Work! 🎨"
        onContinue={() => navigate(-1)} />
    </div>
  );
}
