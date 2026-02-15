import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TrendGraphs({ history }) {
  const last7Days = history.slice(-7);
  
  // Normalize data to percentages for better comparison
  const graphData = last7Days.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Mood (out of 5)': day.mood,
    'Steps (thousands)': day.steps / 1000,
    'Sleep (hours)': day.sleep,
  }));

  const moodTrend = calculateTrend(last7Days, 'mood');
  const stepsTrend = calculateTrend(last7Days, 'steps');
  const sleepTrend = calculateTrend(last7Days, 'sleep');

  const motivation = getMotivationalMessage(moodTrend, stepsTrend, sleepTrend, last7Days);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Motivation Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        marginBottom: '24px',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
      }}>
        <span style={{ fontSize: '48px' }}>{motivation.icon}</span>
        <div style={{ flex: 1, color: 'white' }}>
          <h3 style={{ fontSize: '24px', marginBottom: '8px', fontWeight: 700 }}>{motivation.title}</h3>
          <p style={{ fontSize: '15px', lineHeight: 1.5, opacity: 0.95 }}>{motivation.message}</p>
        </div>
      </div>

      {/* Single Graph with 3 Lines */}
      <div style={{
        background: 'white',
        padding: '24px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '8px' }}>
            📊 7-Day Trends
          </h3>
          <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
            <span style={{ color: '#667eea', fontWeight: 600 }}>
              Mood: {moodTrend >= 0 ? '↑' : '↓'} {Math.abs(moodTrend.toFixed(1))}%
            </span>
            <span style={{ color: '#48dbfb', fontWeight: 600 }}>
              Steps: {stepsTrend >= 0 ? '↑' : '↓'} {Math.abs(stepsTrend.toFixed(1))}%
            </span>
            <span style={{ color: '#a29bfe', fontWeight: 600 }}>
              Sleep: {sleepTrend >= 0 ? '↑' : '↓'} {Math.abs(sleepTrend.toFixed(1))}%
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              style={{ fontWeight: 500 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Value', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            
            {/* Mood Line - Purple */}
            <Line 
              type="monotone" 
              dataKey="Mood (out of 5)" 
              stroke="#667eea" 
              strokeWidth={3}
              dot={{ fill: '#667eea', r: 5 }}
              activeDot={{ r: 7 }}
            />
            
            {/* Steps Line - Blue */}
            <Line 
              type="monotone" 
              dataKey="Steps (thousands)" 
              stroke="#48dbfb" 
              strokeWidth={3}
              dot={{ fill: '#48dbfb', r: 5 }}
              activeDot={{ r: 7 }}
            />
            
            {/* Sleep Line - Light Purple */}
            <Line 
              type="monotone" 
              dataKey="Sleep (hours)" 
              stroke="#a29bfe" 
              strokeWidth={3}
              dot={{ fill: '#a29bfe', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function calculateTrend(data, metric) {
  if (data.length < 6) return 0;
  const first3 = data.slice(0, 3).reduce((sum, d) => sum + d[metric], 0) / 3;
  const last3 = data.slice(-3).reduce((sum, d) => sum + d[metric], 0) / 3;
  return ((last3 - first3) / first3) * 100;
}

function getMotivationalMessage(moodTrend, stepsTrend, sleepTrend, data) {
  const avgMood = data.reduce((sum, d) => sum + d.mood, 0) / data.length;
  const recentMood = data.slice(-2).reduce((sum, d) => sum + d.mood, 0) / 2;
  
  if (moodTrend < -10 || recentMood < 2.5) {
    return {
      icon: '💙',
      title: 'You Can Do This!',
      message: "Things are tough right now, but you've made it through hard times before. Small steps count - even a 5-minute walk or calling a friend can help. You're stronger than you think."
    };
  }
  
  if (moodTrend > 10) {
    return {
      icon: '🚀',
      title: "You're on Fire!",
      message: `Your mood is up ${moodTrend.toFixed(0)}% this week! Whatever you're doing, keep it going. You're proving that small daily actions create real change.`
    };
  }
  
  if (stepsTrend < -15) {
    return {
      icon: '👟',
      title: "Let's Get Moving!",
      message: "Your activity has dropped this week. Even 10 minutes of movement can boost your mood by 25%. How about a quick walk right now?"
    };
  }
  
  if (sleepTrend < -10) {
    return {
      icon: '😴',
      title: 'Sleep Matters!',
      message: "You're getting less sleep than usual. Your body needs rest to feel good. Try going to bed 30 minutes earlier tonight - your future self will thank you."
    };
  }
  
  if (avgMood >= 4) {
    return {
      icon: '⭐',
      title: "You're Thriving!",
      message: "Your mood has been consistently good this week. This is what balance looks like. Keep up these healthy habits!"
    };
  }
  
  return {
    icon: '💪',
    title: 'Keep Going!',
    message: "You're tracking your health consistently - that's already a win. Small improvements each week add up to big changes over time."
  };
}

export default TrendGraphs;