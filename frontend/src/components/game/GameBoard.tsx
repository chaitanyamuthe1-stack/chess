import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import './GameBoard.realistic.css';
import { pieceSvgs, type PieceCode } from '../../assets/chess-pieces';
import {
  FILES,
  captureValue,
  coordsToSquare,
  createInitialGameState,
  getGameStatus,
  getLegalMoves,
  applyMove,
  squareToCoords,
  type Color,
  type GameState,
} from '../../lib/chessEngine';

interface GameBoardProps {
  onScoreUpdate?: (points: number, isCombo?: boolean) => void;
  resetKey?: number;
  darkMode?: boolean;
  onGameEnd?: (result: 'checkmate' | 'stalemate', winner: Color | null) => void;
}

const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

const GameBoard: React.FC<GameBoardProps> = ({
  onScoreUpdate,
  resetKey = 0,
  darkMode = true,
  onGameEnd,
}) => {
  const [game, setGame] = useState<GameState>(createInitialGameState);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalTargets, setLegalTargets] = useState<Set<string>>(new Set());
  const [animatedSquare, setAnimatedSquare] = useState<string | null>(null);
  const gameEndReported = useRef(false);

  const resetBoard = useCallback(() => {
    gameEndReported.current = false;
    setGame(createInitialGameState());
    setSelectedSquare(null);
    setLegalTargets(new Set());
    setAnimatedSquare(null);
  }, []);

  useEffect(() => {
    resetBoard();
  }, [resetKey, resetBoard]);

  const status = useMemo(
    () => getGameStatus(game),
    [game.board, game.turn, game.castling, game.enPassant]
  );

  const kingInCheckSquare = useMemo(() => {
    if (status !== 'check' && status !== 'checkmate') return null;
    const [row, col] = (() => {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (game.board[r][c] === `${game.turn}K`) return [r, c];
        }
      }
      return [-1, -1];
    })();
    return row >= 0 ? coordsToSquare(row, col) : null;
  }, [game.board, game.turn, status]);

  const lastMoveSquares = useMemo(() => {
    if (!game.lastMove) return new Set<string>();
    const { fr, fc, tr, tc } = game.lastMove;
    return new Set([coordsToSquare(fr, fc), coordsToSquare(tr, tc)]);
  }, [game.lastMove]);

  useEffect(() => {
    if (
      (status === 'checkmate' || status === 'stalemate') &&
      !gameEndReported.current
    ) {
      gameEndReported.current = true;
      const winner =
        status === 'checkmate' ? (game.turn === 'w' ? 'b' : 'w') : null;
      onGameEnd?.(status, winner);
    }
  }, [status, game.turn, onGameEnd]);

  const statusLabel = useMemo(() => {
    switch (status) {
      case 'check':
        return game.turn === 'w' ? 'White in check' : 'Black in check';
      case 'checkmate':
        return game.turn === 'w' ? 'Black wins' : 'White wins';
      case 'stalemate':
        return 'Draw — stalemate';
      default:
        return game.turn === 'w' ? "White's turn" : "Black's turn";
    }
  }, [status, game.turn]);

  const handleSquareClick = (square: string) => {
    if (status === 'checkmate' || status === 'stalemate') return;

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

      const { board, captured, castling, enPassant } = applyMove(
        game.board,
        move.fr,
        move.fc,
        move.tr,
        move.tc,
        move.promo ?? null,
        game.castling,
        game.enPassant
      );

      if (captured) {
        onScoreUpdate?.(captureValue(captured), true);
      } else {
        onScoreUpdate?.(5, false);
      }

      const nextTurn: Color = game.turn === 'w' ? 'b' : 'w';
      setAnimatedSquare(square);
      setTimeout(() => setAnimatedSquare(null), 320);

      setGame({
        board,
        turn: nextTurn,
        castling,
        enPassant,
        lastMove: move,
      });
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
        <motion.h3
          className={`text-lg font-bold text-center tracking-wide font-gaming ${
            darkMode ? 'text-neon-cyan' : 'text-amber-900'
          }`}
          layout
        >
          Chess Board
        </motion.h3>

        <motion.div
          className={`turn-indicator ${game.turn === 'w' ? 'white-turn' : 'black-turn'}`}
          layout
          key={game.turn}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
        >
          <span className={`turn-dot ${game.turn === 'w' ? 'white' : 'black'}`} />
          <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{statusLabel}</span>
        </motion.div>

        <motion.div
          className="chess-board-realistic mx-auto w-full max-w-[min(92vw,520px)] aspect-square p-2"
          role="grid"
          aria-label="Chess board"
        >
          <motion.div
            className="grid grid-cols-8 gap-0 h-full w-full rounded-xl overflow-hidden"
            layout
          >
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
                    aria-label={
                      piece
                        ? `${square}, ${piece[0] === 'w' ? 'white' : 'black'} ${piece[1]}`
                        : square
                    }
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
          <motion.div
            className="board-shine"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        </motion.div>

        <div
          className={`grid grid-cols-2 gap-2 text-xs font-medium ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <motion.div layout>Status: {status === 'playing' ? 'In progress' : status}</motion.div>
          <motion.div
            key={game.lastMove ? `${game.lastMove.fr}${game.lastMove.fc}` : 'start'}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Last:{' '}
            {game.lastMove
              ? `${coordsToSquare(game.lastMove.fr, game.lastMove.fc)} → ${coordsToSquare(game.lastMove.tr, game.lastMove.tc)}`
              : '—'}
          </motion.div>
        </div>
      </motion.div>
    </GlassCard>
  );
};

export default GameBoard;
