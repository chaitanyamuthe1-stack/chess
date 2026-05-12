/* Toast notification component */
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ToastItem = ({ toast, onClose }: ToastProps) => {
    const icons = {
        success: <CheckCircle size={20} className="text-neon-green" />,
        error: <AlertCircle size={20} className="text-neon-pink" />,
        info: <Info size={20} className="text-neon-cyan" />,
        warning: <AlertTriangle size={20} className="text-yellow-400" />,
    };

    const colors = {
        success: 'bg-neon-green/20 border-neon-green',
        error: 'bg-neon-pink/20 border-neon-pink',
        info: 'bg-neon-cyan/20 border-neon-cyan',
        warning: 'bg-yellow-400/20 border-yellow-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className={`
        flex items-center gap-3
        px-4 py-3 rounded-lg
        backdrop-blur-md border
        ${colors[toast.type]}
      `}
        >
            {icons[toast.type]}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
                onClick={() => onClose(toast.id)}
                className="text-gray-400 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

interface ToastContainerProps {
    toasts: Toast[];
    onClose: (id: string) => void;
}

export const ToastContainer = ({ toasts, onClose }: ToastContainerProps) => {
    return (
        <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onClose={onClose} />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
};
