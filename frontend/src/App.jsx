import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'

export default function App(){
  const token = localStorage.getItem('token')
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={token ? <Dashboard /> : <Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  )
}

function Nav(){
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); navigate('/') }
  return (
    <div className="nav">
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <span style={{fontWeight:700}}>Classic Dashboard</span>
        <span className="small">DeepQ-AI</span>
      </div>
      <div style={{display:'flex', gap:8}}>
        {token ? <button className="btn" onClick={logout}>Logout</button> : null}
        <a className="btn primary" href="https://data.worldbank.org/" target="_blank">World Bank Data</a>
      </div>
    </div>
  )
}
