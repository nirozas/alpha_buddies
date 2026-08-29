import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX, Zap, ZapOff, Trash2, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { AGE_THEMES } from '../config/themes';

export default function SettingsScreen() {
  const { player, setScreen, toggleSound, toggleReducedMotion, resetPlayer, soundEnabled, reducedMotion, updatePlayer } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [editName, setEditName] = useState(player?.name ?? '');

  if (!player) return null;

  const theme = AGE_THEMES[player.ageGroup] ?? AGE_THEMES['9-11'];

  return (
    <div className="bg-app min-h-dvh flex flex-col px-5 py-8 gap-5 max-w-md mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen('dashboard')}
          className="p-2 rounded-xl" style={{ background: 'var(--c-surface)', color: 'var(--c-text)' }}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-head text-app text-2xl font-black" style={{ fontFamily: 'var(--font-head)' }}>
          Settings ⚙️
        </h1>
      </div>

      {/* Profile */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--c-surface)' }}>
        <h2 className="font-bold text-app">Profile</h2>
        <div>
          <label className="text-muted text-xs font-semibold uppercase mb-1 block">Your Name</label>
          <div className="flex gap-2">
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-app font-bold outline-none border-2"
              style={{ background: 'var(--c-card)', borderColor: 'var(--c-accent)', color: 'var(--c-text)' }}
            />
            <button
              onClick={() => updatePlayer({ name: editName.trim() || player.name })}
              className="px-4 py-3 rounded-xl font-bold text-white text-sm"
              style={{ background: 'var(--c-accent)' }}
            >Save</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-app text-sm font-semibold">Age Group</span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--c-accent), var(--c-accent2))' }}>
            {theme.emoji} {player.ageGroup} · {theme.label}
          </span>
        </div>
      </div>

      {/* Preferences */}
      <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'var(--c-surface)' }}>
        <h2 className="font-bold text-app">Preferences</h2>
        {[
          { label: 'Sound Effects', sub: 'Toggle game sounds', enabled: soundEnabled, onIcon: <Volume2 size={18}/>, offIcon: <VolumeX size={18}/>, toggle: toggleSound },
          { label: 'Animations', sub: 'Reduce motion for accessibility', enabled: !reducedMotion, onIcon: <Zap size={18}/>, offIcon: <ZapOff size={18}/>, toggle: toggleReducedMotion },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ color: 'var(--c-accent)' }}>{row.enabled ? row.onIcon : row.offIcon}</div>
              <div>
                <p className="text-app text-sm font-semibold">{row.label}</p>
                <p className="text-muted text-xs">{row.sub}</p>
              </div>
            </div>
            <motion.button
              onClick={row.toggle}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-7 rounded-full relative transition-colors"
              style={{ background: row.enabled ? 'var(--c-accent)' : 'var(--c-card)' }}
            >
              <motion.div
                className="absolute top-1 w-5 h-5 bg-white rounded-full"
                animate={{ left: row.enabled ? '26px' : '4px' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </motion.button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--c-surface)', border: '2px solid var(--c-error, #f87171)22' }}>
        <h2 className="font-bold text-app mb-3">Danger Zone</h2>
        <button
          onClick={() => setShowConfirm(true)}
          className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-xl w-full justify-center"
          style={{ background: '#f8717122', color: '#f87171' }}
        >
          <Trash2 size={16} /> Reset All Progress
        </button>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4"
              style={{ background: 'var(--c-card)' }}
            >
              <AlertTriangle size={40} style={{ color: '#f87171' }} className="mx-auto" />
              <h3 className="font-head text-app text-xl font-black text-center" style={{ fontFamily: 'var(--font-head)' }}>
                Reset everything?
              </h3>
              <p className="text-muted text-sm text-center">Your name, stars, and word collection will be cleared. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 rounded-2xl font-bold border-2"
                  style={{ borderColor: 'var(--c-card)', color: 'var(--c-text)' }}>
                  Cancel
                </button>
                <button onClick={() => { resetPlayer(); setShowConfirm(false); }}
                  className="flex-1 py-3 rounded-2xl font-bold text-white"
                  style={{ background: '#f87171' }}>
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
