import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export function HomePage() {
  const navigate = useNavigate();
  const { settings } = useStore();

  return (
    <div 
      className="relative min-h-dvh w-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* 
        We use the exact image as the background. 
        It should be saved as 'forest-home.png' in the public folder.
        We use object-cover to make sure it fills the screen.
      */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: "url('/forest-home.png')" }}
      />

      {/* HEADER HUD (Logo and Parents button) */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-start z-50 pointer-events-none">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="pointer-events-auto cursor-pointer drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: 'Nunito', fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'white', lineHeight: 1.1, WebkitTextStroke: '2px #6C3CE1' }}
        >
          Alpha<span style={{ color: '#F97316', WebkitTextStroke: '2px #C2410C' }}>Buddies</span>
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/progress')}
          className="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-full shadow-lg border-2 border-[#6C3CE1]"
          style={{ background: 'white', fontFamily: 'Nunito', fontWeight: 800, color: '#6C3CE1', fontSize: '1rem' }}
        >
          🔒 Parents
        </motion.button>
      </div>

      {/* 
        INTERACTIVE HITBOXES 
        These invisible buttons are positioned over the painted signs in the image.
      */}
      <div className="absolute inset-0 z-10 w-full h-full max-w-7xl mx-auto relative flex">
        
        {/* Letters Hitbox (Left Half) */}
        <motion.button
          onClick={() => navigate('/letters')}
          className="w-1/2 h-full cursor-pointer"
          aria-label="Letters and Alphabet Fun"
        />

        {/* Numbers Hitbox (Right Half) */}
        <motion.button
          onClick={() => navigate('/numbers')}
          className="w-1/2 h-full cursor-pointer"
          aria-label="Numbers and Counting Adventure"
        />

        {/* Bear Hitbox (Center) - Just for fun! */}
        <motion.button
          onClick={() => { /* Play bear sound or jump animation */ }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute rounded-full transition-colors cursor-pointer z-20"
          style={{
            bottom: '12%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '15%',
            height: '30%',
          }}
          aria-label="Buddy Bear"
        />
      </div>

      {/* Floating Welcome Message */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg z-20 pointer-events-none hidden md:block"
      >
        <p className="font-bold text-[#6C3CE1]" style={{ fontFamily: 'Nunito' }}>
          Welcome, {settings.childName}! Tap a sign to start.
        </p>
      </motion.div>

    </div>
  );
}
