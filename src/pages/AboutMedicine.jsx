// src/pages/AboutMedicine.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AboutMedicine.css';
import { useNavigate } from 'react-router-dom';

const AboutMedicine = () => {
  const [medicineName, setMedicineName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch medicine names for suggestions
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/medicines');
        setAllMedicines(res.data);
      } catch (err) {
        console.error('Error fetching medicine names:', err);
      }
    };
    fetchMedicines();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setMedicineName(input);
    setSuggestions(
      input.length > 0
        ? allMedicines.filter((m) => m.toLowerCase().includes(input.toLowerCase()))
        : []
    );
  };

  const handleSuggestionClick = (name) => {
    setMedicineName(name);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    const trimmedName = medicineName.trim().toLowerCase();
    if (!trimmedName) {
      setError('Please enter a medicine name.');
      return;
    }

    setError('');
    setInfo(null);

    try {
      const res = await axios.get(`http://localhost:8080/api/medicine-info/${trimmedName}`);
      setInfo(res.data);
    } catch (err) {
      console.error('🔴 API Error:', err);
      if (err.response?.status === 404) {
        setError('Medicine not found.');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="about-medicine-container">
      <h2>💊 About Medicine</h2>
      <div className="input-group">
        <input
          type="text"
          value={medicineName}
          onChange={handleInputChange}
          placeholder="Enter medicine name"
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(item)}>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="button-group">
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => navigate('/')}>← Back</button>
      </div>

      {error && <p className="error">{error}</p>}

      {info && (
        <div className="medicine-info">
          <h3>{info.name}</h3>
          <p><strong>Uses:</strong> {info.uses}</p>
          <p><strong>Who Can Take:</strong> {info.whoCanTake}</p>
          <p><strong>Who Should Avoid:</strong> {info.whoShouldAvoid}</p>
          <p><strong>Side Effects:</strong> {info.sideEffects}</p>
        </div>
      )}
    </div>
  );
};

export default AboutMedicine;
