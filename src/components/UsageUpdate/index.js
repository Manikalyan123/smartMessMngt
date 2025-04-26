import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const UsageUpdate = () => {
  const [entries, setEntries] = useState([])
  const [groupedItems, setGroupedItems] = useState({})
  const [usage, setUsage] = useState({})
  const [remaining, setRemaining] = useState({})
  const navigate = useNavigate()

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const storedUsage = JSON.parse(localStorage.getItem('groceryUsage')) || {}
    const storedRemaining =
      JSON.parse(localStorage.getItem('groceryRemaining')) || {}

    setEntries(data)
    setUsage(storedUsage)

    const grouped = {}
    data.forEach(({name, quantity, unit}) => {
      if (!grouped[name]) {
        grouped[name] = {quantity: 0, unit}
      }
      grouped[name].quantity += parseFloat(quantity)
    })
    setGroupedItems(grouped)

    // Initialize remaining with total quantity on load if not already stored
    const initialRemaining = {}
    Object.keys(grouped).forEach(name => {
      initialRemaining[name] =
        storedRemaining[name] !== undefined
          ? parseFloat(storedRemaining[name])
          : parseFloat(grouped[name].quantity)
    })
    setRemaining(initialRemaining)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    localStorage.setItem('groceryRemaining', JSON.stringify(remaining))
    console.log('useEffect - remaining updated in localStorage:', remaining)
  }, [remaining])

  const handleInputChange = (name, value) => {
    setUsage(prev => ({...prev, [name]: value}))
  }

  const handleUpdateClick = name => {
    const usedQty = parseFloat(usage[name])
    const currentRemaining =
      remaining[name] !== undefined
        ? parseFloat(remaining[name])
        : parseFloat(groupedItems[name]?.quantity || 0)

    if (Number.isNaN(usedQty) || usedQty < 0) {
      alert('Enter a valid usage amount.')
      return
    }

    if (usedQty > currentRemaining) {
      alert('Used quantity exceeds the remaining quantity.')
      return
    }

    const newRemainingQty = currentRemaining - usedQty
    setRemaining(prevRemaining => ({...prevRemaining, [name]: newRemainingQty}))
  }

  return (
    <div className="usage-update">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Update Grocery Usage</h2>
      {Object.keys(groupedItems).length === 0 ? (
        <p>No grocery items available.</p>
      ) : (
        <table className="usage-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Total Quantity</th>
              <th>Used Quantity</th>
              <th>Action</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedItems).map(([name, {quantity, unit}]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>
                  {quantity} {unit}
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={usage[name] || ''}
                    onChange={e => handleInputChange(name, e.target.value)}
                    aria-label={`Used quantity for ${name}`}
                  />
                </td>
                <td>
                  <button onClick={() => handleUpdateClick(name)}>
                    Update
                  </button>
                </td>
                <td>
                  {remaining[name] !== undefined
                    ? `${remaining[name]} ${unit}`
                    : `${quantity} ${unit}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default UsageUpdate
