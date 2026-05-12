/* Animated counter for scores and stats */
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export const AnimatedCounter = ({
    value,
    duration = 1,
    prefix = '',
    suffix = '',
    className = '',
}: AnimatedCounterProps) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let startValue = displayValue;
        const difference = value - startValue;
        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep++;
            const progress = currentStep / (duration * 100);
            const newValue = Math.floor(startValue + difference * progress);
            setDisplayValue(newValue);

            if (currentStep >= duration * 100) {
                setDisplayValue(value);
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [value, duration]);

    return (
        <motion.div
            className={className}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 } as any}
        >
            {prefix}
            {displayValue.toLocaleString()}
            {suffix}
        </motion.div>
    );
};
