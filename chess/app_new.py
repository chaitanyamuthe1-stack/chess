import json
import time
import streamlit as st
import streamlit.components.v1 as components

from chess_game import format_time, load_board, make_move, parse_event


PAGE_CONFIG = {
    'page_title': 'Streamlit Chess Arena',
    'page_icon': '♟️',
    'layout': 'wide',
    'initial_sidebar_state': 'expanded',
}


def init_state() -> None:
    if 'fen' not in st.session_state:
        st.session_state.fen = 'start'
        st.session_state.game_over = False
        st.session_state.result = None
        st.session_state.move_history = []
        st.session_state.captured_white = []
        st.session_state.captured_black = []
        st.session_state.last_move = None
        st.session_state.active_color = 'w'
        st.session_state.clocks = {'w': 300.0, 'b': 300.0}
        st.session_state.last_tick = time.time()
        st.session_state.history = []
        st.session_state.sound_enabled = True
        st.session_state.last_event_id = None
        st.session_state.orientation = 'white'
        st.session_state.status = 'New game ready. Drag a piece to move.'


def reset_game() -> None:
    st.session_state.fen = 'start'
    st.session_state.game_over = False
    st.session_state.result = None
    st.session_state.move_history = []
    st.session_state.captured_white = []
    st.session_state.captured_black = []
    st.session_state.last_move = None
    st.session_state.active_color = 'w'
    st.session_state.clocks = {'w': 300.0, 'b': 300.0}
    st.session_state.last_tick = time.time()
    st.session_state.history = []
    st.session_state.status = 'New game ready. Drag a piece to move.'


