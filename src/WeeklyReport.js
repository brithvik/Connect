import React, { useState } from 'react';
import './WeeklyReport.css';

function WeeklyReport({ history }) {
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, 1 = last week, etc.

  // Group history into weeks
  const groupIntoWeeks = () => {
    if (history.length === 0) return [];
    
    const weeks = [];
    const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentWeek = [];
    let weekStartDate = new Date(sortedHistory[0].date);
    
    sortedHistory.forEach(day => {
      const dayDate = new Date(day.date);
      const daysDiff = Math.floor((weekStartDate - dayDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        currentWeek.push(day);
      } else {
        if (currentWeek.length > 0) {
          weeks.push(currentWeek);
        }
        currentWeek = [day];
        weekStartDate = dayDate;
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = groupIntoWeeks();
  
  if (weeks.length === 0) {
    return (
      <div className="weekly-report">
        <h2>📊 Weekly Report</h2>
        <p>No data yet. Start tracking to see your weekly report!</p>
      </div>
    );
  }

  const currentWeekData = weeks[selectedWeek];

  const calculateWeeklyStats = (weekData) => {
    const totalSteps = weekData.reduce((sum, day) => sum + day.steps, 0);
    const avgSteps = totalSteps / weekData.length;
    const avgSleep = weekData.reduce((sum, day) => sum + day.sleep, 0) / weekData.length;
    const avgExercise = weekData.reduce((sum, day) => sum + day.exercise, 0) / weekData.length;
    const avgMood = weekData.reduce((sum, day) => sum + day.mood, 0) / weekData.length;
    
    const bestDay = weekData.reduce((best, day) => 
      day.mood > best.mood ? day : best, weekData[0]
    );
    
    const worstDay = weekData.reduce((worst, day) => 
      day.mood < worst.mood ? day : worst, weekData[0]
    );

    return {
      totalSteps,
      avgSteps,
      avgSleep,
      avgExercise,
      avgMood,
      bestDay,
      worstDay,
      daysTracked: weekData.length
    };
  };

  const stats = calculateWeeklyStats(currentWeekData);

  const getGrade = (avgMood) => {
    if (avgMood >= 4.5) return { grade: 'A+', emoji: '🌟' };
    if (avgMood >= 4) return { grade: 'A', emoji: '😊' };
    if (avgMood >= 3.5) return { grade: 'B', emoji: '🙂' };
    if (avgMood >= 3) return { grade: 'C', emoji: '😐' };
    if (avgMood >= 2.5) return { grade: 'D', emoji: '😕' };
    return { grade: 'F', emoji: '😢' };
  };

  const gradeInfo = getGrade(stats.avgMood);

  const getWeekLabel = (index) => {
    if (index === 0) return 'This Week';
    if (index === 1) return 'Last Week';
    return `${index + 1} Weeks Ago`;
  };

  const getWeekDateRange = (weekData) => {
    const dates = weekData.map(d => new Date(d.date)).sort((a, b) => a - b);
    const start = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dates[dates.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${start} - ${end}`;
  };

  return (
    <div className="weekly-report">
      <div className="week-header">
        <h2>📊 Weekly Report</h2>
        
        {weeks.length > 1 && (
          <div className="week-selector">
            <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
              {weeks.map((_, index) => (
                <option key={index} value={index}>
                  {getWeekLabel(index)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <p className="week-date-range">{getWeekDateRange(currentWeekData)}</p>
      
      <div className="report-grade">
        <div className="grade-circle">
          <span className="grade-emoji">{gradeInfo.emoji}</span>
          <span className="grade-letter">{gradeInfo.grade}</span>
        </div>
        <div className="grade-text">
          <h3>Overall Wellness Score</h3>
          <p>Based on {stats.daysTracked} days of tracking</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-emoji">🚶</span>
          <h3>{Math.round(stats.totalSteps).toLocaleString()}</h3>
          <p>Total Steps</p>
          <span className="stat-detail">{Math.round(stats.avgSteps)}/day avg</span>
        </div>

        <div className="stat-card">
          <span className="stat-emoji">😴</span>
          <h3>{stats.avgSleep.toFixed(1)}h</h3>
          <p>Avg Sleep</p>
          <span className="stat-detail">{stats.avgSleep >= 7 ? 'Good!' : 'Need more'}</span>
        </div>

        <div className="stat-card">
          <span className="stat-emoji">💪</span>
          <h3>{Math.round(stats.avgExercise)}min</h3>
          <p>Avg Exercise</p>
          <span className="stat-detail">{stats.avgExercise >= 30 ? 'Great!' : 'Keep going'}</span>
        </div>

        <div className="stat-card">
          <span className="stat-emoji">💙</span>
          <h3>{stats.avgMood.toFixed(1)}/5</h3>
          <p>Avg Mood</p>
          <span className="stat-detail">{stats.avgMood >= 4 ? 'Feeling good!' : 'Room to improve'}</span>
        </div>
      </div>

      <div className="comparison-section">
        <h3>Best vs Worst Day</h3>
        <div className="comparison-cards">
          <div className="comparison-card best">
            <span className="comparison-label">🌟 Best Day</span>
            <p className="comparison-date">{new Date(stats.bestDay.date).toLocaleDateString()}</p>
            <div className="comparison-stats">
              <span>{Math.round(stats.bestDay.steps)} steps</span>
              <span>{stats.bestDay.sleep.toFixed(1)}h sleep</span>
              <span>{Math.round(stats.bestDay.exercise)}min exercise</span>
              <span className="mood-highlight">Mood: {stats.bestDay.mood.toFixed(1)}/5 😊</span>
            </div>
          </div>

          <div className="comparison-card worst">
            <span className="comparison-label">😕 Worst Day</span>
            <p className="comparison-date">{new Date(stats.worstDay.date).toLocaleDateString()}</p>
            <div className="comparison-stats">
              <span>{Math.round(stats.worstDay.steps)} steps</span>
              <span>{stats.worstDay.sleep.toFixed(1)}h sleep</span>
              <span>{Math.round(stats.worstDay.exercise)}min exercise</span>
              <span className="mood-highlight">Mood: {stats.worstDay.mood.toFixed(1)}/5</span>
            </div>
          </div>
        </div>
      </div>

      {weeks.length > 1 && selectedWeek > 0 && (
        <div className="week-comparison">
          <h3>📈 Week-over-Week Change</h3>
          <CompareWeeks currentWeek={currentWeekData} previousWeek={weeks[selectedWeek - 1]} />
        </div>
      )}
    </div>
  );
}

function CompareWeeks({ currentWeek, previousWeek }) {
  const calcAvg = (week, metric) => {
    return week.reduce((sum, day) => sum + day[metric], 0) / week.length;
  };

  const currentMood = calcAvg(currentWeek, 'mood');
  const previousMood = calcAvg(previousWeek, 'mood');
  const moodChange = ((currentMood - previousMood) / previousMood * 100).toFixed(1);

  const currentSteps = calcAvg(currentWeek, 'steps');
  const previousSteps = calcAvg(previousWeek, 'steps');
  const stepsChange = ((currentSteps - previousSteps) / previousSteps * 100).toFixed(1);

  return (
    <div className="comparison-grid">
      <div className="change-card">
        <span className="change-emoji">💙</span>
        <h4>Mood</h4>
        <p className={moodChange >= 0 ? 'positive' : 'negative'}>
          {moodChange >= 0 ? '↑' : '↓'} {Math.abs(moodChange)}%
        </p>
      </div>
      <div className="change-card">
        <span className="change-emoji">🚶</span>
        <h4>Steps</h4>
        <p className={stepsChange >= 0 ? 'positive' : 'negative'}>
          {stepsChange >= 0 ? '↑' : '↓'} {Math.abs(stepsChange)}%
        </p>
      </div>
    </div>
  );
}

export default WeeklyReport;