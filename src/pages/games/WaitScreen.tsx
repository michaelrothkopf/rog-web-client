import { beginGame } from '../../core/game';
import { useGameStore } from '../../hooks/gameStore';

function WaitScreen() {
  const joinCode = useGameStore((state) => state.joinCode);
  const isHost = useGameStore((state) => state.isHost);

  return (
    <div className='wait-screen'>
      <h2>Waiting for the host to start the game...</h2>
      <h4>Join code: {joinCode}</h4>
      {isHost ? <button onClick={beginGame}>Begin game</button> : <></>}
    </div>
  );
}

export default WaitScreen;
