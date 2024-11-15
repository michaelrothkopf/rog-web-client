interface VoteBoxProps {
  prompt: string;
  firstOption: string;
  secondOption: string;
  voteCallback: (vote: number) => void;
}

function VoteBox(props: VoteBoxProps) {
  return (
    <div className='vote-box'>
      <h2 className='vote-prompt'>{props.prompt}</h2>
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
