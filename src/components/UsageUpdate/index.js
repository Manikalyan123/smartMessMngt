import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const UsageUpdate = () => {
  const [entries, setEntries] = useState([])
  const [groupedItems, setGroupedItems] = useState({})
  const [usage, setUsage] = useState({})
  const [remaining, setRemaining] = useState({})
  const [visibleRemaining, setVisibleRemaining] = useState({})
  const navigate = useNavigate()

  // Load entries & init states
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const storedRemaining =
      JSON.parse(localStorage.getItem('groceryRemaining')) || {}
    const storedUsage = JSON.parse(localStorage.getItem('groceryUsage')) || {}

    setEntries(data)
    setUsage(storedUsage)
    setRemaining(storedRemaining)

    const grouped = {}
    data.forEach(({name, quantity, unit}) => {
      if (!grouped[name]) {
        grouped[name] = {quantity: 0, unit}
      }
      grouped[name].quantity += parseFloat(quantity)
    })
    setGroupedItems(grouped)

    const initialVisibility = {}
    Object.keys(grouped).forEach(name => {
      initialVisibility[name] = true
    })
    setVisibleRemaining(initialVisibility)
  }, [])

  const handleInputChange = (name, value) => {
    setUsage(prev => ({...prev, [name]: value}))
    setVisibleRemaining(prev => ({...prev, [name]: false}))
  }

  const handleUpdateClick = name => {
    const usedQty = parseFloat(usage[name])
    const item = groupedItems[name]

    if (!item) return alert('Item not found.')
    if (Number.isNaN(usedQty) || usedQty < 0)
      return alert('Enter a valid usage amount.')

    const prevRemaining = remaining[name] ?? item.quantity

    if (usedQty > prevRemaining)
      return alert('Used quantity exceeds remaining quantity.')

    const updatedRemainingQty = prevRemaining - usedQty

    const updatedRemaining = {...remaining, [name]: updatedRemainingQty}
    const updatedUsage = {...usage, [name]: ' '}

    setRemaining(updatedRemaining)
    setUsage(updatedUsage)
    setVisibleRemaining(prev => ({...prev, [name]: true}))

    // Persist in localStorage
    localStorage.setItem('groceryRemaining', JSON.stringify(updatedRemaining))
    localStorage.setItem('groceryUsage', JSON.stringify(updatedUsage))
    return ''
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
                  {visibleRemaining[name]
                    ? `${remaining[name] ?? quantity} ${unit}`
                    : `${remaining[name] ?? quantity} ${unit}`}
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
