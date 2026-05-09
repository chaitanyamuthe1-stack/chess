"""RL Chess Engine Streamlit App - AI3046"""

import streamlit as st
from datetime import datetime
from chess_engine import (
    clone_board, color, ptype, get_legal_moves, apply_move, in_check,
    evaluate, get_ai_move, UNI, FILES
)

st.set_page_config(
    page_title="RL Chess Engine — AI3046",
    page_icon="♔",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Initialize session state first
if 'logs' not in st.session_state:
    st.session_state.logs = []

# Define helper functions
def add_log(cls, msg):
    now = datetime.now().strftime("%H:%M:%S")
    st.session_state.logs.append((now, cls, msg))
    if len(st.session_state.logs) > 100:
        st.session_state.logs.pop(0)

# Initialize other session state
if 'board' not in st.session_state:
    st.session_state.board = None
    st.session_state.turn = 'w'
    st.session_state.selected = None
    st.session_state.hints = []
    st.session_state.last_move = None
    st.session_state.game_over = False
    st.session_state.history = []
    st.session_state.cap_w = []
    st.session_state.cap_b = []
    st.session_state.move_history = []
    st.session_state.ai_vs_ai = False
    st.session_state.flipped = False
    st.session_state.move_count = 1
    st.session_state.eval_score = 0.0
    st.session_state.nodes = 0
    st.session_state.pending_promo = None
    st.session_state.ai_depth = 2

    # Initialize board
    def init_game():
        st.session_state.board = [[None] * 8 for _ in range(8)]
        back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
        for c in range(8):
            st.session_state.board[0][c] = 'b' + back[c]
            st.session_state.board[1][c] = 'bP'
            st.session_state.board[6][c] = 'wP'
            st.session_state.board[7][c] = 'w' + back[c]
        
        st.session_state.turn = 'w'
        st.session_state.selected = None
        st.session_state.hints = []
        st.session_state.last_move = None
        st.session_state.game_over = False
        st.session_state.history = []
        st.session_state.cap_w = []
        st.session_state.cap_b = []
        st.session_state.move_history = []
        st.session_state.ai_vs_ai = False
        st.session_state.logs = []
        st.session_state.move_count = 1
        st.session_state.eval_score = 0.0
        st.session_state.nodes = 0
        st.session_state.pending_promo = None
        
        add_log('sys', '═══════════════════════════════')
        add_log('sys', '  RL CHESS ENGINE  —  AI3046')
        add_log('sys', '  minimax + alpha-beta + PST')
        add_log('sys', '═══════════════════════════════')
        add_log('sys', 'new game started. you are white.')
    
    init_game()


def do_move(fr, fc, tr, tc, promo='Q', silent=False):
    piece = st.session_state.board[fr][fc]
    is_promotion = ptype(piece) == 'P' and (tr == 0 or tr == 7)
    
    if is_promotion and not promo and st.session_state.turn == 'w':
        st.session_state.pending_promo = (fr, fc, tr, tc)
        return
    
    new_board, captured = apply_move(st.session_state.board, fr, fc, tr, tc, promo or 'Q')
    
    if captured:
        if color(captured) == 'w':
            st.session_state.cap_b.append(captured)
        else:
            st.session_state.cap_w.append(captured)
    
    st.session_state.history.append({
        'board': clone_board(st.session_state.board),
        'turn': st.session_state.turn,
        'cap_w': st.session_state.cap_w[:],
        'cap_b': st.session_state.cap_b[:]
    })
    
    st.session_state.board = new_board
    st.session_state.last_move = (fr, fc, tr, tc)
    
    mv_str = f"{FILES[fc]}{8-fr}{FILES[tc]}{8-tr}"
    st.session_state.move_history.append({
        'col': st.session_state.turn,
        'str': mv_str,
        'piece': UNI.get(piece, '♙' if st.session_state.turn == 'b' else '♟'),
        'cap': UNI.get(captured, '') if captured else '',
        'promo': promo if promo != 'Q' else ''
    })
    
    if not silent:
        cls = 'usr' if st.session_state.turn == 'w' else 'ai'
        pfx = '[you]' if st.session_state.turn == 'w' else '[ ai]'
        msg = f"{pfx}  {UNI.get(piece, '♙')}  {mv_str}"
        if captured:
            msg += f"  x{UNI.get(captured, '')}"
        if promo and promo != 'Q':
            msg += f"  ={promo}"
        add_log(cls, msg)
    
    st.session_state.turn = 'b' if st.session_state.turn == 'w' else 'w'
    st.session_state.selected = None
    st.session_state.hints = []
    
    legal = get_legal_moves(st.session_state.board, st.session_state.turn)
    chk = in_check(st.session_state.board, st.session_state.turn)
    
    ev = evaluate(st.session_state.board) / 100
    st.session_state.eval_score = ev
    st.session_state.move_count = (len(st.session_state.history) + 1) // 2
    
    if not legal:
        st.session_state.game_over = True
        if chk:
            winner = 'black' if st.session_state.turn == 'w' else 'white'
            add_log('warn', f'checkmate! {winner} wins')
        else:
            add_log('warn', 'stalemate — draw')
    elif chk:
        add_log('warn', f"{st.session_state.turn.upper()} king in check!")


def render_board():
    st.markdown("---")
    cols = st.columns([1, 3, 1])
    
    with cols[1]:
        # Coordinates top
        files = list(FILES)
        if st.session_state.flipped:
            files = files[::-1]
        
        coord_cols = st.columns([1] + [1]*8 + [1])
        for i, f in enumerate(files):
            with coord_cols[i+2]:
                st.caption(f, unsafe_allow_html=True)
        
        # Board
        for r in range(8):
            row_cols = st.columns([1] + [1]*8 + [1])
            
            # Rank number
            rank = r + 1 if st.session_state.flipped else 8 - r
            with row_cols[0]:
                st.caption(str(rank), unsafe_allow_html=True)
            
            # Squares
            for c in range(8):
                dr = (7 - r) if st.session_state.flipped else r
                dc = (7 - c) if st.session_state.flipped else c
                
                with row_cols[c+2]:
                    piece = st.session_state.board[dr][dc]
                    emoji = UNI.get(piece, '　')
                    
                    bg_color = '#2a2a2a' if (dr + dc) % 2 == 0 else '#1a1a1a'
                    
                    if st.session_state.selected and st.session_state.selected == (dr, dc):
                        bg_color = '#7c5c00'
                    elif st.session_state.last_move and ((st.session_state.last_move[0] == dr and st.session_state.last_move[1] == dc) or
                                                         (st.session_state.last_move[2] == dr and st.session_state.last_move[3] == dc)):
                        bg_color = '#1a3a1a'
                    elif not st.session_state.game_over and in_check(st.session_state.board, st.session_state.turn) and st.session_state.board[dr][dc] == st.session_state.turn + 'K':
                        bg_color = '#3a0000'
                    
                    hint_marker = ' 🎯' if (dr, dc) in st.session_state.hints else ''
                    
                    if st.button(
                        emoji + hint_marker,
                        key=f"sq_{dr}_{dc}",
                        use_container_width=True,
                        help=f"{FILES[dc]}{8-dr}"
                    ):
                        on_sq_click(dr, dc)
            
            # Rank number right
            with row_cols[9]:
                st.caption(str(rank), unsafe_allow_html=True)


def on_sq_click(r, c):
    if st.session_state.game_over or st.session_state.turn != 'w' or st.session_state.pending_promo:
        return
    
    if st.session_state.selected:
        sr, sc = st.session_state.selected
        if (sr, sc) == (r, c):
            st.session_state.selected = None
            st.session_state.hints = []
        elif (r, c) in st.session_state.hints:
            st.session_state.selected = None
            st.session_state.hints = []
            do_move(sr, sc, r, c)
            st.rerun()
        else:
            st.session_state.selected = None
            st.session_state.hints = []
            if st.session_state.board[r][c] and color(st.session_state.board[r][c]) == 'w':
                st.session_state.selected = (r, c)
                legal = [m for m in get_legal_moves(st.session_state.board, 'w') if m['fr'] == r and m['fc'] == c]
                st.session_state.hints = [(m['tr'], m['tc']) for m in legal]
    else:
        if st.session_state.board[r][c] and color(st.session_state.board[r][c]) == 'w':
            st.session_state.selected = (r, c)
            legal = [m for m in get_legal_moves(st.session_state.board, 'w') if m['fr'] == r and m['fc'] == c]
            st.session_state.hints = [(m['tr'], m['tc']) for m in legal]
    
    st.rerun()


# UI Layout
st.markdown("""
<style>
    .title { text-align: center; font-family: 'Courier New', monospace; }
    .subtitle { text-align: center; color: #999; font-family: 'Courier New', monospace; font-size: 12px; }
    .terminal { background-color: #0a0a0a; border: 1px solid #222; border-radius: 6px; padding: 10px; font-family: 'Courier New', monospace; font-size: 12px; max-height: 200px; overflow-y: auto; }
    .log-sys { color: #44cc77; }
    .log-ai { color: #4da6ff; }
    .log-usr { color: #f0a500; }
    .log-warn { color: #ff9944; }
    .log-err { color: #ff5555; }
    .log-dim { color: #444; }
</style>
""", unsafe_allow_html=True)

st.markdown("<h1 class='title'>♔ RL CHESS ENGINE ♔</h1>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>minimax + alpha-beta pruning + piece-square tables | roll: AI3046</div>", unsafe_allow_html=True)

# Main layout
left, right = st.columns([3, 2], gap="large")

with left:
    render_board()

with right:
    # Status
    if st.session_state.game_over:
        status = "GAME OVER"
        status_type = "danger"
    elif st.session_state.turn == 'w':
        status = "Your turn — select a white piece"
        status_type = "info"
    else:
        status = "AI is calculating..."
        status_type = "info"
    
    st.markdown(f"### {status}")
    
    # Stats
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("MOVE", st.session_state.move_count)
    with col2:
        st.metric("EVAL", f"{st.session_state.eval_score:.1f}")
    with col3:
        st.metric("NODES", st.session_state.nodes if st.session_state.nodes > 0 else "—")
    
    # Captured pieces
    st.markdown("### Captured Pieces")
    cap_cols = st.columns(2)
    with cap_cols[0]:
        cap_w_str = ''.join([UNI.get(p, '') for p in st.session_state.cap_w]) or "—"
        st.write(f"**By White:** {cap_w_str}")
    with cap_cols[1]:
        cap_b_str = ''.join([UNI.get(p, '') for p in st.session_state.cap_b]) or "—"
        st.write(f"**By Black:** {cap_b_str}")
    
    # Terminal/Logs
    st.markdown("### Logs")
    log_text = "\n".join([f"{ts} {msg}" for ts, _, msg in st.session_state.logs])
    st.code(log_text, language="text")
    
    # Move History
    st.markdown("### Move History")
    hist_text = ""
    for i in range(0, len(st.session_state.move_history), 2):
        mn = i // 2 + 1
        w = st.session_state.move_history[i]
        hist_text += f"{mn}. {w['piece']}{w['str']}"
        if w['cap']:
            hist_text += f"x"
        if i+1 < len(st.session_state.move_history):
            b = st.session_state.move_history[i+1]
            hist_text += f"  {b['piece']}{b['str']}"
            if b['cap']:
                hist_text += f"x"
        hist_text += "  \n"
    
    st.code(hist_text if hist_text else "—", language="text")
    
    # Controls
    st.markdown("### Controls")
    
    ctrl_cols = st.columns(5)
    with ctrl_cols[0]:
        if st.button("🆕 New Game", use_container_width=True):
            st.session_state.ai_vs_ai = False
            st.session_state.board = None
            init_game = True
            # Reset board
            st.session_state.board = [[None] * 8 for _ in range(8)]
            back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
            for c in range(8):
                st.session_state.board[0][c] = 'b' + back[c]
                st.session_state.board[1][c] = 'bP'
                st.session_state.board[6][c] = 'wP'
                st.session_state.board[7][c] = 'w' + back[c]
            
            st.session_state.turn = 'w'
            st.session_state.selected = None
            st.session_state.hints = []
            st.session_state.last_move = None
            st.session_state.game_over = False
            st.session_state.history = []
            st.session_state.cap_w = []
            st.session_state.cap_b = []
            st.session_state.move_history = []
            st.session_state.logs = []
            st.session_state.move_count = 1
            st.session_state.eval_score = 0.0
            add_log('sys', 'new game started. you are white.')
            st.rerun()
    
    with ctrl_cols[1]:
        if st.button("↩ Undo", use_container_width=True):
            if len(st.session_state.history) >= 2:
                st.session_state.history.pop()
                st.session_state.history.pop()
                st.session_state.move_history = st.session_state.move_history[:-2]
                
                if st.session_state.history:
                    prev = st.session_state.history[-1]
                    st.session_state.board = clone_board(prev['board'])
                    st.session_state.turn = prev['turn']
                    st.session_state.cap_w = prev['cap_w'][:]
                    st.session_state.cap_b = prev['cap_b'][:]
                else:
                    st.session_state.board = None
                    # Reinit
                    st.session_state.board = [[None] * 8 for _ in range(8)]
                    back = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
                    for c in range(8):
                        st.session_state.board[0][c] = 'b' + back[c]
                        st.session_state.board[1][c] = 'bP'
                        st.session_state.board[6][c] = 'wP'
                        st.session_state.board[7][c] = 'w' + back[c]
                    st.session_state.turn = 'w'
                    st.session_state.cap_w = []
                    st.session_state.cap_b = []
                
                st.session_state.last_move = None
                st.session_state.selected = None
                st.session_state.hints = []
                st.session_state.game_over = False
                st.session_state.move_count = (len(st.session_state.history) + 1) // 2
                add_log('dim', '↩ last move undone')
                st.rerun()
    
    with ctrl_cols[2]:
        if st.button("💡 Hint", use_container_width=True):
            if not st.session_state.game_over and st.session_state.turn == 'w':
                move, _ = get_ai_move(st.session_state.board, st.session_state.ai_depth)
                if move:
                    piece = st.session_state.board[move['fr']][move['fc']]
                    add_log('sys', f"hint: try {UNI.get(piece, '♙')} {FILES[move['fc']]}{8-move['fr']}→{FILES[move['tc']]}{8-move['tr']}")
                    st.session_state.selected = (move['fr'], move['fc'])
                    st.session_state.hints = [(move['tr'], move['tc'])]
                    st.rerun()
    
    with ctrl_cols[3]:
        if st.button("🤖 AI vs AI" if not st.session_state.ai_vs_ai else "⏹ Stop", use_container_width=True):
            st.session_state.ai_vs_ai = not st.session_state.ai_vs_ai
            st.rerun()
    
    with ctrl_cols[4]:
        if st.button("🔄 Flip", use_container_width=True):
            st.session_state.flipped = not st.session_state.flipped
            st.rerun()
    
    # Depth slider
    st.markdown("### Difficulty")
    st.session_state.ai_depth = st.slider("Depth (1=fast, 3=strong)", 1, 3, st.session_state.ai_depth, key="depth_slider")

# AI vs AI automation
if st.session_state.ai_vs_ai and not st.session_state.game_over:
    move, nodes = get_ai_move(st.session_state.board, st.session_state.ai_depth)
    st.session_state.nodes = nodes
    if move:
        do_move(move['fr'], move['fc'], move['tr'], move['tc'], silent=True)
        st.rerun()
elif st.session_state.turn == 'b' and not st.session_state.game_over:
    move, nodes = get_ai_move(st.session_state.board, st.session_state.ai_depth)
    st.session_state.nodes = nodes
    if move:
        do_move(move['fr'], move['fc'], move['tr'], move['tc'])
        st.rerun()
