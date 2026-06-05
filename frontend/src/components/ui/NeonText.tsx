import React from 'react';
import theme from '../../theme';

/**
 * Neon Text Component
 * Displays glowing neon-style text with optional glow effects
 */
interface NeonTextProps {
    children: React.ReactNode;
    className?: string;
    color?: 'cyan' | 'pink' | 'purple' | 'green';
    gradient?: boolean;
}

const NeonText: React.FC<NeonTextProps> = ({
    children,
    className = '',
    color = 'cyan',
    gradient = false,
}) => {
    const colorMap = {
        cyan: `text-[${theme.colors.primary}] drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]`,
        pink: `text-[${theme.colors.secondary}] drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]`,
        purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
        green: 'text-neon-green drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]',
    };

    const gradientClass = gradient
        ? 'bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-purple bg-clip-text text-transparent'
        : '';

    return (
        <span
            className={`
                ${colorMap[color]} ${gradientClass} font-gaming tracking-wider
                animate-pulse hover:scale-105 transition-transform duration-300
                ${className}
            `}
        >
            {children}
        </span>
    );
};

export default NeonText;
