// Basic page functionality
import './pages/global/App.css';

// Hilar testing
import './pages/games/hilar/HilarGame.css';
import Leaderboard from './pages/games/hilar/Leaderboard';

function TestApp() {
  return (
    <div className='light-mode'>
      <div className='hilar-game'>
        <Leaderboard
          standings={[
            { userId: '100', displayName: 'michael', score: 200 },
            { userId: '101', displayName: 'gregory', score: 100 },
            { userId: '103', displayName: 'debbie', score: 100 },
          ]}
        />
      </div>
    </div>
  );
}

export default TestApp;
