import { useEffect } from 'react';
import './pages/global/App.css';
import { resetAuthData, setupAuth, validateUser } from './core/auth';
import NavBar from './components/navigation/NavBar';
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import { attemptJsonParse } from './utils';
import { useAuthStore } from './hooks/authStore';
import { CurrentPage, useNavigationStore } from './hooks/navigationStore';
import { useFriendStore } from './hooks/friendStore';
import { getFriendList, getFriendRequestsList } from './core/friends';
import { useGameStore } from './hooks/gameStore';
import { globalState } from './core/global';
import HilarGame from './pages/games/hilar/HilarGame';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticate = useAuthStore((state) => state.authenticate);

  const currentPage = useNavigationStore((state) => state.currentPage);
  const navigate = useNavigationStore((state) => state.navigate);

  const setFriends = useFriendStore((state) => state.setFriends);
  const setFriendRequests = useFriendStore((state) => state.setFriendRequests);

  const setGame = useGameStore((state) => state.setGame);
  const beginGame = useGameStore((state) => state.beginGame);

  // Attempt to login using existing information
  useEffect(() => {
    // If already authenticated, do nothing
    const t = true;
    if (isAuthenticated || t) return;

    // Get the authentication data
    const authToken = localStorage.getItem('authToken');
    const authTokenExpires = localStorage.getItem('authTokenExpires');
    const authUser = attemptJsonParse(localStorage.getItem('authUser'));

    if (
      authToken &&
      authTokenExpires &&
      !isNaN(new Date(authTokenExpires).getTime()) &&
      authUser &&
      validateUser(authUser) &&
      new Date() < new Date(authTokenExpires)
    ) {
      // Set the unbound global variables for an authenticated state
      setupAuth({
        token: authToken,
        tokenExpires: new Date(authTokenExpires),
        user: authUser,
      });

      // Authentication data from localStorage is valid
      authenticate({
        token: authToken,
        tokenExpires: new Date(authTokenExpires),
        user: authUser,
      });
    } else resetAuthData();
  }, [isAuthenticated, authenticate]);

  // When there is a change in the authentication state
  useEffect(() => {
    // If not authenticated, do nothing
    if (!isAuthenticated) return;

    // Load the friends
    getFriendList().then((friends) => {
      setFriends(friends);
    });

    // Load the friend requests
    getFriendRequestsList().then((friendRequests) => {
      setFriendRequests(friendRequests);
    });

    // Add the socket listeners
    if (globalState.socket) {
      // When the client joins a game
      globalState.socket.on('gameInfo', (data) => {
        console.log('gameInfo', data);

        if (
          !data.gameId ||
          !data.joinCode ||
          !(typeof data.gameId === 'string') ||
          !(typeof data.joinCode === 'string')
        ) {
          return;
        }

        // Update the game state
        setGame(data.gameId, data.joinCode, [], data.isHost || false);

        // Navigate to the correct game
        switch (data.gameId) {
          case 'HILAR':
            navigate(CurrentPage.HILAR);
            break;
          default:
            break;
        }
      });

      // When a game starts
      globalState.socket.on('gameBegin', () => {
        beginGame();
      });

      // When when the client receives a game error
      globalState.socket.on('gameError', (data) => {
        console.error(data);
      });
    }
  }, [
    isAuthenticated,
    setFriends,
    setFriendRequests,
    setGame,
    navigate,
    beginGame,
  ]);

  if (!isAuthenticated) {
    return (
      <div className='light-mode'>
        <AuthPage />
      </div>
    );
  }

  if (currentPage === CurrentPage.HILAR) {
    return (
      <div className='light-mode'>
        <HilarGame />
      </div>
    );
  }

  return (
    <div className='light-mode'>
      <NavBar />
      {currentPage === CurrentPage.HOME ? <HomePage /> : <></>}
    </div>
  );
}

export default App;
