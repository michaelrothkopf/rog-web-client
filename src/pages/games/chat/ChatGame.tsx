import { useEffect, useRef, useState } from 'react';

import { useGameStore } from '../../../hooks/gameStore';
import { leaveGame, terminateGame } from '../../../core/game';

import WaitScreen from '../WaitScreen';
import ChatMessage, { MessageData } from './ChatMessage';

import { globalState } from '../../../core/global';

import './ChatGame.css';
import TypingIndicator, { TypingState } from './TypingIndicator';

// How long the typing indicator stays on screen before automatically being removed
const TYPING_INDICATOR_PERSISTENCE_TIME = 2000; // ms
const TYPING_INDICATOR_CHECK_INTERVAL = 100; // ms
const TYPING_INDICATION_SEND_INTERVAL = TYPING_INDICATOR_PERSISTENCE_TIME / 2; // ms

function ChatGame() {
  const hasBegun = useGameStore((state) => state.hasBegun);
  const isHost = useGameStore((state) => state.isHost);

  const messageBox = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const [usersCurrentlyTyping, setUsersCurrentlyTyping] = useState<TypingState[]>([]);
  const typingIndicatorInterval = useRef<number>(0);
  const lastTypingIndication = useRef<number>(Date.now());

  // Create and cleanup event handlers
  useEffect(() => {
    // Add the socket.io handlers
    if (globalState.socket) {
      // When the client receives a new message
      if (!globalState.socket.hasListeners('chatNewMessage')) {
        globalState.socket.on('chatNewMessage', handleNewMessage);
      }

      // When the client receives a typign indication
      if (!globalState.socket.hasListeners('chatTypingIndication')) {
        globalState.socket.on('chatTypingIndication', handleTypingIndication);
      }
    }

    // Add the typing indicator updater
    clearInterval(typingIndicatorInterval.current);
    typingIndicatorInterval.current = setInterval(() => {
      // Purge the list of people currently typing
      setUsersCurrentlyTyping((old) => {
        // Populate to a new array
        let typing: TypingState[] = [];
        // For each user currently typing
        for (const ut of old) {
          // Add the user iff the typing notification hasn't expired
          if (Date.now() < ut.expires) typing.push(ut);
        }
        // Set the new data
        return typing;
      });
    }, TYPING_INDICATOR_CHECK_INTERVAL);

    // When the chat game will dismount
    return () => {
      // Remove the new message handler
      if (globalState.socket) {
        globalState.socket.removeAllListeners('chatNewMessage');
      }

      // Clear the timeout for the typing indicator
      clearTimeout(typingIndicatorInterval.current);
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

    // Purge the user in question's typing indication if they had one at the time of sending
    setUsersCurrentlyTyping((old) => {
      // Populate to a new array
      let typing: TypingState[] = [];
      // For each user currently typing
      for (const ut of old) {
        // Add the user iff they're not the same as the user who just sent a message
        if (ut.displayName !== data.sender) typing.push(ut);
      }
      // Set the new data
      return typing;
    });
  }

  /**
   * When the client receives a typing indicator from the server
   */
  const handleTypingIndication = (data: any) => {
    if (
      !('displayName' in data) ||
      !(typeof data.displayName === 'string')
    ) {
      return;
    }

    // Add the user to the list of people currently typing and remove any old record containing their name
    setUsersCurrentlyTyping((old) => {
      // Populate to a new array
      let typing: TypingState[] = [];
      // For each user currently typing
      for (const ut of old) {
        // Add the record iff it isn't about to be replaced
        if (ut.displayName !== data.displayName) typing.push(ut);
      }
      // Add the new record
      typing.push({
        displayName: data.displayName,
        expires: Date.now() + TYPING_INDICATOR_PERSISTENCE_TIME,
      });
      // Set the new data
      return typing;
    });
  }

  /**
   * Handle keydown listeners
   */
  const handleKeydownInput = (e: any) => {
    // If the enter button is pressed, send the message
    if (e.code === 'Enter') {
      handleSend();
    }

    // If the key is not enter or backspace
    else if (e.code !== 'Backspace') {
      // If it's been long enough since the last typing indication
      if (Date.now() - lastTypingIndication.current > TYPING_INDICATION_SEND_INTERVAL && globalState.socket) {
        // Send a typing indication to the server
        globalState.socket.emit('chatTyping');
        // Update the last typing message
        lastTypingIndication.current = Date.now();
      }
    }
  }

  // When the user wants to send a message
  const handleSend = () => {
    // If the socket and message box are both valid (should always be true)
    if (globalState.socket && messageBox.current) {
      // Don't send blank messages
      if (messageBox.current.value.length < 1) return;

      // Send the message to the server
      globalState.socket.emit('chatMessage', {
        content: messageBox.current.value,
      });

      // Clear the message box
      messageBox.current.value = '';

      // Refocus the message box
      messageBox.current.focus();

      // Allow immediately sending another typing indication
      lastTypingIndication.current = Date.now() - TYPING_INDICATION_SEND_INTERVAL;
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
          <div className='buttons'>
            <button onClick={leaveGame}>Leave</button>
            {isHost ? <button onClick={terminateGame}>Close room for all</button> : <></>}
          </div>
          <TypingIndicator typing={usersCurrentlyTyping} />
        </div>
      </div>
    </div>
  );
}

export default ChatGame;