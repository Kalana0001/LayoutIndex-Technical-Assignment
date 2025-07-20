import React, { useState } from 'react';
import './AdminLogin.css';
import { Eye, EyeOff, LogIn } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
    alert('Sign-in functionality not implemented in this demo.');
  };

  return (
    <div className="admin-signin-container">
      <div className="admin-header">
        <div className="admin-logo">
          <LogIn size={24} />
        </div>
      </div>

      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">Sign in to manage your e-commerce platform</p>

      <div className="signin-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>

        <div className="demo-credentials-box">
          <div className="demo-cdetails">
            <h3>Demo Credentials:</h3>
            <p>Email: <span>admin@example.com</span></p>
            <p>Password: <span>password</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
