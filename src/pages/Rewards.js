import React, { useEffect, useState } from 'react';
import './Rewards.css'; 
import { collection, getDocs, doc, updateDoc, getDoc, arrayUnion  } from "firebase/firestore"; 
import { NavLink, useNavigate } from 'react-router-dom'; 
import { FaCoins, FaBolt, FaUserFriends, FaGift, FaTrophy } from 'react-icons/fa'; 
import { db } from './firebase';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [coins, setCoins] = useState(0);
  const user = JSON.parse(localStorage.getItem('telegramUser'));
const userId = user ? user.id : null; // Fetch Telegram user ID if available
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchRewards = async () => {
      const rewardsCollection = collection(db, "rewards");
      const rewardsSnapshot = await getDocs(rewardsCollection);
      const rewardsList = rewardsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRewards(rewardsList);
    };

    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCoins(userSnap.data().coins);
      }
    };

    fetchRewards();
    fetchUserData();
  }, [userId]);

  const redeemReward = async (reward) => {
    if (coins < reward.pointsRequired) {
      toast.error("Not enough coins to redeem this reward.");
      return;
    }
  
    const userDocRef = doc(db, "users", userId);
    try {
      // Update coins and add the redemption to the user's history
      await updateDoc(userDocRef, {
        coins: coins - reward.pointsRequired,
        redemptions: arrayUnion({
          name: reward.name,
          date: new Date().toISOString(),
          pointsSpent: reward.pointsRequired,
          code: reward.code // Assuming rewards have a code
        })
      });
      
      setCoins(prevCoins => prevCoins - reward.pointsRequired); // Update local coins state
      toast.success(`Successfully redeemed: ${reward.name}`);
      
      setTimeout(() => {
        navigate("/reward-details", { state: { rewardId: reward.id } }); // Pass the reward ID
      }, 5000);
    } catch (error) {
      console.error("Error redeeming reward: ", error);
      toast.error("Failed to redeem reward.");
    }
  };
  

  return (
    <div className="rewards-container">
      <h1>Your Rewards</h1>
      <p>You have {coins} coins.</p>
      <button 
  className="redemption-history-btn" 
  onClick={() => navigate("/redemption-history")}
>
  View Redemption History
</button>
      <ToastContainer />

      <div className="rewards-list">
        {rewards.length === 0 ? (
          <p>Loading rewards...</p>
        ) : (
          rewards.map((reward) => (
            <div className="reward-card" key={reward.id}>
              <h2>{reward.name}</h2>
              <p>{reward.description}</p>
              <p>Cost: {reward.pointsRequired} coins</p>
              <button onClick={() => redeemReward(reward)}>Redeem</button>
            </div>
          ))
        )}
      </div>
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

export default Rewards;
