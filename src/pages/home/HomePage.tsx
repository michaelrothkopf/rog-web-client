import CreateGameBox from './CreateGameBox';
import FriendBox from './FriendBox';
import FriendRequestBox from './FriendRequestBox';
import JoinGameBox from './JoinGameBox';

import './Home.css';

function HomePage() {
  return (
    <div className='page-content'>
      <h1>Welcome to Nangam!</h1>
      <div className='home-grid'>
        <FriendBox />
        <FriendRequestBox />
        <CreateGameBox />
        <JoinGameBox />
      </div>
    </div>
  );
}

export default HomePage;
