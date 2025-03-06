import { useEffect, useState } from 'react';
import { globalState } from '../../../core/global';
import { useGameStore } from '../../../hooks/gameStore';
import WaitScreen from '../WaitScreen';
import GameControlsBar from '../core/GameControlsBar';

import './HoldemGame.css';
import { Card } from '../core/cards';
import Table from './Table';
import Controls, { BettingAction } from './Controls';
import { PlayerData } from './PlayerInfo';

// The current round stage
// enum RoundStage {
//   LOBBY,
//   BETTING,
//   PREFLOP,
//   FLOP,
//   TURN,
//   RIVER,
//   SHOWDOWN
// }

function HoldemGame() {
  const hasBegun = useGameStore((state) => state.hasBegun);
  // const [roundStage, setRoundStage] = useState<RoundStage>(RoundStage.LOBBY);

  // The players in the current round
  const [roundPlayers, setRoundPlayers] = useState<PlayerData[]>([]);
  // The current special position seats
  const [dealer, setDealer] = useState<number>(0);
  const [smallBlind, setSmallBlind] = useState<number>(1);
  const [bigBlind, setBigBlind] = useState<number>(1);

  // The player's seat at the table
  const [seat, setSeat] = useState<number>(0);
  // The player's hole cards
  const [holeCards, setHoleCards] = useState<Card[]>([]);
  // The player's player data
  const playerData = roundPlayers.find(p => p.seat === seat);

  // The current quantity of money in the pot
  const [pot, setPot] = useState<number>(0);
  // The player whose turn it currently is to bet
  const [turnSeat, setTurnSeat] = useState<number>(-1);
  // The current river cards
  const [river, setRiver] = useState<Card[]>([]);
  // The allowed betting actions
  const [bettingActions, setBettingActions] = useState<BettingAction[]>([]);
  // The amount required to bet immediately to stay in the round
  const [callAmount, setCallAmount] = useState<number>(0);
  // The betting history
  const [betHistory, setBetHistory] = useState<string[]>([]);
  // The winner message to display on the table
  const [winnerMessage, setWinnerMessage] = useState<string>('');
  // The time the player has to bet before the server automatically folds the player
  const [bettingOver, setBettingOver] = useState<number>(-1);

  useEffect(() => {
    if (globalState.socket) {
      // Add event listeners
      if (!globalState.socket.hasListeners('holdemSeat')) {
        globalState.socket.on('holdemSeat', handleSeat);
      }
      if (!globalState.socket.hasListeners('holdemRoundBegin')) {
        globalState.socket.on('holdemRoundBegin', handleRoundBegin);
      }
      if (!globalState.socket.hasListeners('holdemBetRequest')) {
        globalState.socket.on('holdemBetRequest', handleBetRequest);
      }
      if (!globalState.socket.hasListeners('holdemBettingAction')) {
        globalState.socket.on('holdemBettingAction', handleBettingAction);
      }
      if (!globalState.socket.hasListeners('holdemHoleCards')) {
        globalState.socket.on('holdemHoleCards', handleHoleCards);
      }
      if (!globalState.socket.hasListeners('holdemRiverUpdate')) {
        globalState.socket.on('holdemRiverUpdate', handleRiverUpdate);
      }
      if (!globalState.socket.hasListeners('holdemBettingTurn')) {
        globalState.socket.on('holdemBettingTurn', handleBettingTurn);
      }
      if (!globalState.socket.hasListeners('holdemShowdownResult')) {
        globalState.socket.on('holdemShowdownResult', handleShowdownResult);
      }
    }

    return () => {
      if (globalState.socket) {
        globalState.socket.removeAllListeners('holdemSeat');
        globalState.socket.removeAllListeners('holdemRoundBegin');
        globalState.socket.removeAllListeners('holdemBetRequest');
        globalState.socket.removeAllListeners('holdemBettingAction');
        globalState.socket.removeAllListeners('holdemHoleCards');
        globalState.socket.removeAllListeners('holdemRiverUpdate');
        globalState.socket.removeAllListeners('holdemBettingTurn');
        globalState.socket.removeAllListeners('holdemShowdownResult');
      }
    }
  });

  // Make socket available throughout function
  if (!globalState.socket) {
    return <p>Critical client error: socket undefined.</p>;
  }

  /**
   * Handles when the player makes a bet
   */
  const handlePerformBettingAction = (action: BettingAction) => {
    // If the action is currently invalid or the socket doesn't exist
    if (!bettingActions.includes(action) || !globalState.socket) {
      // Do nothing
      return;
    }

    // Prompt the user by how much to raise if the action is raise
    let amount = 0;
    let pass = false;
    if (action === BettingAction.RAISE) {
      while (!pass) {
        try {
          amount = parseInt(prompt(`Enter a whole number greater than $${callAmount} to raise by.`) || '0');
          if (amount > callAmount) pass = true;
        }
        catch {}
      }
    }

    // Send the betting action to the server and purge the betting actions
    globalState.socket.emit('holdemBetResponse', {
      action,
      amount,
    });
  }

  /**
   * Handles seat assignment
   */
  const handleSeat = (payload: any) => {
    if (!('seat' in payload) || typeof payload.seat !== 'number') {
      return;
    }

    setSeat(payload.seat);
  }

  /**
   * Handles the beginning of the round
   */
  const handleRoundBegin = (payload: any) => {
    if (
      !('roundPlayers' in payload) ||
      !(Array.isArray(payload.roundPlayers)) ||
      !('dealer' in payload) ||
      !(typeof payload.dealer === 'number') ||
      !('smallBlind' in payload) ||
      !(typeof payload.smallBlind === 'number') ||
      !('bigBlind' in payload) ||
      !(typeof payload.bigBlind === 'number')
    ) {
      return;
    }

    // Update round-specific values with the payload round information
    setRoundPlayers(payload.roundPlayers);
    setDealer(payload.dealer);
    setSmallBlind(payload.smallBlind);
    setBigBlind(payload.bigBlind);

    // Reset the round state variables
    setRiver([]);
    setPot(0);
    setBetHistory([]);
    setTurnSeat(-1);

    // Hide any previous round's winner message
    setWinnerMessage('');
  }

  /**
   * Handles the player's betting turn
   */
  const handleBetRequest = (payload: any) => {
    if (
      !('roundTotal' in payload) ||
      !(typeof payload.roundTotal === 'number') ||
      !('bet' in payload) ||
      !(typeof payload.bet === 'number') ||
      !('callAmount' in payload) ||
      !(typeof payload.callAmount === 'number') ||
      !('money' in payload) ||
      !(typeof payload.money === 'number') ||
      !('bettingOver' in payload) ||
      !(typeof payload.bettingOver === 'number') ||
      !('bettingActions' in payload) ||
      !(Array.isArray(payload.bettingActions))
    ) {
      return;
    }

    setCallAmount(payload.callAmount);
    setBettingOver(payload.bettingOver);
    setBettingActions(payload.bettingActions);
  }

  /**
   * Handles a new betting action reported by the server
   */
  const handleBettingAction = (payload: any) => {
    if (
      !(Array.isArray(payload.roundPlayers)) ||
      !('pot' in payload) ||
      !(typeof payload.pot === 'number') ||
      !('displayName' in payload) ||
      !(typeof payload.displayName === 'string') ||
      !('action' in payload) ||
      !(typeof payload.action === 'number') ||
      !('amount' in payload) ||
      !(typeof payload.amount === 'number') ||
      !('roundPlayers' in payload)
    ) {
      return;
    }

    // Update the round player state
    setRoundPlayers(payload.roundPlayers);

    // Update the betting action history based on the just placed bet
    let betLog = '';
    if (payload.action === BettingAction.CHECK) {
      betLog = `${payload.displayName} checked`;
    }
    else if (payload.action === BettingAction.CALL) {
      betLog = `${payload.displayName} called (${payload.amount})`;
    }
    else if (payload.action === BettingAction.RAISE) {
      betLog = `${payload.displayName} raised by ${payload.amount}`;
    }
    else if (payload.action === BettingAction.FOLD) {
      betLog = `${payload.displayName} folded`;
    }
    setBetHistory([...betHistory, betLog]);

    // Update the pot
    setPot(payload.pot);

    // Guarantee that the timer is hidden (if it is now the player's turn, the bet request message will come after and re-show the timer)
    setBettingOver(-1);
  }

  /**
   * Handles receiving hole cards from the server
   */
  const handleHoleCards = (payload: any) => {
    console.log('received hole cards: ', payload.cards);
    if (
      !('cards' in payload) ||
      !(Array.isArray(payload.cards))
    ) {
      return;
    }
    console.log('passed hole cards');

    setHoleCards(payload.cards);
  }

  /**
   * Handles receiving a river update from the server
   */
  const handleRiverUpdate = (payload: any) => {
    if (
      !('stage' in payload) ||
      !(typeof payload.stage === 'number') ||
      !('river' in payload) ||
      !(Array.isArray(payload.river))
    ) {
      return;
    }

    // Update the river cards
    setRiver(payload.river);
    // Hide whose turn it is so it doesn't look like someone should be betting while the river cards are simply being displayed
    setTurnSeat(-1);
    // For the same reason, clear any previously allowed betting actoins
    setBettingActions([]);
  }

  /**
   * Handles receiving a new betting turn seat index
   */
  const handleBettingTurn = (payload: any) => {
    if (
      !('turn' in payload) ||
      !(typeof payload.turn === 'number')
    ) {
      return;
    }

    setTurnSeat(payload.turn);
    setBettingActions([]);
  }

  /**
   * Handles receiving the result of a game after it is over
   */
  const handleShowdownResult = (payload: any) => {
    if (
      !('pot' in payload) ||
      !(typeof payload.pot === 'number') ||
      !('winnings' in payload) ||
      !(typeof payload.winnings === 'number') ||
      !('winnerNames' in payload) ||
      !(Array.isArray(payload.winnerNames)) ||
      !('roundPlayers' in payload) ||
      !(Array.isArray(payload.roundPlayers))
    ) {
      return;
    }

    // Hide any betting actions and whose turn it was
    setBettingActions([]);
    setTurnSeat(-1);
    // Update the round players
    setRoundPlayers(payload.roundPlayers);
    // Update the winner message
    if (payload.winnerNames.length === 1) {
      setWinnerMessage(`${payload.winnerNames[0]} won $${payload.winnings}!`);
    }
    else {
      setWinnerMessage(`${payload.winnerNames.join(', ')} won $${payload.winnings} each!`);
    }
  }

  if (!hasBegun) {
    return <WaitScreen />;
  }

  // If the player's seat doesn't have corresponding player data
  if (!playerData) {
    // Return a waiting message
    return (
      <div className='holdem-game'>
        <div className='holdem-content'>
          <h3>Waiting for the server to begin the round...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className='holdem-game'>
      <GameControlsBar name='Holdem' />
      <div className='holdem-content'>
        <Table
          bettingOver={bettingOver === undefined ? 0 : bettingOver}
          winnerMessage={winnerMessage}
          river={river}
          roundPlayers={roundPlayers}
          turnSeat={turnSeat}
          dealer={dealer}
          smallBlind={smallBlind}
          bigBlind={bigBlind}
        />
        <Controls
          displayName={playerData.displayName}
          pot={pot}
          balance={playerData.money}
          callAmount={callAmount}
          holeCards={holeCards}
          bettingActions={bettingActions}
          bettingActionCallback={handlePerformBettingAction}
          betHistory={betHistory}
        />
      </div>
    </div>
  );
}

export default HoldemGame;