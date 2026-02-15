import React, { useState } from 'react';
import './Social.css';

function Social({ user, friends, setFriends, challenges, setChallenges }) {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriend, setNewFriend] = useState({ name: '', email: '' });
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    name: '',
    goal: '',
    type: 'steps',
    endsIn: ''
  });

  const addFriend = () => {
    if (!newFriend.name || !newFriend.email) {
      alert('Please enter both name and email!');
      return;
    }

    const friend = {
      id: Date.now(),
      name: newFriend.name,
      email: newFriend.email,
      avatar: newFriend.name.substring(0, 2).toUpperCase(),
      currentSteps: Math.floor(Math.random() * 10000),
      goalSteps: 10000
    };

    setFriends([...friends, friend]);
    setNewFriend({ name: '', email: '' });
    setShowAddFriend(false);
  };

  const removeFriend = (friendId, friendName) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${friendName} from your friends?`);
    if (confirmed) {
      setFriends(friends.filter(f => f.id !== friendId));
      
      // Also remove them from any challenges
      setChallenges(challenges.map(challenge => ({
        ...challenge,
        participants: challenge.participants.filter(p => p.name !== friendName)
      })));
    }
  };

  const createChallenge = () => {
    if (!newChallenge.name || !newChallenge.goal || !newChallenge.endsIn) {
      alert('Please fill in all fields!');
      return;
    }

    // Create participants list with "You" and random progress for friends
    const participants = [
      { name: 'You', current: Math.floor(Math.random() * parseInt(newChallenge.goal)) }
    ];

    // Add some random friends to the challenge
    const shuffledFriends = [...friends].sort(() => 0.5 - Math.random());
    const selectedFriends = shuffledFriends.slice(0, Math.min(3, friends.length));
    
    selectedFriends.forEach(friend => {
      participants.push({
        name: friend.name,
        current: Math.floor(Math.random() * parseInt(newChallenge.goal))
      });
    });

    const challenge = {
      id: Date.now(),
      name: newChallenge.name,
      goal: parseInt(newChallenge.goal),
      type: newChallenge.type,
      participants: participants,
      endsIn: newChallenge.endsIn
    };

    setChallenges([...challenges, challenge]);
    setNewChallenge({ name: '', goal: '', type: 'steps', endsIn: '' });
    setShowCreateChallenge(false);
  };

  const removeChallenge = (challengeId, challengeName) => {
    const confirmed = window.confirm(`Are you sure you want to remove the "${challengeName}" challenge?`);
    if (confirmed) {
      setChallenges(challenges.filter(c => c.id !== challengeId));
    }
  };

  return (
    <div className="social-container">
      <h2>Friends & Challenges</h2>

      {/* Friends Section */}
      <div className="social-section">
        <div className="section-header">
          <h3>👥 Your Friends</h3>
          <button onClick={() => setShowAddFriend(!showAddFriend)} className="add-friend-btn">
            {showAddFriend ? '✕ Cancel' : '+ Add Friend'}
          </button>
        </div>

        {showAddFriend && (
          <div className="add-friend-form">
            <input
              type="text"
              placeholder="Friend's name"
              value={newFriend.name}
              onChange={(e) => setNewFriend({ ...newFriend, name: e.target.value })}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Friend's email"
              value={newFriend.email}
              onChange={(e) => setNewFriend({ ...newFriend, email: e.target.value })}
              className="form-input"
            />
            <button onClick={addFriend} className="submit-btn">
              Add Friend
            </button>
          </div>
        )}

        <div className="friends-grid">
          {friends.map(friend => {
            const progress = (friend.currentSteps / friend.goalSteps) * 100;
            
            return (
              <div key={friend.id} className="friend-card">
                <button 
                  onClick={() => removeFriend(friend.id, friend.name)}
                  className="remove-friend-btn"
                  title="Remove friend"
                >
                  ✕
                </button>
                
                <div className="friend-avatar">
                  {friend.avatar}
                </div>
                <div className="friend-info">
                  <h4>{friend.name}</h4>
                  <p className="friend-email">{friend.email}</p>
                </div>
                <div className="friend-stats">
                  <div className="stat-label">Today's Steps</div>
                  <div className="stat-value">{Math.round(friend.currentSteps).toLocaleString()}</div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        background: progress >= 100 ? '#2ecc71' : progress >= 60 ? '#CEC2FF' : '#ffa502'
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {progress.toFixed(0)}% of goal
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {friends.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No friends yet</h3>
            <p>Add friends to compete in challenges and stay motivated together!</p>
          </div>
        )}
      </div>

      {/* Challenges Section */}
      <div className="social-section">
        <div className="section-header">
          <h3>🏆 Active Challenges</h3>
          <button onClick={() => setShowCreateChallenge(!showCreateChallenge)} className="add-friend-btn">
            {showCreateChallenge ? '✕ Cancel' : '+ Create Challenge'}
          </button>
        </div>

        {showCreateChallenge && (
          <div className="add-friend-form">
            <input
              type="text"
              placeholder="Challenge name (e.g., 10k Steps Challenge)"
              value={newChallenge.name}
              onChange={(e) => setNewChallenge({ ...newChallenge, name: e.target.value })}
              className="form-input"
            />
            <select
              value={newChallenge.type}
              onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })}
              className="form-input"
              style={{ flex: '0.5' }}
            >
              <option value="steps">Steps</option>
              <option value="exercise">Exercise Minutes</option>
              <option value="sleep">Sleep Hours</option>
            </select>
            <input
              type="number"
              placeholder="Goal"
              value={newChallenge.goal}
              onChange={(e) => setNewChallenge({ ...newChallenge, goal: e.target.value })}
              className="form-input"
              style={{ flex: '0.5' }}
            />
            <input
              type="text"
              placeholder="Ends in (e.g., 3 days)"
              value={newChallenge.endsIn}
              onChange={(e) => setNewChallenge({ ...newChallenge, endsIn: e.target.value })}
              className="form-input"
              style={{ flex: '0.7' }}
            />
            <button onClick={createChallenge} className="submit-btn">
              Create
            </button>
          </div>
        )}

        <div className="challenges-list">
          {challenges.map(challenge => {
            const sortedParticipants = [...challenge.participants].sort((a, b) => b.current - a.current);
            const userRank = sortedParticipants.findIndex(p => p.name === 'You') + 1;

            return (
              <div key={challenge.id} className="challenge-card">
                <button 
                  onClick={() => removeChallenge(challenge.id, challenge.name)}
                  className="remove-challenge-btn"
                  title="Remove challenge"
                >
                  ✕
                </button>
                <div className="challenge-header">
                  <h4>{challenge.name}</h4>
                  <span className="challenge-deadline">Ends in {challenge.endsIn}</span>
                </div>
                <div className="challenge-goal">
                  Goal: {challenge.goal.toLocaleString()} {challenge.type}
                </div>
                
                <div className="leaderboard">
                  <h5>Leaderboard</h5>
                  {sortedParticipants.map((participant, index) => {
                    const progress = (participant.current / challenge.goal) * 100;
                    const isUser = participant.name === 'You';
                    
                    return (
                      <div key={index} className={`leaderboard-row ${isUser ? 'user-row' : ''}`}>
                        <div className="rank">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                        </div>
                        <div className="participant-name">
                          {participant.name}
                          {isUser && <span className="you-badge">You</span>}
                        </div>
                        <div className="participant-progress">
                          <div className="progress-bar-small">
                            <div 
                              className="progress-fill-small"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="progress-value">
                            {Math.round(participant.current).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No active challenges</h3>
            <p>Create a challenge to compete with your friends!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Social;