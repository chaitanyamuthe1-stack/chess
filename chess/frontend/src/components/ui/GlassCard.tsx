/* Glassmorphic card component with premium styling */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    glow?: 'cyan' | 'purple' | 'pink' | 'green' | 'none';
    variant?: 'default' | 'elevated' | 'inset';
}

export const GlassCard = ({
    children,
    className = '',
    hover = true,
    glow = 'cyan',
    variant = 'default',
}: GlassCardProps) => {
    const glowClasses = {
        cyan: 'hover:shadow-neon-cyan',
        purple: 'hover:shadow-neon-purple',
        pink: 'hover:shadow-neon-pink',
        green: 'hover:shadow-neon-green',
        none: '',
    };

    const variantClasses = {
        default: 'bg-white/5 border border-white/10 backdrop-blur-md',
        elevated: 'bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl',
        inset: 'bg-white/5 border border-white/5 backdrop-blur-md inset-shadow',
    };

    return (
        <motion.div
            className={`
        rounded-xl p-6
        transition-all duration-300
        ${variantClasses[variant]}
        ${hover ? glowClasses[glow] : ''}
        ${className}
      `}
            whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
        >
            {children}
        </motion.div>
    );
};
