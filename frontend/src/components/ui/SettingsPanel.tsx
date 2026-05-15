import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Moon, Sun, Bot } from 'lucide-react';
import GlassCard from './GlassCard';
import GamingButton from './GamingButton';

/**
 * Settings Panel Component
 * Premium settings interface with various toggles
 */
interface SettingsPanelProps {
    darkMode: boolean;
    soundEnabled: boolean;
    vsAi: boolean;
    aiDepth: number;
    onDarkModeChange: (enabled: boolean) => void;
    onSoundChange: (enabled: boolean) => void;
    onVsAiChange: (enabled: boolean) => void;
    onAiDepthChange: (depth: number) => void;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
    darkMode,
    soundEnabled,
    vsAi,
    aiDepth,
    onDarkModeChange,
    onSoundChange,
    onVsAiChange,
    onAiDepthChange,
    onClose,
}) => {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />

                {/* Settings Panel */}
                <motion.div
                    className="relative z-10 max-w-md w-full mx-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <GlassCard neon>
                        <div className="relative p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-neon-cyan">SETTINGS</h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-neon-pink" />
                                </motion.button>
                            </div>

                            {/* Settings Options */}
                            <div className="space-y-4 mb-6">
                                {/* Sound Toggle */}
                                <motion.div
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        {soundEnabled ? (
                                            <Volume2 className="w-5 h-5 text-neon-cyan" />
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-neon-pink" />
                                        )}
                                        <span className="font-semibold">Sound Effects</span>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onSoundChange(!soundEnabled)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-neon-cyan' : 'bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                                            animate={{ x: soundEnabled ? 24 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </motion.button>
                                </motion.div>

                                <motion.div
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        <Bot className="w-5 h-5 text-neon-cyan" />
                                        <span className="font-semibold">AI Opponent</span>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onVsAiChange(!vsAi)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${vsAi ? 'bg-neon-cyan' : 'bg-gray-600'}`}
                                    >
                                        <motion.div
                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                                            animate={{ x: vsAi ? 24 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </motion.button>
                                </motion.div>

                                {vsAi && (
                                    <motion.div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold">AI Strength</span>
                                            <span className="text-neon-cyan">Depth {aiDepth}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min={1}
                                            max={3}
                                            value={aiDepth}
                                            onChange={(e) => onAiDepthChange(Number(e.target.value))}
                                            className="w-full accent-neon-cyan"
                                        />
                                        <p className="text-xs text-gray-400">
                                            1 = fast · 2 = balanced · 3 = strong (slower)
                                        </p>
                                    </motion.div>
                                )}

                                {/* Dark Mode Toggle */}
                                <motion.div
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                                >
                                    <div className="flex items-center gap-3">
                                        {darkMode ? (
                                            <Moon className="w-5 h-5 text-neon-purple" />
                                        ) : (
                                            <Sun className="w-5 h-5 text-neon-green" />
                                        )}
                                        <span className="font-semibold">Dark Mode</span>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => onDarkModeChange(!darkMode)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-neon-purple' : 'bg-gray-600'
                                            }`}
                                    >
                                        <motion.div
                                            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full"
                                            animate={{ x: darkMode ? 24 : 0 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    </motion.button>
                                </motion.div>
                            </div>

                            {/* Info Section */}
                            <div className="bg-white/5 rounded-lg p-4 mb-6 border border-white/10">
                                <h3 className="font-bold text-neon-green mb-2">Game Info</h3>
                                <div className="text-sm text-gray-300 space-y-1">
                                    <p>Version: 1.0.0</p>
                                    <p>Made with ❤️</p>
                                </div>
                            </div>

                            {/* Close Button */}
                            <GamingButton onClick={onClose} className="w-full">
                                Close Settings
                            </GamingButton>
                        </div>
                    </GlassCard>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsPanel;
