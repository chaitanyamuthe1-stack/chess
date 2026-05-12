/* Header/Navigation component */
import { motion } from 'framer-motion';
import { Settings, Volume2, Maximize2, Menu } from 'lucide-react';
import { GamingButton } from '../ui/GamingButton';
import { useState } from 'react';

interface HeaderProps {
    title: string;
    onSettings?: () => void;
    onMenu?: () => void;
    soundEnabled?: boolean;
    onSoundToggle?: () => void;
    onFullscreen?: () => void;
}

export const Header = ({
    title,
    onSettings,
    onMenu,
    soundEnabled = true,
    onSoundToggle,
    onFullscreen,
}: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 bg-white/5"
        >
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Left side - Title */}
                <motion.div
                    className="flex-1"
                    whileHover={{ scale: 1.05 }}
                >
                    <h1 className="text-3xl font-gaming font-bold tracking-widest">
                        <span className="text-neon-cyan">&gt;</span>
                        <span className="text-white mx-2">{title}</span>
                        <span className="text-neon-cyan">&lt;</span>
                    </h1>
                </motion.div>

                {/* Right side - Controls */}
                <div className="flex items-center gap-3">
                    {onSoundToggle && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onSoundToggle}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Volume2
                                size={24}
                                className={soundEnabled ? 'text-neon-cyan' : 'text-gray-500'}
                            />
                        </motion.button>
                    )}

                    {onFullscreen && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onFullscreen}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Maximize2 size={24} className="text-neon-cyan" />
                        </motion.button>
                    )}

                    {onSettings && (
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onSettings}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Settings size={24} className="text-neon-cyan" />
                        </motion.button>
                    )}

                    {onMenu && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Menu size={24} className="text-neon-cyan" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Menu dropdown */}
            {isMenuOpen && onMenu && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="border-t border-white/10 bg-white/5 backdrop-blur-xl px-4 py-4"
                >
                    <GamingButton variant="secondary" onClick={() => { onMenu?.(); setIsMenuOpen(false); }}>
                        Menu
                    </GamingButton>
                </motion.div>
            )}
        </motion.header>
    );
};
