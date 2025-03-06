import { useEffect, useState } from 'react';
import { globalState } from '../../../core/global';
import { useGameStore } from '../../../hooks/gameStore';
import WaitScreen from '../WaitScreen';
import GameControlsBar from '../core/GameControlsBar';

import './HilarGame.css';
import QuestionPrompt from './QuestionPrompt';
import VoteBox from './VoteBox';
import Leaderboard from './Leaderboard';
import ResultDisplay from './ResultDisplay';

enum RoundStage {
  LOAD,
  RESPOND,
  VOTE,
  RESULTS,
  LEADERBOARD,
}

// The current question and responses on which players are voting
interface VoteState {
  prompt: string;
  options: string[];
  canVote: boolean;
}
const VOTE_STATE_BLANK: VoteState = { prompt: '', options: [], canVote: true };

// The voting results for the current question
interface VoteResultState {
  winner: number;
  p1name: string;
  p2name: string;
  newScore1: number;
  newScore2: number;
  scoreChange: number;
}
const VOTE_RESULT_STATE_BLANK: VoteResultState = {
  winner: 0,
  p1name: '',
  p2name: '',
  newScore1: 0,
  newScore2: 0,
  scoreChange: 0,
};

// Information about an individual player's standings on the leaderboard
interface StandingsState {
  userId: string;
  displayName: string;
  score: number;
}

function HilarGame() {
  const hasBegun = useGameStore((state) => state.hasBegun);
  const [roundStage, setRoundStage] = useState<RoundStage>(RoundStage.LOAD);

  // The user's questions and the responses they have entered
  const [questions, setQuestions] = useState<string[]>([]);
  const [responses, setResponses] = useState<string[]>([]);
  // The questions, responses, and results for voting
  const [voteData, setVoteData] = useState<VoteState>(VOTE_STATE_BLANK);
  const [voteResult, setVoteResult] = useState<VoteResultState>(
    VOTE_RESULT_STATE_BLANK
  );
  // The leaderboard standings
  const [standings, setStandings] = useState<StandingsState[]>([]);

  // Event listener handling
  useEffect(() => {
    if (globalState.socket) {
      // Add event listeners
      if (!globalState.socket.hasListeners('hilarQuestions')) {
        globalState.socket.on('hilarQuestions', handleQuestions);
      }
      if (!globalState.socket.hasListeners('hilarVoteQuestion')) {
        globalState.socket.on('hilarVoteQuestion', handleVoteQuestion);
      }
      if (!globalState.socket.hasListeners('hilarVoteResult')) {
        globalState.socket.on('hilarVoteResult', handleVoteResult);
      }
      if (!globalState.socket.hasListeners('hilarLeaderboard')) {
        globalState.socket.on('hilarLeaderboard', handleLeaderboard);
      }
    }

    return () => {
      if (globalState.socket) {
        globalState.socket.removeAllListeners('hilarQuestions');
        globalState.socket.removeAllListeners('hilarVoteQuestion');
        globalState.socket.removeAllListeners('hilarVoteResult');
        globalState.socket.removeAllListeners('hilarLeaderboard');
      }
    };
  }, []);

  // Make socket available throughout function
  if (!globalState.socket) {
    return <p>Critical client error: socket undefined.</p>;
  }

  /**
   * Handles when the user finishes responding to a prompt
   */
  const handleResponse = (response: string) => {
    setResponses(responses.concat([response]));
    setQuestions(questions.slice(1));

    // Send the responses to the server
    if (globalState.socket) {
      globalState.socket.emit('hilarQuestionResponse', {
        responseText: response,
      });

      // Remove the sent responses from state
      setResponses([]);
    }
  };

  /**
   * Handles when the user votes for a question
   */
  const handleVote = (vote: number) => {
    // Update the state
    setVoteData({
      prompt: voteData.prompt,
      options: voteData.options,
      canVote: false,
    });

    // send the vote to the server
    if (globalState.socket) {
      globalState.socket.emit('hilarVote', {
        vote,
      });
    }
  };

  /**
   * When the client receives the questions to respond to from the server
   */
  const handleQuestions = (data: any) => {
    if (
      !Array.isArray(data.questions) ||
      !(data.questions.length === 2) ||
      typeof data.questions[0] !== 'string' ||
      typeof data.questions[1] !== 'string'
    ) {
      return;
    }

    setQuestions(data.questions);
    setRoundStage(RoundStage.RESPOND);
  }

  /**
   * When the client receives the question to vote on from the server
   */
  const handleVoteQuestion = (data: any) => {
    // Validate the response object
    if (
      typeof data.prompt !== 'string' ||
      !Array.isArray(data.options) ||
      !(data.options.length === 2) ||
      typeof data.options[0] !== 'string' ||
      typeof data.options[1] !== 'string' ||
      typeof data.canVote !== 'boolean'
    ) {
      return;
    }

    setVoteData({
      prompt: data.prompt,
      options: data.options,
      canVote: data.canVote,
    });
    // Also clear the questions
    setQuestions([]);
    setRoundStage(RoundStage.VOTE);
  }

  /**
   * When the client receives the result of the vote from the server
   */
  const handleVoteResult = (data: any) => {
    // Validate the response object
    if (
      typeof data.winner !== 'number' ||
      typeof data.p1name !== 'string' ||
      typeof data.p2name !== 'string' ||
      typeof data.newScore1 !== 'number' ||
      typeof data.newScore2 !== 'number' ||
      typeof data.scoreChange !== 'number'
    ) {
      console.error('HVR result error');
      return;
    }

    setVoteResult(data);
    setRoundStage(RoundStage.RESULTS);
  }

  /**
   * When the client receives leaderboard data from the server
   */
  const handleLeaderboard = (data: any) => {
    // Validate the response object
    if (
      !Array.isArray(data.standings) ||
      !(data.standings.length > 0) ||
      typeof data.standings[0].userId !== 'string' ||
      typeof data.standings[0].score !== 'number'
    ) {
      console.error('leaderboard failure');
      return;
    }

    setStandings(data.standings);
    setRoundStage(RoundStage.LEADERBOARD);
  }

  // Load if not started
  if (!hasBegun) {
    return <WaitScreen />;
  }

  // If currently in question mode
  if (roundStage === RoundStage.RESPOND && questions.length > 0) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <QuestionPrompt prompt={questions[0]} submitCallback={handleResponse} />
        </div>
      </div>
    );
  } else if (roundStage === RoundStage.RESPOND) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <p>Waiting for other responses...</p>
        </div>
      </div>
    );
  }

  // If currently in voting mode
  if (roundStage === RoundStage.VOTE && voteData.canVote) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <VoteBox
            prompt={voteData.prompt}
            voteCallback={handleVote}
            firstOption={voteData.options[0]}
            secondOption={voteData.options[1]}
          />
        </div>
        
      </div>
    );
  } else if (roundStage === RoundStage.VOTE && voteData.options.length > 0) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <p>Waiting for votes...</p>
        </div>
      </div>
    );
  }

  // If currently in results mode
  if (roundStage === RoundStage.RESULTS) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <ResultDisplay results={voteResult} />
        </div>
      </div>
    );
  }

  // If currently in leaderboard mode
  if (roundStage === RoundStage.LEADERBOARD) {
    return (
      <div className='hilar-game'>
        <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <Leaderboard standings={standings} />
        </div>
      </div>
    );
  }

  // roundStage === RoundStage.LOAD
  return (
    <div className='hilar-game'>
      <GameControlsBar name='hilar' />
        <div className='hilar-content'>
          <p>Waiting...</p>
        </div>
    </div>
  );
}

export default HilarGame;
