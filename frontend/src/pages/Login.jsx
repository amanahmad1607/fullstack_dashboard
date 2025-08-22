import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const data = await api.login(username, password)
      localStorage.setItem('token', data.access)
      nav('/dashboard')
    }catch(e){ setErr(e.message) }
  }

  return (
    <form onSubmit={submit} className="login">
      <h1>Sign in</h1>
      {err && <div className="card" style={{borderColor:'#ef4444'}}>{err}</div>}
      <div className="card">
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="jane" />
        </div>
        <div className="field" style={{marginTop:8}}>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn primary" style={{marginTop:12, width:'100%'}}>Login</button>
      </div>
    </form>
  )
}
