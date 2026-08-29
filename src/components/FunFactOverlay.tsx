import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Brain, Calculator } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORY_GRADIENTS } from '../config/themes';

export default function FunFactOverlay() {
  const { showFunFact, closeFunFact } = useStore();

  if (!showFunFact) return null;

  const { funFact } = showFunFact;

  return (
    <AnimatePresence>
      {showFunFact && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-br ${CATEGORY_GRADIENTS[funFact.category] ?? 'from-indigo-500 to-purple-700'} shadow-2xl overflow-y-auto max-h-[90vh]`}
            initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
            animate={{ scale: 1, rotateY: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <button
              onClick={closeFunFact}
              className="absolute top-3 right-3 text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <motion.div
              className="text-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              style={{ fontSize: 64 }}
            >
              {funFact.emoji}
            </motion.div>

            <motion.h2
              className="text-white font-head text-3xl font-black text-center mb-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {showFunFact.answer}
            </motion.h2>

            <motion.p
              className="text-white/70 text-xs text-center uppercase tracking-widest mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {funFact.category}
            </motion.p>

            <motion.div
              className="bg-white/20 rounded-2xl p-4 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-white font-semibold text-sm leading-relaxed">
                {funFact.funFact}
              </p>
            </motion.div>

            {funFact.formula && (
               <motion.div
                className="bg-black/20 rounded-2xl p-4 mb-3 border border-white/10"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
               >
                 <p className="text-white/60 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                   <Calculator size={12} /> Formula
                 </p>
                 <p className="text-white font-mono text-center py-1">{funFact.formula}</p>
               </motion.div>
            )}

            {funFact.criticalThinking && (
               <motion.div
                className="bg-amber-500/20 rounded-2xl p-4 mb-3 border border-amber-500/30"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}
               >
                 <p className="text-amber-200 text-[10px] font-bold uppercase mb-1 flex items-center gap-1">
                   <Brain size={12} /> Why it matters today
                 </p>
                 <p className="text-white text-sm italic">{funFact.criticalThinking}</p>
               </motion.div>
            )}

            <motion.div
              className="bg-white/10 rounded-2xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-white/60 text-xs font-bold uppercase mb-1">Did you know?</p>
              <p className="text-white text-sm leading-relaxed">{funFact.didYouKnow}</p>
            </motion.div>

            <div className="flex gap-2 mt-4">
              {funFact.deepDiveUrl && (
                <motion.a
                  href={funFact.deepDiveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl transition-all text-center flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.96 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
                >
                  <ExternalLink size={18} /> Deep Dive
                </motion.a>
              )}
              <motion.button
                onClick={closeFunFact}
                className={`${funFact.deepDiveUrl ? 'flex-1' : 'w-full'} bg-white/20 hover:bg-white/30 text-white font-bold py-3 rounded-2xl transition-all`}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                Awesome! ⭐
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
