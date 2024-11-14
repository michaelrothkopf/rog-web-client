interface VoteBoxProps {
  firstOption: string;
  secondOption: string;
  voteCallback: (vote: number) => void;
}

function VoteBox(props: VoteBoxProps) {
  return (
    <div className='vote-box'>
      <button
        className='vote-option'
        onClick={() => {
          props.voteCallback(-1);
        }}
      >
        {props.firstOption}
      </button>
      <button
        className='vote-option'
        onClick={() => {
          props.voteCallback(1);
        }}
      >
        {props.secondOption}
      </button>
    </div>
  );
}

export default VoteBox;
