import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const UsageUpdate = () => {
  const [entries, setEntries] = useState([])
  const [usage, setUsage] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const usageInitial = {}

    stored.forEach(entry => {
      let qtyValue = 0
      let unit = ''

      if (typeof entry.quantity === 'string' && entry.quantity.includes(' ')) {
        const [value, u] = entry.quantity.split(' ')
        qtyValue = parseFloat(value)
        unit = u
      } else if (typeof entry.quantity === 'number') {
        qtyValue = entry.quantity
        unit = entry.unit || ''
      }

      usageInitial[entry.id] = {
        used: '',
        remaining: qtyValue,
        unit,
      }
    })

    setEntries(stored)
    setUsage(usageInitial)
  }, [])

  const handleUsageChange = (id, value) => {
    setUsage(prev => {
      const used = parseFloat(value)
      const current = prev[id]
      const remaining =
        used > 0 ? Math.max(0, current.remaining - used) : current.remaining

      return {
        ...prev,
        [id]: {
          ...current,
          used: value,
          remaining,
        },
      }
    })
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="usage-update">
      <button onClick={handleBack} className="back-btn">
        ← Back
      </button>
      <h2>Update Grocery Usage</h2>
      {entries.length === 0 ? (
        <p>No grocery entries found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Used</th>
              <th>Remaining</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.name}</td>
                <td>
                  <label
                    htmlFor={`used-${entry.id}`}
                    className="visually-hidden"
                  >
                    Used quantity for {entry.name}
                  </label>
                  <input
                    id={`used-${entry.id}`}
                    type="number"
                    min="0"
                    value={usage[entry.id]?.used || ''}
                    onChange={e => handleUsageChange(entry.id, e.target.value)}
                  />
                </td>
                <td>{usage[entry.id]?.remaining}</td>
                <td>{usage[entry.id]?.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsageUpdate
