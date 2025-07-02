// src/pages/FindMedicine.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FindMedicine.css';
import { useNavigate } from 'react-router-dom';

const FindMedicine = () => {
  const [medicine, setMedicine] = useState('');
  const [area, setArea] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [allMedicines, setAllMedicines] = useState([]);
  const [allAreas, setAllAreas] = useState([]);
  const [filteredMedicineSuggestions, setFilteredMedicineSuggestions] = useState([]);
  const [filteredAreaSuggestions, setFilteredAreaSuggestions] = useState([]);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const BASE_URL = 'https://medilocator-backend.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const medRes = await axios.get(`${BASE_URL}/api/medicines`);
        const areaRes = await axios.get(`${BASE_URL}/api/areas`);
        setAllMedicines(medRes.data);
        setAllAreas(areaRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleMedicineChange = (e) => {
    const input = e.target.value;
    setMedicine(input);
    setFilteredMedicineSuggestions(
      input.length > 0
        ? allMedicines.filter((m) => m.toLowerCase().includes(input.toLowerCase()))
        : []
    );
  };

  const handleAreaChange = (e) => {
    const input = e.target.value;
    setArea(input);
    setFilteredAreaSuggestions(
      input.length > 0
        ? allAreas.filter((a) => a.toLowerCase().includes(input.toLowerCase()))
        : []
    );
  };

  const handleSuggestionClick = (type, value) => {
    if (type === 'medicine') {
      setMedicine(value);
      setFilteredMedicineSuggestions([]);
    } else {
      setArea(value);
      setFilteredAreaSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.get(`${BASE_URL}/api/pharmacies`, {
        params: { medicine, area },
      });
      if (res.data.length === 0) {
        setError('No pharmacies found with that medicine in the selected area.');
      }
      setResults(res.data);
    } catch (err) {
      setError('Server error while fetching data.');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <>
      <div className="top-bar">
        <div className="logo">🩺 MediLocator</div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <span>Welcome, {username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/signup')}>Signup</button>
            </>
          )}
        </div>
      </div>

      <div className="container">
        <h1 className="heading">Find the Medicine</h1>
        <form onSubmit={handleSubmit} className="form">
          <label>Medicine Name:</label>
          <div className="input-group">
            <input
              type="text"
              value={medicine}
              onChange={handleMedicineChange}
              autoComplete="off"
              required
            />
            {filteredMedicineSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredMedicineSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick('medicine', item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label>Search Area:</label>
          <div className="input-group">
            <input
              type="text"
              value={area}
              onChange={handleAreaChange}
              autoComplete="off"
              required
            />
            {filteredAreaSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {filteredAreaSuggestions.map((item, idx) => (
                  <li key={idx} onClick={() => handleSuggestionClick('area', item)}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button type="submit" className="search-btn">Find Pharmacies</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="results">
          {results.map((pharmacy, idx) => (
            <div key={idx} className="pharmacy-card">
              <img src={pharmacy.image} alt={pharmacy.name} />
              <h3>{pharmacy.name}</h3>
              <p><strong>Address:</strong> {pharmacy.address}</p>
              <p><strong>Phone:</strong> {pharmacy.phone}</p>
              <p><strong>Rating:</strong> ⭐ {pharmacy.rating}/5</p>
            </div>
          ))}
        </div>

        {/* ✅ Bottom Buttons */}
        <div className="bottom-buttons">
          <button className="bottom-btn" onClick={() => navigate('/emergency')}>🚑 Emergency</button>
          <button className="bottom-btn" onClick={() => navigate('/about-medicine')}>💊 About Medicine</button>
        </div>
      </div>
    </>
  );
};

export default FindMedicine;
