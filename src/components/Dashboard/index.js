import React from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/')
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <button onClick={() => navigate('/grocery-entry')} className="btn">
        Grocery Entry
      </button>
      <button onClick={() => navigate('/usage-update')} className="btn">
        Usage Update
      </button>
      <button onClick={() => navigate('/reports')} className="btn">
        Reports
      </button>
      <button onClick={() => navigate('/bills')} className="btn">
        Bills
      </button>

      <button onClick={handleLogout} className="btn logout">
        Logout
      </button>
    </div>
  )
}

export default Dashboard
