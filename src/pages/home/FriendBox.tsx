import { getFriendList, removeFriend } from '../../core/friends';
import { useAuthStore } from '../../hooks/authStore';
import { useFriendStore } from '../../hooks/friendStore';
import { formatDuration } from '../../utils/time';
import './FriendBox.css';

function FriendBox() {
  // Get the user's username for verification purposes
  const username = useAuthStore((state) => state.user.username);
  // Get the friend data
  const friends = useFriendStore((state) => state.friends);
  const setFriends = useFriendStore((state) => state.setFriends);

  const handleRemoveFriend = (friend: string, username: string) => {
    if (
      confirm(
        `Are you sure you want to remove friend "${username}"? You'll have to send him or her another friend request to become friends again.`
      )
    ) {
      removeFriend(friend).then((success) => {
        if (success)
          getFriendList().then((newFriends) => setFriends(newFriends));
      });
    }
  };

  if (friends.length === 0) {
    return (
      <div className='home-grid-element'>
        <h2>Friends</h2>
        <p className='message'>You don't have any friends yet.</p>
      </div>
    );
  }

  return (
    <div className='home-grid-element'>
      <h2>Friends</h2>
      <div className='cards'>
        {friends.map((f) => (
          <div className='friend-card' key={f.sentAt}>
            <div className='left'>
              <p className='username'>
                {f.initiator.username === username
                  ? f.recipient.username
                  : f.initiator.username}
              </p>
              <span className='date'>
                Last seen {f.initiator.username === username
                  ? (f.recipient.lastLogin > f.recipient.lastLogout ? `just now` : `${formatDuration(Date.now() - new Date(f.recipient.lastLogout).getTime())} ago`)
                  : (f.initiator.lastLogin > f.initiator.lastLogout ? `just now` : `${formatDuration(Date.now() - new Date(f.initiator.lastLogout).getTime())} ago`)}
              </span>
            </div>
            <div className='right'>
              <button
                className='x-button'
                onClick={() =>
                  handleRemoveFriend(
                    f.initiator.username === username
                      ? f.recipient._id
                      : f.initiator._id,
                    f.initiator.username === username
                      ? f.recipient.username
                      : f.initiator.username
                  )
                }
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FriendBox;
