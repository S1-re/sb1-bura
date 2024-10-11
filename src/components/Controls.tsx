import React from 'react';

interface ControlsProps {
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
  onDeal: () => void;
  onHit: () => void;
  onStand: () => void;
  onBet: (amount: number) => void;
  playerPoints: number;
}

const Controls: React.FC<ControlsProps> = ({ gameStatus, onDeal, onHit, onStand, onBet, playerPoints }) => {
  return (
    <div className="mt-4 flex flex-col items-center">
      {gameStatus === 'betting' && (
        <div className="space-x-2">
          <button onClick={() => onBet(10)} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={playerPoints < 10}>10ベット</button>
          <button onClick={() => onBet(25)} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={playerPoints < 25}>25ベット</button>
          <button onClick={() => onBet(50)} className="bg-blue-500 text-white px-4 py-2 rounded" disabled={playerPoints < 50}>50ベット</button>
        </div>
      )}
      {gameStatus === 'playing' && (
        <div className="space-x-2">
          <button onClick={onHit} className="bg-yellow-500 text-white px-4 py-2 rounded">ヒット</button>
          <button onClick={onStand} className="bg-red-500 text-white px-4 py-2 rounded">スタンド</button>
        </div>
      )}
      {gameStatus === 'gameOver' && (
        <button onClick={() => onBet(0)} className="bg-green-500 text-white px-4 py-2 rounded">新しいゲーム</button>
      )}
    </div>
  );
};

export default Controls;