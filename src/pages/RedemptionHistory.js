import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import the Firebase configuration
import { doc, getDoc } from 'firebase/firestore'; // Firebase Firestore imports
import { NavLink } from 'react-router-dom'; // Import NavLink for navigation
import { FaCoins, FaBolt, FaUserFriends, FaGift, FaTrophy } from 'react-icons/fa'; // Import icons
import './RedemptionHistory.css'; // Import any styles if needed

const RedemptionHistory = () => {
  const [redemptions, setRedemptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('telegramUser'));
const userId = user ? user.id : null; // Fetch Telegram user ID if available

  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setRedemptions(userSnap.data().redemptions || []); // Assuming "redemptions" is an array in user document
      } else {
        console.log("No redemption history found for user");
      }

      setLoading(false);
    };

    fetchRedemptionHistory();
  }, [userId]);

  if (loading) {
    return <p>Loading redemption history...</p>;
  }

  return (
    <div className="redemption-history-container">
      <h1>Redemption History</h1>
      {redemptions.length === 0 ? (
        <p className="no-rewards">You haven't redeemed any rewards yet.</p>
      ) : (
        <ul className="redemption-list">
          {redemptions.map((redemption, index) => (
            <li key={index} className="redemption-item">
              <div className="reward-info">
                <h2>{redemption.name}</h2>
                <p className="date">Redeemed on: {new Date(redemption.date).toLocaleDateString()}</p>
                <p className="points">Points Spent: <span>{redemption.pointsSpent}</span></p>
                {redemption.code && <p className="reward-code">Reward Code: {redemption.code}</p>}
                {/* Display all available redemption data */}
                <p className="reward-description">Description: {redemption.description}</p>
                <p className="reward-status">Status: {redemption.status}</p>
                <p className="reward-id">Redemption ID: {redemption.id}</p>
                {/* Add any other available fields from your Firebase document */}
              </div>
            </li>
          ))}
        </ul>
      )}

      <nav className="bottom-nav">
        <NavLink to="/" className="nav-item" activeClassName="active">
          <FaCoins className="nav-icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/task" className="nav-item" activeClassName="active">
          <FaBolt className="nav-icon" />
          <span>Task</span>
        </NavLink>
        <NavLink to="/rewards" className="nav-item" activeClassName="active">
          <FaUserFriends className="nav-icon" />
          <span>Rewards</span>
        </NavLink>
        <NavLink to="/airdrop" className="nav-item" activeClassName="active">
          <FaGift className="nav-icon" />
          <span>Airdrop</span>
        </NavLink>
        <NavLink to="/leaderboard" className="nav-item" activeClassName="active">
          <FaTrophy className="nav-icon" />
          <span>Leaderboard</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default RedemptionHistory;
