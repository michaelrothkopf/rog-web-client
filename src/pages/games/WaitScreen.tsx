import { useEffect } from 'react';

import { AVAILABLE_GAMES, beginGame, terminateGame } from '../../core/game';
import { useGameStore } from '../../hooks/gameStore';

import './WaitScreen.css';

function WaitScreen() {
  const gameId = useGameStore((state) => state.gameId);
  const joinCode = useGameStore((state) => state.joinCode);
  const isHost = useGameStore((state) => state.isHost);
  const players = useGameStore((state) => state.players);

  // Listen for termination of game
  const keydownListener = (e: KeyboardEvent) => {
    // Exit the game (only if host)
    if (e.code === 'Escape' && isHost) {
      if (confirm(`Do you really want to end the game? This will kick all players and return you to the home screen.`)) {
        terminateGame();
      }
    }
  }

  // Create termination listener
  useEffect(() => {
    window.addEventListener('keydown', keydownListener);

    // Cleanup the termination listener
    return () => {
      window.removeEventListener('keydown', keydownListener);
    }
  });

  const gameConfig = AVAILABLE_GAMES.find((game) => game.gameId === gameId);
  // If the game wasn't found
  if (!gameConfig) {
    return (
      <div className='wait-screen'>
        <div className='ws-content'>
          <h2>Critical error: invalid game ID registered!</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='wait-screen'>
      <div className='ws-content'>
        <h2>
          {isHost
            ? `You're the host! Press 'begin game' below when you're ready.`
            : `Waiting for the host to start the game...`}
        </h2>
        {isHost ? <h3>Press escape to terminate the game.</h3> : <></>}
        <h3>
          {players.length} / {gameConfig.maxPlayers} players
        </h3>
        <h3>
          {players.length >= gameConfig.minPlayers
            ? ``
            : `Need ${gameConfig.minPlayers} (${
                gameConfig.minPlayers - players.length
              } more) to start`}
        </h3>
        <h3>Join code:</h3>
        <h4>{joinCode}</h4>
        {isHost ? <button onClick={beginGame}>Begin game</button> : <></>}
      </div>
    </div>
  );
}

export default WaitScreen;
