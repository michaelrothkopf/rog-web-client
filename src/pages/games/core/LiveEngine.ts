import { Socket } from "socket.io-client";
import { GameEngine } from "./GameEngine";

export class LiveEngine extends GameEngine {
  playerId: string;
  socket: Socket;

  constructor(ctx: CanvasRenderingContext2D, playerId: string, socket: Socket) {
    super(ctx);
    this.playerId = playerId;
    this.socket = socket;
  }
}