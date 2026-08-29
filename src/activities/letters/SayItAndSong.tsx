// Stub activities for L3, L6 – reuse the same engaging template
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { LETTERS_DATA } from '../../constants/letters';
import { BackButton, CelebrationScreen, FunFactCard, ProgressBar } from '../../components/SharedComponents';
import { BuddyBear } from '../../components/BuddyBear';
import { useStore } from '../../store';
import { useAudio } from '../../hooks/useAudio';
import { LETTER_SONGS } from '../../constants/letterSongs';

export function SayItOutLoud() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const { speak, playDing } = useAudio();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;

  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const handleWordTap = (wordObj: { word: string; image: string }) => {
    const word = wordObj.word.toLowerCase();
    if (completedWords.includes(word)) {
      speak(word);
      return;
    }
    
    setActiveWord(word);
    speak(`Can you say ${word}?`);
    
    // Start listening after Buddy finishes speaking (roughly)
    setTimeout(() => {
      startListening(word);
    }, 1500);
  };

  const startListening = (targetWord: string) => {
    if (!SpeechRecognition) {
      // Fallback for no speech recognition
      setTimeout(() => {
        handleSuccess(targetWord);
      }, 1500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    setListening(true);
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      
      // If we are looking for the letter sound
      if (targetWord === ld.letter.toLowerCase()) {
        if (transcript.includes(targetWord) || transcript.includes(ld.phoneme.replace(/\//g, ''))) {
          handleSuccess(targetWord);
        }
      } 
      // If we are looking for a word
      else {
        if (transcript.includes(targetWord)) {
          handleSuccess(targetWord);
        }
      }
      
      setListening(false);
      setActiveWord(null);
    };

    recognition.onerror = () => {
      setListening(false);
      setActiveWord(null);
    };

    recognition.onend = () => {
      setListening(false);
      setActiveWord(null);
    };
  };

  const handleSuccess = (word: string) => {
    playDing();
    const newCompleted = [...completedWords, word];
    setCompletedWords(newCompleted);
    
    if (newCompleted.length >= 8) { // Complete after 8 words to avoid exhaustion
      awardStars(`${ld.letter}-say-it-out-loud`, 3);
      incrementActivity(`${ld.letter}-say-it-out-loud`);
      setTimeout(() => setShowCelebration(true), 1000);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-12 bg-transparent relative z-10">
      <div className="w-full flex items-center justify-between p-4 max-w-5xl">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        
        <div className="flex-1 max-w-[200px] mx-4">
          <ProgressBar value={completedWords.length} max={8} color={ld.color} />
          <p className="text-[10px] font-black uppercase text-center mt-1 opacity-60">Words Done: {completedWords.length}/8</p>
        </div>

        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.25rem', color: ld.color }}>Say It Out Loud</h2>
      </div>

      <BuddyBear mood={listening ? 'thinking' : 'excited'} size={90}
        speech={
          activeWord ? `I'm listening for "${activeWord}"...` : 
          completedWords.length === 0 ? `First, say the letter sound! Then tap the cards below. 🎤` :
          completedWords.length >= 8 ? `You did it! You're amazing! 🌟` :
          `Great job! Tap another card! 🎤`
        }
      />

      {/* Main Letter Sound Card */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleWordTap({ word: ld.letter, image: ld.exampleImage })}
        className={`mt-4 mb-8 p-8 rounded-[3rem] shadow-2xl border-8 flex flex-col items-center gap-4 transition-all ${
          completedWords.includes(ld.letter.toLowerCase()) ? 'bg-green-100 border-green-500' : 
          activeWord === ld.letter.toLowerCase() ? 'bg-yellow-100 border-yellow-500 ring-8 ring-yellow-200' : 
          'bg-white border-white'
        }`}
        style={{ width: 280 }}
      >
        <div 
          className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-inner relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ld.color}, ${ld.color}dd)` }}
        >
          {/* Decorative shine */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 skew-y-[-10deg] -translate-y-1/2" />
          <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '6rem', color: 'white', filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))' }}>
            {ld.uppercase}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-2xl font-black" style={{ color: ld.color }}>Sound: {ld.phoneme}</p>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Tap to Say Sound</p>
        </div>
        {activeWord === ld.letter.toLowerCase() && (
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="mt-2 text-3xl">🎤</motion.div>
        )}
      </motion.button>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-4 w-full max-w-4xl">
        {ld.objects.map((obj, i) => {
          const word = obj.word;
          const isCompleted = completedWords.includes(word.toLowerCase());
          const isActive = activeWord === word.toLowerCase();

          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleWordTap(obj)}
              className={`relative p-4 rounded-3xl shadow-lg border-4 flex flex-col items-center gap-2 transition-all ${
                isCompleted ? 'bg-green-100 border-green-400' : 
                isActive ? 'bg-yellow-100 border-yellow-400 ring-4 ring-yellow-200' : 
                'bg-white border-white'
              }`}
            >
              {isCompleted && (
                <div className="absolute top-2 right-2 text-xl">✅</div>
              )}
              {isActive && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute top-2 right-2 text-xl"
                >
                  🎤
                </motion.div>
              )}
              
              <img 
                src={obj.image}
                alt={word}
                className="w-20 h-20 object-contain"
                style={{ filter: isCompleted ? 'grayscale(0)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
              <p className="font-black text-lg" style={{ color: isCompleted ? '#15803d' : '#444' }}>
                <span style={{ color: 'red' }}>{word[0]}</span>{word.slice(1)}
              </p>
            </motion.button>
          );
        })}
      </div>

      <CelebrationScreen
        active={showCelebration}
        stars={3}
        message="You have a great voice! 🎉🎤"
        onContinue={() => navigate(-1)}
      />
    </div>
  );
}

export function AlphabetSong() {
  const { letter } = useParams<{ letter: string }>();
  const navigate = useNavigate();
  const { awardStars, incrementActivity } = useStore();
  const ld = LETTERS_DATA.find(l => l.letter === letter?.toUpperCase())!;
  const songs = LETTER_SONGS[ld.letter] || [];
  
  const [activeSong, setActiveSong] = useState<LetterSong | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const handleComplete = () => {
    awardStars(`${ld.letter}-alphabet-song`, 3);
    incrementActivity(`${ld.letter}-alphabet-song`);
    setShowCelebration(true);
  };

  return (
    <div className="min-h-dvh flex flex-col items-center pb-8 bg-transparent relative z-10">
      <div className="w-full flex items-center justify-between p-4 max-w-5xl relative z-10">
        <BackButton onClick={() => navigate(-1)} color={ld.color} />
        <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.5rem', color: ld.color }}>Letter {ld.letter} Songs</h2>
        <div style={{ width: 56 }} />
      </div>

      <div className="w-full max-w-4xl px-4 flex-1 flex flex-col items-center justify-center gap-6">
        <BuddyBear mood="excited" size={90} speech={`Choose a video to sing about the letter ${ld.letter}! 🎵`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {songs.map((song, i) => (
            <motion.button
              key={song.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSong(song)}
              className="group relative flex flex-col rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-8 transition-all"
              style={{ borderColor: ld.color }}
            >
              {/* High Quality Thumbnail */}
              <div className="aspect-video w-full relative overflow-hidden">
                <img 
                  src={`https://img.youtube.com/vi/${song.id}/hqdefault.jpg`} 
                  alt="Song preview"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform group-hover:scale-125 transition-transform">
                    <div className="text-3xl" style={{ color: ld.color, marginLeft: '4px' }}>▶️</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white w-full">
                <p className="font-black text-xl uppercase" style={{ color: ld.color }}>Play Song Option {i + 1}</p>
                <p className="text-xs font-bold opacity-40">{song.source} Education</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Full Screen Player Modal */}
      <AnimatePresence>
        {activeSong && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4"
          >
            {/* Top Bar */}
            <div className="absolute top-0 w-full p-4 flex justify-between items-center z-[1010]">
              <div className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/30 text-white font-black text-lg">
                Singing Letter {ld.letter}
              </div>
              <button 
                onClick={() => setActiveSong(null)}
                className="bg-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-white hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>

            {/* Restricted Video Container */}
            <div className="w-full max-w-5xl aspect-video relative rounded-[2rem] overflow-hidden border-4 border-white/20 bg-zinc-900 shadow-[0_0_80px_rgba(255,255,255,0.1)]">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube-nocookie.com/embed/${activeSong.id}?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=1&playsinline=1&iv_load_policy=3&fs=0&color=white`}
                title="Letter Song"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                className="w-full h-full"
              />
              
              {/* BOTTOM SHIELD: Overlay to block YouTube logo and "More Videos" links */}
              <div 
                className="absolute bottom-0 right-0 h-16 w-48 z-[1005] cursor-default pointer-events-auto bg-transparent"
                title="Safe Player"
                onClick={(e) => e.stopPropagation()}
              />
              <div 
                className="absolute top-0 right-0 h-16 w-16 z-[1005] cursor-default pointer-events-auto bg-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 3 }}
              onClick={() => { setActiveSong(null); handleComplete(); }}
              className="mt-8 px-12 py-4 rounded-full bg-white text-black font-black text-xl shadow-2xl border-4 border-zinc-800 hover:scale-105 active:scale-95 transition-transform"
            >
              Done Singing! 🎤🌟
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <CelebrationScreen 
        active={showCelebration} 
        stars={3} 
        message="Music Master! 🎵✨"
        onContinue={() => { setShowCelebration(false); setShowFact(true); }}
      />

      {showFact && (
        <div className="absolute inset-0 flex items-center justify-center p-6 z-[200] bg-black/40 backdrop-blur-md">
          <FunFactCard fact={ld.funFact} emoji={ld.exampleEmoji} onClose={() => navigate(-1)} />
        </div>
      )}
    </div>
  );
}
