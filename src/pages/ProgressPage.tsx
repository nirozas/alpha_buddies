import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LETTERS_DATA } from '../constants/letters';
import { NUMBERS_DATA } from '../constants/numbers';
import { LETTER_ACTIVITIES, NUMBER_ACTIVITIES } from '../constants/activities';
import { STICKERS_CATALOG } from '../constants/stickers';
import { BADGES_CATALOG, AVATARS_CATALOG } from '../constants/badges';
import { BackButton, StarRating } from '../components/SharedComponents';
import { useStore, calculateDistinctStars } from '../store';
import { useAudio } from '../hooks/useAudio';

type Tab = 'overview' | 'letters' | 'numbers' | 'stickers' | 'settings';

interface ItemDetail {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  isUnlocked: boolean;
  type: 'sticker' | 'badge';
  category?: string;
  level?: number;
  tier?: string;
}

export function ProgressPage() {
  const navigate = useNavigate();
  const { progress, resetProgress, settings, updateSettings, setAvatar } = useStore();
  const { playPop, playCheer } = useAudio();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedLetterDetail, setSelectedLetterDetail] = useState<string | null>(null);
  const [selectedNumberDetail, setSelectedNumberDetail] = useState<number | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [stickerFilter, setStickerFilter] = useState<'stickers' | 'badges'>('stickers');
  const [selectedItemDetail, setSelectedItemDetail] = useState<ItemDetail | null>(null);

  // Parent PIN state
  const [parentUnlocked, setParentUnlocked] = useState(!settings.parentPin);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Computations
  const totalStars = calculateDistinctStars(progress.starsEarned);
  const totalLetters = Object.keys(progress.lettersCompleted || {}).length;
  const totalNumbers = Object.keys(progress.numbersCompleted || {}).length;
  const totalMinutes = Math.round((progress.totalPlaytime || 0) / 60);
  const unlockedStickers = progress.stickers || [];
  const unlockedBadges = progress.badges || [];
  const currentAvatar = progress.avatar || '🦁';

  // XP & Level calculations
  const xp = totalStars * 50;
  const xpPerLevel = 200;
  const currentLevel = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelProgress = Math.round(((xp % xpPerLevel) / xpPerLevel) * 100);

  const getRankTitle = (lvl: number) => {
    if (lvl === 1) return 'Curious Cub 🐻';
    if (lvl === 2) return 'Alphabet Explorer 🧭';
    if (lvl === 3) return 'Phonics Star ⭐';
    if (lvl === 4) return 'Math Apprentice 🔢';
    if (lvl === 5) return 'Learning Champion 🏆';
    if (lvl === 6) return 'Super Genius 🧠';
    return 'Legendary Master 👑';
  };

  // Helper: Past 7 days data for chart
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const label = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const stars = (progress.dailyStars && progress.dailyStars[dateStr]) || (i === 0 ? Math.min(totalStars, 12) : 0);
      days.push({ dateStr, label, stars, isToday: i === 0 });
    }
    return days;
  };
  const weekData = getLast7DaysData();
  const maxWeekStars = Math.max(8, ...weekData.map((d) => d.stars));

  // Helper: Get games completed for a given letter
  const getLetterGames = (letter: string) => {
    const list: { act: typeof LETTER_ACTIVITIES[0]; stars: 1 | 2 | 3 }[] = [];
    for (const act of LETTER_ACTIVITIES) {
      const k1 = `${letter}-${act.id}`;
      const k2 = `${act.id}-${letter}`;
      const leg = `${letter}-letter-of-the-day`;
      const score = (progress.starsEarned[k1] ||
        progress.starsEarned[k2] ||
        (act.id === 'learn-my-letters' ? progress.starsEarned[leg] : 0) ||
        0) as 0 | 1 | 2 | 3;
      if (score > 0) {
        list.push({ act, stars: score as 1 | 2 | 3 });
      }
    }
    return list;
  };

  // Helper: Get letter star level badge
  const getLetterMastery = (letter: string) => {
    const games = getLetterGames(letter);
    const count = games.length;
    const totalStarsForLetter = games.reduce((sum, g) => sum + g.stars, 0);
    if (count >= 3 || totalStarsForLetter >= 6) {
      return { tier: 'gold', label: 'Gold Master', badge: '🥇', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (count >= 2 || totalStarsForLetter >= 3) {
      return { tier: 'silver', label: 'Silver Achiever', badge: '🥈', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
    if (count >= 1) {
      return { tier: 'bronze', label: 'Bronze Learner', badge: '🥉', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    }
    return { tier: 'none', label: 'Not Started', badge: '⚪', bg: 'bg-gray-100 text-gray-400 border-gray-200' };
  };

  // Helper: Get games completed for a given number
  const getNumberGames = (digit: number) => {
    const list: { act: typeof NUMBER_ACTIVITIES[0]; stars: 1 | 2 | 3 }[] = [];
    for (const act of NUMBER_ACTIVITIES) {
      const k1 = `${digit}-${act.id}`;
      const k2 = `${act.id}-${digit}`;
      const score = (progress.starsEarned[k1] || progress.starsEarned[k2] || 0) as 0 | 1 | 2 | 3;
      if (score > 0) {
        list.push({ act, stars: score as 1 | 2 | 3 });
      }
    }
    return list;
  };

  // Helper: Get number star level badge
  const getNumberMastery = (digit: number) => {
    const games = getNumberGames(digit);
    const count = games.length;
    const totalStarsForDigit = games.reduce((sum, g) => sum + g.stars, 0);
    if (count >= 3 || totalStarsForDigit >= 6) {
      return { tier: 'gold', label: 'Gold Master', badge: '🥇', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (count >= 2 || totalStarsForDigit >= 3) {
      return { tier: 'silver', label: 'Silver Achiever', badge: '🥈', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
    if (count >= 1) {
      return { tier: 'bronze', label: 'Bronze Learner', badge: '🥉', bg: 'bg-orange-100 text-orange-800 border-orange-300' };
    }
    return { tier: 'none', label: 'Not Started', badge: '⚪', bg: 'bg-gray-100 text-gray-400 border-gray-200' };
  };

  const handlePin = () => {
    if (pin === settings.parentPin) {
      setParentUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const handleSetPin = () => {
    if (pin.length === 4) {
      updateSettings({ parentPin: pin });
      setParentUnlocked(true);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 select-none font-nunito text-slate-800 pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white px-4 pt-4 pb-6 shadow-xl relative z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <BackButton onClick={() => navigate('/')} color="white" />

          <div className="text-center flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black drop-shadow-md tracking-tight truncate">
              🏆 {settings.childName}'s Player Dashboard
            </h1>
            <p className="text-purple-200 text-xs sm:text-sm font-bold mt-0.5">
              Level {currentLevel}: {getRankTitle(currentLevel)}
            </p>
          </div>

          {/* Interactive Avatar button */}
          <button
            onClick={() => {
              playPop();
              setShowAvatarPicker(true);
            }}
            className="w-12 h-12 rounded-full bg-white/25 border-2 border-white/60 flex items-center justify-center text-2xl shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer relative group"
            title="Change Avatar"
          >
            <span>{currentAvatar}</span>
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center border border-white">
              ✏️
            </span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-1.5 sm:gap-2.5 mt-5 flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'letters', label: '🔤 Letters', icon: '🔤' },
            { id: 'numbers', label: '🔢 Numbers', icon: '🔢' },
            { id: 'stickers', label: '🎨 Stickers & Badges', icon: '🎨' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                playPop();
                setActiveTab(tab.id as Tab);
              }}
              className={`px-3 sm:px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-purple-900 shadow-md scale-105 ring-2 ring-purple-300'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto w-full px-4 mt-6 flex-1">
        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Player Level & XP Banner */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-indigo-200 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-2xl -z-10" />

              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-5xl shadow-xl border-4 border-white">
                  {currentAvatar}
                </div>
                <button
                  onClick={() => setShowAvatarPicker(true)}
                  className="absolute -bottom-1 -right-1 bg-amber-400 text-amber-950 text-xs font-black px-2 py-0.5 rounded-full shadow-md border border-white hover:scale-105"
                >
                  Change
                </button>
              </div>

              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                      {settings.childName}
                    </h2>
                    <span className="text-xs sm:text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                      Level {currentLevel} · {getRankTitle(currentLevel)}
                    </span>
                  </div>
                  <div className="text-sm font-black text-amber-600 flex items-center justify-center sm:justify-end gap-1">
                    <span>⭐</span> {totalStars} Total Stars Earned
                  </div>
                </div>

                {/* XP Progress bar */}
                <div className="w-full bg-slate-100 h-5 rounded-full overflow-hidden border-2 border-slate-200 shadow-inner relative mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${currentLevelProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full shadow"
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">
                    {xp % xpPerLevel} / {xpPerLevel} XP to Level {currentLevel + 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-amber-200 flex flex-col items-center text-center">
                <span className="text-3xl mb-1">⭐</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600">{totalStars}</span>
                <span className="text-xs font-bold text-slate-500 mt-0.5">Total Stars</span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-orange-200 flex flex-col items-center text-center">
                <span className="text-3xl mb-1 animate-bounce">🔥</span>
                <span className="text-2xl sm:text-3xl font-black text-orange-600">
                  {progress.streakDays || 1}
                </span>
                <span className="text-xs font-bold text-slate-500 mt-0.5">Day Streak</span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-emerald-200 flex flex-col items-center text-center">
                <span className="text-3xl mb-1">🔤</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {totalLetters} / 26
                </span>
                <span className="text-xs font-bold text-slate-500 mt-0.5">Letters Mastered</span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-blue-200 flex flex-col items-center text-center">
                <span className="text-3xl mb-1">🔢</span>
                <span className="text-2xl sm:text-3xl font-black text-blue-600">
                  {totalNumbers} / 11
                </span>
                <span className="text-xs font-bold text-slate-500 mt-0.5">Numbers Mastered</span>
              </div>
            </div>

            {/* Activity Chart: Stars Over the Past 7 Days */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                    <span>📈</span> 7-Day Star Activity Chart
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    See how many stars you've collected each day this week!
                  </p>
                </div>
                <div className="px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-xs font-black text-amber-700 flex items-center gap-1">
                  <span>⏱️</span> {totalMinutes}m Playtime
                </div>
              </div>

              <div className="flex items-end justify-between gap-2 h-44 pt-6 px-2 sm:px-6 bg-slate-50 rounded-2xl border border-slate-200">
                {weekData.map((d, idx) => {
                  const barHeightPct = Math.max(12, Math.round((d.stars / maxWeekStars) * 100));
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <span className="text-[11px] font-black text-amber-700 mb-1 opacity-90 group-hover:scale-110 transition-transform">
                        {d.stars > 0 ? `${d.stars}★` : '0'}
                      </span>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${barHeightPct}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className={`w-full max-w-[36px] rounded-t-xl shadow-md transition-all ${
                          d.isToday
                            ? 'bg-gradient-to-t from-amber-500 to-yellow-400 ring-2 ring-amber-300'
                            : d.stars > 0
                            ? 'bg-gradient-to-t from-indigo-500 to-purple-400 opacity-80 group-hover:opacity-100'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span
                        className={`text-[10px] sm:text-xs font-black mt-2 truncate ${
                          d.isToday ? 'text-amber-800 font-black scale-105' : 'text-slate-500'
                        }`}
                      >
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Rewards Showcase */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-xl border-4 border-purple-200">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                    <span>✨</span> Trophy Room &amp; Stickers Showcase
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Tap any badge or sticker to view it in full glittering glory!
                  </p>
                </div>
                <button
                  onClick={() => {
                    playPop();
                    setActiveTab('stickers');
                  }}
                  className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm"
                >
                  View All ({unlockedStickers.length + unlockedBadges.length}) →
                </button>
              </div>

              {/* Grid of top badges & stickers */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {/* 3 top badges */}
                {BADGES_CATALOG.slice(0, 3).map((b) => {
                  const isUnlocked = unlockedBadges.includes(b.id);
                  return (
                    <motion.button
                      key={b.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isUnlocked) playCheer();
                        else playPop();
                        setSelectedItemDetail({
                          id: b.id,
                          title: b.title,
                          description: b.description,
                          icon: b.icon,
                          imageUrl: b.imageUrl,
                          isUnlocked,
                          type: 'badge',
                          category: b.category,
                        });
                      }}
                      className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 relative overflow-hidden group ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-purple-50 to-indigo-50 border-purple-300 shadow-md hover:border-purple-400'
                          : 'bg-slate-100 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-1 relative">
                        {b.imageUrl ? (
                          <img
                            src={b.imageUrl}
                            alt={b.title}
                            className={`w-full h-full object-contain ${
                              isUnlocked
                                ? 'drop-shadow-sm group-hover:scale-110 duration-200'
                                : 'brightness-0 opacity-20'
                            }`}
                          />
                        ) : (
                          <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                            {b.icon}
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-black drop-shadow">
                            🔒
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-slate-700 truncate w-full">
                        {b.title}
                      </span>
                    </motion.button>
                  );
                })}

                {/* 3 top stickers */}
                {STICKERS_CATALOG.slice(0, 3).map((st) => {
                  const isUnlocked = unlockedStickers.includes(st.id);
                  return (
                    <motion.button
                      key={st.id}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isUnlocked) playCheer();
                        else playPop();
                        setSelectedItemDetail({
                          id: st.id,
                          title: st.title,
                          description: st.description,
                          icon: st.icon,
                          imageUrl: st.imageUrl,
                          isUnlocked,
                          type: 'sticker',
                          category: st.category,
                        });
                      }}
                      className={`aspect-square rounded-2xl p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all border-2 relative overflow-hidden group ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-50 to-pink-50 border-amber-300 shadow-md hover:border-amber-400'
                          : 'bg-slate-100 border-dashed border-slate-300 opacity-60'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mb-1 relative">
                        {st.imageUrl ? (
                          <img
                            src={st.imageUrl}
                            alt={st.title}
                            className={`w-full h-full object-contain ${
                              isUnlocked
                                ? 'drop-shadow-sm group-hover:scale-110 duration-200'
                                : 'brightness-0 opacity-20'
                            }`}
                          />
                        ) : (
                          <span className={`text-2xl ${isUnlocked ? '' : 'grayscale opacity-30'}`}>
                            {st.icon}
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-black drop-shadow">
                            🔒
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-black text-slate-700 truncate w-full">
                        {st.title}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Quick Launch Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  playPop();
                  setActiveTab('letters');
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-5 shadow-xl flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-left"
              >
                <div>
                  <h4 className="text-lg font-black">🔤 Alphabet Mastery Grid</h4>
                  <p className="text-xs text-emerald-100 font-bold mt-0.5">
                    View Bronze, Silver &amp; Gold ratings for all 26 letters
                  </p>
                </div>
                <span className="text-3xl bg-white/20 p-2.5 rounded-2xl">→</span>
              </button>

              <button
                onClick={() => {
                  playPop();
                  setActiveTab('numbers');
                }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-3xl p-5 shadow-xl flex items-center justify-between hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-left"
              >
                <div>
                  <h4 className="text-lg font-black">🔢 Numbers Mastery Grid</h4>
                  <p className="text-xs text-blue-100 font-bold mt-0.5">
                    Explore counting, matching &amp; building stars (0-10)
                  </p>
                </div>
                <span className="text-3xl bg-white/20 p-2.5 rounded-2xl">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 2: LETTERS TAB ─────────────────────────────────────────── */}
        {activeTab === 'letters' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-emerald-800 flex items-center gap-2">
                  <span>🔤</span> Alphabet Mastery Grid
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Tap any letter to see all completed games, earned stars, and jump straight into playing!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-200">
                <span>🥇 Gold: 3+ games</span>
                <span>🥈 Silver: 2</span>
                <span>🥉 Bronze: 1</span>
              </div>
            </div>

            {/* Letter Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3">
              {LETTERS_DATA.map((ld) => {
                const mastery = getLetterMastery(ld.letter);
                const games = getLetterGames(ld.letter);
                const letterStars = games.reduce((sum, g) => sum + g.stars, 0);

                return (
                  <motion.button
                    key={ld.letter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      playPop();
                      setSelectedLetterDetail(ld.letter);
                    }}
                    className={`bg-white rounded-2xl p-3 shadow-md border-3 flex flex-col items-center justify-between relative cursor-pointer transition-all ${
                      mastery.tier === 'gold'
                        ? 'border-amber-400 ring-2 ring-amber-200 shadow-amber-100'
                        : mastery.tier === 'silver'
                        ? 'border-slate-300 ring-1 ring-slate-200'
                        : mastery.tier === 'bronze'
                        ? 'border-orange-300'
                        : 'border-slate-100 opacity-80'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-sm">{mastery.badge}</span>
                      <span className="text-[11px] font-black text-amber-600">
                        {letterStars > 0 ? `${letterStars}★` : ''}
                      </span>
                    </div>

                    <span
                      className="text-4xl font-black my-1"
                      style={{ color: ld.color }}
                    >
                      {ld.uppercase}
                    </span>

                    <div className="w-full text-center">
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md border block truncate ${mastery.bg}`}
                      >
                        {mastery.label}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: NUMBERS TAB ─────────────────────────────────────────── */}
        {activeTab === 'numbers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-blue-800 flex items-center gap-2">
                  <span>🔢</span> Numbers Mastery Grid (0 - 10)
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Tap any number to see all completed activities and launch into number games!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-2xl border border-blue-200">
                <span>🥇 Gold: 3+ games</span>
                <span>🥈 Silver: 2</span>
                <span>🥉 Bronze: 1</span>
              </div>
            </div>

            {/* Number Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {NUMBERS_DATA.map((nd) => {
                const mastery = getNumberMastery(nd.digit);
                const games = getNumberGames(nd.digit);
                const numStars = games.reduce((sum, g) => sum + g.stars, 0);

                return (
                  <motion.button
                    key={nd.digit}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      playPop();
                      setSelectedNumberDetail(nd.digit);
                    }}
                    className={`bg-white rounded-3xl p-4 shadow-lg border-4 flex flex-col items-center justify-between relative cursor-pointer transition-all ${
                      mastery.tier === 'gold'
                        ? 'border-amber-400 ring-2 ring-amber-200 shadow-amber-100'
                        : mastery.tier === 'silver'
                        ? 'border-slate-300 ring-1 ring-slate-200'
                        : mastery.tier === 'bronze'
                        ? 'border-orange-300'
                        : 'border-slate-100 opacity-80'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between mb-1">
                      <span className="text-base">{mastery.badge}</span>
                      <span className="text-xs font-black text-amber-600">
                        {numStars > 0 ? `${numStars}★` : ''}
                      </span>
                    </div>

                    <span
                      className="text-5xl font-black my-1"
                      style={{ color: nd.color }}
                    >
                      {nd.digit}
                    </span>

                    <span className="text-xs font-extrabold text-slate-600 mb-2">
                      {nd.word} {nd.emoji || ''}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border w-full text-center truncate ${mastery.bg}`}
                    >
                      {mastery.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: STICKERS & BADGES TAB ────────────────────────────────── */}
        {activeTab === 'stickers' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-purple-800 flex items-center gap-2">
                  <span>🎨</span> Rewards &amp; Achievements
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Earn stickers and badges by mastering letters, numbers, and maintaining streaks!
                </p>
              </div>

              {/* Toggle Stickers vs Badges */}
              <div className="flex bg-purple-100 p-1 rounded-2xl gap-1">
                <button
                  onClick={() => {
                    playPop();
                    setStickerFilter('stickers');
                  }}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                    stickerFilter === 'stickers'
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  Sticker Book ({unlockedStickers.length}/{STICKERS_CATALOG.length})
                </button>
                <button
                  onClick={() => {
                    playPop();
                    setStickerFilter('badges');
                  }}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                    stickerFilter === 'badges'
                      ? 'bg-purple-700 text-white shadow-md'
                      : 'text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  Badges ({unlockedBadges.length}/{BADGES_CATALOG.length})
                </button>
              </div>
            </div>

            {/* STICKERS VIEW */}
            {stickerFilter === 'stickers' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {STICKERS_CATALOG.map((st) => {
                  const isUnlocked = unlockedStickers.includes(st.id);
                  return (
                    <motion.button
                      key={st.id}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (isUnlocked) playCheer();
                        else playPop();
                        setSelectedItemDetail({
                          id: st.id,
                          title: st.title,
                          description: st.description,
                          icon: st.icon,
                          imageUrl: st.imageUrl,
                          isUnlocked,
                          type: 'sticker',
                          category: st.category,
                          level: st.level,
                          tier: st.tier,
                        });
                      }}
                      className={`w-full rounded-3xl p-4 flex flex-col items-center text-center transition-all cursor-pointer relative overflow-hidden group ${
                        isUnlocked
                          ? 'bg-white border-4 border-amber-300 shadow-xl shadow-amber-100/50 hover:border-amber-400 hover:shadow-2xl'
                          : 'bg-slate-100/80 border-2 border-dashed border-slate-300 hover:border-slate-400 opacity-75'
                      }`}
                    >
                      {/* Glitter Sparkle Accent */}
                      {isUnlocked && (
                        <span className="absolute top-2 right-2 text-xs sm:text-sm animate-pulse select-none">
                          ✨
                        </span>
                      )}

                      {/* Tier & Level Badge */}
                      {st.tier && (
                        <span className="text-[9px] font-black uppercase tracking-wider text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-full border border-purple-200 mb-1.5 shadow-xs">
                          {st.tier} · Lv {st.level || 1}
                        </span>
                      )}

                      <div
                        className={`w-24 h-24 rounded-full flex items-center justify-center p-1.5 mb-2 relative overflow-hidden transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-tr from-amber-200 via-pink-100 to-yellow-100 shadow-lg ring-4 ring-amber-300 group-hover:scale-105 duration-300'
                            : 'bg-slate-200 border-2 border-slate-300'
                        }`}
                      >
                        {st.imageUrl ? (
                          <img
                            src={st.imageUrl}
                            alt={st.title}
                            className={`w-full h-full object-contain rounded-full transition-all ${
                              isUnlocked
                                ? 'drop-shadow-md group-hover:rotate-3 duration-300'
                                : 'brightness-0 opacity-20'
                            }`}
                          />
                        ) : (
                          <span
                            className={`text-4xl ${
                              isUnlocked ? 'group-hover:scale-110 transition-transform' : 'grayscale opacity-30'
                            }`}
                          >
                            {st.icon}
                          </span>
                        )}
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center text-xl font-black drop-shadow">
                            🔒
                          </div>
                        )}
                      </div>

                      <h4 className="font-black text-sm text-slate-800 mb-0.5 truncate w-full group-hover:text-amber-700 transition-colors">
                        {st.title}
                      </h4>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight line-clamp-2">
                        {st.description}
                      </p>

                      <div className="mt-2.5 flex items-center gap-1">
                        {isUnlocked ? (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                            <span>✓</span> Collected
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                            Tap to inspect
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* BADGES VIEW */}
            {stickerFilter === 'badges' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {BADGES_CATALOG.map((b) => {
                  const isUnlocked = unlockedBadges.includes(b.id);
                  return (
                    <motion.button
                      key={b.id}
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        if (isUnlocked) playCheer();
                        else playPop();
                        setSelectedItemDetail({
                          id: b.id,
                          title: b.title,
                          description: b.description,
                          icon: b.icon,
                          imageUrl: b.imageUrl,
                          isUnlocked,
                          type: 'badge',
                          category: b.category,
                        });
                      }}
                      className={`w-full text-left rounded-3xl p-4 flex items-center gap-3.5 transition-all cursor-pointer relative overflow-hidden group ${
                        isUnlocked
                          ? 'bg-white border-3 border-indigo-300 shadow-lg hover:border-indigo-400 hover:shadow-xl'
                          : 'bg-slate-100/80 border-2 border-dashed border-slate-300 hover:border-slate-400 opacity-75'
                      }`}
                    >
                      {/* Glitter Sparkle Accent */}
                      {isUnlocked && (
                        <span className="absolute top-2 right-2 text-xs sm:text-sm animate-pulse select-none">
                          ✨
                        </span>
                      )}

                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 p-1 relative overflow-hidden transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-tr from-purple-100 via-indigo-50 to-pink-100 shadow-md ring-2 ring-indigo-200 group-hover:scale-105 duration-300'
                            : 'bg-slate-200 border-2 border-slate-300'
                        }`}
                      >
                        {b.imageUrl ? (
                          <img
                            src={b.imageUrl}
                            alt={b.title}
                            className={`w-full h-full object-contain transition-all ${
                              isUnlocked
                                ? 'drop-shadow-sm group-hover:rotate-3 duration-300'
                                : 'brightness-0 opacity-20'
                            }`}
                          />
                        ) : (
                          <span
                            className={`text-3xl ${
                              isUnlocked ? 'group-hover:scale-110 transition-transform' : 'grayscale opacity-30'
                            }`}
                          >
                            {b.icon}
                          </span>
                        )}
                        {!isUnlocked && (
                          <div className="absolute inset-0 flex items-center justify-center text-lg font-black drop-shadow">
                            🔒
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-black text-sm text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                          {b.title}
                        </h4>
                        <p className="text-xs font-bold text-slate-500 leading-snug line-clamp-2">
                          {b.description}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          {isUnlocked ? (
                            <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                              ★ Earned Badge
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">
                              Tap to inspect 🔍
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: SETTINGS & PARENT ZONE ────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-slate-200 max-w-xl mx-auto space-y-6">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span>⚙️</span> Parent Zone &amp; Settings
            </h3>

            {!parentUnlocked ? (
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-600">
                  Please enter your 4-digit Parent PIN to access controls:
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="flex-1 border-2 border-slate-300 rounded-xl px-4 py-2 font-mono text-center tracking-widest text-lg"
                    placeholder="••••"
                  />
                  <button
                    onClick={handlePin}
                    className="bg-indigo-600 text-white font-black px-6 py-2 rounded-xl shadow-md hover:bg-indigo-700"
                  >
                    Unlock
                  </button>
                </div>
                {pinError && (
                  <p className="text-xs font-bold text-rose-500">
                    Incorrect PIN. Please try again!
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Child's Name
                  </label>
                  <input
                    type="text"
                    value={settings.childName}
                    onChange={(e) => updateSettings({ childName: e.target.value })}
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                    Parent PIN
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={settings.parentPin || ''}
                    onChange={(e) => updateSettings({ parentPin: e.target.value || null })}
                    placeholder="Enter 4-digit PIN (or leave empty)"
                    className="w-full border-2 border-slate-300 rounded-xl px-4 py-2 font-mono text-slate-800"
                  />
                </div>

                {/* Reset Progress Confirmation */}
                <div className="pt-4 border-t border-slate-200">
                  {!confirmReset ? (
                    <button
                      onClick={() => setConfirmReset(true)}
                      className="w-full py-3 bg-rose-50 text-rose-700 font-black rounded-xl border border-rose-200 hover:bg-rose-100 transition-all text-sm"
                    >
                      ⚠️ Reset All Progress &amp; Stars
                    </button>
                  ) : (
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-300 space-y-3">
                      <p className="text-xs font-black text-rose-700">
                        Are you completely sure? This will delete all mastered letters, numbers, and stars.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            resetProgress();
                            setConfirmReset(false);
                            playCheer();
                          }}
                          className="flex-1 py-2 bg-rose-600 text-white font-black rounded-lg text-xs"
                        >
                          Yes, Reset Everything
                        </button>
                        <button
                          onClick={() => setConfirmReset(false)}
                          className="flex-1 py-2 bg-slate-200 text-slate-700 font-black rounded-lg text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL: LETTER DETAIL & DIRECT LAUNCHER ───────────────────────── */}
      <AnimatePresence>
        {selectedLetterDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border-4 border-emerald-400"
            >
              {(() => {
                const ld =
                  LETTERS_DATA.find((l) => l.letter === selectedLetterDetail) || LETTERS_DATA[0];
                const letterGames = getLetterGames(ld.letter);
                const mastery = getLetterMastery(ld.letter);

                return (
                  <>
                    <div
                      className="p-5 text-white flex items-center justify-between"
                      style={{ background: ld.color }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-black drop-shadow">{ld.uppercase}</span>
                        <div>
                          <h3 className="text-xl font-black">Letter {ld.letter}</h3>
                          <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                            {mastery.label} {mastery.badge}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedLetterDetail(null)}
                        className="text-white/80 hover:text-white text-2xl font-black p-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-2">
                      <p className="text-xs font-black text-slate-500 uppercase mb-2">
                        Activities for letter {ld.letter}:
                      </p>

                      {LETTER_ACTIVITIES.map((act) => {
                        const gameItem = letterGames.find((g) => g.act.id === act.id);
                        const starsEarned = gameItem ? gameItem.stars : 0;

                        return (
                          <div
                            key={act.id}
                            className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-2xl">{act.icon}</span>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                                  {act.name}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {starsEarned > 0 ? (
                                    <span className="text-xs text-amber-500 font-black">
                                      {'★'.repeat(starsEarned)}
                                      <span className="text-slate-300">
                                        {'★'.repeat(3 - starsEarned)}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400">
                                      Not played yet
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                playPop();
                                setSelectedLetterDetail(null);
                                navigate(`/letters/activity/${act.id}/${ld.letter}`);
                              }}
                              className="px-3 py-1.5 rounded-xl font-black text-xs text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                              style={{ background: ld.color }}
                            >
                              ▶ Play
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: NUMBER DETAIL & DIRECT LAUNCHER ───────────────────────── */}
      <AnimatePresence>
        {selectedNumberDetail !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border-4 border-blue-400"
            >
              {(() => {
                const nd =
                  NUMBERS_DATA.find((n) => n.digit === selectedNumberDetail) || NUMBERS_DATA[0];
                const numGames = getNumberGames(nd.digit);
                const mastery = getNumberMastery(nd.digit);

                return (
                  <>
                    <div
                      className="p-5 text-white flex items-center justify-between"
                      style={{ background: nd.color }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-black drop-shadow">{nd.digit}</span>
                        <div>
                          <h3 className="text-xl font-black">Number {nd.word}</h3>
                          <span className="text-xs font-extrabold bg-white/20 px-2 py-0.5 rounded-full">
                            {mastery.label} {mastery.badge}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedNumberDetail(null)}
                        className="text-white/80 hover:text-white text-2xl font-black p-2"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-2">
                      <p className="text-xs font-black text-slate-500 uppercase mb-2">
                        Activities for number {nd.digit}:
                      </p>

                      {NUMBER_ACTIVITIES.map((act) => {
                        const gameItem = numGames.find((g) => g.act.id === act.id);
                        const starsEarned = gameItem ? gameItem.stars : 0;

                        return (
                          <div
                            key={act.id}
                            className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-100 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-2xl">{act.icon}</span>
                              <div className="min-w-0">
                                <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                                  {act.name}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {starsEarned > 0 ? (
                                    <span className="text-xs text-amber-500 font-black">
                                      {'★'.repeat(starsEarned)}
                                      <span className="text-slate-300">
                                        {'★'.repeat(3 - starsEarned)}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold text-slate-400">
                                      Not played yet
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                playPop();
                                setSelectedNumberDetail(null);
                                navigate(`/numbers/activity/${act.id}/${nd.digit}`);
                              }}
                              className="px-3 py-1.5 rounded-xl font-black text-xs text-white shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
                              style={{ background: nd.color }}
                            >
                              ▶ Play
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: AVATAR PICKER ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-indigo-400 text-center"
            >
              <h3 className="text-xl font-black text-slate-800 mb-1">Choose Your Buddy Avatar!</h3>
              <p className="text-xs font-bold text-slate-500 mb-5">
                Pick your favorite mascot to display on your dashboard
              </p>

              <div className="grid grid-cols-4 gap-3 mb-6">
                {AVATARS_CATALOG.map((av) => (
                  <button
                    key={av.id}
                    onClick={() => {
                      playPop();
                      setAvatar(av.emoji);
                      setShowAvatarPicker(false);
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 border-3 transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                      currentAvatar === av.emoji
                        ? 'border-indigo-600 bg-indigo-50 shadow-md ring-2 ring-indigo-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-3xl mb-1">{av.emoji}</span>
                    <span className="text-[10px] font-black text-slate-700 truncate w-full">
                      {av.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAvatarPicker(false)}
                className="w-full py-2.5 bg-slate-200 text-slate-700 font-black rounded-xl text-xs hover:bg-slate-300"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: BIG & BEAUTIFUL STICKER / BADGE HOVERING WINDOW ────────── */}
      <AnimatePresence>
        {selectedItemDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            onClick={() => {
              playPop();
              setSelectedItemDetail(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.75, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              className="bg-white rounded-[2.5rem] max-w-md sm:max-w-lg w-full p-6 sm:p-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.55)] border-4 sm:border-[6px] border-amber-300 text-center relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glittery Animated Radiant Glow Aura */}
              <div
                className={`absolute -inset-10 rounded-[3rem] blur-3xl opacity-35 -z-10 animate-pulse pointer-events-none ${
                  selectedItemDetail.isUnlocked
                    ? selectedItemDetail.type === 'sticker'
                      ? 'bg-gradient-to-r from-pink-400 via-amber-300 to-indigo-400'
                      : 'bg-gradient-to-r from-amber-400 via-purple-500 to-sky-400'
                    : 'bg-gradient-to-r from-slate-400 via-indigo-300 to-slate-500'
                }`}
              />

              {/* Close Button */}
              <button
                onClick={() => {
                  playPop();
                  setSelectedItemDetail(null);
                }}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xl flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all z-20 border-2 border-slate-300 cursor-pointer"
                title="Close"
              >
                ✕
              </button>

              {/* Status Header Pill */}
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-black mb-3 shadow-sm border ${
                  selectedItemDetail.isUnlocked
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 border-amber-300'
                    : 'bg-slate-100 text-slate-600 border-slate-300'
                }`}
              >
                {selectedItemDetail.isUnlocked ? (
                  <>
                    <span className="animate-spin text-sm">✨</span>
                    <span>
                      {selectedItemDetail.type === 'sticker'
                        ? 'COLLECTED MYSTIC STICKER'
                        : 'ACHIEVEMENT BADGE UNLOCKED'}
                    </span>
                    <span className="text-sm">🌟</span>
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    <span>
                      LOCKED {selectedItemDetail.type === 'sticker' ? 'STICKER' : 'BADGE'}
                    </span>
                  </>
                )}
              </div>

              {/* Giant Art Showcase with Glitter & Halos */}
              <div className="relative mx-auto my-2 flex items-center justify-center">
                {/* Outer Sparkling Halo */}
                <div
                  className={`w-56 h-56 sm:w-64 sm:h-64 rounded-full flex items-center justify-center p-3.5 relative transition-all ${
                    selectedItemDetail.isUnlocked
                      ? 'bg-gradient-to-tr from-amber-200 via-pink-100 to-purple-200 shadow-inner ring-4 sm:ring-8 ring-amber-300/80 shadow-amber-300/50'
                      : 'bg-slate-200/90 border-4 border-dashed border-slate-300'
                  }`}
                >
                  {/* Corner Glitter Stars for unlocked */}
                  {selectedItemDetail.isUnlocked && (
                    <>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-2 -left-2 text-2xl drop-shadow-md select-none"
                      >
                        ✨
                      </motion.span>
                      <motion.span
                        animate={{ scale: [1, 1.25, 1], rotate: [0, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2.3, delay: 0.3 }}
                        className="absolute -top-2 -right-2 text-2xl drop-shadow-md select-none"
                      >
                        🌟
                      </motion.span>
                      <motion.span
                        animate={{ scale: [1, 1.3, 1], rotate: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}
                        className="absolute -bottom-1 -left-1 text-2xl drop-shadow-md select-none"
                      >
                        💫
                      </motion.span>
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2.1, delay: 0.9 }}
                        className="absolute -bottom-1 -right-1 text-2xl drop-shadow-md select-none"
                      >
                        ✨
                      </motion.span>
                    </>
                  )}

                  {/* Artwork display */}
                  {selectedItemDetail.imageUrl ? (
                    <motion.img
                      initial={{ scale: 0.85 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12 }}
                      src={selectedItemDetail.imageUrl}
                      alt={selectedItemDetail.title}
                      className={`w-full h-full object-contain filter transition-all select-none ${
                        selectedItemDetail.isUnlocked
                          ? 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]'
                          : 'brightness-0 opacity-20'
                      }`}
                    />
                  ) : (
                    <span
                      className={`text-7xl sm:text-8xl select-none ${
                        selectedItemDetail.isUnlocked ? '' : 'grayscale opacity-25'
                      }`}
                    >
                      {selectedItemDetail.icon}
                    </span>
                  )}

                  {/* Mystery Lock overlay if locked */}
                  {!selectedItemDetail.isUnlocked && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <span className="text-5xl sm:text-6xl drop-shadow-lg animate-bounce">
                        🔒
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-white/90 px-3 py-1 rounded-full shadow mt-2">
                        Mystery Reward
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3 mb-1">
                {selectedItemDetail.title}
              </h3>

              {/* Category & Tier Tag */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                {selectedItemDetail.tier && (
                  <span className="text-xs font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 shadow-xs">
                    ⭐ {selectedItemDetail.tier} Tier · Level {selectedItemDetail.level || 1}
                  </span>
                )}
                {selectedItemDetail.category && (
                  <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 uppercase tracking-wider">
                    {selectedItemDetail.type === 'sticker' ? '🌟 Mystic Creature' : '🎖️ Badge'} · {selectedItemDetail.category}
                  </span>
                )}
              </div>

              {/* Description / Lore / Requirement Card */}
              <div
                className={`rounded-2xl p-4 sm:p-5 mb-5 text-center border-2 ${
                  selectedItemDetail.isUnlocked
                    ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                    : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                }`}
              >
                {selectedItemDetail.isUnlocked ? (
                  <>
                    <p className="text-sm sm:text-base font-bold leading-relaxed">
                      "{selectedItemDetail.description}"
                    </p>
                    <p className="text-xs font-black text-emerald-600 mt-2 flex items-center justify-center gap-1">
                      <span>🎉</span> Unlocked &amp; proudly shining in your collection!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      <span>🎯</span> How to Unlock
                    </p>
                    <p className="text-sm sm:text-base font-bold leading-relaxed text-slate-700">
                      {selectedItemDetail.description}
                    </p>
                    <p className="text-xs font-bold text-indigo-500 mt-2">
                      Keep exploring and playing to collect this treasure!
                    </p>
                  </>
                )}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  playPop();
                  setSelectedItemDetail(null);
                }}
                className={`w-full py-3.5 sm:py-4 rounded-2xl font-black text-base shadow-xl cursor-pointer border-b-4 transition-all ${
                  selectedItemDetail.isUnlocked
                    ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-amber-950 border-amber-600 hover:brightness-105'
                    : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white border-indigo-800 hover:brightness-105'
                }`}
              >
                {selectedItemDetail.isUnlocked ? '⭐ AWESOME! ⭐' : "🚀 LET'S GO EARN IT!"}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
