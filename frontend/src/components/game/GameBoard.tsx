import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Bot } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GamingButton from '../ui/GamingButton';
import './GameBoard.realistic.css';
import { pieceSvgs, type PieceCode } from '../../assets/chess-pieces';
import {
  FILES,
  coordsToSquare,
  getLegalMoves,
  squareToCoords,
  type Color,
} from '../../lib/chessEngine';
import { useChessGame } from '../../hooks/useChessGame';
import PromotionModal from './PromotionModal';
import MoveHistory from './MoveHistory';

interface GameBoardProps {
  onScoreUpdate?: (points: number, isCombo?: boolean) => void;
  resetKey?: number;
  darkMode?: boolean;
  paused?: boolean;
  vsAi?: boolean;
  aiDepth?: number;
  onGameEnd?: (result: 'checkmate' | 'stalemate', winner: Color | null) => void;
}

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

const GameBoard: React.FC<GameBoardProps> = ({
  onScoreUpdate,
  resetKey = 0,
  darkMode = true,
  paused = false,
  vsAi = false,
  aiDepth = 2,
  onGameEnd,
}) => {
  const {
    game,
    status,
    isGameOver,
    notations,
    pendingPromotion,
    aiThinking,
    canUndo,
    reset,
    undo,
    applyMoveWithPromo,
    completePromotion,
    cancelPromotion,
  } = useChessGame({
    vsAi,
    aiDepth,
    humanColor: 'w',
    paused,
    onScoreUpdate,
    onGameEnd,
  });

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<Set<string>>(new Set());
  const [animatedSquare, setAnimatedSquare] = useState<string | null>(null);

  useEffect(() => {
    reset();
    setSelectedSquare(null);
    setLegalTargets(new Set());
  }, [resetKey, reset]);

  const kingInCheckSquare = useMemo(() => {
    if (status !== 'check' && status !== 'checkmate') return null;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (game.board[r][c] === `${game.turn}K`) {
          return coordsToSquare(r, c);
        }
      }
    }
    return null;
  }, [game.board, game.turn, status]);

  const lastMoveSquares = useMemo(() => {
    if (!game.lastMove) return new Set<string>();
    const { fr, fc, tr, tc } = game.lastMove;
    return new Set([coordsToSquare(fr, fc), coordsToSquare(tr, tc)]);
  }, [game.lastMove]);

  const statusLabel = useMemo(() => {
    if (aiThinking) return 'AI is thinking…';
    switch (status) {
      case 'check':
        return game.turn === 'w' ? 'White in check' : 'Black in check';
      case 'checkmate':
        return game.turn === 'w' ? 'Black wins' : 'White wins';
      case 'stalemate':
        return 'Draw — stalemate';
      default:
        if (vsAi && game.turn === 'b') return "AI's turn (Black)";
        return game.turn === 'w' ? "White's turn" : "Black's turn";
    }
  }, [status, game.turn, aiThinking, vsAi]);

  const canInteract =
    !isGameOver &&
    !paused &&
    !aiThinking &&
    !pendingPromotion &&
    (!vsAi || game.turn === 'w');

  const handleSquareClick = (square: string) => {
    if (!canInteract) return;

    const [row, col] = squareToCoords(square);
    const piece = game.board[row][col];

    if (selectedSquare && legalTargets.has(square)) {
      const [fromRow, fromCol] = squareToCoords(selectedSquare);
      const move = getLegalMoves(
        game.board,
        game.turn,
        game.castling,
        game.enPassant
      ).find(
        (m) =>
          m.fr === fromRow &&
          m.fc === fromCol &&
          m.tr === row &&
          m.tc === col
      );
      if (!move) return;

      setAnimatedSquare(square);
      setTimeout(() => setAnimatedSquare(null), 320);
      applyMoveWithPromo(move);
      setSelectedSquare(null);
      setLegalTargets(new Set());
      return;
    }

    if (piece && piece[0] === game.turn) {
      setSelectedSquare(square);
      const moves = getLegalMoves(
        game.board,
        game.turn,
        game.castling,
        game.enPassant
      ).filter((m) => m.fr === row && m.fc === col);
      setLegalTargets(new Set(moves.map((m) => coordsToSquare(m.tr, m.tc))));
    } else {
      setSelectedSquare(null);
      setLegalTargets(new Set());
    }
  };

  return (
    <GlassCard neon className="p-4 sm:p-6">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <motion.h3
            className={`text-lg font-bold tracking-wide font-gaming ${
              darkMode ? 'text-neon-cyan' : 'text-amber-900'
            }`}
          >
            Chess Board
          </motion.h3>
          {vsAi && (
            <span className="flex items-center gap-1 text-xs text-neon-purple font-semibold">
              <Bot className="w-4 h-4" /> AI depth {aiDepth}
            </span>
          )}
        </div>

        <motion.div
          className={`turn-indicator ${game.turn === 'w' ? 'white-turn' : 'black-turn'}`}
          layout
          key={`${game.turn}-${aiThinking}`}
        >
          <span className={`turn-dot ${game.turn === 'w' ? 'white' : 'black'}`} />
          <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{statusLabel}</span>
        </motion.div>

        <motion.div
          className={`chess-board-realistic mx-auto w-full max-w-[min(92vw,520px)] aspect-square p-2 ${
            aiThinking ? 'board-ai-thinking' : ''
          }`}
          role="grid"
          aria-label="Chess board"
        >
          <motion.div className="grid grid-cols-8 gap-0 h-full w-full rounded-xl overflow-hidden">
            {RANKS.map((rank) =>
              FILES.map((file) => {
                const square = `${file}${rank}`;
                const [row, col] = squareToCoords(square);
                const isLight = (FILES.indexOf(file) + rank) % 2 === 0;
                const isSelected = square === selectedSquare;
                const isLegal = legalTargets.has(square);
                const isLastMove = lastMoveSquares.has(square);
                const isCheck = square === kingInCheckSquare;
                const piece = game.board[row][col];

                return (
                  <motion.button
                    type="button"
                    key={square}
                    disabled={!canInteract}
                    className={[
                      'chess-square-realistic',
                      isLight ? 'light' : 'dark',
                      isSelected ? 'selected' : '',
                      isLegal ? 'legal-target' : '',
                      isLastMove ? 'last-move' : '',
                      isCheck ? 'in-check' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    whileHover={{ scale: piece || isLegal ? 1.03 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSquareClick(square)}
                  >
                    {file === 'a' && (
                      <span className="square-rank-label">{rank}</span>
                    )}
                    {rank === 1 && (
                      <span className="square-file-label">{file.toUpperCase()}</span>
                    )}
                    {piece && (
                      <img
                        src={pieceSvgs[piece as PieceCode]}
                        alt=""
                        className={`chess-piece-realistic${
                          animatedSquare === square ? ' animate' : ''
                        }`}
                        draggable={false}
                      />
                    )}
                  </motion.button>
                );
              })
            )}
          </motion.div>
          <motion.div className="board-shine" aria-hidden />
        </motion.div>

        <motion.div className="flex gap-2">
          <GamingButton
            variant="secondary"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            Undo
          </GamingButton>
        </motion.div>

        <MoveHistory notations={notations} darkMode={darkMode} />

        <motion.div
          className={`grid grid-cols-2 gap-2 text-xs font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <div>Status: {status === 'playing' ? 'In progress' : status}</div>
          <div>
            Last:{' '}
            {game.lastMove
              ? `${coordsToSquare(game.lastMove.fr, game.lastMove.fc)} → ${coordsToSquare(game.lastMove.tr, game.lastMove.tc)}`
              : '—'}
          </div>
        </motion.div>
      </motion.div>

      {pendingPromotion && (
        <PromotionModal
          color={game.turn}
          onSelect={completePromotion}
          onClose={cancelPromotion}
        />
      )}
    </GlassCard>
  );
};

export default GameBoard;
