import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/layout/Header';
import { ScoreDisplay } from './components/game/ScoreDisplay';
import { GameBoard } from './components/game/GameBoard';
import { GamingButton } from './components/ui/GamingButton';
import { GamingModal } from './components/ui/GamingModal';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { ToastContainer } from './components/ui/Toast';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { GlassCard } from './components/ui/GlassCard';
import { NeonText } from './components/ui/NeonText';
import { useToast } from './hooks/useToast';
import './App.css';

type GameState = 'menu' | 'playing' | 'victory' | 'defeat' | 'paused';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameState, setGameState] = useState<GameState>('menu');
  const { toasts, addToast, removeToast } = useToast();

  const maxExperience = level * 100;

  const handleStartGame = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setGameState('playing');
      addToast('Game started!', 'success', 2000);
    }, 2000);
  };

  const handleGameAction = () => {
    const points = Math.floor(Math.random() * 100) + 50;
    setScore(score + points);
    setCombo(combo + 1);
    setExperience(experience + 10);

    if (experience + 10 >= maxExperience) {
      setExperience(0);
      setLevel(level + 1);
      addToast(`Level Up! You are now level ${level + 1}`, 'success', 3000);
    }

    addToast(`+${points} Points!`, 'success', 1500);
  };

  const handleVictory = () => {
    setGameState('victory');
    addToast('Victory achieved!', 'success', 3000);
  };

  // const handleDefeat = () => {
  //   setGameState('defeat');
  //   addToast('Game Over!', 'error', 3000);
  // };

  const handlePause = () => {
    setGameState('paused');
  };

  const handleResume = () => {
    setGameState('playing');
  };

  const handleReset = () => {
    setScore(0);
    setCombo(0);
    setLevel(1);
    setExperience(0);
    setGameState('menu');
    addToast('Game reset', 'info', 1500);
  };

  const handleSettings = () => {
    addToast('Settings not implemented yet', 'info', 2000);
  };

  const handleFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
    addToast(`Sound ${!soundEnabled ? 'enabled' : 'disabled'}`, 'info', 1500);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a0033 100%)',
      }}
    >
      <ParticleBackground />

      <Header
        title="CHESS MASTER"
        onSettings={handleSettings}
        soundEnabled={soundEnabled}
        onSoundToggle={handleSoundToggle}
        onFullscreen={handleFullscreen}
      />

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {gameState === 'menu' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center mb-12">
              <NeonText color="cyan" size="2xl" glow>
                CHESS MASTER
              </NeonText>
              <p className="text-gray-400 mt-4 font-gaming tracking-widest">
                EXPERIENCE THE ULTIMATE GAMING INTERFACE
              </p>
            </div>

            <GlassCard glow="cyan" variant="elevated" className="text-center py-12">
              <div className="space-y-6">
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Prepare yourself for an immersive chess experience with modern
                  AAA-game quality visuals and smooth animations.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <GamingButton
                    variant="primary"
                    size="lg"
                    onClick={handleStartGame}
                  >
                    START GAME
                  </GamingButton>
                  <GamingButton
                    variant="secondary"
                    size="lg"
                    onClick={handleSettings}
                  >
                    SETTINGS
                  </GamingButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left: Game Board */}
            <div className="lg:col-span-2">
              <GameBoard />
            </div>

            {/* Right: Stats */}
            <div className="space-y-6">
              <ScoreDisplay
                score={score}
                combo={combo}
                level={level}
                experience={experience}
                maxExperience={maxExperience}
              />

              <div className="space-y-3">
                <GamingButton
                  variant="success"
                  onClick={handleGameAction}
                  className="w-full"
                  glow
                >
                  MAKE MOVE
                </GamingButton>
                <GamingButton
                  variant="success"
                  onClick={handleVictory}
                  className="w-full"
                >
                  WIN
                </GamingButton>
                <GamingButton
                  variant="danger"
                  onClick={handlePause}
                  className="w-full"
                >
                  PAUSE
                </GamingButton>
              </div>
            </div>
          </motion.div>
        )}

        {(gameState === 'victory' || gameState === 'defeat') && (
          <GamingModal
            isOpen={true}
            type={gameState === 'victory' ? 'victory' : 'defeat'}
            title={gameState === 'victory' ? '🎉 VICTORY 🎉' : '💀 DEFEAT 💀'}
            onClose={() => setGameState('menu')}
          >
            <div className="space-y-6 py-8">
              <div>
                <p className="text-4xl font-gaming font-bold text-neon-cyan mb-2">
                  {score}
                </p>
                <p className="text-gray-400 tracking-widest">TOTAL SCORE</p>
              </div>

              <div className="flex justify-around text-center">
                <div>
                  <p className="text-2xl font-gaming text-neon-green">{level}</p>
                  <p className="text-sm text-gray-400 tracking-widest">LEVEL</p>
                </div>
                <div>
                  <p className="text-2xl font-gaming text-neon-purple">{combo}</p>
                  <p className="text-sm text-gray-400 tracking-widest">COMBO</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <GamingButton variant="primary" onClick={handleReset}>
                  PLAY AGAIN
                </GamingButton>
                <GamingButton variant="secondary" onClick={() => setGameState('menu')}>
                  MAIN MENU
                </GamingButton>
              </div>
            </div>
          </GamingModal>
        )}

        {gameState === 'paused' && (
          <GamingModal
            isOpen={true}
            type="pause"
            title="⏸ PAUSED ⏸"
            onClose={handleResume}
          >
            <div className="space-y-6 py-8">
              <p className="text-gray-300 text-lg">GAME PAUSED</p>

              <div className="flex gap-3 justify-center flex-col">
                <GamingButton
                  variant="primary"
                  size="lg"
                  onClick={handleResume}
                >
                  RESUME
                </GamingButton>
                <GamingButton
                  variant="secondary"
                  size="lg"
                  onClick={handleSettings}
                >
                  SETTINGS
                </GamingButton>
                <GamingButton
                  variant="danger"
                  size="lg"
                  onClick={() => {
                    setGameState('menu');
                    handleReset();
                  }}
                >
                  QUIT TO MENU
                </GamingButton>
              </div>
            </div>
          </GamingModal>
        )}
      </main>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;
