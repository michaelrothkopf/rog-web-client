interface LeaderboardProps {
  standings: { userId: string; displayName: string; score: number }[];
}

function Leaderboard(props: LeaderboardProps) {
  return (
    <div className='game-leaderboard'>
      {props.standings.map((p) => (
        <div className='game-leaderboard-card' key={p.userId}>
          <span className='game-leaderboard-username'>{p.displayName}</span>
          <span className='game-leaderboard-score'>{p.score}</span>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
