import { User } from './auth';
import { FRIEND_LIST_PATH, FRIEND_REMOVE_PATH, FRIEND_REQUEST_LIST_PATH, HEADERS, BODY_HEADERS, FRIEND_REQUEST_ACCEPT_PATH, FRIEND_REQUEST_DECLINE_PATH, FRIEND_REQUEST_PATH } from './global';

export interface FriendshipData {
  _id: string;
  // The person who initiated the friend request
  initiator: User;
  // The person who is receiving the friend request
  recipient: User;
  // The status of the request
  accepted: boolean;
  // The date the friend request was sent
  sentAt: string;
  // The date the friend request was accepted
  acceptedAt: string;
}

export const validateFriendshipData = (object): object is FriendshipData => {
  return (
    'initiator' in object &&
    'recipient' in object &&
    'accepted' in object &&
    'sentAt' in object &&
    'acceptedAt' in object
  );
}

export const validateFriendList = (object): object is FriendshipData[] => {
  if (!object || !Array.isArray(object)) return false;
  if (object.length < 1) return true;
  for (const item of object) if (!validateFriendshipData(item)) return false;
  return true;
}

/**
 * Gets a list of the user's friends at time of login
 * @returns 
 */
export const getFriendList = async (): Promise<FriendshipData[]> => {
  const response = await fetch(FRIEND_LIST_PATH, {
    headers: HEADERS,
  });

  if (!response.ok) return [];

  try {
    const json = await response.json();
    if (!('friends' in json) || !validateFriendList(json.friends)) return [];
    return json.friends;
  } catch {
    return [];
  }
}

/**
 * Gets a list of the user's pending friend requests at time of login
 * @returns
 */
export const getFriendRequestsList = async (): Promise<FriendshipData[]> => {
  const response = await fetch(FRIEND_REQUEST_LIST_PATH, {
    headers: HEADERS,
  });

  if (!response.ok) return [];

  try {
    const json = await response.json();
    if (!('friendRequests' in json) || !validateFriendList(json.friendRequests)) return [];
    return json.friendRequests;
  } catch {
    return [];
  }
}

/**
 * Removes a friend from a user's friend list
 * @param friend The user ID of the friend to remove
 * @returns Whether the removal was successful
 */
export const removeFriend = async (friend: string): Promise<boolean> => {
  return (await fetch(FRIEND_REMOVE_PATH, {
    headers: BODY_HEADERS,
    method: 'DELETE',
    body: JSON.stringify({ friend }),
  })).ok;
}

/**
 * Accepts a friend request from a user
 * @param request The request ID of the request to accept
 * @returns Whether the acceptance was successful
 */
export const acceptFriendRequest = async (request: string): Promise<boolean> => {
  return (await fetch(FRIEND_REQUEST_ACCEPT_PATH, {
    headers: BODY_HEADERS,
    method: 'PUT',
    body: JSON.stringify({ request }),
  })).ok;
}

/**
 * Declines a friend request from a user
 * @param request The request ID of the request to decline
 * @returns Whether the declination was successful
 */
export const declineFriendRequest = async (request: string): Promise<boolean> => {
  return (await fetch(FRIEND_REQUEST_DECLINE_PATH, {
    headers: BODY_HEADERS,
    method: 'PUT',
    body: JSON.stringify({ request }),
  })).ok;
}

/**
 * Sends a friend request
 * @param recipient The recipient of the friend request
 * @returns Whether the request was successful
 */
export const createFriendRequest = async (recipient: string): Promise<boolean> => {
  return (await fetch(FRIEND_REQUEST_PATH, {
    headers: BODY_HEADERS,
    method: 'POST',
    body: JSON.stringify({ recipient }),
  })).ok;
}