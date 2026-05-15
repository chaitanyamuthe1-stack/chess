/** Chess rules engine (ported from chess/chess_engine.py) */

export type Piece = string;
export type Board = (Piece | null)[][];
export type Color = 'w' | 'b';

export interface CastlingRights {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

export interface ChessMove {
  fr: number;
  fc: number;
  tr: number;
  tc: number;
  promo?: string;
}

export interface GameState {
  board: Board;
  turn: Color;
  castling: CastlingRights;
  enPassant: [number, number] | null;
  lastMove: ChessMove | null;
}

const PIECE_VALUES: Record<string, number> = {
  P: 10,
  N: 30,
  B: 30,
  R: 50,
  Q: 90,
  K: 0,
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));
  const back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
  for (let c = 0; c < 8; c++) {
    board[0][c] = `b${back[c]}`;
    board[1][c] = 'bP';
    board[6][c] = 'wP';
    board[7][c] = `w${back[c]}`;
  }
  return board;
}

export function createInitialGameState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'w',
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    enPassant: null,
    lastMove: null,
  };
}

export function squareToCoords(square: string): [number, number] {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = parseInt(square[1], 10);
  return [8 - rank, file];
}

export function coordsToSquare(row: number, col: number): string {
  return `${FILES[col]}${8 - row}`;
}

function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

function color(piece: Piece | null): Color | null {
  return piece ? (piece[0] as Color) : null;
}

function ptype(piece: Piece | null): string | null {
  return piece ? piece[1] : null;
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function isPathClear(board: Board, squares: [number, number][]): boolean {
  return squares.every(([r, c]) => inBounds(r, c) && !board[r][c]);
}

function getPawnMoves(
  r: number,
  c: number,
  board: Board,
  col: Color,
  enPassantTarget: [number, number] | null
): [number, number][] {
  const moves: [number, number][] = [];
  const direction = col === 'w' ? -1 : 1;
  const startRow = col === 'w' ? 6 : 1;

  if (inBounds(r + direction, c) && !board[r + direction][c]) {
    moves.push([r + direction, c]);
    if (r === startRow && !board[r + 2 * direction][c]) {
      moves.push([r + 2 * direction, c]);
    }
  }

  for (const dc of [-1, 1]) {
    const nr = r + direction;
    const nc = c + dc;
    if (!inBounds(nr, nc)) continue;
    if (board[nr][nc] && color(board[nr][nc]) !== col) {
      moves.push([nr, nc]);
    } else if (enPassantTarget && enPassantTarget[0] === nr && enPassantTarget[1] === nc) {
      const adjacent = board[r][nc];
      if (adjacent && color(adjacent) !== col && ptype(adjacent) === 'P') {
        moves.push([nr, nc]);
      }
    }
  }
  return moves;
}

function getSlideMoves(
  r: number,
  c: number,
  board: Board,
  col: Color,
  directions: [number, number][]
): [number, number][] {
  const moves: [number, number][] = [];
  for (const [dr, dc] of directions) {
    let nr = r + dr;
    let nc = c + dc;
    while (inBounds(nr, nc)) {
      if (board[nr][nc]) {
        if (color(board[nr][nc]) !== col) moves.push([nr, nc]);
        break;
      }
      moves.push([nr, nc]);
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

function getKnightMoves(r: number, c: number, board: Board, col: Color): [number, number][] {
  const moves: [number, number][] = [];
  const offsets: [number, number][] = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];
  for (const [dr, dc] of offsets) {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc) && color(board[nr][nc]) !== col) moves.push([nr, nc]);
  }
  return moves;
}

function getKingMoves(r: number, c: number, board: Board, col: Color): [number, number][] {
  const moves: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && color(board[nr][nc]) !== col) moves.push([nr, nc]);
    }
  }
  return moves;
}

function getCastlingMoves(
  r: number,
  c: number,
  board: Board,
  col: Color,
  castling: CastlingRights
): [number, number][] {
  const moves: [number, number][] = [];
  const row = col === 'w' ? 7 : 0;
  const opponent: Color = col === 'w' ? 'b' : 'w';
  if (r !== row || c !== 4) return moves;

  if (castling[`${col}K` as keyof CastlingRights] && board[row][7] === `${col}R`) {
    const path: [number, number][] = [[row, 5], [row, 6]];
    if (
      isPathClear(board, path) &&
      !isAttacked(board, row, 4, opponent) &&
      !isAttacked(board, row, 5, opponent) &&
      !isAttacked(board, row, 6, opponent)
    ) {
      moves.push([row, 6]);
    }
  }

  if (castling[`${col}Q` as keyof CastlingRights] && board[row][0] === `${col}R`) {
    const path: [number, number][] = [[row, 3], [row, 2], [row, 1]];
    if (
      isPathClear(board, path) &&
      !isAttacked(board, row, 4, opponent) &&
      !isAttacked(board, row, 3, opponent) &&
      !isAttacked(board, row, 2, opponent)
    ) {
      moves.push([row, 2]);
    }
  }
  return moves;
}

function getRawMoves(
  r: number,
  c: number,
  board: Board,
  castling?: CastlingRights,
  enPassantTarget?: [number, number] | null,
  includeCastling = true
): [number, number][] {
  const piece = board[r][c];
  if (!piece) return [];
  const col = color(piece)!;
  const t = ptype(piece)!;

  switch (t) {
    case 'P':
      return getPawnMoves(r, c, board, col, enPassantTarget ?? null);
    case 'N':
      return getKnightMoves(r, c, board, col);
    case 'B':
      return getSlideMoves(r, c, board, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    case 'R':
      return getSlideMoves(r, c, board, col, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    case 'Q':
      return getSlideMoves(r, c, board, col, [
        [-1, -1], [-1, 1], [1, -1], [1, 1],
        [-1, 0], [1, 0], [0, -1], [0, 1],
      ]);
    case 'K': {
      const moves = getKingMoves(r, c, board, col);
      if (includeCastling && castling) {
        moves.push(...getCastlingMoves(r, c, board, col, castling));
      }
      return moves;
    }
    default:
      return [];
  }
}

function findKing(board: Board, col: Color): [number, number] | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === `${col}K`) return [r, c];
    }
  }
  return null;
}

