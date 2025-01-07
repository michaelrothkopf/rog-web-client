import { Socket } from 'socket.io-client';

export const PRODUCTION_BASE_URL = 'https://rog.michaelrothkopf.com/server';
export const DEVELOPMENT_BASE_URL = 'http://localhost:8141';
export const IN_PRODUCTION = import.meta.env.MODE === 'production';

export const GLOBAL_BASE_URL = IN_PRODUCTION ? PRODUCTION_BASE_URL : DEVELOPMENT_BASE_URL;

export const AUTH_LOGIN_PATH = GLOBAL_BASE_URL + '/auth/login';
export const AUTH_SIGNUP_PATH = GLOBAL_BASE_URL + '/auth/signup';
export const CHANGE_PASSWORD_PATH = GLOBAL_BASE_URL + '/auth/change_password';
export const VALIDATE_AUTHTOKEN_PATH = GLOBAL_BASE_URL + '/auth/validate_authtoken';

export const FRIEND_LIST_PATH = GLOBAL_BASE_URL + '/friends';
export const FRIEND_REQUEST_PATH = GLOBAL_BASE_URL + '/friends/request';
export const FRIEND_REQUEST_LIST_PATH = GLOBAL_BASE_URL + '/friends/request';
export const FRIEND_REQUEST_ACCEPT_PATH = GLOBAL_BASE_URL + '/friends/request/accept';
export const FRIEND_REQUEST_DECLINE_PATH = GLOBAL_BASE_URL + '/friends/request/decline';
export const FRIEND_REMOVE_PATH = GLOBAL_BASE_URL + '/friends';
export const FRIEND_GAME_LIST_PATH = GLOBAL_BASE_URL + '/friends/games';

export const HOMEPAGE_DATA_REFRESH_INTERVAL = 3000; // ms

export const HEADERS = new Headers();
export const BODY_HEADERS = new Headers();
BODY_HEADERS.set('Content-Type', 'application/json');

export const SOCKET_URL_BASE = GLOBAL_BASE_URL;
export const SOCKET_CONNECTION_PATH = '/live/socket.io'

interface GlobalState {
  socket: Socket | null,
}

export const globalState: GlobalState = {
  socket: null,
};