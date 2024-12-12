// Basic page functionality
import './pages/global/App.css';

// Duel testing
import DuelGame from './pages/games/duel/DuelGame';

function TestApp() {
  return (
    <div className='light-mode'>
      <DuelGame devBypass={true} />
    </div>
  );
}

export default TestApp;
