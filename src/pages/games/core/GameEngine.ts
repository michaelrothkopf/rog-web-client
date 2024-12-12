export abstract class GameEngine {
  ctx: CanvasRenderingContext2D;

  /**
   * Creates a new GameEngine
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
}