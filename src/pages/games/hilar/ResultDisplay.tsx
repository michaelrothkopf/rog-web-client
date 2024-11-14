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
        <span className='winner-username'>
          {props.results.p1name}{' '}
          <span className='score-change'>{props.results.scoreChange}</span>
        </span>
        <span className='loser-username'>{props.results.p2name}</span>
        <span className='winner-score'>{props.results.newScore1}</span>
        <span className='loser-score'>{props.results.newScore2}</span>
      </div>
    );
  }
  if (props.results.winner === 2) {
    return (
      <div className='result-display'>
        <span className='loser-username'>{props.results.p1name}</span>
        <span className='winner-username'>
          {props.results.p2name}{' '}
          <span className='score-change'>{props.results.scoreChange}</span>
        </span>
        <span className='loser-score'>{props.results.newScore1}</span>
        <span className='winner-score'>{props.results.newScore2}</span>
      </div>
    );
  }
  return (
    <div className='result-display'>
      <span className='winner-username'>
        {props.results.p1name}{' '}
        <span className='score-change'>{props.results.scoreChange}</span>
      </span>
      <span className='winner-username'>
        {props.results.p2name}{' '}
        <span className='score-change'>{props.results.scoreChange}</span>
      </span>
      <span className='winner-score'>{props.results.newScore1}</span>
      <span className='winner-score'>{props.results.newScore2}</span>
    </div>
  );
}

export default ResultDisplay;
