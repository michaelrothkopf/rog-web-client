import { Socket } from "socket.io-client";
import { LiveEngine } from "../core/LiveEngine";
import { Player } from "./DuelPlayer";
import { Color } from "../core/Color";
import { GamePlayer } from "../../../hooks/gameStore";
import { globalKeyStateManager } from "../core/KeyStateManager";

export const MAP_W = 750;
export const MAP_H = 750;
export const MOVE_DELAY = 10;

const BACKGROUND_COLOR = Color.fromHex('#FAFAFA');
const UI_FONT = '20px Roboto';
const UI_TEXT_COLOR = Color.fromHex('#333333');
const MENU_BAR_COLOR = Color.fromHex('#EFEFEF');

const READY_COLOR = Color.fromHex('#38761d');
const NOT_READY_COLOR = Color.fromHex('#990000');

const WALL_COLOR = Color.fromHex('#111111');

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
  walls: number[][][] = [];

  constructor(ctx: CanvasRenderingContext2D, playerId: string, socket: Socket, isHost: boolean, players: GamePlayer[]) {
    super(ctx, playerId, socket, isHost);
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

      // Exit the game (only if host and in the menu)
      if (e.code === 'Escape' && this.roundStage === RoundStage.MENU && this.isHost) {
        if (confirm(`Do you really want to end the game? This will kick all players and return you to the home screen.`)) {
          this.socket.emit('terminateGame');
        }
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
    // Get the controlled player
    const p = this.getControlledPlayer();
    if (!p) return;

    const topBarHeight = MAP_H / 6;
    const contentStart = topBarHeight * 2;
    const usernameStart = MAP_W / 6;
    const readyEnd = MAP_W - usernameStart;
    const usernameSpacing = MAP_H / 10;

    // Draw the menu bar
    this.ctx.fillStyle = MENU_BAR_COLOR.toRgbString();
    this.ctx.fillRect(0, 0, MAP_W, topBarHeight);

    // Draw the menu bar label
    this.ctx.font = `light 40px Roboto`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
    this.ctx.fillText(`Lobby`, MAP_W / 2, topBarHeight / 2);

    let cy = contentStart;
    // Draw the player ready data
    for (const player of this.players.values()) {
      // Draw the username
      this.ctx.font = `bold ${UI_FONT}`;
      this.ctx.textAlign = 'left';
      this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
      this.ctx.fillText(`${player.username}`, usernameStart, cy);

      // Draw the ready
      this.ctx.font = `normal ${UI_FONT}`;
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = player.ready ? READY_COLOR.toRgbString() : NOT_READY_COLOR.toRgbString();
      this.ctx.fillText(player.ready ? 'READY' : 'NOT READY', readyEnd, cy);

      cy += usernameSpacing;
    }

    // Draw the ready up instructions if not ready
    if (!p.ready) {
      this.ctx.textAlign = 'center';
      this.ctx.font = `normal ${UI_FONT}`;
      this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
      this.ctx.fillText('Press space to ready up!', MAP_W / 2, cy);
    }

    // Draw the exit instructions if host
    if (this.isHost) {
      this.ctx.textAlign = 'center';
      this.ctx.font = `normal ${UI_FONT}`;
      this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
      this.ctx.fillText(`You're the host, press Escape to end the game here.`, MAP_W / 2, MAP_H - 10);
    }
  }

  drawBattle() {
    // Draw all walls in the battle
    for (const w of this.walls) {
      // If the wall is invalid
      if (w.length < 3) continue;

      // Draw the polygon
      this.ctx.beginPath();
      this.ctx.fillStyle = WALL_COLOR.toRgbString();

      // Start at the first point
      const start = w[0];
      if (start.length < 2) continue;
      this.ctx.moveTo(start[0], MAP_H - start[1]);

      // For every other point
      for (let i = 1; i < w.length; i++) {
        // Line to that point
        this.ctx.lineTo(w[i][0], MAP_H - w[i][1]);
      }

      // Fill in the polygon
      this.ctx.closePath();
      this.ctx.fill();
    }

    // Draw all players in the battle
    for (const p of this.players) {
      p.render(this.ctx);
    }
  }

  drawResults() {
    const topBarHeight = MAP_H / 6;
    const contentCenter = topBarHeight + (MAP_H - topBarHeight) / 2;

    // Draw the menu bar
    this.ctx.fillStyle = MENU_BAR_COLOR.toRgbString();
    this.ctx.fillRect(0, 0, MAP_W, topBarHeight);

    // Draw the menu bar label
    this.ctx.font = `light 40px Roboto`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
    this.ctx.fillText(`Round Results`, MAP_W / 2, topBarHeight / 2);

    // Draw the winner label
    const winner = this.players.find(p => p.userId === this.winner);
    if (!winner) return;
    this.ctx.font = `bold 60px Roboto`;
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = UI_TEXT_COLOR.toRgbString();
    this.ctx.fillText(`${winner.username} won!`, MAP_W / 2, contentCenter);
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