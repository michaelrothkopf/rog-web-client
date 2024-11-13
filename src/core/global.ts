import { Socket } from 'socket.io-client';

export const GLOBAL_BASE_URL = 'http://127.0.0.1:8148';
export const AUTH_LOGIN_PATH = GLOBAL_BASE_URL + '/auth/login';
export const AUTH_SIGNUP_PATH = GLOBAL_BASE_URL + '/auth/signup';
export const FRIEND_LIST_PATH = GLOBAL_BASE_URL + '/friends';
export const FRIEND_REQUEST_PATH = GLOBAL_BASE_URL + '/friends/request';
export const FRIEND_REQUEST_LIST_PATH = GLOBAL_BASE_URL + '/friends/request';
export const FRIEND_REQUEST_ACCEPT_PATH = GLOBAL_BASE_URL + '/friends/request/accept';
export const FRIEND_REQUEST_DECLINE_PATH = GLOBAL_BASE_URL + '/friends/request/decline';
export const FRIEND_REMOVE_PATH = GLOBAL_BASE_URL + '/friends';

export const HEADERS = new Headers();
export const BODY_HEADERS = new Headers();
BODY_HEADERS.set('Content-Type', 'application/json');

export const SOCKET_URL_BASE = 'http://127.0.0.1:8148/';
export const SOCKET_CONNECTION_PATH = '/live/socket.io'

interface GlobalState {
  socket: Socket | null,
}

export const globalState: GlobalState = {
  socket: null,
};