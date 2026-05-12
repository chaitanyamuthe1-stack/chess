/* Animated gaming modal component */
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface GamingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg';
    type?: 'default' | 'victory' | 'defeat' | 'pause';
}

export const GamingModal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    type = 'default',
}: GamingModalProps) => {
    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
    };

    const typeColors = {
        default: 'border-neon-cyan',
        victory: 'border-neon-green',
        defeat: 'border-neon-pink',
        pause: 'border-neon-purple',
    };

    const typeGlows = {
        default: 'shadow-neon-cyan',
        victory: 'shadow-neon-green',
        defeat: 'shadow-neon-pink',
        pause: 'shadow-neon-purple',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 50 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                        className={`
              fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
              ${sizeClasses[size]}
              w-full mx-4
              bg-white/5 border-2 ${typeColors[type]}
              backdrop-blur-xl rounded-2xl
              ${typeGlows[type]}
              p-8 z-50
            `}
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-neon-cyan transition-colors"
                        >
                            <X size={24} />
                        </button>

                        {/* Title */}
                        {title && (
                            <h2 className="text-3xl font-gaming font-bold text-neon-cyan mb-6 tracking-widest">
                                {title}
                            </h2>
                        )}

                        {/* Content */}
                        <div className="text-white text-center">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
