import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated Counter Component
 * Counts up numbers with animation effects
 */
interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    color?: 'cyan' | 'pink' | 'purple' | 'green';
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
    value,
    duration = 0.6,
    prefix = '',
    suffix = '',
    color = 'cyan',
}) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setDisplayValue(Math.floor(value * progress));

            if (progress < 1) {
                animationId = requestAnimationFrame(animate);
            }
        };

        animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [value, duration]);

    const colorMap = {
        cyan: 'text-neon-cyan',
        pink: 'text-neon-pink',
        purple: 'text-neon-purple',
        green: 'text-neon-green',
    };

    return (
        <motion.div
            className={`font-bold text-3xl font-gaming ${colorMap[color]}`}
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {prefix}{displayValue.toLocaleString()}{suffix}
        </motion.div>
    );
};

export default AnimatedCounter;
