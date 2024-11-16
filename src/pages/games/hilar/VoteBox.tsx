import './VoteBox.css';

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
      <div className='vote-options'>
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
    </div>
  );
}

export default VoteBox;
