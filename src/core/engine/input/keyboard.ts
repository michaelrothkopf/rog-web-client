export class KeyState {
  down: boolean;
  pressed: boolean;

  constructor(down?: boolean, pressed?: boolean) {
    this.down = down || false;
    this.pressed = pressed || false;
  }
}

class KeyboardInputHandler {
  // Creates all keyboard input states
  keyStates: Map<string, KeyState>;

  constructor() {
    this.keyStates = new Map();

    // Add the keyboard event listeners
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  handleKeydown(e: KeyboardEvent) {
    // Mark the key as down
    this.keyStates.set(e.code, new KeyState(true, true));
  }

  handleKeyup(e: KeyboardEvent) {
    // Mark the key as up
    this.keyStates.set(e.code, new KeyState(false, true));
  }

  /**
   * Checks whether a key is currently down
   * @param code The KeyboardEvent.code of the key
   */
  keyDown(code: string): boolean {
    return this.keyStates.get(code)?.down || false;
  }

  /**
   * Checks whether a key is currently pressed
   * @param code The KeyboardEvent.code of the key
   */
  keyPressed(code: string): boolean {
    return this.keyStates.get(code)?.pressed || false;
  }

  /**
   * Resets press state for a specific key if code provided, otherwise resets all press states
   * @param code The key to reset
   */
  resetPressed(code?: string) {
    if (code) {
      const ks = this.keyStates.get(code);
      if (!ks) return;
      ks.pressed = false;
    }
    else {
      for (const ks of this.keyStates.values()) {
        ks.pressed = false;
      }
    }
  }
}

export const Keyboard = new KeyboardInputHandler();