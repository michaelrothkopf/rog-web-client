import {
  acceptFriendRequest,
  createFriendRequest,
  declineFriendRequest,
  getFriendList,
  getFriendRequestsList,
} from '../../core/friends';
import { useAuthStore } from '../../hooks/authStore';
import { useFriendStore } from '../../hooks/friendStore';
import './FriendBox.css';

function FriendRequestBox() {
  // Get the user's username for verification purposes
  const username = useAuthStore((state) => state.user.username);
  // Get the friend data
  const friendRequests = useFriendStore((state) => state.friendRequests);
  const setFriendRequests = useFriendStore((state) => state.setFriendRequests);
  const setFriends = useFriendStore((state) => state.setFriends);

  const handleDeclineRequest = (request: string) => {
    declineFriendRequest(request).then((success) => {
      if (success) {
        getFriendRequestsList().then((newFriendRequests) =>
          setFriendRequests(newFriendRequests)
        );
        getFriendList().then((newFriends) => setFriends(newFriends));
      }
    });
  };

  const handleAcceptRequest = (request: string) => {
    acceptFriendRequest(request).then((success) => {
      if (success)
        getFriendRequestsList().then((newFriendRequests) =>
          setFriendRequests(newFriendRequests)
        );
    });
  };

  const handleCreateFriendRequest = () => {
    const response = prompt(
      `Enter the username of the person you'd like to friend:`
    );
    if (response && response.length > 3 && response.length < 50) {
      createFriendRequest(response).then((success) => {
        if (success)
          getFriendRequestsList().then((newFriendRequests) =>
            setFriendRequests(newFriendRequests)
          );
      });
    }
  };

  if (friendRequests.length === 0) {
    return (
      <div className='home-grid-element friend-request-box'>
        <div className='left'>
          <h2>Friend Requests</h2>
          <p className='message'>You don't have any friend requests yet.</p>
        </div>
        <div className='right'>
          <button
            className='x-button'
            onClick={() => handleCreateFriendRequest()}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='home-grid-element'>
      <div className='friend-request-box'>
        <h2>Friend Requests</h2>
        <button
          className='x-button'
          onClick={() => handleCreateFriendRequest()}
        >
          +
        </button>
      </div>
      <div className='cards'>
        {friendRequests.map((f) => {
          if (f.initiator.username === username) {
            return (
              <div className='friend-card' key={f.sentAt}>
                <div className='left'>
                  <p className='username'>{f.recipient.username} (outgoing)</p>
                  <span className='date'>
                    Sent on {new Date(f.sentAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div className='friend-card' key={f.sentAt}>
                <div className='left'>
                  <p className='username'>
                    {f.initiator.username === username
                      ? f.recipient.username
                      : f.initiator.username}
                  </p>
                </div>
                <div className='right'>
                  <button
                    className='x-button'
                    onClick={() => handleDeclineRequest(f._id)}
                  >
                    x
                  </button>
                  <button
                    className='x-button'
                    onClick={() => handleAcceptRequest(f._id)}
                  >
                    &#10003;
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default FriendRequestBox;
