import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, TrendingUp, Target } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import AnimatedCounter from '../ui/AnimatedCounter';
import GlowingProgressBar from '../ui/GlowingProgressBar';

/**
 * Score Display Component
 * Shows game statistics with animated counters and progress bars
 */
interface GameStats {
    score: number;
    combo: number;
    level: number;
    xp: number;
    nextLevelXp: number;
    moves: number;
    accuracy: number;
}

interface ScoreDisplayProps {
    stats: GameStats;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ stats }) => {
    const statItems = [
        {
            icon: Trophy,
            label: 'Score',
            value: stats.score,
            color: 'cyan',
        },
        {
            icon: Zap,
            label: 'Combo',
            value: stats.combo,
            color: 'pink',
        },
        {
            icon: Target,
            label: 'Accuracy',
            value: stats.accuracy,
            color: 'green',
            suffix: '%',
        },
        {
            icon: TrendingUp,
            label: 'Moves',
            value: stats.moves,
            color: 'purple',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Level Display */}
            <GlassCard neon className="p-6">
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="text-center">
                        <h3 className="text-sm font-bold text-gray-400 mb-2">LEVEL</h3>
                        <motion.div
                            className="text-6xl font-black text-neon-purple drop-shadow-lg"
                            key={stats.level}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {stats.level}
                        </motion.div>
                    </div>

                    {/* XP Progress */}
                    <div>
                        <GlowingProgressBar
                            value={stats.xp}
                            max={stats.nextLevelXp}
                            color="purple"
                            label="XP Progress"
                            showPercentage={true}
                        />
                    </div>
                </motion.div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {statItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <GlassCard
                            key={idx}
                            className="p-4"
                            hover={false}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + idx * 0.1 }}
                                className="space-y-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-neon-cyan" />
                                    <span className="text-xs font-bold text-gray-400">{item.label}</span>
                                </div>
                                <div className={`text-2xl font-bold text-neon-${item.color}`}>
                                    <AnimatedCounter
                                        value={item.value}
                                        suffix={item.suffix}
                                        color={item.color as any}
                                        duration={0.5}
                                    />
                                </div>
                            </motion.div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Main Score Display */}
            <GlassCard neon className="p-6 bg-gradient-to-br from-neon-purple/10 to-neon-cyan/10">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center space-y-2"
                >
                    <h3 className="text-sm font-bold text-gray-400">TOTAL SCORE</h3>
                    <motion.div
                        key={stats.score}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                    >
                        <AnimatedCounter
                            value={stats.score}
                            color="cyan"
                            duration={0.6}
                        />
                    </motion.div>

                    {/* Combo Display */}
                    {stats.combo > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-sm text-neon-pink font-bold"
                        >
                            🔥 COMBO x{stats.combo}
                        </motion.div>
                    )}
                </motion.div>
            </GlassCard>

            {/* Recent Action */}
            <GlassCard className="p-4 text-center">
                <p className="text-xs text-gray-400">Last Action: +50 points</p>
            </GlassCard>
        </div>
    );
};

export default ScoreDisplay;
