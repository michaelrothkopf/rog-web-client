export class Color {
  red: number = 0;
  green: number = 0;
  blue: number = 0;

  /**
   * Creates a new color with RGB values from 0 to 255 
   */
  constructor(red: number, green: number, blue: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
  }

  /**
   * Creates a new Color from a hexadecimal string
   */
  static fromHex(hex: string) {
    // Remove the hashtag if present
    if (hex.length === 7) {
      hex = hex.substring(1);
    }
    // If the hex is invalid
    if (hex.length !== 6) {
      throw new Error(`Invalid hex code: must be in format '#fafafa' or 'fafafa'.`);
    }
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4), 16);
    return new Color(red, green, blue);
  }

  toHexString(): string {
    return `#${this.red.toString(16)}${this.green.toString(16)}${this.blue.toString(16)}`;
  }

  toRgbString(): string {
    return `rgb(${this.red},${this.green},${this.blue})`;
  }

  /**
   * Returns a color between this color and another input color based on factor (0 being this color, 1 being the other color)
   * @param other The opposite end of the gradient
   * @param factor The position on the gradient
   */
  gradientBetween(other: Color, factor: number, includeComponents: { red: boolean, green: boolean, blue: boolean } = { red: true, green: true, blue: true }): Color {
    const dred = includeComponents.red ? (other.red - this.red) * factor : 0;
    const dgreen = includeComponents.green ? (other.green - this.green) * factor : 0;
    const dblue = includeComponents.blue ? (other.blue - this.blue) * factor : 0;
    return new Color(this.red + dred, this.blue + dblue, this.green + dgreen);
  }
}