import { Socket } from "socket.io-client";
import { GameEngine } from "./GameEngine";

export class LiveEngine extends GameEngine {
  playerId: string;
  isHost: boolean;
  socket: Socket;

  constructor(ctx: CanvasRenderingContext2D, playerId: string, socket: Socket, isHost: boolean) {
    super(ctx);
    this.playerId = playerId;
    this.socket = socket;
    this.isHost = isHost;
  }
}