import { globalState } from './global';

export interface GameMetadata {
  gameId: string;
  friendlyName: string;
  minPlayers: number;
  maxPlayers: number;
}

export interface OutsiderGameData {
  joinCode: string;
  numJoined: number;
  maxPlayers: number;
  friendlyName: string;
  creatorDisplayName: string;
}

export const AVAILABLE_GAMES: GameMetadata[] = [
  { gameId: 'HILAR', friendlyName: 'Hilar', minPlayers: 2, maxPlayers: 8 },
  { gameId: 'DUEL', friendlyName: 'Duel', minPlayers: 2, maxPlayers: 2 },
  { gameId: 'CHAT', friendlyName: 'Chat', minPlayers: 1, maxPlayers: 32 },
];

export const createGame = (gameId: string) => {
  if (!globalState.socket) return;
  globalState.socket.emit('createGame', { gameId });
}

export const joinGame = (joinCode: string) => {
  if (!globalState.socket) return;
  globalState.socket.emit('joinGame', { joinCode });
}

export const beginGame = () => {
  if (!globalState.socket) return;
  globalState.socket.emit('beginGame');
}

export const terminateGame = () => {
  if (!globalState.socket) return;
  globalState.socket.emit('terminateGame');
}

export const leaveGame = () => {
  if (!globalState.socket) return;
  globalState.socket.emit('leaveGame');
}