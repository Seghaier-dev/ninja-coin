import React, { useState, useEffect } from 'react';
import './Home.css';
import { NavLink } from 'react-router-dom'; // Import NavLink from react-router-dom
import { FaCoins, FaBolt, FaUserFriends, FaGift, FaTrophy } from 'react-icons/fa'; // Import icons
import ninjaCoinLogo from '../images/ninja-coin-logo.png';
import { db } from './firebase'; // Firebase setup
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from "firebase/firestore"; // Firebase Firestore imports

const Home = () => {
  const [coins, setCoins] = useState(0); // User's coins from Firebase
  const [level, setLevel] = useState(1); // User's level from Firebase
  const [collectedCoins, setCollectedCoins] = useState([]); // To track animated coins
  const [levels, setLevels] = useState([]); // To store level thresholds from Firestore

  // Assume we have userId (you'd fetch this after authentication)
  const user = JSON.parse(localStorage.getItem('telegramUser'));
const userId = user ? user.id : null; // Fetch Telegram user ID if available

  // Fetch user's data and level thresholds from Firebase when the component loads
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCoins(userSnap.data().coins);
        setLevel(userSnap.data().level);
      } else {
        console.log("No user document found, initializing...");
        const initialData = { coins: 0, level: 1 }; // Initial data for new users
        await setDoc(userRef, initialData); // Create the document with initial data
        setCoins(0);
        setLevel(1);
      }
    };

    const fetchLevels = async () => {
      const levelsCollection = collection(db, "levels");
      const levelsSnapshot = await getDocs(levelsCollection);
      const levelsData = levelsSnapshot.docs.map(doc => doc.data());
      setLevels(levelsData.sort((a, b) => a.coinsRequired - b.coinsRequired)); // Sort levels by coin requirement
    };

    fetchUserData();
    fetchLevels();
  }, [userId]);

  // Function to simulate coin collection and update Firebase
  const collectCoins = async () => {
    const newCoins = coins + 10; // Add 10 coins per click
    setCoins(newCoins);
    triggerCoinAnimation();

    // Update coins in Firebase
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { coins: newCoins });

    // Check if user qualifies for a level up
    checkForLevelUp(newCoins);
  };

  // Check if the user's coins qualify for a level up
  const checkForLevelUp = async (newCoins) => {
    const nextLevel = levels.find(l => newCoins >= l.coinsRequired && l.level > level);
    if (nextLevel) {
      setLevel(nextLevel.level);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { level: nextLevel.level });
    }
  };

  // Function to simulate coin animation
  const triggerCoinAnimation = () => {
    const newCoin = { id: Date.now() }; // Unique ID for each coin
    setCollectedCoins([...collectedCoins, newCoin]);

    // Remove the coin after animation is done (1 second)
    setTimeout(() => {
      setCollectedCoins(collectedCoins.filter(coin => coin.id !== newCoin.id));
    }, 1000); // 1000ms for the animation duration
  };
  <NavLink to="/login" className="nav-item">
  <span>Login with Telegram</span>
</NavLink>

  return (
    <div className="home-container">
      {/* Header with level info (left) and coin balance (right) */}
      <header className="home-header">
        <div className="level-info">
          <p>Level {level}</p>
          <p>Platinum</p>
        </div>
        <div className="coin-balance">
          <p>{coins} Coins</p>
        </div>
      </header>

      {/* Main logo in the center for coin collection */}
      <div className="logo-container" onClick={collectCoins}>
        <img src={ninjaCoinLogo} alt="Ninja Character" className="ninja-logo" />
      </div>

      {/* Bottom navigation */}
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
}

export default Home;
