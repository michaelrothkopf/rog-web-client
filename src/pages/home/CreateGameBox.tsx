import { ChangeEvent, useState } from 'react';
import { AVAILABLE_GAMES, createGame } from '../../core/game';
import './GameBox.css';

function CreateGameBox() {
  const [selectedGame, setSelectedGame] = useState<string>(
    AVAILABLE_GAMES[0].gameId || ''
  );

  const handleSelectChange = (e: ChangeEvent) => {
    setSelectedGame((e.currentTarget as HTMLSelectElement).value || '');
  };

  const handleCreateGame = () => {
    createGame(selectedGame);
  };

  return (
    <div className='home-grid-element'>
      <h2>Create Game</h2>
      <select
        name='game'
        className='game-data-input'
        id='select-game'
        onChange={handleSelectChange}
      >
        {AVAILABLE_GAMES.map((game) => (
          <option value={game.gameId} key={game.gameId}>
            {game.friendlyName}
          </option>
        ))}
      </select>
      <button className='create-game' onClick={handleCreateGame}>
        Create
      </button>
    </div>
  );
}

export default CreateGameBox;