def build_board_html() -> str:
    current_fen = json.dumps(st.session_state.fen)
    orientation = json.dumps(st.session_state.orientation)
    last_move = json.dumps(st.session_state.last_move or {})
    active_color = json.dumps(st.session_state.active_color)
    display_clocks = dict(st.session_state.clocks)
    if not st.session_state.game_over:
        elapsed = time.time() - st.session_state.last_tick
        display_clocks[st.session_state.active_color] = max(0.0, display_clocks[st.session_state.active_color] - elapsed)
    white_time = int(display_clocks['w'])
    black_time = int(display_clocks['b'])
    status = json.dumps(st.session_state.status)
    sound = 'true' if st.session_state.sound_enabled else 'false'

    template = """
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css" integrity="sha512-0Yc7YMTCk7nZ64SDnble3qkA0Y5A4o+sp0uvW5pVwI7DrSyk+6uKCb2TdmGvBzTn1bLNuXmiG/MzffEEmDHFVA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/1.0.0/chess.min.js" integrity="sha512-Q4J7B4BylFucff7cF26UkBggVNQm0f1KjWMMVvu7MVd4JdDE0ZcK4STnj5SaXcPoO2C1OaK2uG4680bFNfWP0w==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js" integrity="sha512-PYJbsyx1Qv6lQjox05PMao2BnpCOZpDTY1FqiNmwJisF/JsN8URtQzAgD1CamD1kGxq3DggGQI60AfuG4I6Zeg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<style>
  body { margin: 0; font-family: Inter, sans-serif; }
  .arena-card { background: linear-gradient(135deg, #f4ede1 0%, #d9c5ae 100%); border-radius: 30px; box-shadow: 0 18px 60px rgba(0,0,0,0.18); padding: 22px; }
  .board-shell { max-width: 760px; margin: 0 auto; position: relative; }
  .board-frame { background: #7b5a2d; border-radius: 28px; padding: 16px; box-shadow: inset 0 8px 20px rgba(0,0,0,0.18); }
  #board { width: 100%; max-width: 720px; margin: auto; }
  .status-chip { background: rgba(0,0,0,0.08); color: #2f220f; padding: 10px 16px; border-radius: 999px; display: inline-flex; align-items: center; gap: 10px; font-weight: 600; }
  .clock-bar { display: flex; justify-content: space-between; align-items: center; margin-top: 18px; }
  .timer-card { background: #fff8ef; border-radius: 18px; padding: 14px 18px; box-shadow: 0 12px 28px rgba(0,0,0,0.08); width: 48%; }
  .timer-label { font-size: 12px; text-transform: uppercase; color: #6b4f35; margin-bottom: 4px; }
  .timer-value { font-size: 2rem; font-weight: 700; color: #3f2a16; }
  .highlight-square { background: rgba(250, 190, 110, 0.45) !important; }
  .last-move { background: rgba(75, 43, 0, 0.35) !important; }
  .board-meta { margin-top: 18px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .wood-tag { padding: 10px 14px; border-radius: 16px; background: rgba(255,255,255,0.88); color: #4c3718; font-weight: 700; box-shadow: 0 8px 20px rgba(0,0,0,0.08); }
  .spinner { width: 42px; height: 42px; border: 5px solid rgba(255,255,255,0.4); border-top-color: #8a5a28; border-radius: 50%; animation: spin 1.2s linear infinite; margin: 0 auto; }
  .loading-overlay { position: absolute; inset: 0; background: rgba(17, 11, 4, 0.82); display: flex; align-items: center; justify-content: center; border-radius: 28px; z-index: 2; color: #fff; font-weight: 600; backdrop-filter: blur(6px); }
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  @media(max-width: 900px) {
    .board-frame { padding: 14px; }
    .timer-card { width: 100%; }
  }
</style>
<div class="arena-card">
  <div class="board-shell">
    <div class="board-frame">
      <div class="loading-overlay" id="loadingOverlay">
        <div>
          <div class="spinner"></div>
          <div style="margin-top:14px; text-align:center; letter-spacing:0.02em;">Loading chessboard...</div>
        </div>
      </div>
      <div class="board-meta">
        <div class="status-chip">{STATUS}</div>
        <div class="wood-tag">Wooden arena theme</div>
      </div>
      <div id="board"></div>
      <div class="clock-bar">
        <div class="timer-card">
          <div class="timer-label">White clock</div>
          <div class="timer-value" id="whiteTimer"></div>
        </div>
        <div class="timer-card">
          <div class="timer-label">Black clock</div>
          <div class="timer-value" id="blackTimer"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  const initialFen = {CURRENT_FEN};
  const orientation = {ORIENTATION};
  const lastMove = {LAST_MOVE};
  const activeColor = {ACTIVE_COLOR};
  let whiteSeconds = {WHITE_TIME};
  let blackSeconds = {BLACK_TIME};
  const soundEnabled = {SOUND_ENABLED};

  const game = new Chess(initialFen === 'start' ? undefined : initialFen);
  const config = {
    draggable: true,
    position: initialFen,
    orientation: orientation,
    pieceTheme: 'https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/img/chesspieces/wikipedia/{piece}.png',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    moveSpeed: 'slow'
  };

  const board = Chessboard('board', config);

  function removeHighlights() {
    document.querySelectorAll('.square-55d63').forEach(s => s.classList.remove('highlight-square', 'last-move'));
  }

  function greySquare(square) {
    const squareEl = document.querySelector('.square-' + square);
    if (squareEl) {
      squareEl.classList.add('highlight-square');
    }
  }

  function onMouseoverSquare(square) {
    const moves = game.moves({square: square, verbose: true});
    if (!moves.length) return;
    greySquare(square);
    moves.forEach(move => greySquare(move.to));
  }

  function onMouseoutSquare() {
    removeHighlights();
    highlightLastMove();
  }

  function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) || (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }
  }

  function onDrop(source, target) {
    removeHighlights();
    const move = game.move({from: source, to: target, promotion: 'q'});
    if (move === null) return 'snapback';

    board.position(game.fen());
    highlightLastMove();
    playMoveSound();

    if (game.in_checkmate()) {
      playMateSound();
    } else if (game.in_check()) {
      playCheckSound();
    }

    postComponentEvent({
      id: Date.now().toString() + Math.random().toString(16).slice(2),
      type: 'move',
      data: {from: move.from, to: move.to, promotion: move.promotion || null}
    });
  }

  function onSnapEnd() {
    board.position(game.fen());
  }

  function highlightLastMove() {
    if (!lastMove || !lastMove.from || !lastMove.to) return;
    const from = document.querySelector('.square-' + lastMove.from);
    const to = document.querySelector('.square-' + lastMove.to);
    if (from) from.classList.add('last-move');
    if (to) to.classList.add('last-move');
  }

  function postComponentEvent(payload) {
    const value = JSON.stringify(payload);
    if (window.Streamlit && window.Streamlit.setComponentValue) {
      window.Streamlit.setComponentValue(value);
    } else {
      window.parent.postMessage({isStreamlitMessage: true, type: 'streamlit:setComponentValue', value}, '*');
    }
  }

  function beep(freq, duration) {
    if (!soundEnabled || !window.AudioContext) return;
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = freq;
    oscillator.connect(gain);
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.15, context.currentTime);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration / 1000);
    oscillator.stop(context.currentTime + duration / 1000);
  }

  function playMoveSound() { beep(440, 90); }
  function playCheckSound() { beep(780, 140); }
  function playMateSound() { beep(240, 260); }

  function displayClocks() {
    const whiteEl = document.getElementById('whiteTimer');
    const blackEl = document.getElementById('blackTimer');
    let white = whiteSeconds;
    let black = blackSeconds;
    const start = performance.now();
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      if (activeColor === 'w') white = Math.max(0, whiteSeconds - elapsed);
      else black = Math.max(0, blackSeconds - elapsed);
      whiteEl.textContent = formatTime(Math.round(white));
      blackEl.textContent = formatTime(Math.round(black));
      if (white <= 0 || black <= 0) {
        const loser = white <= 0 ? 'w' : 'b';
        postComponentEvent({ id: Date.now().toString() + Math.random().toString(16).slice(2), type: 'timeout', data: {side: loser} });
      } else {
        requestAnimationFrame(tick);
      }
    };
    tick();
  }

  function formatTime(seconds) {
    const total = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(total / 60);
    const secs = total % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  window.addEventListener('load', () => {
    document.getElementById('loadingOverlay').style.display = 'none';
    highlightLastMove();
    displayClocks();
  });
</script>
"""
    return (
        template
        .replace('{CURRENT_FEN}', current_fen)
        .replace('{ORIENTATION}', orientation)
        .replace('{LAST_MOVE}', last_move)
        .replace('{ACTIVE_COLOR}', active_color)
        .replace('{WHITE_TIME}', str(white_time))
        .replace('{BLACK_TIME}', str(black_time))
        .replace('{STATUS}', status)
        .replace('{SOUND_ENABLED}', sound)
    )


