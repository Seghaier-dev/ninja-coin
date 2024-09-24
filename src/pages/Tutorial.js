import React from 'react';
import { Link } from 'react-router-dom';
import './Tutorial.css'; 

const Tutorial = () => {
  return (
    <div className="tutorial-container">
      <h1>Welcome to Ninja Coin</h1>

      <div className="tutorial-step">
        <h2>Step 1: Collect Coins</h2>
        <p>Earn coins by completing tasks like following social media pages, downloading apps, or other activities.</p>
      </div>

      <div className="tutorial-step">
        <h2>Step 2: Use Coins</h2>
        <p>Use your coins to unlock rewards or participate in special events like airdrops.</p>
      </div>

      <div className="tutorial-step">
        <h2>Step 3: Redeem Rewards</h2>
        <p>Visit the rewards store to redeem your coins for exciting prizes!</p>
      </div>

      <Link to="/">
        <button>Get Started</button>
      </Link>
    </div>
  );
}

export default Tutorial;
