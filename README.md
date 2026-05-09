# RL Chess Engine — AI3047

A powerful chess engine with **minimax + alpha-beta pruning + piece-square tables**, now ready for Streamlit deployment.

## Features

✅ **Full Chess Rules Implementation**
- Legal move generation for all piece types
- Check and checkmate detection  
- Stalemate detection
- Pawn promotion support
- Undo functionality

✅ **Advanced AI**
- Minimax algorithm with alpha-beta pruning
- Piece-Square Tables (PST) for positional evaluation
- Configurable difficulty (depth 1-3)
- Real-time move evaluation

✅ **Rich UI**
- Interactive chess board with move hints
- Move history and captured pieces display
- Real-time evaluation bar
- Game logs and statistics
- Board flip option

## Installation & Setup

### Local Development

1. **Clone/Download the project**
   ```bash
   cd chess
   ```

2. **Create a virtual environment** (optional but recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the app**
   ```bash
   streamlit run app.py
   ```

The app will open in your browser at `http://localhost:8501`

### Deploy to Streamlit Cloud

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/chess-engine.git
   git push -u origin main
   ```

2. **Deploy on Streamlit Cloud**
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Click "New app"
   - Connect your GitHub repository
   - Select this repository and `app.py` as the main file
   - Click "Deploy"

### Deploy to Other Platforms

**Heroku:**
```bash
heroku create your-chess-app
git push heroku main
```

**Railway:**
- Connect your GitHub repo to Railway
- Add `Procfile`:
  ```
  web: streamlit run app.py --server.headless true --server.address 0.0.0.0 --server.port $PORT
  ```

**Replit:**
- Import from GitHub
- Create `.replit`: 
  ```
  run = "streamlit run app.py"
  ```

## How to Play

1. **Your Turn**: Click a white piece, then click a highlighted square to move
2. **AI Move**: The AI will automatically calculate its move
3. **Controls**:
   - 🆕 **New Game**: Start fresh
   - ↩ **Undo**: Revert last 2 moves
   - 💡 **Hint**: Get AI recommendation
   - 🤖 **AI vs AI**: Watch two AIs play
   - 🔄 **Flip**: Flip board perspective

4. **Difficulty**: Adjust depth slider (1=fast/weak, 3=slow/strong)

## Project Structure

```
chess/
├── app.py                 # Main Streamlit application
├── chess_engine.py        # Chess engine with minimax + AB pruning
├── requirements.txt       # Python dependencies
├── .streamlit/
│   └── config.toml       # Streamlit configuration
├── AI3047_Chess_RL.html  # Original HTML/JS version
└── README.md             # This file
```

## Technical Details

### Engine Architecture

- **Move Generation**: Efficient bitboard-style generation for all piece types
- **Legal Move Validation**: Full check detection and move legality verification
- **Evaluation Function**: Material count + Piece-Square Tables (PST)
- **Minimax with Alpha-Beta Pruning**: Recursive algorithm with move ordering optimization
- **Piece Values**: P=100, N=320, B=330, R=500, Q=900, K=20000

### Performance

- Depth 1: ~50-200 ms (instant)
- Depth 2: ~200-800 ms (very playable)
- Depth 3: ~1-5 seconds (strong play)

## Files Explanation

- **app.py**: Streamlit UI with game state management
- **chess_engine.py**: Core chess logic (move generation, evaluation, minimax)
- **AI3047_Chess_RL.html**: Original single-file HTML implementation

## Original Version

The original HTML version (`AI3047_Chess_RL.html`) is a standalone game that runs entirely in the browser with no server required. You can open it directly in any web browser.

## Configuration

Edit `.streamlit/config.toml` to customize:
- Theme colors
- Font settings
- Performance options

Edit `app.py` to adjust:
- Default difficulty level
- UI styling
- Game rules

## Troubleshooting

**"Module not found" error:**
```bash
pip install -r requirements.txt
```

**Slow performance:**
- Reduce depth slider to 1 or 2
- Check CPU usage (minimax can be CPU-intensive)

**App won't load:**
- Ensure port 8501 is available
- Check Python version (3.8+ required)

## Future Enhancements

- [ ] Opening book integration
- [ ] Endgame tables (EGTBs)
- [ ] UCI protocol support
- [ ] Network multiplayer
- [ ] Move time management
- [ ] Perft testing

## License

Open source - feel free to modify and distribute!

## Author

AI3047 Chess Engine by GitHub Copilot

---

**Ready to deploy?** 🚀

1. Install dependencies: `pip install -r requirements.txt`
2. Run locally: `streamlit run app.py`
3. Deploy to cloud: Push to GitHub and connect to Streamlit Cloud
