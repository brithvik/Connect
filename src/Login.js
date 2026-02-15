// Login.js
import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For demo - just store email in localStorage
    localStorage.setItem('userEmail', email);
    onLogin(email);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💙 Connect</h1>
        <p className="tagline">Your physical health, your mental wellness</p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <button type="submit">
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        
        <p className="switch-mode">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? ' Log in' : ' Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;