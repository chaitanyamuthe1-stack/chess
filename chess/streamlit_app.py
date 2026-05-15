import streamlit as st
import chess
from rl_agent import RandomRLAgent

st.title("♟️ Chess RL Agent Demo")

agent = RandomRLAgent()

if 'board' not in st.session_state:
    st.session_state.board = chess.Board()

board = st.session_state.board

st.write("Current board:")
st.text(str(board))

if st.button("Agent Move"):
    move = agent.select_move(board)
    if move:
        board.push(move)
    else:
        st.write("No legal moves.")

if st.button("Reset Board"):
    st.session_state.board = chess.Board()
    board = st.session_state.board

if board.is_game_over():
    st.write(f"Game over! Result: {board.result()}")
