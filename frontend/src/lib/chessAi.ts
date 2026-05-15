/** Minimax AI (ported from chess/chess_engine.py) */

import {
  applyMove,
  getLegalMoves,
  inCheck,
  type Board,
  type CastlingRights,
  type ChessMove,
  type Color,
} from './chessEngine';

const PVAL: Record<string, number> = {
  P: 100,
  N: 320,
  B: 330,
  R: 500,
  Q: 900,
  K: 20000,
};

const PST: Record<string, number[][]> = {
  P: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  N: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  B: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  R: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  Q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  K: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

function color(piece: string | null): Color | null {
  return piece ? (piece[0] as Color) : null;
}

function ptype(piece: string | null): string | null {
  return piece ? piece[1] : null;
}

export function evaluate(board: Board): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const col = color(piece)!;
      const t = ptype(piece)!;
      const val = PVAL[t] ?? 0;
      const pstRow = col === 'w' ? r : 7 - r;
      const table = PST[t];
      const psVal = table?.[pstRow]?.[c] ?? 0;
      const pieceScore = val + psVal;
      score += col === 'w' ? pieceScore : -pieceScore;
    }
  }
  return score;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  isMax: boolean,
  castling: CastlingRights,
  enPassant: [number, number] | null
): { score: number; move: ChessMove | null } {
  if (depth === 0) {
    return { score: evaluate(board), move: null };
  }

  const col: Color = isMax ? 'w' : 'b';
  const moves = getLegalMoves(board, col, castling, enPassant);

  if (moves.length === 0) {
    if (inCheck(board, col)) {
      return { score: isMax ? 99999 : -99999, move: null };
    }
    return { score: 0, move: null };
  }

  let bestScore = isMax ? -Infinity : Infinity;
  let bestMove: ChessMove = moves[0];

  for (const move of moves) {
    const { board: nextBoard, castling: nextCastling, enPassant: nextEp } = applyMove(
      board,
      move.fr,
      move.fc,
      move.tr,
      move.tc,
      move.promo ?? null,
      castling,
      enPassant
    );
    const { score } = minimax(
      nextBoard,
      depth - 1,
      alpha,
      beta,
      !isMax,
      nextCastling,
      nextEp
    );

    if (isMax) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
    }

    if (beta <= alpha) break;
  }

  return { score: bestScore, move: bestMove };
}

export function getAiMove(
  board: Board,
  depth: number,
  col: Color,
  castling: CastlingRights,
  enPassant: [number, number] | null
): ChessMove | null {
  const isMax = col === 'w';
  const { move } = minimax(
    board,
    depth,
    -Infinity,
    Infinity,
    isMax,
    castling,
    enPassant
  );
  return move;
}
