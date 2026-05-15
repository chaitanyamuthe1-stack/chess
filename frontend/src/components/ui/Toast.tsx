import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Displays temporary notifications with various types
 */interface ToastProps {
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
        success: 'bg-gradient-to-r from-neon-green to-emerald-600 border-neon-green/50',
        error: 'bg-gradient-to-r from-red-600 to-rose-600 border-red-500/50',
        info: 'bg-gradient-to-r from-neon-cyan to-blue-600 border-neon-cyan/50',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 border-yellow-500/50',
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
        flex items-center gap-3 px-6 py-4 rounded-lg backdrop-blur-xl
        border ${typeStyles[type]}
        text-white font-semibold shadow-lg
      `}
        >
            {icons[type]}
            <span className="flex-1">{message}</span>
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
