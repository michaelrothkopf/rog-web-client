import CreateGameBox from './CreateGameBox';
import FriendBox from './FriendBox';
import FriendRequestBox from './FriendRequestBox';
import JoinGameBox from './JoinGameBox';

import './Home.css';
import SettingsBox from './SettingsBox';
import { useFriendStore } from '../../hooks/friendStore';
import { useEffect, useRef } from 'react';
import { getFriendList, getFriendRequestsList } from '../../core/friends';
import { HOMEPAGE_DATA_REFRESH_INTERVAL } from '../../core/global';

function HomePage() {
  // Depend on the refresh functions
  const setFriends = useFriendStore((state) => state.setFriends);
  const setFriendRequests = useFriendStore((state) => state.setFriendRequests);
  
  // Use a reference to avoid creating two check intervals
  const checkInterval = useRef<number>(0);

  // Create the check interval
  useEffect(() => {
    // Clear any previous checking function
    clearInterval(checkInterval.current);

    // Create a new checking function
    checkInterval.current = setInterval(() => {
      // Update the friend data
      getFriendList().then((newFriends) => {
        setFriends(newFriends);
      });

      // Update the friend request data
      getFriendRequestsList().then((newFriendRequests) => {
        setFriendRequests(newFriendRequests);
      });
    }, HOMEPAGE_DATA_REFRESH_INTERVAL);

    // Clear the checking function on dismount
    return () => {
      clearInterval(checkInterval.current);
    };
  }, []);

  return (
    <div className='page-content'>
      <h1>Welcome to Rothkopf Online Games!</h1>
      <div className='home-grid'>
        <FriendBox />
        <FriendRequestBox />
        <CreateGameBox />
        <JoinGameBox />
        <SettingsBox />
      </div>
    </div>
  );
}

export default HomePage;
