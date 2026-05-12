import React from 'react';
import { motion } from 'framer-motion';

/**
 * Glowing Progress Bar Component
 * Animated progress bar with neon glow effects
 */
interface GlowingProgressBarProps {
    value: number;
    max?: number;
    color?: 'cyan' | 'purple' | 'pink' | 'green';
    label?: string;
    showPercentage?: boolean;
}

const GlowingProgressBar: React.FC<GlowingProgressBarProps> = ({
    value,
    max = 100,
    color = 'cyan',
    label,
    showPercentage = true,
}) => {
    const percentage = (value / max) * 100;

    const colorMap = {
        cyan: 'from-neon-cyan to-blue-500 shadow-glow-cyan',
        purple: 'from-neon-purple to-violet-500 shadow-glow',
        pink: 'from-neon-pink to-rose-500 shadow-glow-pink',
        green: 'from-neon-green to-emerald-500',
    };

    return (
        <div className="w-full space-y-2">
            {label && (
                <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-300">{label}</span>
                    {showPercentage && (
                        <span className="text-xs font-bold text-neon-cyan">{Math.round(percentage)}%</span>
                    )}
                </div>
            )}

            <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
                <motion.div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorMap[color]} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />

                {/* Shine effect */}
                <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-transparent w-full rounded-full"
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </div>
    );
};

export default GlowingProgressBar;
