import { create } from 'zustand';
import { FriendshipData } from '../core/friends';

export interface FriendState {
  friends: FriendshipData[],
  friendRequests: FriendshipData[],

  setFriends(newFriends: FriendshipData[]): void,
  setFriendRequests(newFriendRequests: FriendshipData[]): void,
}

export const useFriendStore = create<FriendState>((set) => ({
  // FriendState
  friends: [],
  friendRequests: [],

  // When friend data is received
  setFriends: (newFriends: FriendshipData[]) => set({ friends: newFriends }),
  setFriendRequests: (newFriendRequests: FriendshipData[]) => set({ friendRequests: newFriendRequests }),
}));