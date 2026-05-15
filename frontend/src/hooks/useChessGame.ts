import { useCallback, useEffect, useRef, useState } from 'react';
import { getAiMove } from '../lib/chessAi';
import {
  applyMove,
  captureValue,
  createInitialGameState,
  getGameStatus,
  getLegalMoves,
  type ChessMove,
  type Color,
  type GameState,
} from '../lib/chessEngine';
import { formatMove } from '../lib/moveNotation';

function cloneGameState(state: GameState): GameState {
  return {
    board: state.board.map((row) => [...row]),
    turn: state.turn,
    castling: { ...state.castling },
    enPassant: state.enPassant ? [state.enPassant[0], state.enPassant[1]] : null,
    lastMove: state.lastMove ? { ...state.lastMove } : null,
  };
}

export interface UseChessGameOptions {
  vsAi?: boolean;
  aiDepth?: number;
  humanColor?: Color;
  paused?: boolean;
  onScoreUpdate?: (points: number, isCombo?: boolean) => void;
  onGameEnd?: (result: 'checkmate' | 'stalemate', winner: Color | null) => void;
}

export function useChessGame({
  vsAi = false,
  aiDepth = 2,
  humanColor = 'w',
  paused = false,
  onScoreUpdate,
  onGameEnd,
}: UseChessGameOptions) {
  const [game, setGame] = useState<GameState>(createInitialGameState);
  const [history, setHistory] = useState<GameState[]>([]);
  const [notations, setNotations] = useState<string[]>([]);
  const [pendingPromotion, setPendingPromotion] = useState<ChessMove[] | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const gameEndReported = useRef(false);
  const aiColor: Color = humanColor === 'w' ? 'b' : 'w';

  const status = getGameStatus(game);
  const isGameOver = status === 'checkmate' || status === 'stalemate';

  const reset = useCallback(() => {
    gameEndReported.current = false;
    setGame(createInitialGameState());
    setHistory([]);
    setNotations([]);
    setPendingPromotion(null);
    setAiThinking(false);
  }, []);

  const commitMove = useCallback(
    (move: ChessMove, boardBefore: GameState) => {
      const notation = formatMove(move, boardBefore.board);
      const { board, captured, castling, enPassant } = applyMove(
        boardBefore.board,
        move.fr,
        move.fc,
        move.tr,
        move.tc,
        move.promo ?? null,
        boardBefore.castling,
        boardBefore.enPassant
      );

      if (captured) {
        onScoreUpdate?.(captureValue(captured), true);
      } else {
        onScoreUpdate?.(5, false);
      }

      const nextTurn: Color = boardBefore.turn === 'w' ? 'b' : 'w';
      const nextState: GameState = {
        board,
        turn: nextTurn,
        castling,
        enPassant,
        lastMove: move,
      };

      setHistory((h) => [...h, cloneGameState(boardBefore)]);
      setNotations((n) => [...n, notation]);
      setGame(nextState);
      return nextState;
    },
    [onScoreUpdate]
  );

  const applyMoveWithPromo = useCallback(
    (move: ChessMove) => {
      if (isGameOver || paused || aiThinking) return;
      if (vsAi && game.turn !== humanColor) return;

      const promos = getLegalMoves(
        game.board,
        game.turn,
        game.castling,
        game.enPassant
      ).filter(
        (m) =>
          m.fr === move.fr &&
          m.fc === move.fc &&
          m.tr === move.tr &&
          m.tc === move.tc &&
          m.promo
      );

      if (promos.length > 0 && !move.promo) {
        setPendingPromotion(promos);
        return;
      }

      commitMove(move, game);
    },
    [aiThinking, commitMove, game, humanColor, isGameOver, paused, vsAi]
  );

  const completePromotion = useCallback(
    (piece: 'Q' | 'R' | 'B' | 'N') => {
      if (!pendingPromotion?.length) return;
      const move = { ...pendingPromotion[0], promo: piece };
      setPendingPromotion(null);
      commitMove(move, game);
    },
    [commitMove, game, pendingPromotion]
  );

  const undo = useCallback(() => {
    if (history.length === 0 || aiThinking) return;
    gameEndReported.current = false;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setNotations((n) => n.slice(0, -1));
    setGame(cloneGameState(prev));
    setPendingPromotion(null);
  }, [aiThinking, history]);

  // Game end notification
  useEffect(() => {
    if ((status === 'checkmate' || status === 'stalemate') && !gameEndReported.current) {
      gameEndReported.current = true;
      const winner =
        status === 'checkmate' ? (game.turn === 'w' ? 'b' : 'w') : null;
      onGameEnd?.(status, winner);
    }
  }, [status, game.turn, onGameEnd]);

  // AI turn
  useEffect(() => {
    if (!vsAi || paused || isGameOver || pendingPromotion) return;
    if (game.turn !== aiColor) return;

    const snapshot = cloneGameState(game);
    let cancelled = false;
    setAiThinking(true);

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      const move = getAiMove(
        snapshot.board,
        aiDepth,
        aiColor,
        snapshot.castling,
        snapshot.enPassant
      );
      if (move) {
        commitMove(move, snapshot);
      }
      setAiThinking(false);
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    vsAi,
    paused,
    isGameOver,
    pendingPromotion,
    game.turn,
    game.board,
    game.castling,
    game.enPassant,
    aiColor,
    aiDepth,
    commitMove,
  ]);

  return {
    game,
    status,
    isGameOver,
    notations,
    pendingPromotion,
    aiThinking,
    canUndo: history.length > 0 && !aiThinking,
    reset,
    undo,
    applyMoveWithPromo,
    completePromotion,
    cancelPromotion: () => setPendingPromotion(null),
  };
}
