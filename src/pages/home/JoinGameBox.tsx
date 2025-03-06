import { ChangeEvent, useState } from 'react';

import { joinGame } from '../../core/game';
import { useGameStore } from '../../hooks/gameStore';
import { useFriendStore } from '../../hooks/friendStore';

import './JoinGameBox.css';

function JoinGameBox() {
  const joinCode = useGameStore((state) => state.joinCode);
  const [selectedGame, setSelectedGame] = useState<string>('');

  const friendGames = useFriendStore((state) => state.friendGames);

  const handleJoinCodeChange = (e: ChangeEvent) => {
    setSelectedGame((e.currentTarget as HTMLInputElement).value || '');
  };

  const handleJoinGame = (joinCode?: string) => {
    joinGame(joinCode || selectedGame);
  };

  return (
    <div className='home-grid-element'>
      <h2>Join a Game</h2>
      <div className='join-input'>
        <input
          type='text'
          name='join-code'
          id='joinCode'
          className='game-data-input'
          onChange={handleJoinCodeChange}
          placeholder='Join code'
        />
        <button className='create-game' onClick={() => { handleJoinGame() }}>
          Join
        </button>
      </div>
      <p className='join-code'>{joinCode}</p>
      <h3>Games Friends Are In</h3>
      <div className='cards'>
        {friendGames.map((g) => (
          <div className='friend-card' key={g.joinCode}>
            <div className='left'>
              <p className='username'>
                {g.friendlyName}
              </p>
              <span className='date'>
                Created by {g.creatorDisplayName}, {g.numJoined} / {g.maxPlayers} players
              </span>
            </div>
            <div className='right'>
              <button
                onClick={() =>
                  handleJoinGame(g.joinCode)
                }
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JoinGameBox;
