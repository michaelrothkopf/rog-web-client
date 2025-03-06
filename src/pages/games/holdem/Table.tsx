import { Card } from '../core/cards';
import CardDisplay from './CardDisplay';
import PlayerInfo, { ActiveButton, PlayerData, PlayerStatus } from './PlayerInfo';
import './Table.css';
import BetTimer from './BetTimer';

interface TableProps {
  bettingOver: number;
  winnerMessage: string;
  river: Card[];
  roundPlayers: PlayerData[];
  turnSeat: number;
  dealer: number;
  smallBlind: number;
  bigBlind: number;
}

function Table(props: TableProps) {
  return (
    <div className='holdem-table'>
      <BetTimer bettingOver={props.bettingOver} />
      <div className='showdown-result'>
        <span className={`showdown-result-text ${props.winnerMessage.length > 1 ? 'showdown-result-shown' : ''}`}>{props.winnerMessage}</span>
      </div>
      <div className='river'>
        {props.river.map((c, idx) => <CardDisplay key={idx} card={c} />)}
      </div>
      {props.roundPlayers.map(p => <PlayerInfo
        key={p.seat}
        data={p}
        status={p.hasFolded ? PlayerStatus.FOLDED : (p.seat === props.turnSeat ? PlayerStatus.ACTIVE : PlayerStatus.WAITING)}
        button={p.seat === props.dealer ? ActiveButton.DEALER
          : (p.seat === props.smallBlind ? ActiveButton.SMALL_BLIND
          : (p.seat === props.bigBlind ? ActiveButton.BIG_BLIND : ActiveButton.NONE))
        }
      />)}
    </div>
  );
}

export default Table;