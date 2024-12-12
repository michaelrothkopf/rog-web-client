import { Color } from "./Color";

export interface RenderableObject {
  draw(ctx: CanvasRenderingContext2D): void;
}

export const DEFAULT_DIMENSIONS = 50;
export const DEFAULT_DRAW_COLOR = Color.fromHex('#ff0000');

/**
 * The base GameObject class which the GameEngine stores
 */
export abstract class GameObject implements RenderableObject {
  xPos: number;
  yPos: number;
  width: number;
  height: number;

  image: HTMLImageElement | null;
  drawColor: Color = DEFAULT_DRAW_COLOR;

  constructor(xPos: number = 0, yPos: number = 0, image: string | null = null, width: number = DEFAULT_DIMENSIONS, height: number = DEFAULT_DIMENSIONS) {
    this.xPos = xPos;
    this.yPos = yPos;
    if (typeof image === 'string') {
      this.image = new Image();
      this.image.src = image;
    }
    else {
      this.image = null;
    }
    this.width = width;
    this.height = height;

    this.initialize();
  }

  initialize(): void {}
  render(ctx: CanvasRenderingContext2D): void {
    this.draw(ctx);
  }
  draw(ctx: CanvasRenderingContext2D): void {
    // If gameObject is an image
    if (this.image !== null) {
      ctx.drawImage(this.image, this.xPos, this.yPos);
    }
    else {
      ctx.fillStyle = this.drawColor.toRgbString();
      ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    }
  }
}