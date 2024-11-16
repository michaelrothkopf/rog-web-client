import './Leaderboard.css';

interface LeaderboardProps {
  standings: { userId: string; displayName: string; score: number }[];
}

function Leaderboard(props: LeaderboardProps) {
  return (
    <div className='game-leaderboard'>
      <h2>Leaderboard</h2>
      {props.standings.map((p, i) => (
        <div className='game-leaderboard-card' key={p.userId}>
          <div className='game-leaderboard-place'>{i + 1}</div>
          <span className='game-leaderboard-username'>{p.displayName}</span>
          <span className='game-leaderboard-score'>{p.score}</span>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
