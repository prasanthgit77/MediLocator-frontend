import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FindMedicine from './pages/FindMedicine';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AboutMedicine from './pages/AboutMedicine'; // ✅ import
import Emergency from './pages/Emergency';
import './App.css'; // ✅ This should be at the top


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindMedicine />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about-medicine" element={<AboutMedicine />} /> {/* ✅ added */}
        <Route path="/emergency" element={<Emergency />} /> {/* ✅ add */}
      </Routes>
    </Router>
  );
}

export default App;

