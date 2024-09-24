import React, { useEffect, useState } from 'react';
import './Task.css';
import { FaCoins, FaUserFriends, FaBolt, FaGift,FaTrophy } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc, arrayUnion } from "firebase/firestore"; 
import { db } from './firebase';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [coins, setCoins] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]); 
  const user = JSON.parse(localStorage.getItem('telegramUser'));
const userId = user ? user.id : null; // Fetch Telegram user ID if available

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, "tasks");
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    };

    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setCoins(userSnap.data().coins);
        setCompletedTasks(userSnap.data().completedTasks || []); 
      } else {
        console.log("No user document found, initializing...");
        const initialData = { coins: 0, completedTasks: [] };
        await setDoc(userRef, initialData);
        setCoins(0);
      }
    };

    const taskNotification = localStorage.getItem('taskNotification');
    if (taskNotification) {
      toast.info(taskNotification); 
      localStorage.removeItem('taskNotification'); 
    }

    fetchTasks();
    fetchUserData();
  }, [userId]);

  const updateUserBalance = async (coinsToAdd) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { coins: coins + coinsToAdd });
    setCoins(prevCoins => prevCoins + coinsToAdd);
  };

  const markTaskAsCompleted = async (taskId) => {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      completedTasks: arrayUnion(taskId)
    });
    setCompletedTasks(prevCompletedTasks => [...prevCompletedTasks, taskId]);
  };

  const handleTaskCompletion = async (task) => {
    if (completedTasks.includes(task.id)) {
      console.log(`Task already completed: ${task.title}`);
      return; 
    }

    toast.info(`You have completed the task: ${task.title}. We will verify it and add ${task.reward} coins after 5 seconds.`);
    localStorage.setItem('taskNotification', `You have completed the task: ${task.title}. Coins will be added after 5 seconds.`);
    await markTaskAsCompleted(task.id);

    if (task.action === 'follow' || task.action === 'download') {
      const link = document.createElement('a');
      link.href = task.link; 
      link.target = '_blank'; 
      link.rel = 'noopener noreferrer'; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    setTimeout(async () => {
      await updateUserBalance(task.reward);
      console.log(`Coins added after verification for task: ${task.title}`);
    }, 5 * 1000); 
  };

  return (
    <div className="task-container">
      <h1>Complete Your Tasks</h1>
      <header className="task-header">
        <div className="coin-balance">
          <p>{coins} Coins</p>
        </div>
      </header>

      <ToastContainer /> 

      {tasks.length === 0 ? (
        <p>Loading tasks...</p>
      ) : (
        tasks.map((task) => (
          <div className="task-details" key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <button 
              onClick={() => handleTaskCompletion(task)} 
              disabled={completedTasks.includes(task.id)} 
              className={`btn ${completedTasks.includes(task.id) ? 'btn-danger' : 'btn-primary'}`} 
            >
              {completedTasks.includes(task.id) ? "Task Completed" : "Complete Task"}
            </button>
            <div className="coin-reward">
              <p>Earn: <span>{task.reward} Coins</span></p>
            </div>
          </div>
        ))
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

export default Task;
