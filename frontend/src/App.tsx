import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Settings, Maximize2 } from 'lucide-react';
import ParticleBackground from './components/ui/ParticleBackground';
import GameBoard from './components/game/GameBoard';
import ScoreDisplay from './components/game/ScoreDisplay';
import GamingModal from './components/ui/GamingModal';
import NeonText from './components/ui/NeonText';
import GlassCard from './components/ui/GlassCard';
import GamingButton from './components/ui/GamingButton';
import SettingsPanel from './components/ui/SettingsPanel';
import './App.css';

interface GameStats {
  score: number;
  combo: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  moves: number;
  accuracy: number;
}

const App: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    combo: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    moves: 0,
    accuracy: 100,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false);
  const [boardResetKey, setBoardResetKey] = useState(0);
  const [victoryMessage, setVictoryMessage] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [, setFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [vsAi, setVsAi] = useState(true);
  const [aiDepth, setAiDepth] = useState(2);

  const savePreferences = (patch: Record<string, unknown>) => {
    const saved = localStorage.getItem('gamePreferences');
    const current = saved ? JSON.parse(saved) : {};
    localStorage.setItem(
      'gamePreferences',
      JSON.stringify({ ...current, ...patch })
    );
  };

  useEffect(() => {
    const saved = localStorage.getItem('gamePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setSoundEnabled(prefs.soundEnabled ?? true);
      setDarkMode(prefs.darkMode ?? true);
      setVsAi(prefs.vsAi ?? true);
      setAiDepth(prefs.aiDepth ?? 2);
    }
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    savePreferences({ soundEnabled: newState, darkMode, vsAi, aiDepth });
    playSound('toggle');
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log('Fullscreen not available');
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const playSound = (type: string) => {
    if (!soundEnabled) return;
    // Sound effects will be implemented with Web Audio API
    console.log('Playing sound:', type);
  };

  const updateScore = (points: number, isCombo: boolean = false) => {
    setGameStats(prev => ({
      ...prev,
      score: prev.score + points,
      combo: isCombo ? prev.combo + 1 : 0,
      xp: prev.xp + (points * (prev.combo + 1)),
      moves: prev.moves + 1,
      level: Math.floor((prev.xp + (points * (prev.combo + 1))) / prev.nextLevelXp) + 1,
    }));
    playSound('score');
  };

  const resetGame = () => {
    setBoardResetKey((k) => k + 1);
    setIsPaused(false);
    setGameStats({
      score: 0,
      combo: 0,
      level: 1,
      xp: 0,
      nextLevelXp: 100,
      moves: 0,
      accuracy: 100,
    });
    playSound('reset');
  };

  const handleGameEnd = (result: 'checkmate' | 'stalemate', winner: 'w' | 'b' | null) => {
    if (result === 'checkmate' && winner) {
      setVictoryMessage(winner === 'w' ? 'White wins by checkmate!' : 'Black wins by checkmate!');
    } else {
      setVictoryMessage('Draw — stalemate');
    }
    setShowVictory(true);
    playSound('victory');
  };

  return (
    <AnimatePresence>
      <motion.div
        key="page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7 }}
        className={`min-h-screen w-full overflow-x-hidden ${darkMode ? 'bg-gaming-dark' : 'bg-gray-50'}`}
      >
        {/* Animated Background */}
        <ParticleBackground />

        {/* Header Navigation */}
        <motion.header
          className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-black/30 border-b border-neon-cyan/20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <NeonText className="text-2xl font-bold">⚔️ CHESS ARENA</NeonText>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Sound Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleSound}
                className="p-2 rounded-lg bg-glass-light hover:bg-neon-cyan/20 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                title={soundEnabled ? 'Mute' : 'Unmute'}
                aria-label={soundEnabled ? 'Mute' : 'Unmute'}
              >
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-neon-cyan" />
                ) : (
                  <VolumeX className="w-5 h-5 text-neon-pink" />
                )}
              </motion.button>

              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDarkMode((prev) => {
                    const newMode = !prev;
                    savePreferences({ soundEnabled, darkMode: newMode, vsAi, aiDepth });
                    return newMode;
                  });
                }}
                className="p-2 rounded-lg bg-glass-light hover:bg-yellow-400/20 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <span className="w-5 h-5 text-yellow-300" role="img" aria-label="Light Mode">🌞</span>
                ) : (
                  <span className="w-5 h-5 text-gray-900" role="img" aria-label="Dark Mode">🌙</span>
                )}
              </motion.button>

              {/* Fullscreen Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleFullscreen}
                className="p-2 rounded-lg bg-glass-light hover:bg-neon-purple/20 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-purple"
                title="Fullscreen"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-5 h-5 text-neon-purple" />
              </motion.button>

              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-glass-light hover:bg-neon-pink/20 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-pink"
                title="Settings"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-neon-pink" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Game Container */}
        <main className="pt-20 pb-6 px-2 sm:px-4 relative z-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left Sidebar - Player Panel & Stats */}
            <motion.div
              className="md:col-span-1 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Player Panel (White) */}
              <GlassCard className="p-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/80 to-neon-cyan/30 border-2 border-neon-cyan flex items-center justify-center text-2xl font-bold text-gray-900 shadow-lg">
                    ♔
                  </div>
                  <div>
                    <div className="font-bold text-neon-cyan text-lg">You</div>
                    <div className="text-xs text-gray-400">White</div>
                  </div>
                </div>
                {/* Timer Placeholder */}
                <div className="mt-2 text-sm text-neon-cyan font-mono">00:00</div>
                {/* Captured Pieces Placeholder */}
                <div className="flex gap-1 mt-2">
                  {/* Example: <img src={pieceSvg} alt="" className="w-5 h-5" /> */}
                </div>
              </GlassCard>
              <ScoreDisplay stats={gameStats} />
            </motion.div>

            {/* Center - Game Board & Match Status */}
            <motion.div
              className="md:col-span-1 flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Match Status */}
              <GlassCard className="mb-2 px-4 py-2 flex items-center justify-center gap-3">
                <span className="text-xs font-semibold text-neon-cyan uppercase tracking-wider">Current Turn:</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-bold text-sm">
                  {/* This could be dynamic: White/Black */}
                  White
                </span>
                <span className="text-xs text-gray-400 ml-2">(vs {vsAi ? 'AI' : 'Player'})</span>
              </GlassCard>
              <div className={isPaused ? 'pointer-events-none opacity-60' : ''}>
                <GameBoard
                  resetKey={boardResetKey}
                  darkMode={darkMode}
                  paused={isPaused}
                  vsAi={vsAi}
                  aiDepth={aiDepth}
                  onScoreUpdate={updateScore}
                  onGameEnd={handleGameEnd}
                />
              </div>
            </motion.div>

            {/* Right Sidebar - Opponent Panel & Controls */}
            <motion.div
              className="md:col-span-1 space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Player Panel (Black/AI) */}
              <GlassCard className="p-4 flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black/80 to-neon-purple/30 border-2 border-neon-purple flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                    ♚
                  </div>
                  <div>
                    <div className="font-bold text-neon-purple text-lg">{vsAi ? 'AI' : 'Opponent'}</div>
                    <div className="text-xs text-gray-400">Black</div>
                  </div>
                </div>
                {/* Timer Placeholder */}
                <div className="mt-2 text-sm text-neon-purple font-mono">00:00</div>
                {/* Captured Pieces Placeholder */}
                <div className="flex gap-1 mt-2">
                  {/* Example: <img src={pieceSvg} alt="" className="w-5 h-5" /> */}
                </div>
              </GlassCard>
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-neon-cyan mb-4">Quick Controls</h3>
                <div className="space-y-3">
                  <GamingButton
                    variant="primary"
                    onClick={() => {
                      setIsPaused(true);
                      setShowPause(true);
                    }}
                    className="w-full"
                  >
                    Pause Game
                  </GamingButton>
                  <GamingButton
                    variant="secondary"
                    onClick={() => setShowNewGameConfirm(true)}
                    className="w-full"
                  >
                    New Game
                  </GamingButton>
                  <GamingButton
                    variant="accent"
                    onClick={() => setShowSettings(true)}
                    className="w-full"
                  >
                    Settings
                  </GamingButton>
                </div>
              </GlassCard>
              {/* Achievement Panel */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-neon-green mb-4 flex items-center gap-2">
                  <span role="img" aria-label="Achievements">🏆</span> Achievements
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <motion.div
                      className="flex items-center gap-2 text-gray-300"
                      whileHover={{ x: 5, scale: 1.05 }}
                    >
                      <span className="inline-block w-4 h-4 bg-neon-green rounded-full mr-1" />
                      First Move
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      className="flex items-center gap-2 text-gray-300"
                      whileHover={{ x: 5, scale: 1.05 }}
                    >
                      <span className="inline-block w-4 h-4 bg-neon-cyan rounded-full mr-1" />
                      Checkmate Master
                    </motion.div>
                  </li>
                  <li>
                    <motion.div
                      className="flex items-center gap-2 text-gray-300"
                      whileHover={{ x: 5, scale: 1.05 }}
                    >
                      <span className="inline-block w-4 h-4 bg-neon-pink rounded-full mr-1" />
                      Speed Demon
                    </motion.div>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </main>

        {/* Modals */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              darkMode={darkMode}
              soundEnabled={soundEnabled}
              vsAi={vsAi}
              aiDepth={aiDepth}
              onDarkModeChange={(v) => {
                setDarkMode(v);
                savePreferences({ darkMode: v, soundEnabled, vsAi, aiDepth });
              }}
              onSoundChange={(v) => {
                setSoundEnabled(v);
                savePreferences({ soundEnabled: v, darkMode, vsAi, aiDepth });
              }}
              onVsAiChange={(v) => {
                setVsAi(v);
                savePreferences({ vsAi: v, soundEnabled, darkMode, aiDepth });
              }}
              onAiDepthChange={(d) => {
                setAiDepth(d);
                savePreferences({ aiDepth: d, soundEnabled, darkMode, vsAi });
              }}
              onClose={() => setShowSettings(false)}
            />
          )}

          {showPause && (
            <GamingModal
              title="GAME PAUSED"
              onClose={() => {
                setShowPause(false);
                setIsPaused(false);
              }}
              closeOnAction={false}
              actions={[
                {
                  label: 'Resume',
                  onClick: () => {
                    setShowPause(false);
                    setIsPaused(false);
                  },
                  variant: 'primary',
                },
                {
                  label: 'Settings',
                  onClick: () => {
                    setShowPause(false);
                    setShowSettings(true);
                  },
                  variant: 'secondary',
                },
                {
                  label: 'New Game',
                  onClick: () => {
                    setShowPause(false);
                    setIsPaused(false);
                    setShowNewGameConfirm(true);
                  },
                  variant: 'accent',
                },
              ]}
            >
              <p className="text-center text-gray-300">Your game is paused. Take your time.</p>
            </GamingModal>
          )}

          {showNewGameConfirm && (
            <GamingModal
              title="NEW GAME?"
              onClose={() => setShowNewGameConfirm(false)}
              actions={[
                {
                  label: 'Start Over',
                  onClick: () => {
                    resetGame();
                    setShowNewGameConfirm(false);
                  },
                  variant: 'primary',
                },
                {
                  label: 'Cancel',
                  onClick: () => setShowNewGameConfirm(false),
                  variant: 'secondary',
                },
              ]}
            >
              <p className="text-center text-gray-300">
                Reset the board and clear your current score?
              </p>
            </GamingModal>
          )}

          {showVictory && (
            <GamingModal
              title="GAME OVER"
              onClose={() => setShowVictory(false)}
              actions={[
                {
                  label: 'Play Again',
                  onClick: () => {
                    resetGame();
                    setShowVictory(false);
                  },
                  variant: 'primary',
                },
                {
                  label: 'Close',
                  onClick: () => setShowVictory(false),
                  variant: 'secondary',
                },
              ]}
            >
              <div className="text-center space-y-3">
                <p className="text-xl font-bold text-neon-cyan">{victoryMessage}</p>
                <p className="text-2xl font-bold text-neon-purple">{gameStats.score} Points</p>
                <p className="text-gray-300">Moves: {gameStats.moves}</p>
              </div>
            </GamingModal>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
