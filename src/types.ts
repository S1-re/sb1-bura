export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  suit: Suit;
  rank: Rank;
}

export interface Player {
  hand: Card[];
  points: number;
  bet: number;
}

export interface GameState {
  deck: Card[];
  player: Player;
  dealer: Player;
  gameStatus: 'betting' | 'playing' | 'dealerTurn' | 'gameOver';
  message: string;
}