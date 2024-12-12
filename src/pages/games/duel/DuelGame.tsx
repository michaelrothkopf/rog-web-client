import { useEffect, useRef, useState } from 'react';
import { globalState } from '../../../core/global';
import { useGameStore } from '../../../hooks/gameStore';

import './DuelGame.css';
import WaitScreen from '../WaitScreen';
import { DuelEngine, MAP_H, MAP_W, RoundStage } from './DuelEngine';

function DuelGame(props: { devBypass?: boolean }) {
  const hasStarted = useGameStore((state) => state.hasStarted);

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

    if (engine.current === null) {
      // Create a game engine
      engine.current = new DuelEngine(ctx.current);

      setInterval(() => {
        if (engine.current) engine.current.render();
      }, 10);
    }
  }, [hasStarted]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (globalState.socket) {
        globalState.socket.removeAllListeners('hilarQuestions');
        globalState.socket.removeAllListeners('hilarVoteQuestion');
        globalState.socket.removeAllListeners('hilarVoteResult');
        globalState.socket.removeAllListeners('hilarLeaderboard');
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
      if (engine.current) engine.current.roundStage = RoundStage.MENU;
    });
  }
  if (!globalState.socket.hasListeners('duelBegin')) {
    globalState.socket.on('duelBegin', () => {
      if (engine.current) engine.current.roundStage = RoundStage.BATTLE;
    });
  }
  if (!globalState.socket.hasListeners('duelResult')) {
    globalState.socket.on('duelResult', (data) => {
      if (!data.winner) return;
      if (engine.current) {
        engine.current.winner = data.winner;
        engine.current.roundStage = RoundStage.RESULTS;
      }
    });
  }
  // Ready up listeners
  if (!globalState.socket.hasListeners('duelReadyState')) {
    globalState.socket.on('duelReadyState', (data) => {
      if (!data.readyData || !data.allReady) return;
      engine.current?.updateReady(data.readyData);
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