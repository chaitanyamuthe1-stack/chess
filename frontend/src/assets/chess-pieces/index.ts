import wK from './wK.svg';
import wQ from './wQ.svg';
import wR from './wR.svg';
import wB from './wB.svg';
import wN from './wN.svg';
import wP from './wP.svg';
import bK from './bK.svg';
import bQ from './bQ.svg';
import bR from './bR.svg';
import bB from './bB.svg';
import bN from './bN.svg';
import bP from './bP.svg';

export type PieceCode =
  | 'wK' | 'wQ' | 'wR' | 'wB' | 'wN' | 'wP'
  | 'bK' | 'bQ' | 'bR' | 'bB' | 'bN' | 'bP';

export const pieceSvgs: Record<PieceCode, string> = {
  wK,
  wQ,
  wR,
  wB,
  wN,
  wP,
  bK,
  bQ,
  bR,
  bB,
  bN,
  bP,
};
