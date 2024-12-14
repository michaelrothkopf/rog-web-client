export class KeyStateManager {
  keyStates: Map<string, boolean> = new Map();
  codeStates: Map<string, boolean> = new Map();

  constructor() {
    window.addEventListener('keydown', (e) => {
      this.keyStates.set(e.key, true);
      this.codeStates.set(e.code, true);
    });

    window.addEventListener('keyup', (e) => {
      this.keyStates.set(e.key, false);
      this.codeStates.set(e.code, false);
    });
  }

  /**
   * Checks if a key is currently down
   */
  keyDown(key: string): boolean {
    return !!this.keyStates.get(key);
  }

  codeDown(code: string): boolean {
    return !!this.codeStates.get(code);
  }
}

export const globalKeyStateManager = new KeyStateManager();