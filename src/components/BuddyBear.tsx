import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BuddyMood } from '../../types';
import { useAudio } from '../hooks/useAudio';

interface Props {
  mood?: BuddyMood;
  speech?: string;
  size?: number;
  className?: string;
}

const moodFaces: Record<BuddyMood, { eyes: string; mouth: string; ears: string }> = {
  idle:        { eyes: '😊', mouth: '', ears: '' },
  happy:       { eyes: '😄', mouth: '', ears: '' },
  excited:     { eyes: '🤩', mouth: '', ears: '' },
  thinking:    { eyes: '🤔', mouth: '', ears: '' },
  celebrating: { eyes: '🥳', mouth: '', ears: '' },
};

// Buddy the Bear — pure CSS/SVG bear face with mood variants
export function BuddyBear({ mood = 'idle', speech, size = 120, className = '' }: Props) {
  const { speak } = useAudio();
  
  useEffect(() => {
    if (speech) {
      // Clean up emojis from speech before sending to TTS
      const cleanSpeech = speech.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
      speak(cleanSpeech);
    }
  }, [speech, speak]);

  const moodEmoji = moodFaces[mood].eyes;

  const idle = {
    y: [0, -6, 0],
    transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
  };

  const celebrating = {
    rotate: [-5, 5, -5, 5, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: { duration: 0.6, repeat: 2 },
  };

  const anim = mood === 'celebrating' ? celebrating : idle;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AnimatePresence>
        {speech && (
          <motion.div
            key={speech}
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative bg-white/90 backdrop-blur-md border-2 border-orange-100 rounded-2xl px-5 py-3 shadow-xl max-w-xs"
            style={{ fontFamily: 'Nunito, sans-serif', color: '#1C1917' }}
          >
            <p className="text-sm md:text-base font-bold leading-tight italic">"{speech}"</p>
            {/* Speech bubble tail pointing right to the bear */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -right-3 w-0 h-0 
                         border-t-[10px] border-t-transparent 
                         border-b-[10px] border-b-transparent 
                         border-l-[12px] border-l-white/90" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div animate={anim} style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
        {/* Bear body */}
        <svg viewBox="0 0 120 120" width={size} height={size}>
          {/* Ears */}
          <circle cx="25" cy="28" r="18" fill="#F97316" />
          <circle cx="95" cy="28" r="18" fill="#F97316" />
          <circle cx="25" cy="28" r="11" fill="#FED7AA" />
          <circle cx="95" cy="28" r="11" fill="#FED7AA" />
          {/* Head */}
          <circle cx="60" cy="65" r="48" fill="#F97316" />
          {/* Face highlight */}
          <circle cx="60" cy="74" r="28" fill="#FED7AA" />
          {/* Eyes */}
          {mood === 'thinking' ? (
            <>
              <circle cx="45" cy="55" r="7" fill="#1C1917" />
              <circle cx="75" cy="55" r="7" fill="#1C1917" />
              <circle cx="47" cy="53" r="2.5" fill="white" />
              <circle cx="77" cy="53" r="2.5" fill="white" />
              <path d="M38 46 Q45 42 52 46" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M68 46 Q75 42 82 46" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : mood === 'excited' || mood === 'celebrating' ? (
            <>
              <text x="36" y="62" fontSize="16" textAnchor="middle">⭐</text>
              <text x="84" y="62" fontSize="16" textAnchor="middle">⭐</text>
            </>
          ) : (
            <>
              <circle cx="45" cy="57" r="7" fill="#1C1917" />
              <circle cx="75" cy="57" r="7" fill="#1C1917" />
              <circle cx="47" cy="55" r="2.5" fill="white" />
              <circle cx="77" cy="55" r="2.5" fill="white" />
            </>
          )}
          {/* Nose */}
          <ellipse cx="60" cy="71" rx="6" ry="4" fill="#1C1917" />
          {/* Mouth */}
          <path d="M50 78 Q60 85 70 78" stroke="#1C1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="34" cy="70" r="8" fill="#FB923C" opacity="0.4" />
          <circle cx="86" cy="70" r="8" fill="#FB923C" opacity="0.4" />
        </svg>
      </motion.div>
    </div>
  );
}
