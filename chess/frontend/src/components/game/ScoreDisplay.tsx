/* Score and stats display component */
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { GlowingProgressBar } from '../ui/GlowingProgressBar';
import { TrendingUp, Award, Zap } from 'lucide-react';

interface ScoreDisplayProps {
    score: number;
    combo: number;
    level: number;
    experience: number;
    maxExperience: number;
}

export const ScoreDisplay = ({
    score,
    combo,
    level,
    experience,
    maxExperience,
}: ScoreDisplayProps) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { type: 'spring' as const, stiffness: 100 },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Main Score */}
            <motion.div variants={itemVariants}>
                <GlassCard glow="cyan" variant="elevated">
                    <div className="flex items-center gap-4">
                        <div className="text-neon-cyan text-3xl">
                            <TrendingUp size={32} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm uppercase tracking-widest">Score</p>
                            <AnimatedCounter
                                value={score}
                                duration={0.5}
                                className="text-4xl font-gaming font-bold text-neon-cyan"
                            />
                        </div>
                    </div>
                </GlassCard>
            </motion.div>

            {/* Combo Counter */}
            {combo > 0 && (
                <motion.div
                    variants={itemVariants}
                    animate={{
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            '0 0 20px rgba(57, 255, 20, 0.3)',
                            '0 0 40px rgba(57, 255, 20, 0.8)',
                            '0 0 20px rgba(57, 255, 20, 0.3)',
                        ],
                    }}
                    transition={{ duration: 0.6, repeat: Infinity } as any}
                >
                    <GlassCard glow="green" variant="elevated">
                        <div className="flex items-center gap-4">
                            <div className="text-neon-green text-3xl">
                                <Zap size={32} />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm uppercase tracking-widest">Combo</p>
                                <p className="text-4xl font-gaming font-bold text-neon-green">x{combo}</p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            )}

            {/* Level and Experience */}
            <motion.div variants={itemVariants}>
                <GlassCard glow="purple" variant="elevated">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Award size={24} className="text-neon-purple" />
                                <span className="text-gray-300 font-gaming">LEVEL</span>
                            </div>
                            <span className="text-2xl font-gaming font-bold text-neon-purple">{level}</span>
                        </div>
                        <GlowingProgressBar
                            value={experience}
                            max={maxExperience}
                            color="purple"
                            label="Experience"
                            showPercentage
                        />
                    </div>
                </GlassCard>
            </motion.div>
        </motion.div>
    );
};
