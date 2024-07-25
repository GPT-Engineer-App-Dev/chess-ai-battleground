import { useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessStore } from '../stores/chessStore';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { game, position, turn, status, makeMove, resetGame, undoMove, aiMove } = useChessStore();

  useEffect(() => {
    if (turn === 'b') {
      // AI's turn
      setTimeout(aiMove, 300);
    }
  }, [turn, aiMove]);

  const onDrop = (sourceSquare, targetSquare) => {
    const move = makeMove(sourceSquare, targetSquare);
    return move !== null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-3xl font-bold mb-4">Chess vs AI</h1>
      <div className="w-full max-w-md mb-4">
        <Chessboard position={position} onPieceDrop={onDrop} />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-center">
          {status === 'playing'
            ? `Current turn: ${turn === 'w' ? 'White' : 'Black'}`
            : status}
        </p>
        <div className="flex space-x-2">
          <Button onClick={resetGame}>New Game</Button>
          <Button onClick={undoMove} disabled={game.history().length === 0}>
            Undo Move
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
