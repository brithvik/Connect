import React, { useState } from 'react';
import './Goals.css';

function Goals({ goals, setGoals, longTermGoals, setLongTermGoals }) {
  const [newGoalType, setNewGoalType] = useState('steps');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [showLongTermForm, setShowLongTermForm] = useState(false);
  const [newLongTermGoal, setNewLongTermGoal] = useState({
    title: '',
    target: '',
    current: 0,
    unit: '',
    deadline: ''
  });

  const goalTypes = {
    steps: { emoji: '🚶', label: 'Steps', unit: 'steps' },
    sleep: { emoji: '😴', label: 'Sleep', unit: 'hours' },
    exercise: { emoji: '💪', label: 'Exercise', unit: 'minutes' },
  };

  const addDailyGoal = () => {
    if (!newGoalTarget || newGoalTarget <= 0) {
      alert('Please enter a valid target!');
      return;
    }

    const newGoal = {
      id: Date.now(),
      type: newGoalType,
      target: parseInt(newGoalTarget),
      current: 0,
      emoji: goalTypes[newGoalType].emoji
    };

    setGoals([...goals, newGoal]);
    setNewGoalTarget('');
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoalTarget = (id, newTarget) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, target: parseInt(newTarget) } : goal
    ));
  };

  const addLongTermGoal = () => {
    if (!newLongTermGoal.title || !newLongTermGoal.target || !newLongTermGoal.unit) {
      alert('Please fill in all required fields!');
      return;
    }

    const goal = {
      id: Date.now(),
      title: newLongTermGoal.title,
      target: parseFloat(newLongTermGoal.target),
      current: parseFloat(newLongTermGoal.current) || 0,
      unit: newLongTermGoal.unit,
      deadline: newLongTermGoal.deadline,
      createdAt: new Date().toISOString()
    };

    setLongTermGoals([...longTermGoals, goal]);
    setNewLongTermGoal({ title: '', target: '', current: 0, unit: '', deadline: '' });
    setShowLongTermForm(false);
  };

  const updateLongTermGoalProgress = (id, newCurrent) => {
    setLongTermGoals(longTermGoals.map(goal =>
      goal.id === id ? { ...goal, current: parseFloat(newCurrent) } : goal
    ));
  };

  const deleteLongTermGoal = (id) => {
    setLongTermGoals(longTermGoals.filter(goal => goal.id !== id));
  };

  return (
    <div className="goals-container">
      <h2>Your Goals</h2>

      {/* Daily Goals Section */}
      <div className="goals-section">
        <h3>📅 Daily Goals</h3>
        <p className="section-description">Track your daily targets for steps, sleep, and exercise</p>
        
        <div className="goals-list">
          {goals.map(goal => (
            <div key={goal.id} className="goal-item">
              <div className="goal-header">
                <span className="goal-emoji">{goal.emoji}</span>
                <span className="goal-name">{goalTypes[goal.type].label}</span>
              </div>
              <div className="goal-controls">
                <input
                  type="number"
                  value={goal.target}
                  onChange={(e) => updateGoalTarget(goal.id, e.target.value)}
                  className="goal-input"
                  min="0"
                />
                <span className="goal-unit">{goalTypes[goal.type].unit}</span>
                <button onClick={() => deleteGoal(goal.id)} className="delete-btn">
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="add-goal-section">
          <select
            value={newGoalType}
            onChange={(e) => setNewGoalType(e.target.value)}
            className="goal-select"
          >
            <option value="steps">🚶 Steps</option>
            <option value="sleep">😴 Sleep</option>
            <option value="exercise">💪 Exercise</option>
          </select>
          <input
            type="number"
            placeholder="Target"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            className="goal-input"
            min="0"
          />
          <button onClick={addDailyGoal} className="add-btn">
            + Add Daily Goal
          </button>
        </div>
      </div>

      {/* Long-term Goals Section */}
      <div className="goals-section long-term-section">
        <h3>🎯 Long-term Goals</h3>
        <p className="section-description">Set and track your bigger health milestones</p>

        <div className="long-term-goals-list">
          {longTermGoals.map(goal => {
            const progress = (goal.current / goal.target) * 100;
            const isComplete = goal.current >= goal.target;
            const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

            return (
              <div key={goal.id} className={`long-term-goal-item ${isComplete ? 'complete' : ''}`}>
                <div className="long-term-goal-header">
                  <h4>{goal.title}</h4>
                  <button onClick={() => deleteLongTermGoal(goal.id)} className="delete-btn-small">
                    ✕
                  </button>
                </div>

                <div className="long-term-goal-progress">
                  <div className="progress-info">
                    <span className="progress-current">
                      <input
                        type="number"
                        value={goal.current}
                        onChange={(e) => updateLongTermGoalProgress(goal.id, e.target.value)}
                        className="progress-input"
                        step="0.1"
                      />
                      <span className="unit">{goal.unit}</span>
                    </span>
                    <span className="progress-separator">/</span>
                    <span className="progress-target">{goal.target} {goal.unit}</span>
                  </div>

                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${Math.min(progress, 100)}%`,
                        background: isComplete ? '#2ecc71' : 'linear-gradient(90deg, #B3B3F1 0%, #CF8BA9 100%)'
                      }}
                    />
                  </div>

                  <div className="progress-stats">
                    <span className="progress-percentage">{progress.toFixed(0)}% complete</span>
                    {daysLeft !== null && daysLeft > 0 && (
                      <span className="days-left">⏰ {daysLeft} days left</span>
                    )}
                    {daysLeft !== null && daysLeft <= 0 && (
                      <span className="days-left overdue">⚠️ Deadline passed</span>
                    )}
                  </div>
                </div>

                {isComplete && (
                  <div className="completion-badge">
                    🎉 Goal Achieved!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!showLongTermForm && (
          <button onClick={() => setShowLongTermForm(true)} className="add-long-term-btn">
            + Add Long-term Goal
          </button>
        )}

        {showLongTermForm && (
          <div className="long-term-form">
            <h4>Create New Long-term Goal</h4>
            
            <input
              type="text"
              placeholder="Goal title (e.g., 'Lose 10 pounds', 'Run a 5K')"
              value={newLongTermGoal.title}
              onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, title: e.target.value })}
              className="form-input"
            />

            <div className="form-row">
              <input
                type="number"
                placeholder="Starting value"
                value={newLongTermGoal.current}
                onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, current: e.target.value })}
                className="form-input-small"
                step="0.1"
              />
              <input
                type="number"
                placeholder="Target value"
                value={newLongTermGoal.target}
                onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, target: e.target.value })}
                className="form-input-small"
                step="0.1"
              />
              <input
                type="text"
                placeholder="Unit (lbs, km, etc.)"
                value={newLongTermGoal.unit}
                onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, unit: e.target.value })}
                className="form-input-small"
              />
            </div>

            <input
              type="date"
              value={newLongTermGoal.deadline}
              onChange={(e) => setNewLongTermGoal({ ...newLongTermGoal, deadline: e.target.value })}
              className="form-input"
            />

            <div className="form-actions">
              <button onClick={addLongTermGoal} className="save-btn">
                Save Goal
              </button>
              <button onClick={() => setShowLongTermForm(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;