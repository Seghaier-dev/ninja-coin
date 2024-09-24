import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './TelegramLogin.css';
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from './firebase'; // Firebase setup

const TelegramLogin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Memoize the onAuthSuccess function to avoid re-renders
  const onAuthSuccess = useCallback(async (userData) => {
    setUser(userData); // Save the user data locally

    // Store the user data in Firebase
    const userRef = doc(db, "users", userData.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        telegramId: userData.id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        photoUrl: userData.photo_url,
        coins: 0, // Initialize default values
        level: 1,
      });
    }

    // Navigate to dashboard after successful login
    navigate('/Home');
  }, [navigate]);

  useEffect(() => {
    const loadTelegramLoginWidget = () => {
      window.TelegramLoginWidget = {
        dataOnauth: onAuthSuccess, // Automatically log in on success
      };

      const script = document.createElement('script');
      script.src = "https://telegram.org/js/telegram-widget.js?2";
      script.async = true;
      script.setAttribute('data-telegram-login', 'ninjaseifbot'); // Replace with your bot's username
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-auth-url', '/auth/telegram');
      script.setAttribute('data-request-access', 'write');
      document.getElementById('telegram-login').appendChild(script);
    };

    loadTelegramLoginWidget();
  }, [onAuthSuccess]); // Ensure onAuthSuccess is included in the dependency array

  useEffect(() => {
    // Automatically check if the user is already logged in via Telegram
    const savedUser = window.localStorage.getItem('telegramUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      navigate('/Home'); // Redirect if already logged in
    }
  }, [navigate]);

  return (
    <div className="telegram-login-container">
      {!user ? (
        <div id="telegram-login"></div>
      ) : (
        <div>
          <h1>Welcome, {user.first_name}!</h1>
          <p>Logged in with Telegram ID: {user.id}</p>
        </div>
      )}
    </div>
  );
};

export default TelegramLogin;
