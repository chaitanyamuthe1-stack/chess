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
  const [darkMode, setDarkMode] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('gamePreferences');
    if (saved) {
      const prefs = JSON.parse(saved);
      setSoundEnabled(prefs.soundEnabled ?? true);
      setDarkMode(prefs.darkMode ?? true);
    }
  }, []);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('gamePreferences', JSON.stringify({
      soundEnabled: newState,
      darkMode,
    }));
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

  return (
    <div className={`min-h-screen w-full overflow-hidden ${darkMode ? 'bg-gaming-dark' : 'bg-gray-50'}`}>
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
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleSound}
              className="p-2 rounded-lg bg-glass-light hover:bg-neon-cyan/20 transition-colors"
              title={soundEnabled ? 'Mute' : 'Unmute'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-neon-cyan" />
              ) : (
                <VolumeX className="w-5 h-5 text-neon-pink" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg bg-glass-light hover:bg-neon-purple/20 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-neon-purple" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-glass-light hover:bg-neon-pink/20 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-neon-pink" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Game Container */}
      <main className="pt-20 pb-6 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stats */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ScoreDisplay stats={gameStats} />
          </motion.div>

          {/* Center - Game Board */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <GameBoard onScoreUpdate={updateScore} />
          </motion.div>

          {/* Right Sidebar - Quick Actions */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-neon-cyan mb-4">Quick Controls</h3>
              <div className="space-y-3">
                <GamingButton
                  variant="primary"
                  onClick={() => setShowPause(true)}
                  className="w-full"
                >
                  Pause Game
                </GamingButton>
                <GamingButton
                  variant="secondary"
                  onClick={() => setShowVictory(true)}
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
              <h3 className="text-lg font-bold text-neon-green mb-4">🏆 Achievements</h3>
              <div className="space-y-2 text-sm">
                <motion.p
                  className="text-gray-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  ✓ First Move
                </motion.p>
                <motion.p
                  className="text-gray-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  ✓ Checkmate Master
                </motion.p>
                <motion.p
                  className="text-gray-300 flex items-center gap-2"
                  whileHover={{ x: 5 }}
                >
                  ✓ Speed Demon
                </motion.p>
              </div>
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
            onDarkModeChange={setDarkMode}
            onSoundChange={setSoundEnabled}
            onClose={() => setShowSettings(false)}
          />
        )}

        {showPause && (
          <GamingModal
            title="GAME PAUSED"
            onClose={() => setShowPause(false)}
            actions={[
              { label: 'Resume', onClick: () => setShowPause(false), variant: 'primary' },
              { label: 'Settings', onClick: () => { setShowPause(false); setShowSettings(true); }, variant: 'secondary' },
              { label: 'Main Menu', onClick: () => setShowPause(false), variant: 'accent' },
            ]}
          >
            <p className="text-center text-gray-300">Your game is paused. Take your time.</p>
          </GamingModal>
        )}

        {showVictory && (
          <GamingModal
            title="VICTORY! 🎉"
            onClose={() => setShowVictory(false)}
            actions={[
              { label: 'Play Again', onClick: () => setShowVictory(false), variant: 'primary' },
              { label: 'Main Menu', onClick: () => setShowVictory(false), variant: 'secondary' },
            ]}
          >
            <div className="text-center space-y-3">
              <p className="text-2xl font-bold text-neon-cyan">{gameStats.score} Points</p>
              <p className="text-gray-300">Moves: {gameStats.moves}</p>
              <p className="text-gray-300">Accuracy: {gameStats.accuracy}%</p>
            </div>
          </GamingModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
