import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X } from 'lucide-react';
import GlassCard from './GlassCard';
import theme from '../../theme';

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

const modalAnimation: Variants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { type: 'spring' as const, damping: 20 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

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
    const toggleStyles = (enabled: boolean, color: string) => `
        w-12 h-6 rounded-full flex items-center px-1
        ${enabled ? `bg-[${color}]` : 'bg-gray-500'}
        transition-colors
    `;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center"
                variants={modalAnimation}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                />

                {/* Settings Card */}
                <GlassCard className="relative z-10 w-full max-w-md p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">Settings</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-white">Dark Mode</span>
                        <button
                            onClick={() => onDarkModeChange(!darkMode)}
                            className={toggleStyles(darkMode, theme.colors.success)}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full"
                                layout
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        </button>
                    </div>

                    {/* Sound Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-white">Sound</span>
                        <button
                            onClick={() => onSoundChange(!soundEnabled)}
                            className={toggleStyles(soundEnabled, theme.colors.blue)}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full"
                                layout
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        </button>
                    </div>

                    {/* AI Depth Slider */}
                    <div className="space-y-2">
                        <span className="text-white">AI Depth</span>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={aiDepth}
                            onChange={(e) => onAiDepthChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none"
                        />
                    </div>

                    {/* Play Against AI Toggle */}
                    <div className="flex items-center justify-between">
                        <span className="text-white">Play Against AI</span>
                        <button
                            onClick={() => onVsAiChange(!vsAi)}
                            className={toggleStyles(vsAi, theme.colors.purple)}
                        >
                            <motion.div
                                className="w-5 h-5 bg-white rounded-full"
                                layout
                                transition={{ type: 'spring', stiffness: 300 }}
                            />
                        </button>
                    </div>
                </GlassCard>
            </motion.div>
        </AnimatePresence>
    );
};

export default SettingsPanel;
