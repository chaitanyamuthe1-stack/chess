import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading Screen Component
 * Immersive loading screen with animations
 */
interface LoadingScreenProps {
    progress?: number;
    text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
    progress = 0,
    text = 'Loading game...',
}) => {
    const containerVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-gaming-dark to-gaming-darker overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-20 left-20 w-64 h-64 bg-neon-purple rounded-full blur-3xl opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-64 h-64 bg-neon-cyan rounded-full blur-3xl opacity-20"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.4, 0.2, 0.4],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center space-y-8"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {/* Logo/Title */}
                <motion.div variants={itemVariants}>
                    <h1 className="text-5xl font-bold font-gaming drop-shadow-lg">
                        <span className="text-neon-cyan">CHESS</span>
                        <span className="text-neon-pink"> ARENA</span>
                    </h1>
                </motion.div>

                {/* Spinner */}
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center"
                >
                    <div className="relative w-32 h-32">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 rounded-full border-2 border-transparent"
                                style={{
                                    borderTopColor: i === 0 ? '#00d9ff' : i === 1 ? '#a855f7' : '#ec4899',
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 2 + i * 0.5,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-neon-cyan">♔</span>
                        </div>
                    </div>
                </motion.div>

                {/* Loading text */}
                <motion.p variants={itemVariants} className="text-xl text-gray-300">
                    {text}
                </motion.p>

                {/* Progress bar */}
                <motion.div variants={itemVariants} className="w-64">
                    <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full shadow-glow"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{progress}%</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;
