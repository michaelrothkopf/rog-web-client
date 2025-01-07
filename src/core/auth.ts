import { io } from 'socket.io-client';
import {
  AUTH_LOGIN_PATH, AUTH_SIGNUP_PATH, CHANGE_PASSWORD_PATH,
  globalState,
  HEADERS, BODY_HEADERS,
  VALIDATE_AUTHTOKEN_PATH,
} from './global';

export interface User {
  _id: string,
  username: string,
  email: string,
  locked: boolean,
  lastLogin: Date,
  lastLogout: Date,
}

export interface AuthData {
  token: string,
  tokenExpires: Date,
  user: User,
}

/**
 * Checks whether an object is a valid User interface
 * @param object 
 * @returns 
 */
export const validateUser = (object): object is User => {
  return (
    '_id' in object &&
    'username' in object &&
    'email' in object &&
    'locked' in object &&
    'lastLogin' in object &&
    'lastLogout' in object
  );
}

/**
 * Checks whether an object is a valid AuthData interface
 * @param object
 * @returns
 */
const validateAuthData = (object): object is AuthData => {
  return (
    'token' in object &&
    'tokenExpires' in object &&
    'user' in object &&
    '_id' in object.user &&
    'username' in object.user &&
    'email' in object.user &&
    'locked' in object.user &&
    'lastLogin' in object.user &&
    'lastLogout' in object.user
  );
}

/**
 * Resets authentication data in localStorage
 * @returns
 */
export const resetAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authTokenExpires');
  localStorage.removeItem('authUser');
  return;
}

export const setupAuth = (authData: AuthData) => {
  // Set the headers
  BODY_HEADERS.set('Authtoken', authData.token);
  HEADERS.set('Authtoken', authData.token);

  // Connect to the live server
  globalState.socket = io('https://rog.michaelrothkopf.com', {
    path: '/server/live/socket.io',
    auth: {
      token: authData.token,
    },
    transports: ['websocket']
  });
}

export const validateAuthtoken = async (authtoken: string) => {
  // Set the authtoken header
  const headers = new Headers();
  headers.set('Authtoken', authtoken);
  
  // Get the response
  const response = await fetch(VALIDATE_AUTHTOKEN_PATH, {
    method: 'GET',
    headers: headers,
  });

  // Return whether validation was successful
  return response.status === 200;
}

const doAuthentication = async (response: Response): Promise<AuthData | null> => {
  // If authentication has failed, return null
  if (!response.ok) return null;

  // Return the provided authentication data
  try {
    const rData = await response.json();
    
    // Validate rData
    if (!validateAuthData(rData)) {
      return null;
    }

    // Set the authentication data
    localStorage.setItem('authToken', rData.token);
    localStorage.setItem('authTokenExpires', rData.tokenExpires.toString());
    localStorage.setItem('authUser', JSON.stringify(rData.user));

    setupAuth(rData);

    // Return the authentication data
    return rData;
  } catch {
    return null;
  }
}

/**
 * Makes a login request with the server
 * @param username
 * @param password 
 * @returns AuthData object if successful, null otherwise
 */
export const doLogin = async (username: string, password: string): Promise<AuthData | null> => {
  // Attempt to authenticate with the server
  const response = await fetch(AUTH_LOGIN_PATH, {
    method: 'POST',
    body: JSON.stringify({
      username, password
    }),
    headers: BODY_HEADERS,
  });

  return doAuthentication(response);
}

export const doSignup = async (username: string, password: string, email: string) => {
  // Attempt to sign up
  const response = await fetch(AUTH_SIGNUP_PATH, {
    method: 'POST',
    body: JSON.stringify({
      username, password, email
    }),
    headers: BODY_HEADERS,
  });

  return doAuthentication(response);
}

export const doChangePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
  // Attempt to change the password
  const response = await fetch(CHANGE_PASSWORD_PATH, {
    method: 'POST',
    body: JSON.stringify({
      oldPassword, newPassword,
    }),
    headers: BODY_HEADERS,
  });

  return response.ok;
}