import { motion } from 'framer-motion';
import type { MascotState } from '../types';

const EXPRESSIONS: Record<MascotState, string> = {
  idle: '🦉',
  happy: '🥳',
  thinking: '🤔',
  celebrating: '🎉',
  encouraging: '💪',
  surprised: '😲',
};

const VARIANTS: Record<MascotState, any> = {
  idle: { y: [0, -8, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } },
  happy: { rotate: [-5, 5, -5, 0], scale: [1, 1.15, 1], transition: { duration: 0.6 } },
  thinking: { rotate: [0, 10, 0], transition: { duration: 1.2, repeat: Infinity } },
  celebrating: { scale: [1, 1.3, 1], rotate: [-10, 10, -10, 0], transition: { duration: 0.5 } },
  encouraging: { y: [0, -12, 0], transition: { duration: 0.4, repeat: 2 } },
  surprised: { scale: [1, 1.25, 1], transition: { duration: 0.3 } },
};

interface Props { state?: MascotState; size?: number; label?: string }

export default function Mascot({ state = 'idle', size = 80, label }: Props) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={VARIANTS[state]}
        style={{ fontSize: size, lineHeight: 1, cursor: 'default', userSelect: 'none' }}
        title="Lexie the Owl"
      >
        {EXPRESSIONS[state]}
      </motion.div>
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-head text-center text-sm font-bold"
          style={{ color: 'var(--c-accent)', maxWidth: 240 }}
        >
          {label}
        </motion.p>
      )}
    </div>
  );
}
