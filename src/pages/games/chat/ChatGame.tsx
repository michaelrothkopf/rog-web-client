import { useEffect, useRef, useState } from 'react';

import { useGameStore } from '../../../hooks/gameStore';
import { leaveGame, terminateGame } from '../../../core/game';

import WaitScreen from '../WaitScreen';
import ChatMessage, { MessageData } from './ChatMessage';

import { globalState } from '../../../core/global';

import './ChatGame.css';

function ChatGame() {
  const hasBegun = useGameStore((state) => state.hasBegun);
  const isHost = useGameStore((state) => state.isHost);

  const messageBox = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);

  // Create and cleanup event handlers
  useEffect(() => {
    // Add the new message handlers
    if (globalState.socket) {
      if (!globalState.socket.hasListeners('chatNewMessage')) {
        globalState.socket.on('chatNewMessage', handleNewMessage);
      }
    }

    // When the chat game will dismount
    return () => {
      // Remove the new message handler
      if (globalState.socket) {
        globalState.socket.removeAllListeners('chatNewMessage');
      }
    }
  }, []);

  // Make socket available throughout function
  if (!globalState.socket) {
    return <p>Critical client error: socket undefined.</p>;
  }

  /**
   * When the client receives a new message from the server
   */
  const handleNewMessage = (data: any) => {
    if (
      !('sender' in data) ||
      !(typeof data.sender === 'string') ||
      !('content' in data) ||
      !(typeof data.content === 'string') ||
      !('timestamp' in data) ||
      !(typeof data.timestamp === 'number')
    ) {
      return;
    }

    // Add the new message to the list
    setMessages(old => [...old, data]);
  }

  /**
   * When the enter button is pressed, send the message
   */
  const handleKeydownInput = (e: any) => {
    if (e.code === 'Enter') {
      handleSend();
    }
  }

  // When the user wants to send a message
  const handleSend = () => {
    // If the socket and message box are both valid (should always be true)
    if (globalState.socket && messageBox.current) {
      // Send the message to the server
      globalState.socket.emit('chatMessage', {
        content: messageBox.current.value,
      });

      // Clear the message box
      messageBox.current.value = '';

      // Refocus the message box
      messageBox.current.focus();
    }
  }

  // Load if not started
  if (!hasBegun) {
    return <WaitScreen />;
  }
  
  // Always return the chat window
  return (
    <div className='chat-game'>
      <div className='messaging-window'>
        <div className='messages'>
          {messages.slice().reverse().map(m => (
            <ChatMessage message={m} key={m.timestamp} />
          ))}
        </div>
        <div className='messaging-controls'>
          <input
            type='text'
            name='message'
            id='message'
            placeholder='Type a message'
            ref={messageBox}
            onKeyDown={handleKeydownInput}
            autoFocus
          />
          <button onClick={handleSend}>Send</button>
        </div>
        <div className='game-controls'>
          <button onClick={leaveGame}>Leave</button>
          {isHost ? <button onClick={terminateGame}>Close room for all</button> : <></>}
        </div>
      </div>
    </div>
  );
}

export default ChatGame;