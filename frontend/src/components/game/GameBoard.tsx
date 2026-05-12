import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

/**
 * Game Board Component
 * Interactive chess board with animations and piece interactions
 */
interface GameBoardProps {
    onScoreUpdate?: (points: number, isCombo?: boolean) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onScoreUpdate }) => {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

    // Chess board coordinates
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    const handleSquareClick = (square: string) => {
        setSelectedSquare(square === selectedSquare ? null : square);
    };

    return (
        <GlassCard neon className="p-6">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h3 className="text-lg font-bold text-neon-cyan text-center">CHESS BOARD</h3>

                {/* Chess Board */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-900 to-yellow-900 rounded-lg p-2 border-2 border-neon-cyan/30 shadow-lg overflow-hidden">
                    {/* Board Grid */}
                    <div className="grid grid-cols-8 gap-0 h-full">
                        {ranks.map((rank) =>
                            files.map((file) => {
                                const square = `${file}${rank}`;
                                const isLight = (files.indexOf(file) + rank) % 2 === 0;
                                const isSelected = square === selectedSquare;

                                return (
                                    <motion.div
                                        key={square}
                                        className={`
                      relative cursor-pointer transition-all duration-200
                      ${isLight ? 'bg-amber-100' : 'bg-amber-700'}
                      ${isSelected ? 'ring-2 ring-neon-cyan shadow-glow-cyan' : ''}
                      hover:opacity-80
                    `}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleSquareClick(square)}
                                    >
                                        {/* Square coordinates */}
                                        {file === 'a' && (
                                            <span className="absolute bottom-1 left-1 text-xs font-bold text-gray-700">
                                                {rank}
                                            </span>
                                        )}
                                        {rank === 1 && (
                                            <span className="absolute bottom-1 right-1 text-xs font-bold text-gray-700">
                                                {file.toUpperCase()}
                                            </span>
                                        )}

                                        {/* Piece placeholder */}
                                        {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="text-3xl animate-bounce">♔</div>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>

                    {/* Board shine effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Board Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                    <div>Status: Ready</div>
                    <div>Move: 1</div>
                </div>
            </motion.div>
        </GlassCard>
    );
};

export default GameBoard;
