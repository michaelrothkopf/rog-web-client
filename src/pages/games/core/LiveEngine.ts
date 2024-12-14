import { Socket } from "socket.io-client";
import { GameEngine } from "./GameEngine";

export class LiveEngine extends GameEngine {
  playerId: string;
  socket: Socket;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, playerId: string, socket: Socket) {
    super(canvas, ctx);
    this.playerId = playerId;
    this.socket = socket;
  }
}