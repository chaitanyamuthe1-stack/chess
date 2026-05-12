/* Loading screen component */
import { motion } from 'framer-motion';

export const LoadingScreen = () => {
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
            },
        },
    };

    const glowVariants = {
        animate: {
            boxShadow: [
                '0 0 20px rgba(0, 212, 255, 0.3)',
                '0 0 40px rgba(0, 212, 255, 0.6)',
                '0 0 20px rgba(0, 212, 255, 0.3)',
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
            },
        },
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                background: 'linear-gradient(135deg, #0a0e27 0%, #1a0033 100%)',
            }}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center space-y-8"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center gap-3"
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                            className="w-4 h-4 bg-neon-cyan rounded-full"
                        />
                    ))}
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="text-center"
                >
                    <h2 className="text-3xl font-gaming font-bold text-neon-cyan mb-2 tracking-widest">
                        INITIALIZING
                    </h2>
                    <p className="text-gray-400 text-sm font-gaming tracking-wider">
                        LOADING GAME ENGINE...
                    </p>
                </motion.div>

                <motion.div
                    variants={glowVariants as any}
                    animate="animate"
                    className="w-32 h-32 mx-auto border-4 border-transparent border-t-neon-cyan border-r-neon-purple rounded-full"
                />

                <motion.div
                    variants={itemVariants}
                    className="text-neon-cyan font-gaming text-sm tracking-widest"
                >
                    CONNECTING TO NEURAL NETWORK...
                </motion.div>
            </motion.div>
        </div>
    );
};
