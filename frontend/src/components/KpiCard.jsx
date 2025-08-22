import React from 'react'
export default function KpiCard({ title, value, delta, suffix='' }){
  const up = (delta ?? 0) >= 0
  return (
    <div className="card">
      <div className="small">{title}</div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'end'}}>
        <div className="kv">{suffix ? `${value}${suffix}` : value}</div>
        <div className="delta" style={{color: up ? 'var(--good)' : 'var(--bad)'}}>
          {up ? `+${delta}%` : `${delta}%`}
        </div>
      </div>
    </div>
  )
}
