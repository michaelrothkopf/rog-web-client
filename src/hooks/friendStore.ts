import { create } from 'zustand';
import { FriendshipData } from '../core/friends';
import { OutsiderGameData } from '../core/game';

export interface FriendState {
  friends: FriendshipData[],
  friendRequests: FriendshipData[],
  friendGames: OutsiderGameData[],

  setFriends(newFriends: FriendshipData[]): void,
  setFriendRequests(newFriendRequests: FriendshipData[]): void,
  setFriendGames(newFriendGames: OutsiderGameData[]): void,
}

export const useFriendStore = create<FriendState>((set) => ({
  // FriendState
  friends: [],
  friendRequests: [],
  friendGames: [],

  // When friend data is received
  setFriends: (newFriends: FriendshipData[]) => set({ friends: newFriends }),
  setFriendRequests: (newFriendRequests: FriendshipData[]) => set({ friendRequests: newFriendRequests }),
  setFriendGames: (newFriendGames: OutsiderGameData[]) => set({ friendGames: newFriendGames }),
}));