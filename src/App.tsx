// Basic page functionality
import { useEffect } from 'react';
import './pages/global/App.css';

// Zustand hook-based global states
import { ColorScheme, useSettingStore } from './hooks/settingStore';
import { useAuthStore } from './hooks/authStore';
import { CurrentPage, useNavigationStore } from './hooks/navigationStore';
import { useFriendStore } from './hooks/friendStore';
import { gameStateHooks, useGameStore } from './hooks/gameStore';

// Core logic for server-dependent actions
import { resetAuthData, setupAuth, validateUser } from './core/auth';
import { getFriendList, getFriendRequestsList } from './core/friends';
import { globalState } from './core/global';

// Renderers for application components
import NavBar from './components/navigation/NavBar';
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import HilarGame from './pages/games/hilar/HilarGame';
import DuelGame from './pages/games/duel/DuelGame';

// Utilities
import { attemptJsonParse } from './utils';

function App() {
  const colorScheme = useSettingStore((state) => state.colorScheme);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticate = useAuthStore((state) => state.authenticate);

  const currentPage = useNavigationStore((state) => state.currentPage);
  const navigate = useNavigationStore((state) => state.navigate);

  const setFriends = useFriendStore((state) => state.setFriends);
  const setFriendRequests = useFriendStore((state) => state.setFriendRequests);

  const setGame = useGameStore((state) => state.setGame);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const beginGame = useGameStore((state) => state.beginGame);

  useEffect(() => {
    // Set the document body background color
    if (colorScheme === ColorScheme.LIGHT) {
      document.body.classList.remove(`${ColorScheme.DARK}-bg`);
      document.body.classList.add(`${ColorScheme.LIGHT}-bg`);
    }
    if (colorScheme === ColorScheme.DARK) {
      document.body.classList.remove(`${ColorScheme.LIGHT}-bg`);
      document.body.classList.add(`${ColorScheme.DARK}-bg`);
    }
  }, [colorScheme]);

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
          case 'DUEL':
            navigate(CurrentPage.DUEL);
            break;
          default:
            break;
        }
      });

      globalState.socket.on('gamePlayers', (data) => {
        if (
          !Array.isArray(data.players) ||
          data.players.length <= 0 ||
          typeof data.players[0].userId !== 'string' ||
          typeof data.players[0].displayName !== 'string'
        ) {
          return;
        }

        // Call the callback
        gameStateHooks.onGamePlayers(data.players);

        // Update the players list
        setPlayers(data.players);
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
    setPlayers,
  ]);

  if (!isAuthenticated) {
    return (
      <div className={colorScheme}>
        <AuthPage />
      </div>
    );
  }

  if (currentPage === CurrentPage.HILAR) {
    return (
      <div className={colorScheme}>
        <HilarGame />
      </div>
    );
  }
  if (currentPage === CurrentPage.DUEL) {
    return (
      <div className={colorScheme}>
        <DuelGame />
      </div>
    );
  }

  return (
    <div className={colorScheme}>
      <NavBar />
      {currentPage === CurrentPage.HOME ? <HomePage /> : <></>}
    </div>
  );
}

export default App;
