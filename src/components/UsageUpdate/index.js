import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const UsageUpdate = () => {
  const [entries, setEntries] = useState([])
  const [groupedItems, setGroupedItems] = useState({})
  const [usage, setUsage] = useState({})
  const [remaining, setRemaining] = useState({})
  const [inputValues, setInputValues] = useState({})
  const [lastUpdated, setLastUpdated] = useState({item: null, day: null})
  const navigate = useNavigate()

  const loadData = () => {
    const data = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const storedUsage = JSON.parse(localStorage.getItem('groceryUsage')) || {}
    const storedRemaining =
      JSON.parse(localStorage.getItem('groceryRemaining')) || {}

    const grouped = {}
    data.forEach(({name, quantity, unit, price}) => {
      if (!grouped[name]) {
        grouped[name] = {
          totalQuantity: 0, // Changed from quantity to totalQuantity for clarity
          unit,
          price: price || 0,
          id: `${name}-${Math.random().toString(36).substr(2, 9)}`,
        }
      }
      grouped[name].totalQuantity += parseFloat(quantity)
    })

    const initialInputValues = {}
    Object.keys(grouped).forEach(name => {
      initialInputValues[name] = storedUsage[name]?.days
        ? storedUsage[name].days.map(val => (val > 0 ? val.toString() : ''))
        : Array(31).fill('')
    })

    // Calculate remaining quantities
    const calculatedRemaining = {}
    Object.keys(grouped).forEach(name => {
      const totalUsed =
        storedUsage[name]?.days?.reduce((sum, val) => sum + val, 0) || 0
      calculatedRemaining[name] = grouped[name].totalQuantity - totalUsed
    })

    setEntries(data)
    setGroupedItems(grouped)
    setUsage(storedUsage)
    setRemaining({...storedRemaining, ...calculatedRemaining}) // Merge stored and calculated
    setInputValues(initialInputValues)
  }

  useEffect(() => {
    loadData()

    // Listen for storage updates from other tabs/components
    const handleStorageUpdate = () => {
      loadData()
    }
    window.addEventListener('storage', handleStorageUpdate)
    return () => window.removeEventListener('storage', handleStorageUpdate)
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
    setLastUpdated({item: name, day: day - 1})
  }

  const handleUpdateClick = name => {
    if (!lastUpdated.item || lastUpdated.item !== name) {
      alert('Please modify a value before updating')
      return
    }

    const dayIndex = lastUpdated.day
    const newValue = parseFloat(inputValues[name][dayIndex]) || 0

    setUsage(prev => {
      const newUsage = {...prev}
      if (!newUsage[name]) {
        newUsage[name] = {days: Array(31).fill(0)}
      } else {
        newUsage[name] = {days: [...newUsage[name].days]}
      }
      newUsage[name].days[dayIndex] = newValue
      return newUsage
    })

    const currentRemaining =
      remaining[name] !== undefined
        ? parseFloat(remaining[name])
        : parseFloat(groupedItems[name]?.totalQuantity || 0)

    const previousDayValue = usage[name]?.days[dayIndex] || 0
    const difference = newValue - previousDayValue
    const newRemaining = currentRemaining - difference

    if (newRemaining < 0) {
      alert('This update would make remaining quantity negative')
      return
    }

    setRemaining(prev => ({...prev, [name]: newRemaining}))
    alert(`Successfully updated ${name} for day ${dayIndex + 1}`)
    setLastUpdated({item: null, day: null})
  }

  const calculateAmount = name => {
    const usedQuantity = (usage[name]?.days || Array(31).fill(0)).reduce(
      (sum, val) => sum + val,
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
                ([name, {id, totalQuantity, unit, price}]) => (
                  <tr key={id}>
                    <td>{Object.keys(groupedItems).indexOf(name) + 1}</td>
                    <td>{name}</td>
                    <td>
                      {totalQuantity.toFixed(2)} {unit}
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
                          onFocus={e => e.target.select()}
                        />
                      </td>
                    ))}
                    <td>₹{price.toFixed(2)}</td>
                    <td>₹{calculateAmount(name).toFixed(2)}</td>
                    <td>
                      <button
                        className="update-btn"
                        onClick={() => handleUpdateClick(name)}
                        disabled={lastUpdated.item !== name}
                      >
                        Update
                      </button>
                    </td>
                    <td>
                      {remaining[name] !== undefined
                        ? `${remaining[name].toFixed(2)} ${unit}`
                        : `${totalQuantity.toFixed(2)} ${unit}`}
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
