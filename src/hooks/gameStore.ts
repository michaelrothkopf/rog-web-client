import { create } from 'zustand';

export interface GamePlayer {
  userId: string;
  displayName: string;
}

export const gameStateHooks = {
  onGamePlayers: (players: GamePlayer[]) => { players; },
};

export interface GameState {
  gameId: string;
  joinCode: string;
  players: GamePlayer[];
  hasBegun: boolean;
  isHost: boolean;

  setGame(newGameId: string, newJoinCode: string, newPlayers: GamePlayer[], hasBegun?: boolean, isHost?: boolean): void;
  setPlayers(newPlayers: GamePlayer[]): void;
  beginGame(): void;
  resetGame(): void;
}

export const useGameStore = create<GameState>((set) => ({
  // GameState
  gameId: '',
  joinCode: '',
  players: [],
  hasBegun: false,
  isHost: false,

  setGame: (newGameId: string, newJoinCode: string, newPlayers: GamePlayer[], hasBegun?: boolean, isHost?: boolean) => set({
    gameId: newGameId,
    joinCode: newJoinCode,
    players: newPlayers,
    hasBegun: hasBegun || false,
    isHost: isHost || false,
  }),
  setPlayers: (newPlayers: GamePlayer[]) => set({
    players: newPlayers,
  }),
  beginGame: () => set({
    hasBegun: true,
  }),
  resetGame: () => set({
    gameId: '',
    joinCode: '',
    players: [],
    hasBegun: false,
    isHost: false,
  }),
}));