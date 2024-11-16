import { create } from 'zustand';

export enum ColorScheme {
  LIGHT = 'light-mode',
  DARK = 'dark-mode',
}
export const COLOR_SCHEMES = [
  { name: 'Light', value: ColorScheme.LIGHT },
  { name: 'Dark', value: ColorScheme.DARK },
];

export interface Settings {
  colorScheme: string;
}

export interface SettingState extends Settings {
  setColorScheme(newColorScheme: string): void;
}

const USER_SETTINGS_LOCALSTORAGE_KEY = 'userSettings';

const userSettings: Settings = {
  colorScheme: ColorScheme.DARK,
};

const writeUserSettings = () => {
  localStorage.setItem(USER_SETTINGS_LOCALSTORAGE_KEY, JSON.stringify(userSettings));
}

// Attempt to get user settings from localStorage
try {
  const savedSettings = JSON.parse(localStorage.getItem(USER_SETTINGS_LOCALSTORAGE_KEY) || '{}');
  for (const k in savedSettings) {
    if (k === 'colorScheme') {
      userSettings.colorScheme = savedSettings[k];
    }
  }
} catch {
  writeUserSettings();
};

export const useSettingStore = create<SettingState>((set) => ({
  // SettingState
  colorScheme: userSettings.colorScheme,

  setColorScheme: (newColorScheme: string) => {
    userSettings.colorScheme = newColorScheme;
    writeUserSettings();
    return set({
      colorScheme: userSettings.colorScheme,
    });
  }
}));