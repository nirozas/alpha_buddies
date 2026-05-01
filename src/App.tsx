import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { HomePage } from './pages/HomePage';
import { LettersActivityHubPage } from './pages/LettersActivityHubPage';
import { NumbersActivityHubPage } from './pages/NumbersActivityHubPage';
import { LetterSelectorPage } from './pages/LetterSelectorPage';
import { NumberSelectorPage } from './pages/NumberSelectorPage';
import { ProgressPage } from './pages/ProgressPage';
import { LetterActivityRouter } from './activities/letters';
import { NumberActivityRouter } from './activities/numbers';
import { PageTransition } from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/letters" element={<PageTransition><LettersActivityHubPage /></PageTransition>} />
        <Route path="/letters/activity/:activity" element={<PageTransition><LetterSelectorPage /></PageTransition>} />
        <Route path="/letters/activity/:activity/:letter" element={<PageTransition><LetterActivityRouter /></PageTransition>} />
        <Route path="/numbers" element={<PageTransition><NumbersActivityHubPage /></PageTransition>} />
        <Route path="/numbers/activity/:activity" element={<PageTransition><NumberSelectorPage /></PageTransition>} />
        <Route path="/numbers/activity/:activity/:number" element={<PageTransition><NumberActivityRouter /></PageTransition>} />
        <Route path="/progress" element={<PageTransition><ProgressPage /></PageTransition>} />
        <Route path="*" element={<PageTransition><HomePage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function PortraitOverlay() {
  return (
    <div className="portrait-overlay fixed inset-0 z-[9999] bg-green-50 flex flex-col items-center justify-center p-6 text-center">
      <style>{`
        .portrait-overlay { display: none; }
        @media (orientation: portrait) and (max-width: 1024px) {
          .portrait-overlay { display: flex; }
        }
      `}</style>
      <motion.div
        animate={{ rotate: -90 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        className="text-8xl mb-6"
      >
        📱
      </motion.div>
      <h2 className="text-3xl font-black text-green-700 mb-2" style={{ fontFamily: 'Nunito' }}>Please Rotate Your Device</h2>
      <p className="text-xl font-bold text-gray-700" style={{ fontFamily: 'Nunito' }}>
        AlphaBuddies looks best in landscape mode! 🌲
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="activity-bg" />
      <AnimatedRoutes />
      <PortraitOverlay />
    </BrowserRouter>
  );
}

export default App;
