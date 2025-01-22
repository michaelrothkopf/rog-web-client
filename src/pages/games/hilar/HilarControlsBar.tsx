import './HilarControlsBar.css';

import { terminateGame } from '../../../core/game';
import { useGameStore } from '../../../hooks/gameStore';

function HilarControlsBar() {
  const isHost = useGameStore((state) => state.isHost);

  // When the user pushes the 'End Game for All' button
  const handleTerminate = () => {
    // Prompt the user to ensure that they want to terminate the game
    if (confirm(`Are you sure you wish to terminate the game? This will end the game for all participants and return everyone to the main screen.`)) {
      terminateGame();
    }
  }

  return (
    <div className='hilar-controls-bar'>
      <span>Hilar</span>
      <span className='spacing'></span>
      {isHost ? <span className='end-game' onClick={handleTerminate}>End Game for All</span> : <></>}
    </div>
  );
}

export default HilarControlsBar;