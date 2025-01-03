import { useEffect, useRef } from 'react';
import { globalState } from '../../../core/global';
import { useGameStore } from '../../../hooks/gameStore';
import { useAuthStore } from '../../../hooks/authStore';

import './DuelGame.css';
import WaitScreen from '../WaitScreen';

import { DuelEngine, MAP_H, MAP_W, RoundStage } from './DuelEngine';

function DuelGame(props: { devBypass?: boolean }) {
  const hasStarted = useGameStore((state) => state.hasStarted);
  const playerId = useAuthStore((state) => state.user._id);
  const gamePlayers = useGameStore((state) => state.players);
  const isHost = useGameStore((state) => state.isHost);

  const canvas = useRef<HTMLCanvasElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const engine = useRef<DuelEngine | null>(null);

  useEffect(() => {
    // If there is no canvas, should execute again once hasStarted is updated; don't do anything on this run
    if (!canvas.current) {
      console.log('no current canvas');
      return;
    }

    // Get the context
    ctx.current = canvas.current.getContext('2d');

    // Error: no context on the canvas
    if (!ctx.current) {
      console.log('no current context');
      return;
    }

    if (engine.current === null && globalState.socket) {
      // Create a game engine
      engine.current = new DuelEngine(ctx.current, playerId, globalState.socket, isHost, gamePlayers);

      // setInterval(() => {
      //   if (engine.current) engine.current.render();
      // }, 10);
    }
  }, [hasStarted]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (globalState.socket) {
        globalState.socket.removeAllListeners('duelMenu');
        globalState.socket.removeAllListeners('duelBegin');
        globalState.socket.removeAllListeners('duelResult');
        globalState.socket.removeAllListeners('duelReadyState');
        globalState.socket.removeAllListeners('duelPlayerState');
      }

      if (engine.current) {
        engine.current.cleanup();
      }
    };
  }, []);

  // Make socket available throughout function
  if (!globalState.socket) {
    return <p>Critical client error: socket undefined.</p>;
  }

  // Game state listeners
  if (!globalState.socket.hasListeners('duelMenu')) {
    globalState.socket.on('duelMenu', () => {
      if (engine.current) {
        engine.current.roundStage = RoundStage.MENU;
        engine.current.render();
      }
    });
  }
  if (!globalState.socket.hasListeners('duelBegin')) {
    globalState.socket.on('duelBegin', (data) => {
      if (!('walls' in data)) return;
      if (engine.current) {
        engine.current.walls = data.walls;
        engine.current.roundStage = RoundStage.BATTLE;
        engine.current.render();
      }
    });
  }
  if (!globalState.socket.hasListeners('duelResult')) {
    globalState.socket.on('duelResult', (data) => {
      if (!('winner' in data)) return;
      if (engine.current) {
        engine.current.winner = data.winner;
        engine.current.roundStage = RoundStage.RESULTS;
        engine.current.render();
      }
    });
  }
  // Ready up listener
  if (!globalState.socket.hasListeners('duelReadyState')) {
    globalState.socket.on('duelReadyState', (data) => {
      if (!('readyState' in data) || !('allReady' in data)) return;
      if (!engine.current) return;
      engine.current.updateReady(data.readyState);
    });
  }
  // Position update listener
  if (!globalState.socket.hasListeners('duelPlayerState')) {
    globalState.socket.on('duelPlayerState', (data) => {
      if (!('userId' in data) || !('xPos' in data) || !('yPos' in data) || !('health' in data) || !('aimAngle' in data)) return;
      if (!engine.current) return;
      engine.current.updatePlayerState(data.userId, data.xPos, data.yPos, data.health, data.aimAngle);
    });
  }
  // Shot listener
  if (!globalState.socket.hasListeners('duelShot')) {
    globalState.socket.on('duelShot', (data) => {
      if (!('userId' in data) || !('startX' in data) || !('startY' in data) || !('endX' in data) || !('endY' in data) || !('direction' in data) || !('hit' in data)) return;
      if (!engine.current) return;
      engine.current.updatePlayerState(data.userId, data.xPos, data.yPos, data.health, data.aimAngle);
    });
  }

  // Load if not started
  if (!props.devBypass && !hasStarted) {
    return <WaitScreen />;
  }

  return (
    <canvas className="duel-game" id="duelGameCanvas" width={MAP_W} height={MAP_H} ref={canvas}>
      
    </canvas>
  );
}

export default DuelGame;