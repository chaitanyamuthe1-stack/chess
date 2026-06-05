import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import theme from '../../theme';

/**
 * Toast Notification Component
 * Displays temporary notifications with various types
 */
interface ToastProps {
    id: string;
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
    id,
    message,
    type = 'info',
    duration = 3000,
    onClose,
}) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const typeStyles = {
        success: `bg-gradient-to-r from-[${theme.colors.success}] to-emerald-600 border-${theme.colors.success}/50`,
        error: `bg-gradient-to-r from-[${theme.colors.error}] to-rose-600 border-${theme.colors.error}/50`,
        info: `bg-gradient-to-r from-[${theme.colors.info}] to-blue-600 border-${theme.colors.info}/50`,
        warning: `bg-gradient-to-r from-[${theme.colors.warning}] to-orange-600 border-${theme.colors.warning}/50`,
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <AlertCircle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
        warning: <AlertCircle className="w-5 h-5" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 100 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`
        flex items-center gap-3 px-6 py-4 rounded-lg backdrop-blur-md
        border ${typeStyles[type]}
        text-white font-semibold shadow-xl
      `}
        >
            {icons[type]}
            <span className="flex-1">{message}</span>
            <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/50 rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration }}
            />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onClose(id)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
            >
                <X className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
};

export default Toast;
