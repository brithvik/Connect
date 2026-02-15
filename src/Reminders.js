import React, { useState } from 'react';

function Reminders({ goals, challenges, currentDay, friends, setFriends, longTermGoals }) {
  const [sentReminders, setSentReminders] = useState({});

  const sendReminder = (friendId, friendName) => {
    // Mark reminder as sent
    setSentReminders(prev => ({
      ...prev,
      [friendId]: true
    }));

    // Show a notification or alert
    alert(`Reminder sent to ${friendName}! 💪 They'll get a notification to boost their activity.`);

    // In a real app, this would send an actual notification/email
    // For now, we'll just simulate it
    setTimeout(() => {
      setSentReminders(prev => ({
        ...prev,
        [friendId]: false
      }));
    }, 5000); // Reset after 5 seconds so you can send again
  };

  // Find friends who are lagging behind
  const laggingFriends = friends.filter(friend => {
    const progress = (friend.currentSteps / friend.goalSteps) * 100;
    return progress < 60; // Less than 60% of their goal
  });

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ 
        fontSize: '20px', 
        fontWeight: 600, 
        marginBottom: '16px',
        color: '#333'
      }}>
        📌 Today's Reminders
      </h3>

      {/* Personal Goals Section */}
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{ 
          fontSize: '16px', 
          fontWeight: 600, 
          marginBottom: '12px',
          color: '#B3B3F1'
        }}>
          Your Goals
        </h4>
        {goals.map(goal => {
          const current = getCurrentValue(goal.type, currentDay);
          const progress = (current / goal.target) * 100;
          const isComplete = current >= goal.target;
          
          return (
            <div key={goal.id} style={{
              padding: '12px',
              background: isComplete ? '#d4f4dd' : '#f8f9fa',
              borderRadius: '12px',
              marginBottom: '8px',
              border: isComplete ? '2px solid #2ecc71' : '2px solid transparent'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {goal.emoji} {getGoalName(goal.type)}
                </span>
                <span style={{ 
                  fontSize: '13px', 
                  fontWeight: 700,
                  color: isComplete ? '#2ecc71' : '#666'
                }}>
                  {Math.round(current)} / {goal.target} {getUnit(goal.type)}
                </span>
              </div>
              <div style={{ 
                height: '6px', 
                background: '#e0e0e0', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(progress, 100)}%`,
                  background: isComplete ? '#2ecc71' : '#B3B3F1',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              {isComplete && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#2ecc71', 
                  fontWeight: 600,
                  marginTop: '4px',
                  display: 'block'
                }}>
                  ✓ Goal completed!
                </span>
              )}
              {!isComplete && progress > 0 && (
                <span style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  marginTop: '4px',
                  display: 'block'
                }}>
                  {(100 - progress).toFixed(0)}% to go
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Long-term Goals Section */}
      {longTermGoals && longTermGoals.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#CF8BA9'
          }}>
            🎯 Long-term Goals
          </h4>
          {longTermGoals.slice(0, 2).map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            
            return (
              <div key={goal.id} style={{
                padding: '12px',
                background: isComplete ? '#d4f4dd' : 'linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%)',
                borderRadius: '12px',
                marginBottom: '8px',
                border: isComplete ? '2px solid #2ecc71' : '2px solid #e9d5ff'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {goal.title}
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  marginBottom: '6px'
                }}>
                  <span style={{ color: '#666' }}>Progress</span>
                  <span style={{ fontWeight: 700, color: '#CF8BA9' }}>
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>

                <div style={{ 
                  height: '8px', 
                  background: '#e9d5ff', 
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '6px'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(progress, 100)}%`,
                    background: isComplete ? '#2ecc71' : 'linear-gradient(90deg, #B3B3F1 0%, #CF8BA9 100%)',
                    transition: 'width 0.3s ease'
                  }} />
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px'
                }}>
                  <span style={{ color: isComplete ? '#2ecc71' : '#666', fontWeight: 600 }}>
                    {isComplete ? '🎉 Complete!' : `${progress.toFixed(0)}% complete`}
                  </span>
                  {daysLeft !== null && daysLeft > 0 && (
                    <span style={{ color: '#999' }}>
                      ⏰ {daysLeft} days left
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collaborative Challenges Section */}
      {challenges && challenges.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#CEC2FF'
          }}>
            🏆 Active Challenges
          </h4>
          {challenges.map(challenge => {
            const userProgress = challenge.participants.find(p => p.name === 'You');
            const progress = userProgress ? (userProgress.current / challenge.goal) * 100 : 0;
            const rank = getRank(challenge.participants);
            
            return (
              <div key={challenge.id} style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #CEC2FF15 0%, #B3B3F115 100%)',
                borderRadius: '12px',
                marginBottom: '8px',
                border: '2px solid #CEC2FF'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
                    {challenge.name}
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    background: '#ff6b6b',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 600
                  }}>
                    Ends in {challenge.endsIn}
                  </span>
                </div>
                
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '4px'
                  }}>
                    <span style={{ color: '#666' }}>Your Progress</span>
                    <span style={{ fontWeight: 700, color: '#CEC2FF' }}>
                      {userProgress ? Math.round(userProgress.current).toLocaleString() : 0} / {challenge.goal.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    background: '#e0e0e0', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(progress, 100)}%`,
                      background: 'linear-gradient(90deg, #CEC2FF 0%, #B3B3F1 100%)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>

                <div style={{ 
                  fontSize: '12px', 
                  color: '#666',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>You're {rank} place</span>
                  <span style={{ fontWeight: 600 }}>
                    {challenge.participants.length} participants
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Friends Needing Reminders Section */}
      {laggingFriends.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '16px', 
            fontWeight: 600, 
            marginBottom: '12px',
            color: '#ff6b6b'
          }}>
            👥 Friends Need a Boost
          </h4>
          <p style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '12px'
          }}>
            These friends are falling behind on their goals. Send them encouragement!
          </p>
          {laggingFriends.map(friend => {
            const progress = (friend.currentSteps / friend.goalSteps) * 100;
            const hasReminder = sentReminders[friend.id];
            
            return (
              <div key={friend.id} style={{
                padding: '12px',
                background: '#fff5f5',
                borderRadius: '12px',
                marginBottom: '8px',
                border: '2px solid #ffe4e4'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #B3B3F1 0%, #CF8BA9 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '14px'
                    }}>
                      {friend.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#333' }}>
                        {friend.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {Math.round(friend.currentSteps).toLocaleString()} / {friend.goalSteps.toLocaleString()} steps
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => sendReminder(friend.id, friend.name)}
                    disabled={hasReminder}
                    style={{
                      padding: '6px 12px',
                      background: hasReminder ? '#ccc' : 'linear-gradient(135deg, #B3B3F1 0%, #CF8BA9 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: hasReminder ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {hasReminder ? '✓ Sent' : '📨 Remind'}
                  </button>
                </div>
                <div style={{ 
                  height: '6px', 
                  background: '#ffe4e4', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${Math.min(progress, 100)}%`,
                    background: progress < 30 ? '#ff6b6b' : progress < 60 ? '#ffa502' : '#CEC2FF',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#999',
                  marginTop: '4px'
                }}>
                  Only {progress.toFixed(0)}% complete
                </div>
              </div>
            );
          })}
        </div>
      )}

      {laggingFriends.length === 0 && friends.length > 0 && (
        <div style={{
          padding: '16px',
          background: '#d4f4dd',
          borderRadius: '12px',
          textAlign: 'center',
          border: '2px solid #2ecc71'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#2ecc71' }}>
            All friends are on track!
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Everyone is doing great with their goals today
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getCurrentValue(type, currentDay) {
  switch(type) {
    case 'steps':
      return currentDay.steps;
    case 'sleep':
      return currentDay.sleep;
    case 'exercise':
      return currentDay.exercise;
    default:
      return 0;
  }
}

function getGoalName(type) {
  switch(type) {
    case 'steps':
      return 'Steps';
    case 'sleep':
      return 'Sleep';
    case 'exercise':
      return 'Exercise';
    default:
      return type;
  }
}

function getUnit(type) {
  switch(type) {
    case 'steps':
      return 'steps';
    case 'sleep':
      return 'hours';
    case 'exercise':
      return 'min';
    default:
      return '';
  }
}

function getRank(participants) {
  const sorted = [...participants].sort((a, b) => b.current - a.current);
  const yourIndex = sorted.findIndex(p => p.name === 'You');
  
  const rank = yourIndex + 1;
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

export default Reminders;