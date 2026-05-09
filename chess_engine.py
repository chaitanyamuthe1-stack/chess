"""Chess engine with minimax + alpha-beta pruning + piece-square tables"""

UNI = {
    'wK': '♔', 'wQ': '♕', 'wR': '♖', 'wB': '♗', 'wN': '♘', 'wP': '♙',
    'bK': '♚', 'bQ': '♛', 'bR': '♜', 'bB': '♝', 'bN': '♞', 'bP': '♟'
}

PVAL = {'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000}
FILES = 'abcdefgh'

PST = {
    'P': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    'N': [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ],
    'B': [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ],
    'R': [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0]
    ],
    'Q': [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ],
    'K': [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [20, 30, 10, 0, 0, 10, 30, 20]
    ]
}


def clone_board(board):
    return [row[:] for row in board]


def color(piece):
    return piece[0] if piece else None


def ptype(piece):
    return piece[1:] if piece else None


def in_bounds(r, c):
    return 0 <= r < 8 and 0 <= c < 8


def get_pawn_moves(r, c, board, col):
    moves = []
    direction = -1 if col == 'w' else 1
    start_row = 6 if col == 'w' else 1
    
    if in_bounds(r + direction, c) and not board[r + direction][c]:
        moves.append((r + direction, c))
        if r == start_row and not board[r + 2 * direction][c]:
            moves.append((r + 2 * direction, c))
    
    for dc in [-1, 1]:
        nr, nc = r + direction, c + dc
        if in_bounds(nr, nc) and board[nr][nc] and color(board[nr][nc]) != col:
            moves.append((nr, nc))
    
    return moves


def get_slide_moves(r, c, board, col, directions):
    moves = []
    for dr, dc in directions:
        nr, nc = r + dr, c + dc
        while in_bounds(nr, nc):
            if board[nr][nc]:
                if color(board[nr][nc]) != col:
                    moves.append((nr, nc))
                break
            moves.append((nr, nc))
            nr += dr
            nc += dc
    return moves


def get_knight_moves(r, c, board, col):
    moves = []
    for dr, dc in [(-2, -1), (-2, 1), (-1, -2), (-1, 2), (1, -2), (1, 2), (2, -1), (2, 1)]:
        nr, nc = r + dr, c + dc
        if in_bounds(nr, nc) and color(board[nr][nc]) != col:
            moves.append((nr, nc))
    return moves


def get_king_moves(r, c, board, col):
    moves = []
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            nr, nc = r + dr, c + dc
            if in_bounds(nr, nc) and color(board[nr][nc]) != col:
                moves.append((nr, nc))
    return moves


def get_raw_moves(r, c, board):
    piece = board[r][c]
    if not piece:
        return []
    
    col = color(piece)
    t = ptype(piece)
    
    if t == 'P':
        return get_pawn_moves(r, c, board, col)
    elif t == 'N':
        return get_knight_moves(r, c, board, col)
    elif t == 'B':
        return get_slide_moves(r, c, board, col, [(-1, -1), (-1, 1), (1, -1), (1, 1)])
    elif t == 'R':
        return get_slide_moves(r, c, board, col, [(-1, 0), (1, 0), (0, -1), (0, 1)])
    elif t == 'Q':
        return get_slide_moves(r, c, board, col, [(-1, -1), (-1, 1), (1, -1), (1, 1), (-1, 0), (1, 0), (0, -1), (0, 1)])
    elif t == 'K':
        return get_king_moves(r, c, board, col)
    
    return []


def find_king(board, col):
    for r in range(8):
        for c in range(8):
            if board[r][c] == col + 'K':
                return (r, c)
    return None


def is_attacked(board, r, c, by_col):
    for rr in range(8):
        for cc in range(8):
            piece = board[rr][cc]
            if color(piece) == by_col:
                if (r, c) in get_raw_moves(rr, cc, board):
                    return True
    return False


def in_check(board, col):
    king_pos = find_king(board, col)
    if not king_pos:
        return False
    return is_attacked(board, king_pos[0], king_pos[1], 'b' if col == 'w' else 'w')


def apply_move(board, fr, fc, tr, tc, promo=None):
    new_board = clone_board(board)
    captured = new_board[tr][tc]
    new_board[tr][tc] = new_board[fr][fc]
    new_board[fr][fc] = None
    
    piece = new_board[tr][tc]
    if ptype(piece) == 'P' and (tr == 0 or tr == 7):
        new_board[tr][tc] = color(piece) + (promo or 'Q')
    
    return new_board, captured


def get_legal_moves(board, col):
    legal = []
    for r in range(8):
        for c in range(8):
            piece = board[r][c]
            if color(piece) != col:
                continue
            
            for tr, tc in get_raw_moves(r, c, board):
                new_board, _ = apply_move(board, r, c, tr, tc)
                if not in_check(new_board, col):
                    legal.append({'fr': r, 'fc': c, 'tr': tr, 'tc': tc})
    
    return legal


def evaluate(board):
    score = 0
    for r in range(8):
        for c in range(8):
            piece = board[r][c]
            if not piece:
                continue
            
            col = color(piece)
            t = ptype(piece)
            val = PVAL.get(t, 0)
            
            pst_row = r if col == 'w' else 7 - r
            ps_val = 0
            if t in PST and pst_row < len(PST[t]) and c < len(PST[t][pst_row]):
                ps_val = PST[t][pst_row][c]
            
            piece_score = val + ps_val
            if col == 'w':
                score += piece_score
            else:
                score -= piece_score
    
    return score


def minimax(board, depth, alpha, beta, is_max, nodes_dict):
    nodes_dict['count'] += 1
    
    if depth == 0:
        return evaluate(board), None
    
    col = 'w' if is_max else 'b'
    moves = get_legal_moves(board, col)
    
    if not moves:
        if in_check(board, col):
            return (99999 if is_max else -99999), None
        return 0, None
    
    best_score = float('-inf') if is_max else float('inf')
    best_move = moves[0]
    
    for move in moves:
        new_board, _ = apply_move(board, move['fr'], move['fc'], move['tr'], move['tc'])
        score, _ = minimax(new_board, depth - 1, alpha, beta, not is_max, nodes_dict)
        
        if is_max:
            if score > best_score:
                best_score = score
                best_move = move
            alpha = max(alpha, best_score)
        else:
            if score < best_score:
                best_score = score
                best_move = move
            beta = min(beta, best_score)
        
        if beta <= alpha:
            break
    
    return best_score, best_move


def get_ai_move(board, depth):
    nodes_dict = {'count': 0}
    _, move = minimax(board, depth, float('-inf'), float('inf'), False, nodes_dict)
    return move, nodes_dict['count']
