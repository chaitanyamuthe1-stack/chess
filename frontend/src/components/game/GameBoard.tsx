import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import './GameBoard.realistic.css';
import { pieceSvgs } from '../../assets/chess-pieces';

/**
 * Game Board Component
 * Interactive chess board with animations and piece interactions
 */
interface GameBoardProps {
    onScoreUpdate?: (points: number, isCombo?: boolean) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onScoreUpdate }) => {

    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    // Simple initial position for demonstration
    const initialPosition: Record<string, string> = {};
    files.forEach((file) => {
        initialPosition[`${file}2`] = 'wP';
        initialPosition[`${file}7`] = 'bP';
    });
    initialPosition['a1'] = 'wR'; initialPosition['h1'] = 'wR';
    initialPosition['b1'] = 'wN'; initialPosition['g1'] = 'wN';
    initialPosition['c1'] = 'wB'; initialPosition['f1'] = 'wB';
    initialPosition['d1'] = 'wQ'; initialPosition['e1'] = 'wK';
    initialPosition['a8'] = 'bR'; initialPosition['h8'] = 'bR';
    initialPosition['b8'] = 'bN'; initialPosition['g8'] = 'bN';
    initialPosition['c8'] = 'bB'; initialPosition['f8'] = 'bB';
    initialPosition['d8'] = 'bQ'; initialPosition['e8'] = 'bK';

    // Chess board coordinates
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    const handleSquareClick = (square: string) => {
        setSelectedSquare(square === selectedSquare ? null : square);
    };

    return (
        <GlassCard neon className="p-6">
            <motion.div
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <h3 className="text-lg font-bold text-yellow-900 drop-shadow text-center tracking-wide">REALISTIC CHESS BOARD</h3>

                {/* Realistic Chess Board */}
                <div className="chess-board-realistic mx-auto w-full max-w-2xl aspect-square p-2">
                    <div className="grid grid-cols-8 gap-0 h-full w-full">
                        {ranks.map((rank) =>
                            files.map((file) => {
                                const square = `${file}${rank}`;
                                const isLight = (files.indexOf(file) + rank) % 2 === 0;
                                const isSelected = square === selectedSquare;

                                const piece = initialPosition[square];
                                return (
                                    <motion.div
                                        key={square}
                                        className={`chess-square-realistic ${isLight ? 'light' : 'dark'}${isSelected ? ' selected' : ''}`}
                                        whileHover={{ scale: 1.04 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleSquareClick(square)}
                                    >
                                        {/* Square coordinates */}
                                        {file === 'a' && (
                                            <span className="absolute bottom-1 left-1 text-xs font-bold text-yellow-900/80 select-none">
                                                {rank}
                                            </span>
                                        )}
                                        {rank === 1 && (
                                            <span className="absolute bottom-1 right-1 text-xs font-bold text-yellow-900/80 select-none">
                                                {file.toUpperCase()}
                                            </span>
                                        )}

                                        {/* Render SVG chess piece if present */}
                                        {piece && (
                                            <img
                                                src={pieceSvgs[piece]}
                                                alt={piece}
                                                className={`chess-piece-realistic${isSelected ? ' animate' : ''}`}
                                                draggable={false}
                                                style={{ width: '80%', height: '80%' }}
                                            />
                                        )}
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                    {/* Board shine effect */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(120deg,rgba(255,255,255,0.10) 0%,rgba(255,255,255,0.03) 80%,transparent 100%)', borderRadius: '18px' }} />
                </div>

                {/* Board Info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-yellow-900/80">
                    <div>Status: Ready</div>
                    <div>Move: 1</div>
                </div>
            </motion.div>
        </GlassCard>
    );
};

export default GameBoard;
