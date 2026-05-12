/* Game board component with modern styling */
import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';

interface GameBoardProps {
    children?: React.ReactNode;
    size?: number;
}

export const GameBoard = ({ children, size = 400 }: GameBoardProps) => {
    const squares = Array.from({ length: 64 }, (_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const isLight = (row + col) % 2 === 0;

        return (
            <motion.div
                key={i}
                className={`
          w-full aspect-square
          flex items-center justify-center
          cursor-pointer
          transition-all duration-200
          relative
          group
          ${isLight
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800'
                        : 'bg-gradient-to-br from-gray-900 to-black'
                    }
          border border-white/5
          hover:border-white/20
        `}
                whileHover={{
                    scale: 1.02,
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                }}
                whileTap={{ scale: 0.98 }}
            >
                <div className="absolute inset-0 bg-gradient-gaming opacity-0 group-hover:opacity-20 transition-opacity rounded" />
            </motion.div>
        );
    });

    return (
        <GlassCard glow="cyan" variant="elevated" className="w-full max-w-lg mx-auto">
            <div
                className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden border-2 border-neon-cyan/30 shadow-neon-cyan"
                style={{ maxWidth: `${size}px` }}
            >
                {squares}
            </div>
            {children}
        </GlassCard>
    );
};
