import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const UsageUpdate = () => {
  const [entries, setEntries] = useState([])
  const [groupedItems, setGroupedItems] = useState({})
  const [usage, setUsage] = useState({})
  const [remaining, setRemaining] = useState({})
  const [inputValues, setInputValues] = useState({})
  const navigate = useNavigate()

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const storedUsage = JSON.parse(localStorage.getItem('groceryUsage')) || {}
    const storedRemaining =
      JSON.parse(localStorage.getItem('groceryRemaining')) || {}

    setEntries(data)
    setUsage(storedUsage)
    setRemaining(storedRemaining)

    const grouped = {}
    data.forEach(({name, quantity, unit, price}) => {
      if (!grouped[name]) {
        grouped[name] = {
          quantity: 0,
          unit,
          price: price || 0,
          id: `${name}-${Math.random().toString(36).substr(2, 9)}`,
        }
      }
      grouped[name].quantity += parseFloat(quantity)
    })
    setGroupedItems(grouped)

    // Initialize input values with existing usage data
    const initialInputValues = {}
    Object.keys(grouped).forEach(name => {
      initialInputValues[name] = storedUsage[name]?.days
        ? storedUsage[name].days.map(val => (val > 0 ? val.toString() : ''))
        : Array(31).fill('')
    })
    setInputValues(initialInputValues)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    localStorage.setItem('groceryRemaining', JSON.stringify(remaining))
    localStorage.setItem('groceryUsage', JSON.stringify(usage))
    window.dispatchEvent(new CustomEvent('groceryDataUpdated'))
  }, [remaining, usage])

  const handleInputChange = (name, day, value) => {
    setInputValues(prev => {
      const newValues = {...prev}
      if (!newValues[name]) {
        newValues[name] = Array(31).fill('')
      }
      newValues[name] = [...newValues[name]]
      newValues[name][day - 1] = value
      return newValues
    })
  }

  const handleUpdateClick = name => {
    const itemInputValues = inputValues[name] || Array(31).fill('')
    const numericValues = itemInputValues.map(val => parseFloat(val) || 0)
    const totalUsed = numericValues.reduce((sum, val) => sum + val, 0)

    const currentRemaining =
      remaining[name] !== undefined
        ? parseFloat(remaining[name])
        : parseFloat(groupedItems[name]?.quantity || 0)

    if (totalUsed > currentRemaining) {
      alert('Used quantity exceeds remaining quantity')
      return
    }

    const newRemaining = currentRemaining - totalUsed
    setRemaining(prev => ({...prev, [name]: newRemaining}))

    setUsage(prev => {
      const newUsage = {...prev}
      newUsage[name] = {days: numericValues}
      return newUsage
    })

    alert(`Successfully updated usage for ${name}`)
  }

  const calculateAmount = name => {
    const usedQuantity = (inputValues[name] || Array(31).fill('')).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0,
    )
    const pricePerUnit = groupedItems[name]?.price || 0
    return usedQuantity * pricePerUnit
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
        <div className="table-container">
          <table className="usage-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item Name</th>
                <th>Total Qty</th>
                {Array.from({length: 31}, (_, i) => (
                  <th key={`day-${i}`}>{i + 1}</th>
                ))}
                <th>Rate/Unit</th>
                <th>Amount</th>
                <th>Action</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedItems).map(
                ([name, {id, quantity, unit, price}]) => (
                  <tr key={id}>
                    <td>{Object.keys(groupedItems).indexOf(name) + 1}</td>
                    <td>{name}</td>
                    <td>
                      {quantity.toFixed(2)} {unit}
                    </td>
                    {Array.from({length: 31}, (_, i) => (
                      <td key={`${id}-day-${i}`}>
                        <input
                          type="number"
                          min="0"
                          value={inputValues[name] ? inputValues[name][i] : ''}
                          onChange={e =>
                            handleInputChange(name, i + 1, e.target.value)
                          }
                          className="day-input"
                          aria-label={`${name} usage on day ${i + 1}`}
                        />
                      </td>
                    ))}
                    <td>₹{price.toFixed(2)}</td>
                    <td>₹{calculateAmount(name).toFixed(2)}</td>
                    <td>
                      <button
                        className="update-btn"
                        onClick={() => handleUpdateClick(name)}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      {remaining[name] !== undefined
                        ? `${remaining[name].toFixed(2)} ${unit}`
                        : `${quantity.toFixed(2)} ${unit}`}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsageUpdate
