import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import WeeklyReport from './WeeklyReport';
import Goals from './Goals';
import Social from './Social';
import TrendGraphs from './TrendGraphs';
import Reminders from './Reminders';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('today');
  
  // Check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('userEmail');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  // Initialize with some sample historical data
const getInitialData = () => {
  const saved = localStorage.getItem('healthHistory');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Generate 14 days of data (2 weeks)
  const today = new Date();
  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (13 - i)); // Go back 13 days
    
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Week 1 has lower activity, Week 2 has higher activity
    const isWeek1 = i < 7;
    const baseSteps = isWeek1 ? 3000 : 6000;
    const baseSleep = isWeek1 ? 5.5 : 7;
    const baseExercise = isWeek1 ? 10 : 25;
    const baseMood = isWeek1 ? 2.5 : 3.8;
    
    return {
      date: date.toISOString().split('T')[0],
      steps: baseSteps + (isWeekend ? 2000 : 0) + Math.random() * 2000,
      sleep: baseSleep + Math.random() * 1.5,
      exercise: baseExercise + (isWeekend ? 15 : 0) + Math.random() * 15,
      mood: baseMood + Math.random() * 1.2
    };
  });
};

  const [history, setHistory] = useState(getInitialData());
  const [currentDay, setCurrentDay] = useState(history[history.length - 1]);
  const [view, setView] = useState('today');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'bot', message: "Hi! I analyze YOUR specific data to give personalized advice. Try asking:\n\n💭 \"Why is my mood low?\"\n📈 \"Analyze my week\"\n🎯 \"What should I focus on today?\"" }
  ]);
  const [userInput, setUserInput] = useState('');

const [goals, setGoals] = useState(() => {
  const saved = localStorage.getItem('userGoals');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, type: 'steps', target: 10000, current: 0, emoji: '🚶' },
    { id: 2, type: 'sleep', target: 8, current: 0, emoji: '😴' },
    { id: 3, type: 'exercise', target: 30, current: 0, emoji: '💪' },
  ];
});

useEffect(() => {
  localStorage.setItem('userGoals', JSON.stringify(goals));
}, [goals]);

const [longTermGoals, setLongTermGoals] = useState(() => {
  const saved = localStorage.getItem('longTermGoals');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, title: 'Lose 10 pounds', target: 150, current: 160, unit: 'lbs', deadline: '2026-04-01', createdAt: new Date().toISOString() },
    { id: 2, title: 'Run a 5K', target: 5, current: 2.5, unit: 'km', deadline: '2026-03-15', createdAt: new Date().toISOString() },
  ];
});

useEffect(() => {
  localStorage.setItem('longTermGoals', JSON.stringify(longTermGoals));
}, [longTermGoals]);

  useEffect(() => {
    localStorage.setItem('healthHistory', JSON.stringify(history));
  }, [history]);

const [friends, setFriends] = useState(() => {
  // Temporarily force new data - remove this check later
  return [
    { id: 1, name: 'Sarah', email: 'sarah@example.com', avatar: 'SA', currentSteps: 8500, goalSteps: 10000 },
    { id: 2, name: 'Mike', email: 'mike@example.com', avatar: 'MI', currentSteps: 12000, goalSteps: 10000 },
    { id: 3, name: 'Alex', email: 'alex@example.com', avatar: 'AL', currentSteps: 6200, goalSteps: 10000 },
    { id: 4, name: 'Emma', email: 'emma@example.com', avatar: 'EM', currentSteps: 2800, goalSteps: 10000 },
    { id: 5, name: 'James', email: 'james@example.com', avatar: 'JA', currentSteps: 3500, goalSteps: 10000 },
  ];
});

const [challenges, setChallenges] = useState(() => {
  const saved = localStorage.getItem('challenges');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, name: '10k Steps Challenge', goal: 10000, type: 'steps', participants: [
      { name: 'You', current: 7500 },
      { name: 'Sarah', current: 8500 },
      { name: 'Mike', current: 12000 },
      { name: 'Alex', current: 6200 },
    ], endsIn: '2 days' },
  ];
});

useEffect(() => {
  localStorage.setItem('friends', JSON.stringify(friends));
}, [friends]);

