import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar
} from 'recharts'

export default function Dashboard() {
  const token = localStorage.getItem('token')
  const [country, setCountry] = useState('IND')
  const [year, setYear] = useState('2022')
  const [start, setStart] = useState('2019')
  const [end, setEnd] = useState('2024')
  const [indicator, setIndicator] = useState('SP.POP.TOTL')

  const [line, setLine] = useState([])
  const [analysis, setAnalysis] = useState([])  // state for analysis chart

  const fetchAll = async () => {
    // --- Line chart ---
    const l = await api.authFetch(
      `/api/line/?country=${country}&indicator=${indicator}&start=${start}&end=${end}`,
      token
    )
    setLine(l.series || [])

    // --- Bars chart ---
    const a = await api.authFetch(
      `/api/bars/?country=${country}&year=${year}`, // bars API expects year not start/end
      token
    )
    console.log("Bars API Response:", a)

    if (a && a.bars) {
      // API returns { bars: [ {label, value}, ... ] }
      setAnalysis(a.bars.map(item => ({
        label: item.label,
        value: item.value ? Number(item.value) : 0
      })))
    } else {
      setAnalysis([])
    }
  }

  useEffect(() => { fetchAll() }, [country, year, start, end, indicator])

  return (
    <div className="container">
      <h1>Classic Dashboard</h1>

      {/* Filters */}
      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="field">
            <label>Country</label>
            <select value={country} onChange={e => setCountry(e.target.value)}>
              <option value="IND">IND</option>
              <option value="USA">USA</option>
              <option value="CHN">CHN</option>
              <option value="BRA">BRA</option>
              <option value="ZAF">ZAF</option>
            </select>
          </div>
          <div className="field">
            <label>Year</label>
            <input value={year} onChange={e => setYear(e.target.value)} />
          </div>
          <div className="field">
            <label>Start</label>
            <input value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div className="field">
            <label>End</label>
            <input value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <div className="field" style={{ minWidth: 260 }}>
            <label>Line Indicator</label>
            <select value={indicator} onChange={e => setIndicator(e.target.value)}>
              <option value="SP.POP.TOTL">Population</option>
              <option value="IT.NET.USER.ZS">Internet Users %</option>
              <option value="EG.FEC.RNEW.ZS">Renewable Energy %</option>
              <option value="NY.GDP.MKTP.CD">GDP</option>
            </select>
          </div>
          <button className="btn" onClick={fetchAll}>Refresh</button>
        </div>
      </div>

      {/* Trends Chart */}
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Trends</h2>
        <div className="chart-wrap" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={line}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis Chart */}
      <div className="card" style={{ marginTop: 16 }}>
        <h2>Analysis</h2>
        <div className="chart-wrap" style={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
