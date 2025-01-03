import { ChangeEvent, useState } from 'react';
import { joinGame } from '../../core/game';
import { useGameStore } from '../../hooks/gameStore';
import './GameBox.css';

function JoinGameBox() {
  const joinCode = useGameStore((state) => state.joinCode);
  const [selectedGame, setSelectedGame] = useState<string>('');

  const handleJoinCodeChange = (e: ChangeEvent) => {
    setSelectedGame((e.currentTarget as HTMLInputElement).value || '');
  };

  const handleJoinGame = () => {
    joinGame(selectedGame);
  };

  return (
    <div className='home-grid-element'>
      <h2>Join a Game</h2>
      <input
        type='text'
        name='join-code'
        id='joinCode'
        className='game-data-input'
        onChange={handleJoinCodeChange}
        placeholder='Join code'
      />
      <button className='create-game' onClick={handleJoinGame}>
        Join
      </button>
      <p className='join-code'>{joinCode}</p>
    </div>
  );
}

export default JoinGameBox;
