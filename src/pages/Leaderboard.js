import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Add your styles here
import { db } from './firebase'; // Firebase setup
import { collection, getDocs } from 'firebase/firestore'; // Firebase Firestore imports
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import { FaCoins, FaBolt, FaUserFriends, FaGift, FaTrophy } from 'react-icons/fa'; // Import icons

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Sort users by coins in descending order
        const sortedUsers = users.sort((a, b) => b.coins - a.coins);
        setLeaderboardData(sortedUsers);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <ul>
        {leaderboardData.map(user => (
          <li key={user.id}>
            {user.username || "Unknown User"}: {user.coins} Coins
          </li>
        ))}
      </ul>

      {/* Bottom Navigation */}
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

export default Leaderboard;
