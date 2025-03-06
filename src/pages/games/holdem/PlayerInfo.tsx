import { Card, NULL_CARD } from '../core/cards';
import CardDisplay from './CardDisplay';
import './PlayerInfo.css';

export interface PlayerData {
  displayName: string;
  money: number;
  wins: number;
  cards: Card[],
  seat: number,
  hasFolded: boolean,
}

export enum PlayerStatus {
  ACTIVE = 'holdem-player-info-active',
  WAITING = 'holdem-player-info-waiting',
  FOLDED = 'holdem-player-info-folded',
}

export enum ActiveButton {
  DEALER='D ',
  SMALL_BLIND='S ',
  BIG_BLIND='B ',
  NONE='',
}

function PlayerInfo(props: { data: PlayerData, status: PlayerStatus, button: ActiveButton }) {
  return (
    <div className={`holdem-player-info p${props.data.seat + 1} ${props.status}`}>
      <h3 className='name'><span className={`button-label`}>{props.button}</span>{props.data.displayName}</h3>
      <h3 className='balance'>${props.data.money}</h3>
      <div className='hole-cards'>
        <CardDisplay card={NULL_CARD} />
        <CardDisplay card={NULL_CARD} />
      </div>
    </div>
  );
}

export default PlayerInfo;