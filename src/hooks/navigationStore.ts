import { create } from 'zustand';

export enum CurrentPage {
  HOME,
  FRIENDS,
  CHAT,

  // Games
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