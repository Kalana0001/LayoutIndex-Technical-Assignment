import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './AdminLogin.css'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { toast ,ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:8180/api/login', { email, password })
      toast.success(res.data.message)
      if (res.status === 200) {
        setTimeout(() => {
          navigate('/admin-panel')
        }, 1000)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="admin-signin-container">
      <ToastContainer position="top-center" autoClose={1000}  />
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
              onChange={e => setEmail(e.target.value)}
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
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
          </div>

          <button type="submit" className="sign-in-button">Sign In</button>
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
  )
}

export default AdminLogin
