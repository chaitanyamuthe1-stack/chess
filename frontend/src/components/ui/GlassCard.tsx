import React from 'react';
import { motion } from 'framer-motion';

/**
 * Glass Card Component
 * Creates glassmorphism effect cards with frosted glass appearance
 */
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    neon?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
    children,
    className = '',
    hover = true,
    neon = false,
}) => {
    return (
        <motion.div
            whileHover={hover ? { scale: 1.02 } : undefined}
            className={`
        relative rounded-2xl backdrop-blur-xl
        bg-white/5 border border-white/10
        overflow-hidden
        ${neon ? 'shadow-glow border-neon-cyan/30' : 'shadow-lg'}
        transition-all duration-300
        ${className}
      `}
        >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
