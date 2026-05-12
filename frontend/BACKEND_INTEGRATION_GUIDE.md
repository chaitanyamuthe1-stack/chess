# API Integration Guide

## Chess Arena - Backend Integration

This document provides guidance for integrating the frontend gaming UI with the backend Chess Engine API.

## Backend API Endpoints (Expected)

### Game Management
- `GET /api/game/start` - Initialize a new game
- `GET /api/game/state` - Get current game state
- `POST /api/game/move` - Execute a chess move
- `POST /api/game/reset` - Reset current game
- `GET /api/game/history` - Get move history

### Player Stats
- `GET /api/player/stats` - Get player statistics
- `POST /api/player/stats/update` - Update player stats
- `GET /api/player/achievements` - Get unlocked achievements

### Leaderboard
- `GET /api/leaderboard` - Get top players
- `GET /api/leaderboard/rank` - Get player rank

### AI Opponent
- `POST /api/ai/move` - Get AI move
- `POST /api/ai/difficulty` - Set AI difficulty

## Frontend API Service

Create a new file: `src/services/api.ts`

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Game APIs
export const gameService = {
  startGame: () => apiClient.get('/game/start'),
  getGameState: () => apiClient.get('/game/state'),
  makeMove: (move: string) => apiClient.post('/game/move', { move }),
  resetGame: () => apiClient.post('/game/reset'),
  getHistory: () => apiClient.get('/game/history'),
};

// Player APIs
export const playerService = {
  getStats: () => apiClient.get('/player/stats'),
  updateStats: (stats: any) => apiClient.post('/player/stats/update', stats),
  getAchievements: () => apiClient.get('/player/achievements'),
};

// Leaderboard APIs
export const leaderboardService = {
  getTopPlayers: (limit: number = 10) => 
    apiClient.get('/leaderboard', { params: { limit } }),
  getPlayerRank: (playerId: string) => 
    apiClient.get(`/leaderboard/rank/${playerId}`),
};

// AI APIs
export const aiService = {
  getAIMove: (difficulty: string = 'medium') => 
    apiClient.post('/ai/move', { difficulty }),
  setDifficulty: (difficulty: string) => 
    apiClient.post('/ai/difficulty', { difficulty }),
};

export default apiClient;
```

## Integration Examples

### Using Game API in Component

```typescript
import { gameService } from '../services/api';

const GameBoard: React.FC = () => {
  const handleMove = async (move: string) => {
    try {
      const response = await gameService.makeMove(move);
      setGameState(response.data);
      onScoreUpdate(response.data.pointsEarned);
    } catch (error) {
      console.error('Move failed:', error);
      showToast('Invalid move', 'error');
    }
  };

  return (
    // Component JSX
  );
};
```

### Fetching Player Stats

```typescript
import { playerService } from '../services/api';

const ScoreDisplay: React.FC = () => {
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await playerService.getStats();
        setGameStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    // Component JSX
  );
};
```

### AI Move Integration

```typescript
const handleAIMove = async () => {
  try {
    const response = await aiService.getAIMove('medium');
    const aiMove = response.data.move;
    
    // Update board with AI move
    handleMove(aiMove);
    
    // Update score if AI action resulted in points
    if (response.data.points) {
      onScoreUpdate(response.data.points);
    }
  } catch (error) {
    console.error('AI move failed:', error);
  }
};
```

## Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=10000
```

## Error Handling

```typescript
import { AxiosError } from 'axios';

const handleApiError = (error: AxiosError) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = (error.response.data as any)?.message || 'Error';

    switch (status) {
      case 400:
        showToast('Invalid request', 'error');
        break;
      case 401:
        showToast('Authentication required', 'error');
        break;
      case 404:
        showToast('Resource not found', 'error');
        break;
      case 500:
        showToast('Server error', 'error');
        break;
      default:
        showToast(message, 'error');
    }
  } else if (error.request) {
    // Request made but no response
    showToast('Network error - no response from server', 'error');
  } else {
    // Error in request setup
    showToast('Error setting up request', 'error');
  }
};
```

## WebSocket Integration (Optional)

For real-time updates:

```typescript
import { useEffect } from 'react';

export const useGameSocket = (gameId: string) => {
  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/game/${gameId}`);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // Handle different message types
      switch (data.type) {
        case 'MOVE':
          handleOpponentMove(data.move);
          break;
        case 'SCORE':
          updateScore(data.points);
          break;
        case 'GAME_END':
          handleGameEnd(data.result);
          break;
      }
    };

    return () => socket.close();
  }, [gameId]);
};
```

## Testing API Integration

### Mock Data for Development

```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/game/state', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        turn: 'white',
        lastMove: null,
      })
    );
  }),

  rest.post('/api/game/move', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        pointsEarned: 50,
        newState: {},
      })
    );
  }),
];
```

## Performance Optimization

### Request Caching
```typescript
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({ max: 100, ttl: 1000 * 60 * 5 }); // 5 min TTL

export const cachedGameService = {
  getGameState: async () => {
    const cached = cache.get('gameState');
    if (cached) return cached;

    const response = await gameService.getGameState();
    cache.set('gameState', response.data);
    return response.data;
  },
};
```

### Request Debouncing
```typescript
import { debounce } from 'lodash';

const debouncedUpdateStats = debounce((stats) => {
  playerService.updateStats(stats);
}, 1000);
```

## CORS Configuration

Ensure backend CORS is configured:

```python
# Python Flask example
from flask_cors import CORS

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"]
    }
})
```

## Authentication (Future)

When authentication is needed:

```typescript
// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Refresh token or redirect to login
    }
    return Promise.reject(error);
  }
);
```

## Monitoring & Analytics

```typescript
// Track API calls
apiClient.interceptors.request.use((config) => {
  config.metadata = { startTime: Date.now() };
  return config;
});

apiClient.interceptors.response.use((response) => {
  const duration = Date.now() - response.config.metadata.startTime;
  console.log(`API ${response.config.method} ${response.config.url} took ${duration}ms`);
  return response;
});
```

## Common Issues & Solutions

### CORS Error
- Ensure backend has CORS enabled
- Check allowed origins match frontend URL
- Verify Content-Type headers

### Timeout Errors
- Increase timeout in api.ts
- Check network connectivity
- Verify backend is running

### 404 Not Found
- Verify API endpoint paths
- Check API_BASE_URL environment variable
- Ensure backend routes are registered

### Stale Data
- Implement cache invalidation strategy
- Use websockets for real-time updates
- Add refresh mechanisms

---

**Backend API integration ready for implementation**
