// The suit of the card
export enum CardSuit {
  NULL,
  CLUBS,
  DIAMONDS,
  HEARTS,
  SPADES,
}

// The rank of the card
export enum CardRank {
  NULL,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE
}

// An individual card in a deck
export interface Card {
  suit: CardSuit;
  rank: CardRank;
}

export const NULL_CARD = {
  suit: CardSuit.NULL,
  rank: CardRank.NULL,
}

export const cardToString = (card: Card): string => {
  let result = '';

  if (card.rank === CardRank.NULL) {
    result += 'X';
  }
  // If the card has a numerical rank, just use that
  else if (card.rank < CardRank.JACK) {
    result += `${card.rank + 1}`;
  }
  else if (card.rank === CardRank.JACK) {
    result += `J`
  }
  else if (card.rank === CardRank.QUEEN) {
    result += `Q`
  }
  else if (card.rank === CardRank.KING) {
    result += `K`
  }
  else if (card.rank === CardRank.ACE) {
    result += `A`
  }
  else {
    result += `X`;
  }

  // Add the suit
  if (card.suit === CardSuit.CLUBS) {
    result += `c`;
  }
  else if (card.suit === CardSuit.DIAMONDS) {
    result += `d`;
  }
  else if (card.suit === CardSuit.HEARTS) {
    result += `h`;
  }
  else if (card.suit === CardSuit.SPADES) {
    result += `s`;
  }
  else {
    result += `x`;
  }

  return result;
}