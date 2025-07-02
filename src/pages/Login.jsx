// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ name: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', credentials);

      // ✅ Store JWT and name in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', credentials.name); // ✅ Use entered name

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Username"
          onChange={handleChange}
          value={credentials.name}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={credentials.password}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
};

export default Login;
