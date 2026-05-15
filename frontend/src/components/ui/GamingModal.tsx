import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import GamingButton from './GamingButton';

/**
 * Gaming Modal Component
 * Immersive modal dialogs with cinematic animations
 */
interface ModalAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

interface GamingModalProps {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
    actions?: ModalAction[];
    closeOnAction?: boolean;
}

const GamingModal: React.FC<GamingModalProps> = ({
    title,
    children,
    onClose,
    actions = [],
    closeOnAction = true,
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

                {/* Modal Content */}
                <motion.div
                    className="relative z-10 max-w-md w-full mx-4"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-gaming-dark/95 to-gaming-darker/95 border border-neon-cyan/30 overflow-hidden shadow-2xl">
                        {/* Glowing border effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-pink opacity-10 rounded-2xl" />

                        {/* Content */}
                        <div className="relative z-10 p-8">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-neon-cyan drop-shadow-lg">
                                    {title}
                                </h2>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-neon-pink" />
                                </motion.button>
                            </div>

                            {/* Body */}
                            <div className="mb-8">
                                {children}
                            </div>

                            {/* Actions */}
                            {actions.length > 0 && (
                                <motion.div
                                    className={`grid gap-3 ${
                                        actions.length >= 3
                                            ? 'grid-cols-1 sm:grid-cols-3'
                                            : 'grid-cols-2'
                                    }`}
                                >
                                    {actions.map((action, idx) => (
                                        <GamingButton
                                            key={idx}
                                            variant={action.variant || 'primary'}
                                            onClick={() => {
                                                action.onClick();
                                                if (closeOnAction) onClose();
                                            }}
                                        >
                                            {action.label}
                                        </GamingButton>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default GamingModal;
