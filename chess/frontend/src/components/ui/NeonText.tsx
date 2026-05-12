/* Neon glowing text component */
import { motion } from 'framer-motion';

interface NeonTextProps {
    children: string;
    color?: 'cyan' | 'purple' | 'pink' | 'green' | 'blue';
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    glow?: boolean;
    className?: string;
}

export const NeonText = ({
    children,
    color = 'cyan',
    size = 'lg',
    glow = true,
    className = '',
}: NeonTextProps) => {
    const colorClasses = {
        cyan: 'text-neon-cyan',
        purple: 'text-neon-purple',
        pink: 'text-neon-pink',
        green: 'text-neon-green',
        blue: 'text-neon-blue',
    };

    const sizeClasses = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
        xl: 'text-4xl',
        '2xl': 'text-6xl',
    };

    return (
        <motion.h1
            className={`
        font-gaming font-bold tracking-widest
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${glow ? 'drop-shadow-lg' : ''}
        ${className}
      `}
            style={
                glow
                    ? {
                        textShadow: `0 0 10px rgba(${color === 'cyan'
                            ? '0, 212, 255'
                            : color === 'purple'
                                ? '180, 0, 255'
                                : color === 'pink'
                                    ? '255, 0, 110'
                                    : color === 'green'
                                        ? '57, 255, 20'
                                        : '0, 128, 255'
                            }, 0.8), 0 0 20px rgba(${color === 'cyan'
                                ? '0, 212, 255'
                                : color === 'purple'
                                    ? '180, 0, 255'
                                    : color === 'pink'
                                        ? '255, 0, 110'
                                        : color === 'green'
                                            ? '57, 255, 20'
                                            : '0, 128, 255'
                            }, 0.5)`,
                    }
                    : undefined
            }
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.h1>
    );
};
