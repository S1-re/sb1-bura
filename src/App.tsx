import React, { useState, useEffect } from 'react';
import { GameState, Card } from './types';
import { createDeck, calculateHandValue } from './utils/deck';
import Hand from './components/Hand';
import Controls from './components/Controls';

const initialState: GameState = {
  deck: [],
  player: { hand: [], points: 1000, bet: 0 },
  dealer: { hand: [], points: 0, bet: 0 },
  gameStatus: 'betting',
  message: 'ベットを選択してください！',
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  useEffect(() => {
    setGameState((prevState) => ({ ...prevState, deck: createDeck() }));
  }, []);

  const dealCard = (hand: Card[]): [Card[], Card[]] => {
    const [card, ...restDeck] = gameState.deck;
    return [restDeck, [...hand, card]];
  };

  const handleBet = (amount: number) => {
    if (amount === 0) {
      setGameState({ ...initialState, deck: createDeck() });
    } else {
      setGameState((prevState) => ({
        ...prevState,
        player: { ...prevState.player, bet: amount, points: prevState.player.points - amount },
        gameStatus: 'playing',
        message: 'ディールしました。ヒットかスタンドを選択してください。',
      }));
      handleDeal();
    }
  };

  const handleDeal = () => {
    let newDeck = gameState.deck;
    let playerHand: Card[], dealerHand: Card[];

    [newDeck, playerHand] = dealCard(gameState.player.hand);
    [newDeck, playerHand] = dealCard(playerHand);
    [newDeck, dealerHand] = dealCard(gameState.dealer.hand);
    [newDeck, dealerHand] = dealCard(dealerHand);

    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);

    if (playerValue === 21 && dealerValue === 21) {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: playerHand, points: prevState.player.points + prevState.player.bet },
        dealer: { ...prevState.dealer, hand: dealerHand },
        gameStatus: 'gameOver',
        message: '両者ナチュラルブラックジャック！引き分けです。',
      }));
    } else if (playerValue === 21) {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: playerHand, points: prevState.player.points + prevState.player.bet * 2.5 },
        dealer: { ...prevState.dealer, hand: dealerHand },
        gameStatus: 'gameOver',
        message: 'ナチュラルブラックジャック！あなたの勝ちです！',
      }));
    } else if (dealerValue === 21) {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: playerHand },
        dealer: { ...prevState.dealer, hand: dealerHand },
        gameStatus: 'gameOver',
        message: 'ディーラーのナチュラルブラックジャック。あなたの負けです。',
      }));
    } else {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: playerHand },
        dealer: { ...prevState.dealer, hand: dealerHand },
        gameStatus: 'playing',
        message: 'ヒットかスタンドを選択してください。',
      }));
    }
  };

  const handleHit = () => {
    const [newDeck, newHand] = dealCard(gameState.player.hand);
    const handValue = calculateHandValue(newHand);

    if (handValue > 21) {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: newHand },
        gameStatus: 'gameOver',
        message: 'バスト！あなたの負けです。',
      }));
    } else if (handValue === 21) {
      handleStand();
    } else {
      setGameState((prevState) => ({
        ...prevState,
        deck: newDeck,
        player: { ...prevState.player, hand: newHand },
        message: 'ヒットかスタンドを選択してください。',
      }));
    }
  };

  const handleStand = () => {
    let newDeck = gameState.deck;
    let dealerHand = gameState.dealer.hand;
    let dealerValue = calculateHandValue(dealerHand);

    while (dealerValue < 17) {
      [newDeck, dealerHand] = dealCard(dealerHand);
      dealerValue = calculateHandValue(dealerHand);
    }

    const playerValue = calculateHandValue(gameState.player.hand);
    let message: string;
    let playerPoints = gameState.player.points;

    if (dealerValue > 21) {
      message = 'ディーラーがバスト！あなたの勝ちです！';
      playerPoints += gameState.player.bet * 2;
    } else if (playerValue > dealerValue) {
      message = 'あなたの勝ちです！';
      playerPoints += gameState.player.bet * 2;
    } else if (playerValue === dealerValue) {
      message = '引き分けです。';
      playerPoints += gameState.player.bet;
    } else {
      message = 'ディーラーの勝ちです。';
    }

    setGameState((prevState) => ({
      ...prevState,
      deck: newDeck,
      dealer: { ...prevState.dealer, hand: dealerHand },
      player: { ...prevState.player, points: playerPoints },
      gameStatus: 'gameOver',
      message,
    }));
  };

  return (
    <div className="min-h-screen bg-green-800 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold mb-8">ブラックジャック</h1>
      <div className="mb-4">
        <Hand hand={gameState.dealer.hand} isDealer hideFirstCard={gameState.gameStatus === 'playing'} />
      </div>
      <div className="mb-8">
        <Hand hand={gameState.player.hand} />
      </div>
      <div className="text-xl mb-4">
        ポイント: {gameState.player.points} | ベット: {gameState.player.bet}
      </div>
      <div className="text-2xl font-bold mb-4">{gameState.message}</div>
      <Controls
        gameStatus={gameState.gameStatus}
        onDeal={handleDeal}
        onHit={handleHit}
        onStand={handleStand}
        onBet={handleBet}
        playerPoints={gameState.player.points}
      />
    </div>
  );
}

export default App;