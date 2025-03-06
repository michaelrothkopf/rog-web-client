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
import { setupAuth, validateAuthtoken, validateUser } from './core/auth';
import { getFriendGamesList, getFriendList, getFriendRequestsList } from './core/friends';
import { globalState, IN_PRODUCTION } from './core/global';

// Renderers for application components
import NavBar from './components/navigation/NavBar';
import HomePage from './pages/home/HomePage';
import AuthPage from './pages/auth/AuthPage';
import ChangePasswordPage from './pages/auth/ChangePasswordPage';
import HoldemGame from './pages/games/holdem/HoldemGame';
import HilarGame from './pages/games/hilar/HilarGame';
import DuelGame from './pages/games/duel/DuelGame';
import ChatGame from './pages/games/chat/ChatGame';

// Utilities
import { attemptJsonParse } from './utils';

function App() {
  const colorScheme = useSettingStore((state) => state.colorScheme);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authenticate = useAuthStore((state) => state.authenticate);
  const logout = useAuthStore((state) => state.logout);

  const currentPage = useNavigationStore((state) => state.currentPage);
  const navigate = useNavigationStore((state) => state.navigate);

  const setFriends = useFriendStore((state) => state.setFriends);
  const setFriendRequests = useFriendStore((state) => state.setFriendRequests);
  const setFriendGames = useFriendStore((state) => state.setFriendGames);

  const setGame = useGameStore((state) => state.setGame);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const beginGame = useGameStore((state) => state.beginGame);
  const resetGame = useGameStore((state) => state.resetGame);

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
    (async () => {
      // If already authenticated or in development mode, do nothing
      if (isAuthenticated || !IN_PRODUCTION) return;

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
        try {
          // Check with the server that the authtoken is valid
          const authtokenValid = await validateAuthtoken(authToken);
          if (!authtokenValid) {
            return logout();
          }

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
        } catch (e) {
          logout();
        }
      } else logout();
    })();
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

    // Load the friend games
    getFriendGamesList().then((friendGames) => {
      setFriendGames(friendGames);
    });

    // Add the socket listeners
    if (globalState.socket) {
      // When the client joins a game
      if (!globalState.socket.hasListeners('gameInfo'))
      globalState.socket.on('gameInfo', (data) => {
        if (
          !data.gameId ||
          !data.joinCode ||
          !(typeof data.gameId === 'string') ||
          !(typeof data.joinCode === 'string')
        ) {
          return;
        }

        // Update the game state
        setGame(data.gameId, data.joinCode, [], data.hasBegun || false, data.isHost || false);

        // Navigate to the correct game
        switch (data.gameId) {
          case 'HOLDEM':
            navigate(CurrentPage.HOLDEM);
            break;
          case 'HILAR':
            navigate(CurrentPage.HILAR);
            break;
          case 'DUEL':
            navigate(CurrentPage.DUEL);
            break;
          case 'CHAT':
            navigate(CurrentPage.CHAT);
            break;
          default:
            break;
        }
      });

      // When the server updates the players in the current game
      if (!globalState.socket.hasListeners('gamePlayers'))
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
      if (!globalState.socket.hasListeners('gameBegin'))
      globalState.socket.on('gameBegin', () => {
        beginGame();
      });

      // When when the client receives a game error
      if (!globalState.socket.hasListeners('gameError'))
      globalState.socket.on('gameError', (data) => {
        console.error(data);
      });

      // When the client's game is terminated
      if (!globalState.socket.hasListeners('gameEnd'))
      globalState.socket.on('gameEnd', (data) => {
        alert(data.message);

        // Clear the game and clean up
        resetGame();
        navigate(CurrentPage.HOME);
      });

      // When the client leaves the game
      if (!globalState.socket.hasListeners('gameLeave'))
      globalState.socket.on('gameLeave', () => {
        // Clear the game and clean up
        resetGame();
        navigate(CurrentPage.HOME);
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

  if (currentPage === CurrentPage.CHANGE_PASSWORD) {
    return (
      <div className={colorScheme}>
        <ChangePasswordPage />
      </div>
    );
  }

  if (currentPage === CurrentPage.HOLDEM) {
    return (
      <div className={colorScheme}>
        <HoldemGame />
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

  if (currentPage === CurrentPage.CHAT) {
    return (
      <div className={colorScheme}>
        <ChatGame />
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
