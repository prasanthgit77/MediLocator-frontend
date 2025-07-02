// src/pages/Emergency.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Emergency.css';

const Emergency = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allAddresses, setAllAddresses] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const BASE_URL = 'https://medilocator-backend.onrender.com';

  useEffect(() => {
    axios.get(`${BASE_URL}/api/addresses`)
      .then(res => setAllAddresses(res.data))
      .catch(err => console.error('Address fetch error:', err));
  }, []);

  const handleLocationChange = (e) => {
    const input = e.target.value;
    setLocation(input);
    setSuggestions(
      input.length > 0
        ? allAddresses.filter(addr =>
            addr.toLowerCase().includes(input.toLowerCase())
          )
        : []
    );
  };

  const handleSuggestionClick = (value) => {
    setLocation(value);
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults([]);
    try {
      const res = await axios.get(`${BASE_URL}/api/emergency`, {
        params: { type: emergencyType, location }
      });
      if (res.data.length === 0) {
        setError('No hospitals found for this emergency in your area.');
      }
      setResults(res.data);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className="emergency-container">
      <h2>🚑 Emergency Services</h2>
      <form onSubmit={handleSubmit}>
        <label>Type of Emergency:</label>
        <select value={emergencyType} onChange={(e) => setEmergencyType(e.target.value)} required>
          <option value="">Select...</option>
          <option value="roadAccident">Road Accident</option>
          <option value="heartAttack">Heart Attack</option>
          <option value="burnInjury">Burn Injury</option>
          <option value="fracture">Fracture</option>
          <option value="other">Other</option>
        </select>

        <label>Your Location:</label>
        <div className="input-group">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter your current location"
            required
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((sug, idx) => (
                <li key={idx} onClick={() => handleSuggestionClick(sug)}>
                  {sug}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Get Nearby Hospitals</button>
      </form>

      {error && <p className="error">{error}</p>}

      {results.map((hospital, idx) => (
        <div key={idx} className="result-item">
          <h3>{hospital.name}</h3>
          <p><strong>Address:</strong> {hospital.address}</p>
          <p><strong>Phone:</strong> {hospital.phone}</p>
          <button
            className="send-button"
            onClick={() =>
              alert(`Ambulance request sent to ${hospital.name} at ${location}.`)
            }
          >
            Send Ambulance
          </button>
        </div>
      ))}
    </div>
  );
};

export default Emergency;
