import './ChatMessage.css';

export interface MessageData {
  sender: string;
  content: string;
  timestamp: number;
}

function ChatMessage(props: { message: MessageData }) {
  return (
    <div className='message'>
      <div className='left'>
        <span className='sender'>{props.message.sender}</span>
        <span className='content'>{props.message.content}</span>
      </div>
      <div className='right'>
        <span className='timestamp'>{new Date(props.message.timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export default ChatMessage;