import chess
import json
from typing import Any, Dict, Optional


def load_board(fen: str) -> chess.Board:
    return chess.Board(fen)


def build_uci(move_data: Dict[str, Any]) -> Optional[str]:
    if not move_data or 'from' not in move_data or 'to' not in move_data:
        return None

    promotion = move_data.get('promotion')
    if promotion:
        return f"{move_data['from']}{move_data['to']}{promotion}"
    return f"{move_data['from']}{move_data['to']}"


def parse_event(raw_value: Any) -> Optional[Dict[str, Any]]:
    if raw_value is None:
        return None
    if isinstance(raw_value, str):
        try:
            return json.loads(raw_value)
        except json.JSONDecodeError:
            return None
    if isinstance(raw_value, dict):
        return raw_value
    return None


def make_move(fen: str, move_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    board = load_board(fen)
    uci = build_uci(move_data)
    if uci is None:
        return None

    try:
        move = chess.Move.from_uci(uci)
    except ValueError:
        return None

    if move not in board.legal_moves:
        return None

    capture_piece = board.piece_at(move.to_square)
    is_capture = board.is_capture(move)
    san = board.san(move)
    color = 'White' if board.turn == chess.WHITE else 'Black'

    board.push(move)

    return {
        'fen': board.fen(),
        'san': san,
        'uci': uci,
        'color': color,
        'capture': capture_piece.symbol() if capture_piece else None,
        'is_capture': is_capture,
        'is_check': board.is_check(),
        'is_checkmate': board.is_checkmate(),
        'is_stalemate': board.is_stalemate(),
        'turn': 'w' if board.turn == chess.WHITE else 'b',
        'fullmove_number': board.fullmove_number,
    }


def build_move_row(move_history: list[Dict[str, Any]]) -> str:
    rows = []
    for index in range(0, len(move_history), 2):
        number = index // 2 + 1
        white_move = move_history[index]['san']
        black_move = move_history[index + 1]['san'] if index + 1 < len(move_history) else ''
        rows.append(f"{number}. {white_move} {black_move}")
    return '\n'.join(rows)


def format_time(seconds: float) -> str:
    total = max(0, int(round(seconds)))
    minutes = total // 60
    secs = total % 60
    return f"{minutes:02d}:{secs:02d}"
