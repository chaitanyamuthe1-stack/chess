import React from 'react';
import { motion } from 'framer-motion';

/**
 * Gaming Button Component
 * Premium gaming button with multiple variants and effects
 */
interface GamingButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

const GamingButton: React.FC<GamingButtonProps> = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false,
}) => {
    const variantStyles = {
        primary: 'bg-gradient-to-r from-neon-purple to-neon-cyan text-white shadow-glow hover:shadow-intense',
        secondary: 'bg-gradient-to-r from-neon-cyan to-neon-green text-white shadow-glow-cyan',
        accent: 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-glow-pink',
        danger: 'bg-red-600 text-white shadow-lg hover:shadow-2xl',
    };

    const sizeStyles = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative font-bold rounded-lg
        transition-all duration-200
        uppercase tracking-wider
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
        overflow-hidden
      `}
        >
            {/* Button shine effect */}
            <span className="absolute inset-0 bg-white/0 hover:bg-white/20 transition-all" />

            {/* Content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};

export default GamingButton;
