import { globalState } from './global';

export interface GameMetadata {
  gameId: string;
  friendlyName: string;
}

export const AVAILABLE_GAMES: GameMetadata[] = [
  { gameId: 'HILAR', friendlyName: 'Hilar' },
  { gameId: 'DEV', friendlyName: 'DO NOT USE' },
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