def apply_move_event(event_payload: dict) -> None:
    event_id = event_payload.get('id')
    if event_id is None or event_id == st.session_state.last_event_id:
        return

    st.session_state.last_event_id = event_id
    event_type = event_payload.get('type')
    event_data = event_payload.get('data', {})

    if event_type == 'move' and not st.session_state.game_over:
        record_snapshot()
        process_move(event_data)
    elif event_type == 'timeout' and not st.session_state.game_over:
        side = event_data.get('side')
        if side in ('w', 'b'):
            st.session_state.game_over = True
            winner = 'Black' if side == 'w' else 'White'
            st.session_state.result = f'{winner} wins by timeout'
            st.session_state.status = st.session_state.result


def record_snapshot() -> None:
    st.session_state.history.append({
        'fen': st.session_state.fen,
        'move_history': list(st.session_state.move_history),
        'captured_white': list(st.session_state.captured_white),
        'captured_black': list(st.session_state.captured_black),
        'clocks': dict(st.session_state.clocks),
        'active_color': st.session_state.active_color,
        'last_move': st.session_state.last_move,
        'status': st.session_state.status,
        'result': st.session_state.result,
    })


def process_move(move_data: dict) -> None:
    elapsed = time.time() - st.session_state.last_tick
    st.session_state.last_tick = time.time()
    st.session_state.clocks[st.session_state.active_color] = max(
        0.0, st.session_state.clocks[st.session_state.active_color] - elapsed
    )

    move_result = make_move(st.session_state.fen, move_data)
    if move_result is None:
        st.session_state.status = 'Illegal move. Try another square.'
        return

    st.session_state.fen = move_result['fen']
    st.session_state.last_move = {'from': move_data['from'], 'to': move_data['to']}
    st.session_state.active_color = move_result['turn']
    st.session_state.move_history.append(move_result)

    if move_result['capture']:
        if move_result['color'] == 'White':
            st.session_state.captured_white.append(move_result['capture'])
        else:
            st.session_state.captured_black.append(move_result['capture'])

    if move_result['is_checkmate']:
        st.session_state.game_over = True
        winner = 'White' if move_result['turn'] == 'b' else 'Black'
        st.session_state.result = f'Checkmate – {winner} wins'
        st.session_state.status = st.session_state.result
    elif move_result['is_stalemate']:
        st.session_state.game_over = True
        st.session_state.result = 'Draw by stalemate'
        st.session_state.status = st.session_state.result
    elif move_result['is_check']:
        st.session_state.status = f"{move_result['color']} gives check"
    else:
        next_player = 'White' if move_result['turn'] == 'w' else 'Black'
        st.session_state.status = f"{next_player} to move"


