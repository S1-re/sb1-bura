import React from 'react';
import { Card as CardType } from '../types';
import Card from './Card';
import { calculateHandValue } from '../utils/deck';

interface HandProps {
  hand: CardType[];
  isDealer?: boolean;
  hideFirstCard?: boolean;
}

const Hand: React.FC<HandProps> = ({ hand, isDealer = false, hideFirstCard = false }) => {
  const handValue = calculateHandValue(hand);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">{isDealer ? 'ディーラー' : 'プレイヤー'}</h2>
      <div className="flex space-x-2">
        {hand.map((card, index) => (
          <div key={index} className={index === 0 && hideFirstCard ? 'invisible' : ''}>
            <Card card={card} />
          </div>
        ))}
        {hideFirstCard && (
          <div className="absolute">
            <div className="w-16 h-24 bg-blue-600 rounded-lg"></div>
          </div>
        )}
      </div>
      {!hideFirstCard && <div className="mt-2">合計: {handValue}</div>}
    </div>
  );
};

export default Hand;