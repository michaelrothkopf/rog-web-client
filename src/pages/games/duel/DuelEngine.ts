import { Socket } from "socket.io-client";
import { LiveEngine } from "../core/LiveEngine";
import { Player } from "./DuelPlayer";
import { Color } from "../core/Color";
import { GamePlayer } from "../../../hooks/gameStore";
import { globalKeyStateManager } from "../core/KeyStateManager";

export const MAP_W = 500;
export const MAP_H = 500;
export const MOVE_DELAY = 10;

const BACKGROUND_COLOR = Color.fromHex('#FAFAFA');
const UI_FONT = '20px sans-serif';
const UI_TEXT_COLOR = Color.fromHex('#333333');

const INPUT_CHECK_INTERVAL = 20; // ms

export enum RoundStage {
  MENU,
  BATTLE,
  RESULTS,
}

export class DuelEngine extends LiveEngine {
  roundStage: RoundStage = RoundStage.BATTLE;
  players: Player[] = [];
  winner: string = '';
  inputCheckInterval: number = 0;

  constructor(ctx: CanvasRenderingContext2D, playerId: string, socket: Socket, players: GamePlayer[]) {
    super(ctx, playerId, socket);
    this.initialize();
    this.updateGamePlayers(players);

    this.inputCheckInterval = setInterval(() => {
      this.checkMovement();
    }, INPUT_CHECK_INTERVAL);
  }

  initialize() {
    window.addEventListener('keydown', (e) => {
      // Ready up
      if (e.code === 'Space') {
        this.socket.emit('duelReady');
      }
    });

    this.ctx.canvas.addEventListener('click', (e) => {
      // The position of the click
      const pos = this.convertMouseCoordinates(e.clientX, e.clientY);

      const player = this.getControlledPlayer();
      if (!player) return;

      const direction = Math.atan2(pos.y - player.yPos, pos.x - player.xPos);

      // Send an angle update
      this.socket.emit('duelAim', { direction });

      // Send the shot
      this.socket.emit('duelShoot', { direction });
    });

    this.ctx.canvas.addEventListener('mousemove', (e) => {
      // Don't send aim updates on the menu screen
      if (this.roundStage !== RoundStage.BATTLE) return;

      // The position of the click
      const pos = this.convertMouseCoordinates(e.clientX, e.clientY);

      const player = this.getControlledPlayer();
      if (!player) return;

      const direction = Math.atan2(pos.y - player.yPos, pos.x - player.xPos);

      // Send an angle update
      this.socket.emit('duelAim', { direction });
    })
  }

  checkMovement() {
    // All directions the player is trying to move in
    const directions: string[] = [];

    // Check each direction individually
    if (globalKeyStateManager.codeDown('KeyW')) directions.push('up');
    if (globalKeyStateManager.codeDown('KeyA')) directions.push('left');
    if (globalKeyStateManager.codeDown('KeyS')) directions.push('down');
    if (globalKeyStateManager.codeDown('KeyD')) directions.push('right');

    // If the player is to move
    if (directions.length > 0) {
      this.socket.emit('duelMove', { directions });
    }
  }

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
    this.ctx.fillStyle = BACKGROUND_COLOR.toRgbString();
    this.ctx.fillRect(0, 0, MAP_H, MAP_W);
  }

  drawMenu() {
    console.log('drawing menu')
    this.ctx.font = UI_FONT;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
    
    // Get the controlled player
    const p = this.getControlledPlayer();
    if (!p) return;
    if (p.ready) {
      this.ctx.fillText(`You are ready.`, MAP_W / 2, MAP_H / 2);
    } else {
      this.ctx.fillText(`You are not ready.`, MAP_W / 2, MAP_H / 2 - 10);
      this.ctx.fillText(`Press space to ready up.`, MAP_W / 2, MAP_H / 2 + 10);
    }
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
    this.render();
  }

  /**
   * Updates the list of players in the game to match newly added players from the server
   */
  updateGamePlayers(players: GamePlayer[]) {
    for (const p of players) {
      if (!this.players.find(player => player.userId === p.userId)) {
        this.players.push(new Player(p.displayName, p.userId, 0, 0, p.userId === this.playerId));
      }
    }
  }

  /**
   * Updates a player's state based on a server message
   */
  updatePlayerState(userId: string, xPos: number, yPos: number, health: number, aimAngle: number) {
    const p = this.players.find(p => p.userId === userId);
    // console.log(`UPS: ${p}, ${userId}, ${xPos}, ${yPos}, ${health}, ${aimAngle} rad`);
    if (!p) return;
    p.xPos = xPos;
    p.yPos = MAP_H - yPos;
    p.health = health;
    p.aimAngle = aimAngle;
    this.render();
  }

  getControlledPlayer() {
    for (const p of this.players) {
      if (p.userId === this.playerId) return p;
    }
    return null;
  }

  cleanup() {
    clearInterval(this.inputCheckInterval);
  }
}