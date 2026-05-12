/* Gaming button component with neon effects */
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GamingButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    glow?: boolean;
}

export const GamingButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    glow = true,
}: GamingButtonProps) => {
    const variants = {
        primary: 'bg-neon-cyan text-gaming-dark hover:shadow-neon-cyan',
        secondary: 'bg-neon-purple text-white hover:shadow-neon-purple',
        danger: 'bg-neon-pink text-white hover:shadow-neon-pink',
        success: 'bg-neon-green text-gaming-dark hover:shadow-neon-green',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={onClick}
            disabled={disabled}
            className={`
        font-gaming font-bold uppercase tracking-wider
        border-2 border-transparent rounded-lg
        relative overflow-hidden
        transition-all duration-300
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${glow ? 'shadow-lg' : ''}
        ${className}
      `}
        >
            <div className="absolute inset-0 bg-gradient-gaming opacity-0 hover:opacity-20 transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
};
