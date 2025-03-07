import { create } from 'zustand';

export enum CurrentPage {
  HOME,
  FRIENDS,
  CHAT,
  CHANGE_PASSWORD,

  // Games
  HOLDEM,
  HILAR,
  DUEL,
}

interface NavigationState {
  currentPage: CurrentPage;
  navigate(Navigation: CurrentPage): void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentPage: CurrentPage.HOME,
  navigate: (Navigation: CurrentPage) => set({
    currentPage: Navigation
  }),
}));