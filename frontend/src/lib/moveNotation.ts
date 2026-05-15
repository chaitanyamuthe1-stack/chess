import { coordsToSquare, type Board, type ChessMove } from './chessEngine';

const PIECE_LETTER: Record<string, string> = {
  K: 'K',
  Q: 'Q',
  R: 'R',
  B: 'B',
  N: 'N',
  P: '',
};

export function formatMove(move: ChessMove, board: Board): string {
  const piece = board[move.fr][move.fc];
  if (!piece) return '?';

  const from = coordsToSquare(move.fr, move.fc);
  const to = coordsToSquare(move.tr, move.tc);
  const pt = piece[1];
  const captured = board[move.tr][move.tc];
  const isCastle = pt === 'K' && Math.abs(move.tc - move.fc) === 2;

  if (isCastle) {
    return move.tc === 6 ? 'O-O' : 'O-O-O';
  }

  const prefix = PIECE_LETTER[pt] ?? '';
  const captureMark = captured || (pt === 'P' && move.tc !== move.fc) ? 'x' : '';
  const promo = move.promo ? `=${move.promo}` : '';

  if (pt === 'P' && captureMark) {
    return `${from[0]}x${to}${promo}`;
  }

  return `${prefix}${captureMark}${to}${promo}`;
}

export interface HistoryLine {
  num: number;
  white?: string;
  black?: string;
}

export function buildMovePairs(notations: string[]): HistoryLine[] {
  const lines: HistoryLine[] = [];
  for (let i = 0; i < notations.length; i += 2) {
    lines.push({
      num: Math.floor(i / 2) + 1,
      white: notations[i],
      black: notations[i + 1],
    });
  }
  return lines;
}
