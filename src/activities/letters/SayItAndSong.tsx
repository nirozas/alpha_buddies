// Stub activities for L3, L6 – reuse the same engaging template
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';

export function SayItOutLoud() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;
  const [listening, setListening] = useState(false);
  const [done, setDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const handleMic = () => {
    if (done || listening) return;
    setListening(true);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        // Check if they said the letter, the phoneme, or the example word
        if (
          transcript.includes(ld.letter.toLowerCase()) || 
          transcript.includes(ld.phoneme.toLowerCase()) ||
          transcript.includes(ld.exampleWord.toLowerCase())
        ) {
          recognition.stop();
          setListening(false);
          setDone(true);
          awardStars(`${ld.letter}-say-it-out-loud`, 3);
          incrementActivity(`${ld.letter}-say-it-out-loud`);
          setTimeout(() => setShowCelebration(true), 400);
        } else {
          // They said something else, but we can still encourage them
          setListening(false);
          // Optional: Add a "Try again!" state here, but for kids it's often better to just let them retry.
        }
      };

      recognition.onerror = () => {
        // Fallback or handle error (e.g., no mic permission)
        setListening(false);
      };

      recognition.onend = () => setListening(false);

      recognition.start();
    } else {
      // Fallback for browsers without SpeechRecognition
      setTimeout(() => {
        setListening(false);
        setDone(true);
        awardStars(`${ld.letter}-say-it-out-loud`, 3);
        incrementActivity(`${ld.letter}-say-it-out-loud`);
        setTimeout(() => setShowCelebration(true), 400);
      }, 2000);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Say It Out Loud</h2>
        <div style={{ width: 56 }} />
      </div>
      <BuddyBear mood={done ? 'celebrating' : 'excited'} size={110}
        speech={done ? 'Amazing! You said it! 🎉' : `Say the letter "${ld.uppercase}"! It says "${ld.phoneme}"! 🎤`}
      />
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="my-6 rounded-3xl flex items-center justify-center shadow-2xl"
        style={{ width: 180, height: 180, background: ld.color }}
      >
        <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '8rem', color: 'white', lineHeight: 1 }}>
          {ld.uppercase}
        </span>
      </motion.div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        animate={listening ? { scale: [1, 1.15, 1], boxShadow: [`0 0 0 0 ${ld.color}50`, `0 0 0 20px ${ld.color}00`] } : {}}
        transition={listening ? { repeat: Infinity, duration: 0.8 } : {}}
        onClick={handleMic}
        className="rounded-full flex items-center justify-center shadow-2xl"
        style={{ width: 120, height: 120, background: listening ? '#EF4444' : ld.color, border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '3.5rem' }}>{listening ? '🔴' : '🎤'}</span>
      </motion.button>
      <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color, marginTop: 12, fontSize: '1.1rem' }}>
        {listening ? 'Listening... keep going!' : 'Tap and say the letter!'}
      </p>
      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message="Great voice! 🎤⭐"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}

export function AlphabetSong() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleLetterTap = (l: string) => {
    setHighlighted(l);
    const tapped = [...new Set([...(highlighted ? [highlighted] : []), l])];
    if (tapped.length >= 5 && !done) {
      setDone(true);
      awardStars(`${ld.letter}-alphabet-song`, 3);
      incrementActivity(`${ld.letter}-alphabet-song`);
      setTimeout(() => setShowCelebration(true), 300);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8" style={{ background: ld.bgColor }}>
      <div className="w-full flex items-center justify-between p-4">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.1rem', color: ld.color }}>Alphabet Song</h2>
        <div style={{ width: 56 }} />
      </div>
      <BuddyBear mood="excited" size={90} speech="Tap any letter to sing it! 🎵 A B C D E F G..." />
      <div className="grid grid-cols-6 gap-2 px-4 mt-4 w-full max-w-sm">
        {ALPHABET.map((l, i) => (
          <motion.button
            key={l}
            whileTap={{ scale: 0.85 }}
            animate={highlighted === l ? { scale: [1, 1.3, 1.1], rotate: [0, -10, 10, 0] } : { y: [0, -2, 0] }}
            transition={highlighted === l ? { duration: 0.4 } : { repeat: Infinity, duration: 2 + (i % 5) * 0.2, ease: 'easeInOut' }}
            onClick={() => handleLetterTap(l)}
            className="aspect-square rounded-xl flex items-center justify-center shadow-sm"
            style={{ background: highlighted === l ? ld.color : 'white', border: `2px solid ${ld.color}30` }}
          >
            <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1rem', color: highlighted === l ? 'white' : ld.color }}>
              {l}
            </span>
          </motion.button>
        ))}
      </div>
      <p className="mt-4" style={{ fontFamily: 'Nunito', fontWeight: 700, color: ld.color }}>
        🎵 A B C D E F G... Tap 5 letters to complete! 🎵
      </p>
      {showFact && (
        <div className="p-4 w-full max-w-sm mt-4">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
      <CelebrationScreen active={showCelebration} stars={3} message="Alphabet superstar! 🎵⭐"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }} />
    </div>
  );
}
