// RewardDetails.js
import React, { useEffect, useState } from 'react';
import { useLocation, NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { db } from './firebase'; 
import { doc, getDoc } from "firebase/firestore"; 
import { FaCoins, FaBolt, FaUserFriends, FaGift, FaTrophy } from 'react-icons/fa'; 

const RewardDetails = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const { rewardId } = location.state; // Get the reward ID from the location state
  const [reward, setReward] = useState(null);

  useEffect(() => {
    const fetchRewardDetails = async () => {
      const rewardRef = doc(db, "rewards", rewardId); // Reference to the specific reward
      const rewardSnap = await getDoc(rewardRef);

      if (rewardSnap.exists()) {
        setReward({ id: rewardSnap.id, ...rewardSnap.data() });
      } else {
        console.error("No such reward!");
      }
    };

    fetchRewardDetails();
  }, [rewardId]);

  if (!reward) return <p>Loading reward details...</p>;

  return (
    <div className="reward-details-container">
      <button 
        className="redemption-history-btn" 
        onClick={() => navigate("/redemption-history")}
      >
        View Redemption History
      </button>
      <h1>{reward.name}</h1>
      <p>{reward.description}</p>
      <p>Cost: {reward.pointsRequired} coins</p>
      <p>Code: {reward.code}</p> {/* Assuming you have a code field in your reward */}
      <NavLink to="/rewards">Back to Rewards</NavLink>
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

export default RewardDetails;
