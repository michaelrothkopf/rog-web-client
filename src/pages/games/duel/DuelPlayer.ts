import { Color } from "../core/Color";
import { GameObject } from "../core/GameObject";

const PLAYER_COLOR = Color.fromHex('#086621');
const ENEMY_COLOR = Color.fromHex('#850505');
const PLAYER_RADIUS = 10;
const PLAYER_WIDTH = PLAYER_RADIUS * 2;
const GUN_COLOR = Color.fromHex('#444444');
const GUN_WIDTH = 4;
const GUN_LENGTH = 8;

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

export class Player extends GameObject {
  username: string;
  userId: string;
  isControlled: boolean;
  health: number = 100;
  aimAngle: number = 0;
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
    // Draw the gun
    ctx.beginPath();
    ctx.fillStyle = GUN_COLOR.toRgbString();
    // Far left corner
    ctx.moveTo(
      this.xPos + PLAYER_RADIUS * Math.cos(this.aimAngle) - GUN_WIDTH * 0.5 * Math.sin(this.aimAngle) + GUN_LENGTH * Math.cos(this.aimAngle),
      this.yPos + PLAYER_RADIUS * Math.sin(this.aimAngle) + GUN_WIDTH * 0.5 * Math.cos(this.aimAngle) + GUN_LENGTH * Math.sin(this.aimAngle),
    );
    // Far right corner
    ctx.lineTo(
      this.xPos + PLAYER_RADIUS * Math.cos(this.aimAngle) + GUN_WIDTH * 0.5 * Math.sin(this.aimAngle) + GUN_LENGTH * Math.cos(this.aimAngle),
      this.yPos + PLAYER_RADIUS * Math.sin(this.aimAngle) - GUN_WIDTH * 0.5 * Math.cos(this.aimAngle) + GUN_LENGTH * Math.sin(this.aimAngle),
    );
    // Close right corner
    ctx.lineTo(
      this.xPos + PLAYER_RADIUS * Math.cos(this.aimAngle) + GUN_WIDTH * 0.5 * Math.sin(this.aimAngle),
      this.yPos + PLAYER_RADIUS * Math.sin(this.aimAngle) - GUN_WIDTH * 0.5 * Math.cos(this.aimAngle),
    );
    // Close left corner
    ctx.lineTo(
      this.xPos + PLAYER_RADIUS * Math.cos(this.aimAngle) - GUN_WIDTH * 0.5 * Math.sin(this.aimAngle),
      this.yPos + PLAYER_RADIUS * Math.sin(this.aimAngle) + GUN_WIDTH * 0.5 * Math.cos(this.aimAngle),
    );
    ctx.closePath();
    ctx.fill();
    
    // Draw the player
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
    ctx.fillText(this.username, this.xPos, this.yPos - USERNAME_OFFSET_Y);

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
    ctx.fillRect(this.xPos - HEALTHBAR_MAX_WIDTH / 2, this.yPos - HEALTHBAR_OFFSET_Y, hWidth, HEALTHBAR_HEIGHT);
    // Draw the healthbar background
    ctx.fillStyle = HEALTH_BACKGROUND_COLOR.toRgbString();
    ctx.fillRect(this.xPos - HEALTHBAR_MAX_WIDTH / 2 + hWidth, this.yPos - HEALTHBAR_OFFSET_Y, HEALTHBAR_MAX_WIDTH - hWidth, HEALTHBAR_HEIGHT);
  }
}