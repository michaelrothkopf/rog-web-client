import './ResultDisplay.css';

interface ResultDisplayProps {
  results: {
    winner: number;
    p1name: string;
    p2name: string;
    newScore1: number;
    newScore2: number;
    scoreChange: number;
  };
}

function ResultDisplay(props: ResultDisplayProps) {
  if (props.results.winner === 1) {
    return (
      <div className='result-display'>
        <div className='user-result'>
          <div className='username username--winner'>
            {props.results.p1name}
          </div>
          <span className='score score--winner'>
            {props.results.newScore1} pts
          </span>
          <span className='score-change score-change--winner'>
            +{props.results.scoreChange}
          </span>
        </div>
        <div className='user-result'>
          <div className='username username--loser'>{props.results.p2name}</div>
          <span className='score score--loser'>
            {props.results.newScore2} pts
          </span>
          <span className='score-change score-change--loser'>
            +{props.results.scoreChange}
          </span>
        </div>
      </div>
    );
  }
  if (props.results.winner === 2) {
    return (
      <div className='result-display'>
        <div className='user-result'>
          <div className='username username--loser'>{props.results.p1name}</div>
          <span className='score score--loser'>
            {props.results.newScore1} pts
          </span>
          <span className='score-change score-change--loser'>
            +{props.results.scoreChange}
          </span>
        </div>
        <div className='user-result'>
          <div className='username username--winner'>
            {props.results.p2name}
          </div>
          <span className='score score--winner'>
            {props.results.newScore2} pts
          </span>
          <span className='score-change score-change--winner'>
            +{props.results.scoreChange}
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className='result-display'>
      <div className='user-result'>
        <div className='username username--winner'>{props.results.p1name}</div>
        <span className='score score--winner'>
          {props.results.newScore1} pts
        </span>
        <span className='score-change score-change--winner'>
          +{props.results.scoreChange}
        </span>
      </div>
      <div className='user-result'>
        <div className='username username--winner'>{props.results.p2name}</div>
        <span className='score score--winner'>
          {props.results.newScore2} pts
        </span>
        <span className='score-change score-change--winner'>
          +{props.results.scoreChange}
        </span>
      </div>
    </div>
  );
}

export default ResultDisplay;
