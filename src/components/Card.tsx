import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
}

const Card: React.FC<CardProps> = ({ card }) => {
  const { suit, rank } = card;
  const color = suit === 'hearts' || suit === 'diamonds' ? 'text-red-600' : 'text-black';

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  return (
    <div className={`w-16 h-24 bg-white border border-gray-300 rounded-lg flex flex-col items-center justify-center ${color}`}>
      <div className="text-xl font-bold">{rank}</div>
      <div className="text-2xl">{getSuitSymbol(suit)}</div>
    </div>
  );
};

export default Card;