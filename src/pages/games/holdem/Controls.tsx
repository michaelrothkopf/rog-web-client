import { Card } from '../core/cards';
import CardDisplay from './CardDisplay';
import './Controls.css';

// The different ways a player can bet
export enum BettingAction {
  CHECK,
  CALL,
  RAISE,
  FOLD
}

interface ControlsProps {
  pot: number;
  displayName: string;
  balance: number;
  callAmount: number;
  holeCards: Card[];
  bettingActions: BettingAction[];
  bettingActionCallback: (action: BettingAction) => void;
  betHistory: string[];
}

function Controls(props: ControlsProps) {
  if (props.holeCards.length !== 2) return <div className='holdem-controls'>Waiting for hole cards...</div>;

  return (
    <div className='holdem-controls'>
      <h3 className='name'>{props.displayName}</h3>
      <div className='money'>
        <span className='label'>Pot:</span>
        <span className='value'>${props.pot}</span>
      </div>
      <div className='money'>
        <span className='label'>Balance:</span>
        <span className='value'>${props.balance}</span>
      </div>
      <div className={`call-amount ${props.bettingActions.length === 0 ? 'betting-turn-inactive' : ''}`}>
        ${props.callAmount} to call
      </div>
      <div className='actions'>
        <button onClick={() => props.bettingActionCallback(BettingAction.CHECK)} className={props.bettingActions.includes(BettingAction.CHECK) ? '' : 'disabled'}>Check</button>
        <button onClick={() => props.bettingActionCallback(BettingAction.CALL)} className={props.bettingActions.includes(BettingAction.CALL) ? '' : 'disabled'}>Call</button>
        <button onClick={() => props.bettingActionCallback(BettingAction.RAISE)} className={props.bettingActions.includes(BettingAction.RAISE) ? '' : 'disabled'}>Raise</button>
        <button onClick={() => props.bettingActionCallback(BettingAction.FOLD)} className={props.bettingActions.includes(BettingAction.RAISE) ? '' : 'disabled'}>Fold</button>
      </div>
      <div className='cards'>
        <CardDisplay card={props.holeCards[0]} />
        <CardDisplay card={props.holeCards[1]} />
      </div>
      <div className='history'>
        {props.betHistory.map((h, idx) => <p key={idx}>{h}</p>)}
      </div>
    </div>
  );
}

export default Controls;