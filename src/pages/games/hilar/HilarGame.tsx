import { useState } from 'react';
import { globalState } from '../../../core/global';
import { useGameStore } from '../../../hooks/gameStore';
import WaitScreen from '../WaitScreen';

import './HilarGame.css';
import QuestionPrompt from './QuestionPrompt';

function HilarGame() {
  const hasStarted = useGameStore((state) => state.hasStarted);
  const joinCode = useGameStore((state) => state.joinCode);
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);

  // Make socket available throughout function
  if (!globalState.socket) {
    return <p>Critical client error: socket undefined.</p>;
  }

  const handleResponse = (response: string) => {
    // Update the state
    setResponses(responses.concat([response]));
    setQuestions(questions.slice(1));

    // Send the responses to the server
    if (globalState.socket) {
      globalState.socket.emit('hilarQuestionResponse', {
        responseText: response,
      });
    }
  };

  // Add event listeners
  globalState.socket.on('hilarQuestions', (data) => {
    console.log(data);
    if (
      !data.questions ||
      !Array.isArray(data.questions) ||
      !(data.questions.length === 2) ||
      typeof data.questions[0] !== 'string' ||
      typeof data.questions[1] !== 'string'
    ) {
      return;
    }

    setQuestions(data.questions);
  });

  // Load if not started
  if (!hasStarted) {
    return <WaitScreen />;
  }

  // If currently in question mode
  if (questions.length > 0) {
    return (
      <div className='hilar-game'>
        <QuestionPrompt prompt={questions[0]} submitCallback={handleResponse} />
      </div>
    );
  }

  return (
    <div className='hilar-game'>
      <p>In Hilar game ({joinCode})</p>
    </div>
  );
}

export default HilarGame;
