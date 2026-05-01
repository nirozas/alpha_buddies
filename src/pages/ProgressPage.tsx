import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../constants/letters';
import { NUMBERS_DATA } from '../constants/numbers';
import { BackButton, StarRating } from '../components/SharedComponents';
import { useStore } from '../store';

export function ProgressPage() {
  const navigate = useNavigate();
  const { progress, resetProgress, settings, updateSettings } = useStore();
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(!settings.parentPin);
  const [pinError, setPinError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const totalLetters = Object.keys(progress.lettersCompleted).length;
  const totalNumbers = Object.keys(progress.numbersCompleted).length;
  const totalStars = Object.values(progress.starsEarned).reduce((s, v) => s + v, 0);
  const totalMinutes = Math.round(progress.totalPlaytime / 60);

  const handlePin = () => {
    if (pin === settings.parentPin) {
      setUnlocked(true); setPinError(false);
    } else {
      setPinError(true); setPin('');
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4) {
      updateSettings({ parentPin: pin });
      setUnlocked(true);
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gradient-home gap-6 p-8">
        <span className="text-6xl">🔒</span>
        <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '2rem', color: '#6C3CE1' }}>Parents Only</h1>
        <p style={{ fontFamily: 'Nunito', color: '#78716C', textAlign: 'center' }}>Enter your 4-digit PIN to view progress</p>
        <div className="flex gap-3">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl font-bold"
              style={{ borderColor: '#6C3CE1', background: 'white', color: '#6C3CE1', fontFamily: 'Nunito' }}>
              {pin[i] ? '●' : ''}
            </div>
          ))}
        </div>
        {pinError && <p style={{ color: '#EF4444', fontFamily: 'Nunito', fontWeight: 700 }}>Wrong PIN — try again!</p>}
        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {[1,2,3,4,5,6,7,8,9,'',0,'⌫'].map((k, i) => (
            <motion.button key={i} whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (k === '⌫') setPin(p => p.slice(0, -1));
                else if (k !== '' && pin.length < 4) setPin(p => p + k);
              }}
              className="w-16 h-16 rounded-2xl shadow-md text-xl font-bold"
              style={{ background: k === '' ? 'transparent' : 'white', border: k === '' ? 'none' : '2px solid #E7E5E4', fontFamily: 'Nunito', color: '#1C1917', cursor: k === '' ? 'default' : 'pointer' }}
            >{k}</motion.button>
          ))}
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={pin.length === 4 ? handlePin : handleSetPin}
          className="btn-primary" style={{ background: '#6C3CE1', color: 'white', minWidth: 200 }}>
          {settings.parentPin ? 'Unlock 🔓' : 'Set PIN & Enter 🔒'}
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/')}
          style={{ fontFamily: 'Nunito', color: '#6C3CE1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Back to Home
        </motion.button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh" style={{ background: '#FFFBF5' }}>
      <div className="gradient-letters px-4 pt-6 pb-8 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-1">
          <BackButton onClick={() => navigate('/')} color="#6C3CE1" />
          <h1 style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.8rem', color: 'white' }}>
            📊 Progress
          </h1>
        </div>
        <p style={{ fontFamily: 'Nunito', color: '#EDE9FB', fontWeight: 600, paddingLeft: 4 }}>
          {settings.childName}'s Learning Journey
        </p>
      </div>

      <div className="p-4 space-y-5 max-w-2xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Letters', value: `${totalLetters}/26`, color: '#6C3CE1', emoji: '🔤' },
            { label: 'Numbers', value: `${totalNumbers}/10`, color: '#0D9E75', emoji: '🔢' },
            { label: 'Stars', value: totalStars, color: '#FBBF24', emoji: '⭐' },
            { label: 'Minutes', value: totalMinutes, color: '#F97316', emoji: '⏱️' },
          ].map(stat => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="card p-3 flex flex-col items-center gap-1 text-center">
              <span className="text-2xl">{stat.emoji}</span>
              <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.3rem', color: stat.color }}>{stat.value}</span>
              <span style={{ fontFamily: 'Nunito', fontSize: '0.7rem', color: '#78716C' }}>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Letters grid */}
        <div className="card p-4">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: '#1C1917', marginBottom: 12 }}>
            🔤 Letters Progress
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {LETTERS_DATA.map(ld => {
              const done = !!progress.lettersCompleted[ld.letter];
              return (
                <div key={ld.letter} className="aspect-square rounded-xl flex items-center justify-center"
                  style={{ background: done ? ld.color : '#F5F5F4', border: `2px solid ${done ? ld.color : '#E7E5E4'}` }}>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '0.9rem', color: done ? 'white' : '#A8A29E' }}>
                    {ld.letter}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Numbers grid */}
        <div className="card p-4">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: '#1C1917', marginBottom: 12 }}>
            🔢 Numbers Progress
          </h2>
          <div className="flex gap-3 flex-wrap">
            {NUMBERS_DATA.map(nd => {
              const done = !!progress.numbersCompleted[nd.digit];
              return (
                <div key={nd.digit} className="rounded-2xl flex flex-col items-center justify-center gap-1"
                  style={{ width: 56, height: 56, background: done ? nd.color : '#F5F5F4', border: `2px solid ${done ? nd.color : '#E7E5E4'}` }}>
                  <span style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: '1.4rem', color: done ? 'white' : '#A8A29E' }}>
                    {nd.digit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="card p-4 space-y-4">
          <h2 style={{ fontFamily: 'Nunito', fontWeight: 800, fontSize: '1.2rem', color: '#1C1917' }}>⚙️ Settings</h2>
          
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: 'Nunito', fontWeight: 700 }}>Child's Name</span>
            <input
              defaultValue={settings.childName}
              onChange={e => updateSettings({ childName: e.target.value })}
              className="rounded-xl px-3 py-1 border-2 text-center"
              style={{ borderColor: '#6C3CE1', fontFamily: 'Nunito', fontWeight: 700, width: 140 }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Nunito', fontWeight: 700 }}>Voice &amp; SFX</span>
              <span>{Math.round(settings.volume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.1" 
              value={settings.volume} 
              onChange={e => updateSettings({ volume: parseFloat(e.target.value) })}
              style={{ accentColor: '#6C3CE1' }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span style={{ fontFamily: 'Nunito', fontWeight: 700 }}>Background Music</span>
              <span>{Math.round(settings.musicVolume * 100)}%</span>
            </div>
            <input 
              type="range" min="0" max="1" step="0.1" 
              value={settings.musicVolume} 
              onChange={e => updateSettings({ musicVolume: parseFloat(e.target.value) })}
              style={{ accentColor: '#0D9E75' }}
            />
          </div>
        </div>

        {/* Reset */}
        {confirmReset ? (
          <div className="card p-4 flex flex-col items-center gap-3" style={{ border: '2px solid #EF4444' }}>
            <p style={{ fontFamily: 'Nunito', fontWeight: 700, color: '#EF4444', textAlign: 'center' }}>
              Are you sure? This will erase all progress! 😢
            </p>
            <div className="flex gap-3">
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { resetProgress(); setConfirmReset(false); }}
                className="rounded-2xl px-5 py-2" style={{ background: '#EF4444', color: 'white', fontFamily: 'Nunito', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                Yes, Reset
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => setConfirmReset(false)}
                className="rounded-2xl px-5 py-2" style={{ background: 'white', border: '2px solid #E7E5E4', fontFamily: 'Nunito', fontWeight: 700, cursor: 'pointer' }}>
                Cancel
              </motion.button>
            </div>
          </div>
        ) : (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setConfirmReset(true)}
            className="w-full rounded-2xl py-3 text-center font-bold"
            style={{ background: 'white', border: '2px solid #EF4444', color: '#EF4444', fontFamily: 'Nunito', fontSize: '1rem', cursor: 'pointer' }}>
            🗑️ Reset Progress
          </motion.button>
        )}
      </div>
    </div>
  );
}
