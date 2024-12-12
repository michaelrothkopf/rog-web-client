import { Color } from "../core/Color";
import { GameEngine } from "../core/GameEngine";
import { GameObject } from "../core/GameObject";

export const MAP_W = 500;
export const MAP_H = 500;
export const MOVE_DELAY = 10;

const BACKGROUND_COLOR = '#FAFAFA';

export enum RoundStage {
  MENU,
  BATTLE,
  RESULTS,
}

const PLAYER_COLOR = Color.fromHex('#086621');
const ENEMY_COLOR = Color.fromHex('#850505');
const PLAYER_RADIUS = 10;
const PLAYER_WIDTH = PLAYER_RADIUS * 2;

const PLAYER_UI_FONT = '16px sans-serif';

const USERNAME_OFFSET_Y = 15;
const USERNAME_COLOR = Color.fromHex('#888888');

const HIGH_HEALTH_COLOR = Color.fromHex('#00aa00');
const MID_HEALTH_COLOR = Color.fromHex('#c97600');
const LOW_HEALTH_COLOR = Color.fromHex('#aa0000');
const HEALTH_BACKGROUND_COLOR = Color.fromHex('#cccccc');
const HEALTHBAR_OFFSET_Y = 10;
const HEALTHBAR_HEIGHT = 5;
const HEALTHBAR_MAX_WIDTH = PLAYER_WIDTH * 1.25;

const STARTING_HEALTH = 100;

class Player extends GameObject {
  username: string;
  userId: string;
  isControlled: boolean;
  health: number = 100;
  ready: boolean = false;

  constructor(username: string, userId: string, x: number, y: number, isControlled: boolean = false) {
    super(x, y, null, PLAYER_WIDTH, PLAYER_WIDTH);

    this.username = username;
    this.userId = userId;
    this.isControlled = isControlled;
    this.drawColor = isControlled ? PLAYER_COLOR : ENEMY_COLOR;
  }

  render(ctx: CanvasRenderingContext2D): void {
    console.log('render')
    // Draw the actual box
    this.draw(ctx);

    // Draw the UI
    this.drawUi(ctx);
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.xPos, this.yPos, PLAYER_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = this.drawColor.toRgbString();
    ctx.fill();
  }

  drawUi(ctx: CanvasRenderingContext2D): void {
    // Set the font for player UI
    ctx.font = PLAYER_UI_FONT;
    ctx.textAlign = 'center';

    ctx.fillStyle = USERNAME_COLOR.toRgbString();
    // Draw the player's username
    ctx.fillText(this.username, this.xPos + this.width / 2, this.yPos - USERNAME_OFFSET_Y);

    // Set the color based on health
    if (this.health > (STARTING_HEALTH * (2/3))) {
      ctx.fillStyle = HIGH_HEALTH_COLOR.toRgbString();
    }
    else if (this.health > (STARTING_HEALTH * (1/3))) {
      ctx.fillStyle = MID_HEALTH_COLOR.toRgbString();
    }
    else {
      ctx.fillStyle = LOW_HEALTH_COLOR.toRgbString();
    }
    // Draw the healthbar
    const hWidth = this.health / STARTING_HEALTH * HEALTHBAR_MAX_WIDTH;
    ctx.fillRect(this.xPos - (HEALTHBAR_MAX_WIDTH - PLAYER_WIDTH) / 2, this.yPos - HEALTHBAR_OFFSET_Y, hWidth, HEALTHBAR_HEIGHT);
    // Draw the healthbar background
    ctx.fillStyle = HEALTH_BACKGROUND_COLOR.toRgbString();
    ctx.fillRect(this.xPos - (HEALTHBAR_MAX_WIDTH - PLAYER_WIDTH) / 2 + hWidth, this.yPos - HEALTHBAR_OFFSET_Y, HEALTHBAR_MAX_WIDTH - hWidth, HEALTHBAR_HEIGHT);
  }
}

export class DuelEngine extends GameEngine {
  roundStage: RoundStage = RoundStage.BATTLE;
  players: Player[] = [new Player('john', 'abcdefghijklmnop', 50, 50, true)];
  winner: string = '';

  /**
   * Redraw all elements to the screen
   */
  draw() {
    // Clear the screen
    this.ctx.clearRect(0, 0, MAP_W, MAP_H);

    this.drawBackground();

    if (this.roundStage === RoundStage.MENU) {
      this.drawMenu();
    }
    else if (this.roundStage === RoundStage.BATTLE) {
      this.drawBattle();
    }
    else if (this.roundStage === RoundStage.RESULTS) {
      this.drawResults();
    }
  }

  drawBackground() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, MAP_H, MAP_W);
  }

  drawMenu() {
    
  }

  drawBattle() {
    // Draw all players in the battle
    for (const p of this.players) {
      p.render(this.ctx);
    }
  }

  drawResults() {

  }

  /**
   * Update's each player's ready state
   */
  updateReady(readyState: [{ userId: string, ready: boolean }]) {
    for (const rs of readyState) {
      const p = this.players.find(p => p.userId === rs.userId);
      if (!p) continue;
      p.ready = rs.ready;
    }
  }

  updatePlayerState(userId: string, xPos: number, yPos: number, health: number) {
    const p = this.players.find(p => p.userId === userId);
    if (!p) return;
    p.xPos = xPos;
    p.yPos = yPos;
    p.health = health;
  }
}