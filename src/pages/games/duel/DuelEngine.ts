import { Socket } from "socket.io-client";
import { User } from "../../../core/auth";
import { LiveEngine } from "../core/LiveEngine";
import { Player } from "./DuelPlayer";
import { Color } from "../core/Color";

export const MAP_W = 500;
export const MAP_H = 500;
export const MOVE_DELAY = 10;

const BACKGROUND_COLOR = Color.fromHex('#FAFAFA');
const UI_FONT = '20px sans-serif';
const UI_TEXT_COLOR = Color.fromHex('#333333');

export enum RoundStage {
  MENU,
  BATTLE,
  RESULTS,
}

export class DuelEngine extends LiveEngine {
  roundStage: RoundStage = RoundStage.BATTLE;
  players: Player[] = [new Player('john', 'abcdefghijklmnop', 50, 50, true)];
  winner: string = '';

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, playerId: string, socket: Socket) {
    super(canvas, ctx, playerId, socket);
    this.initialize();
    console.log('PID:', this.playerId);
  }

  initialize() {
    window.addEventListener('keydown', (e) => {
      // Movement cases
      if (e.code === 'KeyW') {
        this.socket.send('duelMove', {
          direction: 'up',
        });
      }
      if (e.code === 'KeyA') {
        this.socket.send('duelMove', {
          direction: 'left',
        });
      }
      if (e.code === 'KeyS') {
        this.socket.send('duelMove', {
          direction: 'down',
        });
      }
      if (e.code === 'KeyD') {
        this.socket.send('duelMove', {
          direction: 'right',
        });
      }
    });

    this.canvas.addEventListener('click', (e) => {
      // The position of the click
      const pos = this.convertMouseCoordinates(e.clientX, e.clientY);

      const player = this.getControlledPlayer();
      if (!player) return;

      const direction = Math.atan2(pos.y - player.yPos, pos.x - player.xPos);

      // Send an angle update
      this.socket.send('duelAim', { direction });

      // Send the shot
      this.socket.send('duelShoot', { direction });
    });

    this.canvas.addEventListener('mousemove', (e) => {
      // The position of the click
      const pos = this.convertMouseCoordinates(e.clientX, e.clientY);

      const player = this.getControlledPlayer();
      if (!player) return;

      const direction = Math.atan2(pos.y - player.yPos, pos.x - player.xPos);

      // Send an angle update
      this.socket.send('duelAim', { direction });
    })
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
    this.ctx.fillText(`You are ${p.ready ? 'not ready' : 'ready'}.`, 0, 0);
    this.ctx.fillText(`Press space to ready up.`, 0, 0);
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

  /**
   * Updates the list of players in the game to match newly added players from the server
   */
  updateGamePlayers(players: User[]) {
    for (const p of players) {
      if (!this.players.find(player => player.userId === p._id)) {
        this.players.push(new Player(p.username, p._id, 0, 0, p._id === this.playerId));
      }
    }
  }

  /**
   * Updates a player's state based on a server message
   */
  updatePlayerState(userId: string, xPos: number, yPos: number, health: number, aimAngle: number) {
    const p = this.players.find(p => p.userId === userId);
    if (!p) return;
    p.xPos = xPos;
    p.yPos = yPos;
    p.health = health;
    p.aimAngle = aimAngle;
  }

  getControlledPlayer() {
    for (const p of this.players) {
      if (p.userId === this.playerId) return p;
    }
    return null;
  }
}