useEffect(() => {
  localStorage.setItem('challenges', JSON.stringify(challenges));
}, [challenges]);

  // All your existing functions
  const generateChatResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    const avgMood = history.reduce((sum, day) => sum + day.mood, 0) / history.length;
    const avgSteps = history.reduce((sum, day) => sum + day.steps, 0) / history.length;
    const avgSleep = history.reduce((sum, day) => sum + day.sleep, 0) / history.length;
    const avgExercise = history.reduce((sum, day) => sum + day.exercise, 0) / history.length;
    
    const lastThree = history.slice(-3);
    const recentMood = lastThree.reduce((sum, day) => sum + day.mood, 0) / 3;
    const recentSteps = lastThree.reduce((sum, day) => sum + day.steps, 0) / 3;
    const recentSleep = lastThree.reduce((sum, day) => sum + day.sleep, 0) / 3;
    
    const bestDay = history.reduce((best, day) => day.mood > best.mood ? day : best, history[0]);
    const worstDay = history.reduce((worst, day) => day.mood < worst.mood ? day : worst, history[0]);
    
    const highStepDays = history.filter(d => d.steps >= 7000);
    const lowStepDays = history.filter(d => d.steps < 7000);
    const highStepMood = highStepDays.length > 0 ? highStepDays.reduce((sum, d) => sum + d.mood, 0) / highStepDays.length : avgMood;
    const lowStepMood = lowStepDays.length > 0 ? lowStepDays.reduce((sum, d) => sum + d.mood, 0) / lowStepDays.length : avgMood;
    
    const goodSleepDays = history.filter(d => d.sleep >= 7);
    const poorSleepDays = history.filter(d => d.sleep < 7);
    const goodSleepMood = goodSleepDays.length > 0 ? goodSleepDays.reduce((sum, d) => sum + d.mood, 0) / goodSleepDays.length : avgMood;
    const poorSleepMood = poorSleepDays.length > 0 ? poorSleepDays.reduce((sum, d) => sum + d.mood, 0) / poorSleepDays.length : avgMood;
    
    if ((msg.includes('mood') || msg.includes('feel')) && (msg.includes('low') || msg.includes('bad'))) {
      let response = `Let me analyze your data...\n\n`;
      const lowSleepDays = history.filter(d => d.sleep < 6.5).length;
      
      if (lowSleepDays >= 3) {
        response += `😴 SLEEP: You've had ${lowSleepDays} days with < 6.5h sleep. This is likely affecting your mood.\n\n`;
      }
      
      if (bestDay && worstDay) {
        response += `📊 Your BEST mood (${bestDay.mood.toFixed(1)}) was on a day with ${Math.round(bestDay.steps)} steps and ${bestDay.sleep.toFixed(1)}h sleep.\n`;
        response += `Your WORST mood (${worstDay.mood.toFixed(1)}) was with ${Math.round(worstDay.steps)} steps and ${worstDay.sleep.toFixed(1)}h sleep.`;
      }
      
      return response;
    }
    
    if (msg.includes('week') || msg.includes('analyze')) {
      return `📊 YOUR 7-DAY SUMMARY\n\nAvg Mood: ${avgMood.toFixed(1)}/5\nAvg Steps: ${Math.round(avgSteps)}\nAvg Sleep: ${avgSleep.toFixed(1)}h\nAvg Exercise: ${Math.round(avgExercise)}min\n\n${highStepDays.length > 0 ? `💡 You feel ${((highStepMood - lowStepMood) / avgMood * 100).toFixed(0)}% better on high-step days!` : ''}`;
    }
    
    return "I can analyze YOUR data! Try:\n💭 'Why is my mood low?'\n📈 'Analyze my week'\n🎯 'What should I focus on?'";
  };

  const sendMessage = () => {
    if (!userInput.trim()) return;
    
    const newMessages = [
      ...chatMessages,
      { role: 'user', message: userInput }
    ];
    
    setChatMessages(newMessages);
    setUserInput('');
    
    setTimeout(() => {
      const botResponse = generateChatResponse(userInput);
      setChatMessages([...newMessages, { role: 'bot', message: botResponse }]);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMoodEmoji = (mood) => {
    if (mood <= 1.5) return "😢";
    if (mood <= 2.5) return "😕";
    if (mood <= 3.5) return "😐";
    if (mood <= 4.5) return "🙂";
    return "😊";
  };

  // If not logged in, show login page
  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Connect</h1>
          <p>Your physical health, your mental wellness</p>
        </header>

        {/* Navigation */}
        <div className="nav-bar">
          <button 
            className={currentPage === 'today' ? 'active' : ''}
            onClick={() => setCurrentPage('today')}
          >
            Today
          </button>
          <button 
            className={currentPage === 'history' ? 'active' : ''}
            onClick={() => setCurrentPage('history')}
          >
            History
          </button>
          <button 
            className={currentPage === 'weekly' ? 'active' : ''}
            onClick={() => setCurrentPage('weekly')}
          >
            Weekly Report
          </button>
          <button 
            className={currentPage === 'goals' ? 'active' : ''}
            onClick={() => setCurrentPage('goals')}
          >
            Goals
          </button>
          <button 
            className={currentPage === 'social' ? 'active' : ''}
            onClick={() => setCurrentPage('social')}
          >
            Friends
          </button>
          <button onClick={() => {
            localStorage.removeItem('userEmail');
            setUser(null);
          }}>
            Logout
          </button>
        </div>

        {/* Show different pages */}
        {currentPage === 'weekly' && <WeeklyReport history={history} />}
        {currentPage === 'goals' && <Goals goals={goals} setGoals={setGoals} longTermGoals={longTermGoals} setLongTermGoals={setLongTermGoals} />}
        {currentPage === 'social' && <Social user={user} friends={friends} setFriends={setFriends} challenges={challenges} setChallenges={setChallenges} />}

        {/* Today view - Reminders at top, then main content */}
        {currentPage === 'today' && (
          <>
            {/* Reminders at the top */}
            <Reminders goals={goals} challenges={challenges} currentDay={currentDay} friends={friends} setFriends={setFriends} longTermGoals={longTermGoals} />

            {/* Main content below */}
            <div className="card stats-card">
              <h2>Today's Activity</h2>
              <div className="stat-row">
                <span className="stat-label">Steps</span>
                <span className="stat-value">{Math.round(currentDay.steps).toLocaleString()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Sleep</span>
                <span className="stat-value">{currentDay.sleep.toFixed(1)}h</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Active Minutes</span>
                <span className="stat-value">{Math.round(currentDay.exercise)}min</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Mood</span>
                <span className="stat-value mood-display">
                  {getMoodEmoji(currentDay.mood)} {currentDay.mood.toFixed(1)}/5
                </span>
              </div>
            </div>

            <TrendGraphs history={history} />

            <div className="simulate-section">
              <h3>Simulate Different Days</h3>
              <div className="button-group">
                <button 
                  onClick={() => setCurrentDay({ date: new Date().toISOString().split('T')[0], steps: 1500, sleep: 5, exercise: 0, mood: 2 })}
                  className="sim-button low"
                >
                  Low Activity Day
                </button>
                <button 
                  onClick={() => setCurrentDay({ date: new Date().toISOString().split('T')[0], steps: 6000, sleep: 7, exercise: 25, mood: 3.5 })}
                  className="sim-button medium"
                >
                  Average Day
                </button>
                <button 
                  onClick={() => setCurrentDay({ date: new Date().toISOString().split('T')[0], steps: 10000, sleep: 8, exercise: 45, mood: 4.5 })}
                  className="sim-button high"
                >
                  Active Day
                </button>
              </div>
            </div>
          </>
        )}

        {/* Your existing History view */}
        {currentPage === 'history' && (
          <div className="card history-card">
            <h2>7-Day History</h2>
            <div className="history-table">
              {history.slice().reverse().map((day, index) => (
                <div key={index} className="history-row">
                  <div className="history-date">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="history-stats">
                    <span>{Math.round(day.steps)} steps</span>
                    <span>{day.sleep.toFixed(1)}h sleep</span>
                    <span>{Math.round(day.exercise)}min active</span>
                  </div>
                  <div className="history-mood">
                    {getMoodEmoji(day.mood)} {day.mood.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat button */}
        <button className="chat-toggle" onClick={() => setShowChat(!showChat)}>
          {showChat ? '✕ Close Chat' : '💬 Chat with me'}
        </button>

        {showChat && (
          <div className="chatbot-container">
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <div className="message-content">{msg.message}</div>
                </div>
              ))}
            </div>
            <div className="chat-input-container">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your health..."
                rows="2"
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;