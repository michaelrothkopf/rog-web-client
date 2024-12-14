export abstract class GameEngine {
  ctx: CanvasRenderingContext2D;

  /**
   * Creates a new GameEngine
   * @param canvas The canvas to render onto
   * @param ctx The rendering context of the canvas
   */
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Overridden draw method
   */
  draw() {}
  /**
   * Exposed render method (to support framerate limiting later)
   */
  render() {
    this.draw();
  }

  /**
   * Converts event coordinates in screen space to canvas coordinates
   * @param x clientX from the event
   * @param y clientY from the event
   * @returns New set of coordinates relative to the canvas
   */
  convertMouseCoordinates(x: number, y: number) {
    return {
      x: x - this.ctx.canvas.getBoundingClientRect().left,
      y: y - this.ctx.canvas.getBoundingClientRect().top,
    }
  }
}