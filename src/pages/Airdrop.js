import React, { useEffect, useState } from 'react';
import './Airdrop.css'; 
import { FaCoins, FaUserFriends, FaBolt, FaGift, FaTrophy } from 'react-icons/fa'; 
import { NavLink } from 'react-router-dom';
import { db } from './firebase'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

const Airdrop = () => {
  const [airdropData, setAirdropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState(0); // User's coins state
  const user = JSON.parse(localStorage.getItem('telegramUser'));
  const userId = user ? user.id : null; // Fetch Telegram user ID if available

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setCoins(userSnap.data().coins);
      }
    };

    const fetchAirdropData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'airdrops'));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAirdropData(data);
      } catch (error) {
        console.error("Error fetching airdrop data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchAirdropData();
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="airdrop-container">
      <h1>Airdrop Bonus!</h1>
      <div className="coin-balance">
        <p>Your Coins: <span>{coins}</span></p> {/* Updated coin display */}
      </div>

      {airdropData.map(airdrop => (
        <AirdropTask key={airdrop.id} airdrop={airdrop} />
      ))}

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

// AirdropTask component remains the same
const AirdropTask = ({ airdrop }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const airdropDate = new Date(airdrop.date);
    const updateTimer = () => {
      const now = new Date();
      const duration = airdropDate - now;

      if (duration > 0) {
        const days = Math.floor(duration / (1000 * 60 * 60 * 24));
        const hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((duration % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [airdrop.date]);

  return (
    <div className="airdrop-task">
      <p>{airdrop.taskDescription}</p>
      <p>Drop Date: {airdrop.date}</p>
      <p>
        Time left: {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
      </p>
    </div>
  );
};

export default Airdrop;
