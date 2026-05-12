/* Animated progress bar with glow effects */
import { motion } from 'framer-motion';

interface GlowingProgressBarProps {
    value: number;
    max?: number;
    color?: 'cyan' | 'purple' | 'pink' | 'green';
    label?: string;
    showPercentage?: boolean;
    animated?: boolean;
}

export const GlowingProgressBar = ({
    value,
    max = 100,
    color = 'cyan',
    label,
    showPercentage = true,
    animated = true,
}: GlowingProgressBarProps) => {
    const percentage = Math.min((value / max) * 100, 100);

    const colorClasses = {
        cyan: { bar: 'bg-neon-cyan', glow: 'shadow-neon-cyan' },
        purple: { bar: 'bg-neon-purple', glow: 'shadow-neon-purple' },
        pink: { bar: 'bg-neon-pink', glow: 'shadow-neon-pink' },
        green: { bar: 'bg-neon-green', glow: 'shadow-neon-green' },
    };

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm font-gaming text-gray-300">{label}</span>}
                    {showPercentage && (
                        <span className="text-sm font-gaming text-neon-cyan">{percentage.toFixed(0)}%</span>
                    )}
                </div>
            )}

            <div className="w-full h-3 bg-black/50 border border-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    className={`h-full ${colorClasses[color].bar} ${animated ? colorClasses[color].glow : ''
                        } rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                        duration: animated ? 0.8 : 0.3,
                        ease: 'easeOut',
                        type: 'spring',
                        stiffness: 50,
                    }}
                />
            </div>
        </div>
    );
};
