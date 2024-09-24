import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tutorial from './pages/Tutorial';
import Task from './pages/Task';
import Rewards from './pages/Rewards';
import Airdrop from './pages/Airdrop';
import 'bootstrap/dist/css/bootstrap.min.css';
import Leaderboard from './pages/Leaderboard'; // Import the Leaderboard component
import RewardDetails from './pages/RewardDetails';
import RedemptionHistory from './pages/RedemptionHistory'; // Import the component
import TelegramLogin from './pages/TelegramLogin'; // Adjust the path if necessary




function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/task" element={<Task />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/reward-details" element={<RewardDetails />} />
        <Route path="/airdrop" element={<Airdrop />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/redemption-history" element={<RedemptionHistory />} />
        <Route path="/login" element={<TelegramLogin />} />
   
      </Routes>
    </Router>
  );
}

export default App;