function isAttacked(board: Board, r: number, c: number, byCol: Color): boolean {
  for (let rr = 0; rr < 8; rr++) {
    for (let cc = 0; cc < 8; cc++) {
      const piece = board[rr][cc];
      if (color(piece) === byCol) {
        const targets = getRawMoves(rr, cc, board, undefined, null, false);
        if (targets.some(([tr, tc]) => tr === r && tc === c)) return true;
      }
    }
  }
  return false;
}

export function inCheck(board: Board, col: Color): boolean {
  const kingPos = findKing(board, col);
  if (!kingPos) return false;
  const opponent: Color = col === 'w' ? 'b' : 'w';
  return isAttacked(board, kingPos[0], kingPos[1], opponent);
}

export function applyMove(
  board: Board,
  fr: number,
  fc: number,
  tr: number,
  tc: number,
  promo: string | null = null,
  castling?: CastlingRights,
  enPassantTarget?: [number, number] | null
): {
  board: Board;
  captured: Piece | null;
  castling: CastlingRights;
  enPassant: [number, number] | null;
} {
  const newBoard = cloneBoard(board);
  const piece = newBoard[fr][fc]!;
  let captured = newBoard[tr][tc];
  newBoard[tr][tc] = piece;
  newBoard[fr][fc] = null;

  if (ptype(piece) === 'P' && tc !== fc && !captured) {
    if (enPassantTarget && enPassantTarget[0] === tr && enPassantTarget[1] === tc) {
      captured = newBoard[fr][tc];
      newBoard[fr][tc] = null;
    }
  }

  if (ptype(piece) === 'K' && Math.abs(tc - fc) === 2) {
    if (tc === 6) {
      newBoard[tr][5] = newBoard[tr][7];
      newBoard[tr][7] = null;
    } else if (tc === 2) {
      newBoard[tr][3] = newBoard[tr][0];
      newBoard[tr][0] = null;
    }
  }

  if (ptype(piece) === 'P' && (tr === 0 || tr === 7)) {
    newBoard[tr][tc] = `${color(piece)}${promo ?? 'Q'}`;
  }

  const newCastling: CastlingRights = castling
    ? { ...castling }
    : { wK: false, wQ: false, bK: false, bQ: false };

  const col = color(piece)!;
  if (ptype(piece) === 'K') {
    newCastling[`${col}K` as keyof CastlingRights] = false;
    newCastling[`${col}Q` as keyof CastlingRights] = false;
  } else if (ptype(piece) === 'R') {
    if (fr === 7 && fc === 7) newCastling.wK = false;
    else if (fr === 7 && fc === 0) newCastling.wQ = false;
    else if (fr === 0 && fc === 7) newCastling.bK = false;
    else if (fr === 0 && fc === 0) newCastling.bQ = false;
  }

  if (captured && ptype(captured) === 'R') {
    if (tr === 7 && tc === 7) newCastling.wK = false;
    else if (tr === 7 && tc === 0) newCastling.wQ = false;
    else if (tr === 0 && tc === 7) newCastling.bK = false;
    else if (tr === 0 && tc === 0) newCastling.bQ = false;
  }

  let newEnPassant: [number, number] | null = null;
  if (ptype(piece) === 'P') {
    const direction = col === 'w' ? -1 : 1;
    if (Math.abs(tr - fr) === 2) {
      newEnPassant = [fr + direction, fc];
    }
  }

  return { board: newBoard, captured, castling: newCastling, enPassant: newEnPassant };
}

export function getLegalMoves(
  board: Board,
  col: Color,
  castling?: CastlingRights,
  enPassantTarget?: [number, number] | null
): ChessMove[] {
  const legal: ChessMove[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (color(piece) !== col) continue;

      const rawMoves = getRawMoves(r, c, board, castling, enPassantTarget);
      for (const [tr, tc] of rawMoves) {
        const needsPromo = ptype(piece) === 'P' && (tr === 0 || tr === 7);
        if (needsPromo) {
          for (const promo of ['Q', 'R', 'B', 'N']) {
            const { board: next } = applyMove(board, r, c, tr, tc, promo, castling, enPassantTarget);
            if (!inCheck(next, col)) legal.push({ fr: r, fc: c, tr, tc, promo });
          }
        } else {
          const { board: next } = applyMove(board, r, c, tr, tc, null, castling, enPassantTarget);
          if (!inCheck(next, col)) legal.push({ fr: r, fc: c, tr, tc });
        }
      }
    }
  }
  return legal;
}

export function captureValue(piece: Piece | null): number {
  if (!piece) return 0;
  return PIECE_VALUES[ptype(piece)!] ?? 0;
}

export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate';

export function getGameStatus(state: Pick<GameState, 'board' | 'turn' | 'castling' | 'enPassant'>): GameStatus {
  const moves = getLegalMoves(state.board, state.turn, state.castling, state.enPassant);
  if (moves.length > 0) {
    return inCheck(state.board, state.turn) ? 'check' : 'playing';
  }
  return inCheck(state.board, state.turn) ? 'checkmate' : 'stalemate';
}

export function getKingSquare(board: Board, col: Color): string | null {
  const pos = findKing(board, col);
  return pos ? coordsToSquare(pos[0], pos[1]) : null;
}
