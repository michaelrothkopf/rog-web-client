export interface TypingState {
  displayName: string;
  expires: number;
}

function TypingIndicator(props: { typing: TypingState[] }) {
  let text = '';
  // If there is no one typing, display nothing
  if (props.typing.length === 0) text = '';
  // If there is one user typing, display that user's name
  else if (props.typing.length === 1) text = `${props.typing[0].displayName} is typing...`;
  // If there are less than five users typing, display all of them
  else if (props.typing.length < 5) {
    // Comma-separated other users
    for (let i = 0; i < props.typing.length - 1; i++) {
      text += `${props.typing[i].displayName}, `;
    }
    // Last user not comma-separated
    text += 'and ' + props.typing[props.typing.length - 1].displayName + ' are typing...';
  }
  // If there are too many users typing, display that message instead
  else text = `Many users are typing...`;

  return (
    <span className='typing-indicator'>{text}</span>
  );
}

export default TypingIndicator;