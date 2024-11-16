import { create } from 'zustand';
import { User } from '../core/auth';

export interface GameState {
  gameId: string;
  joinCode: string;
  players: User[];
  hasStarted: boolean;
  isHost: boolean;

  setGame(newGameId: string, newJoinCode: string, newPlayers: User[], isHost?: boolean): void;
  setPlayers(newPlayers: User[]): void;
  beginGame(): void;
}

export const useGameStore = create<GameState>((set) => ({
  // GameState
  gameId: '',
  joinCode: '',
  players: [],
  hasStarted: false,
  isHost: false,

  setGame: (newGameId: string, newJoinCode: string, newPlayers: User[], isHost?: boolean) => set({
    gameId: newGameId,
    joinCode: newJoinCode,
    players: newPlayers,
    hasStarted: false,
    isHost: isHost || false,
  }),
  setPlayers: (newPlayers: User[]) => set({
    players: newPlayers,
  }),
  beginGame: () => set({
    hasStarted: true,
  }),
}));