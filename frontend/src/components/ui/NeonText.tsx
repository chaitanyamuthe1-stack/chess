import React from 'react';

/**
 * Neon Text Component
 * Displays glowing neon-style text with optional glow effects
 */
interface NeonTextProps {
    children: React.ReactNode;
    className?: string;
    color?: 'cyan' | 'pink' | 'purple' | 'green';
}

const NeonText: React.FC<NeonTextProps> = ({
    children,
    className = '',
    color = 'cyan',
}) => {
    const colorMap = {
        cyan: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,217,255,0.8)]',
        pink: 'text-neon-pink drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]',
        purple: 'text-neon-purple drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]',
        green: 'text-neon-green drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]',
    };

    return (
        <span className={`${colorMap[color]} font-gaming tracking-wider ${className}`}>
            {children}
        </span>
    );
};

export default NeonText;
