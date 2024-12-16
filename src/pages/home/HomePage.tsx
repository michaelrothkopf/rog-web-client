import CreateGameBox from './CreateGameBox';
import FriendBox from './FriendBox';
import FriendRequestBox from './FriendRequestBox';
import JoinGameBox from './JoinGameBox';

import './Home.css';
import SettingsBox from './SettingsBox';

function HomePage() {
  return (
    <div className='page-content'>
      <h1>Welcome to MROG!</h1>
      <div className='home-grid'>
        <FriendBox />
        <FriendRequestBox />
        <CreateGameBox />
        <JoinGameBox />
        <SettingsBox />
      </div>
    </div>
  );
}

export default HomePage;
