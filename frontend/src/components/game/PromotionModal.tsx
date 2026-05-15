import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pieceSvgs, type PieceCode } from '../../assets/chess-pieces';
import type { Color } from '../../lib/chessEngine';

interface PromotionModalProps {
  color: Color;
  onSelect: (piece: 'Q' | 'R' | 'B' | 'N') => void;
  onClose: () => void;
}

const OPTIONS: Array<'Q' | 'R' | 'B' | 'N'> = ['Q', 'R', 'B', 'N'];

const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
        <motion.div
          className="relative z-10 rounded-2xl border border-neon-cyan/40 bg-gaming-dark/95 p-6 shadow-2xl mx-4"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-center text-lg font-bold text-neon-cyan mb-4 font-gaming">
            Promote pawn
          </h3>
          <div className="flex gap-3 justify-center">
            {OPTIONS.map((piece) => {
              const code = `${color}${piece}` as PieceCode;
              return (
                <motion.button
                  key={piece}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(piece)}
                  className="p-3 rounded-xl bg-white/10 border border-neon-purple/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 transition-colors"
                  aria-label={`Promote to ${piece}`}
                >
                  <img src={pieceSvgs[code]} alt="" className="w-12 h-12 sm:w-14 sm:h-14" />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromotionModal;
