import { useEffect, useRef, useState } from "react";

// The delay between checks for the betting timer
const BETTING_TIMER_CHECK_DELAY = 1 * 1000; // ms

function BetTimer(props: { bettingOver: number }) {
  // The interval to update the betting timer
  const bettingTimerInterval = useRef<number>(0);
  // The time left to bet, in seconds
  const [displayTimeToBet, setDisplayTimeToBet] = useState<number>(-1);

  useEffect(() => {
    // Set the check function for betting time
    clearInterval(bettingTimerInterval.current);
    bettingTimerInterval.current = setInterval(() => {
      // Set the display time to bet to this number
      setDisplayTimeToBet(Math.floor((props.bettingOver - Date.now()) / 1000));
    }, BETTING_TIMER_CHECK_DELAY);

    // Clear the interval on function destruction
    return () => {
      clearInterval(bettingTimerInterval.current);
    }
  }, [props.bettingOver]);

  return (
    <div className={`bet-timer ${displayTimeToBet > 0 ? '' : 'bet-timer-hidden'}`}>
      <div className='bet-timer-content'>
        <span className='your-turn'>YOUR TURN:</span>
        <div className='spacing'></div>
        <span className='bet-timer-text'>{displayTimeToBet}</span>
      </div>
    </div>
  );
}

export default BetTimer;