def undo_move() -> None:
    if not st.session_state.history:
        st.session_state.status = 'No move to undo.'
        return

    snapshot = st.session_state.history.pop()
    st.session_state.fen = snapshot['fen']
    st.session_state.move_history = list(snapshot['move_history'])
    st.session_state.captured_white = list(snapshot['captured_white'])
    st.session_state.captured_black = list(snapshot['captured_black'])
    st.session_state.clocks = dict(snapshot['clocks'])
    st.session_state.active_color = snapshot['active_color']
    st.session_state.last_move = snapshot['last_move']
    st.session_state.status = snapshot.get('status', 'Move undone')
    st.session_state.result = snapshot.get('result')
    st.session_state.game_over = False
    st.session_state.last_tick = time.time()


def format_history() -> str:
    rows = []
    for index in range(0, len(st.session_state.move_history), 2):
        number = index // 2 + 1
        white = st.session_state.move_history[index]['san']
        black = st.session_state.move_history[index + 1]['san'] if index + 1 < len(st.session_state.move_history) else ''
        rows.append(f"{number}. {white} {black}")
    return '\n'.join(rows)


def render_header() -> None:
    st.markdown(
        """
        <style>
            .page-title { font-size: 2.8rem; font-weight: 800; margin-bottom: 0.15rem; }
            .page-subtitle { font-size: 1rem; color: #5a4632; margin-bottom: 1rem; }
            .panel-card { background: linear-gradient(180deg, #fbf5ee 0%, #f1e4d5 100%); border-radius: 26px; padding: 22px; box-shadow: 0 24px 70px rgba(43, 25, 10, 0.12); }
            .panel-heading { margin-bottom: 0.75rem; font-size: 1.05rem; font-weight: 700; color: #3d2b17; }
            .status-pill { display: inline-flex; align-items: center; padding: 10px 16px; background: rgba(81, 50, 15, 0.08); border-radius: 999px; color: #3b2411; font-weight: 600; }
            .board-card { background: linear-gradient(180deg, #e7ccb7 0%, #d8b690 100%); border-radius: 32px; }
            .capture-row { display: flex; flex-wrap: wrap; gap: 8px; }
            .capture-piece { font-size: 1.2rem; background: rgba(255,255,255,0.82); border-radius: 10px; padding: 8px 12px; box-shadow: 0 10px 18px rgba(37, 22, 7, 0.08); }
            .control-button { min-height: 48px; }
            @media(max-width: 880px) {
                .page-title { font-size: 2rem; }
            }
        </style>
        <div class="page-title">Streamlit Chess Arena</div>
        <div class="page-subtitle">Realistic drag & drop chess with timers, rich history, and polished wooden styling.</div>
        """,
        unsafe_allow_html=True,
    )


def render_layout() -> str:
    left, right = st.columns([3, 2], gap='large')

    with left:
        raw_event = components.html(build_board_html(), height=760, scrolling=False)
        st.markdown('### Captured pieces')
        col1, col2 = st.columns(2)
        with col1:
            st.markdown('**White has captured**')
            st.write(' '.join(st.session_state.captured_white) or '—')
        with col2:
            st.markdown('**Black has captured**')
            st.write(' '.join(st.session_state.captured_black) or '—')

    with right:
        st.markdown('### Game status')
        st.markdown(f"<div class='status-pill'>{st.session_state.status}</div>", unsafe_allow_html=True)

        display_clocks = dict(st.session_state.clocks)
        if not st.session_state.game_over:
            elapsed = time.time() - st.session_state.last_tick
            display_clocks[st.session_state.active_color] = max(
                0.0, display_clocks[st.session_state.active_color] - elapsed
            )

        st.markdown('### Player timers')
        st.metric('White clock', format_time(display_clocks['w']))
        st.metric('Black clock', format_time(display_clocks['b']))

        st.markdown('### Move history')
        st.code(format_history() or 'No moves yet. Drag a piece to start.', language='text')

        st.markdown('### Controls')
        restart, undo = st.columns(2)
        with restart:
            if st.button('Restart game', key='restart_btn'):
                reset_game()
                st.experimental_rerun()
        with undo:
            if st.button('Undo move', key='undo_btn'):
                undo_move()
                st.experimental_rerun()

        st.markdown('### Settings')
        st.session_state.sound_enabled = st.checkbox('Enable sounds', value=st.session_state.sound_enabled)
        st.markdown('### Game result')
        if st.session_state.game_over:
            st.success(st.session_state.result)

    return raw_event


def main() -> None:
    st.set_page_config(**PAGE_CONFIG)
    init_state()

    render_header()

    raw_event = render_layout()
    event_payload = parse_event(raw_event)
    if event_payload:
        apply_move_event(event_payload)
        st.experimental_rerun()


if __name__ == '__main__':
    main()
