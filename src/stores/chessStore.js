import { create } from 'zustand';
import { Chess } from 'chess.js';

export const useChessStore = create((set, get) => ({
  game: new Chess(),
  position: 'start',
  turn: 'w',
  status: 'playing',

  makeMove: (from, to) => {
    const { game } = get();
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (move) {
        set({
          position: game.fen(),
          turn: game.turn(),
          status: game.isGameOver() ? getGameStatus(game) : 'playing',
        });
        return move;
      }
    } catch (error) {
      console.error('Invalid move:', error);
    }
    return null;
  },

  resetGame: () => {
    const newGame = new Chess();
    set({
      game: newGame,
      position: newGame.fen(),
      turn: 'w',
      status: 'playing',
    });
  },

  undoMove: () => {
    const { game } = get();
    game.undo();
    game.undo(); // Undo both player and AI moves
    set({
      position: game.fen(),
      turn: game.turn(),
      status: 'playing',
    });
  },

  aiMove: () => {
    const { game } = get();
    const moves = game.moves();
    if (moves.length > 0) {
      const move = moves[Math.floor(Math.random() * moves.length)];
      game.move(move);
      set({
        position: game.fen(),
        turn: game.turn(),
        status: game.isGameOver() ? getGameStatus(game) : 'playing',
      });
    }
  },
}));

function getGameStatus(game) {
  if (game.isCheckmate()) return 'Checkmate!';
  if (game.isDraw()) return 'Draw';
  if (game.isStalemate()) return 'Stalemate';
  if (game.isThreefoldRepetition()) return 'Draw by repetition';
  if (game.isInsufficientMaterial()) return 'Draw by insufficient material';
  return 'Game Over';
}
