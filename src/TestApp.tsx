// Basic page functionality
import './pages/global/App.css';

// Hilar testing
// import './pages/games/hilar/HilarGame.css'
// import HilarControlsBar from './pages/games/hilar/HilarControlsBar';

// Holdem testing
// import './pages/games/holdem/HoldemGame.css';
// import Table, { PlayerData } from './pages/games/holdem/Table';
// import GameControlsBar from './pages/games/core/GameControlsBar';
// import Controls, { BettingAction } from './pages/games/holdem/Controls';
// import { NULL_CARD } from './pages/games/core/cards';

// const testPlayerData: PlayerData[] = [
//   {
//     displayName: 'Player A',
//     money: 300,
//     wins: 2,
//     cards: [NULL_CARD, NULL_CARD],
//     seat: 0,
//     hasFolded: false,
//   },
//   {
//     displayName: 'Player B',
//     money: 300,
//     wins: 2,
//     cards: [NULL_CARD, NULL_CARD],
//     seat: 1,
//     hasFolded: false,
//   },
//   {
//     displayName: 'Player C',
//     money: 300,
//     wins: 2,
//     cards: [NULL_CARD, NULL_CARD],
//     seat: 2,
//     hasFolded: false,
//   },
//   {
//     displayName: 'Player D',
//     money: 300,
//     wins: 2,
//     cards: [NULL_CARD, NULL_CARD],
//     seat: 3,
//     hasFolded: false,
//   }
// ];

function TestApp() {
  return (
    <div className='light-mode'>
      {/* <div className='holdem-game'>
        <GameControlsBar name='Holdem' />
        <div className='holdem-content'>
          <Table players={testPlayerData} turn={1} />
          <Controls bettingActionCallback={(action: BettingAction) => {}} bettingActions={[BettingAction.CHECK, BettingAction.FOLD]} holeCards={[NULL_CARD, NULL_CARD]} />
        </div>
      </div> */}
    </div>
  );
}

export default TestApp;
