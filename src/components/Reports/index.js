import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const Reports = () => {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState([])

  useEffect(() => {
    const entries = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const usage = JSON.parse(localStorage.getItem('groceryUsage')) || {}
    const remaining = JSON.parse(localStorage.getItem('groceryRemaining')) || {}

    // Group items by name and combine their quantities and amounts
    const grouped = {}

    entries.forEach(item => {
      const key = item.name

      if (!grouped[key]) {
        grouped[key] = {
          name: item.name,
          unit: item.unit,
          quantity: 0,
          amount: 0,
          dates: [],
        }
      }

      grouped[key].quantity += item.quantity
      grouped[key].amount += parseFloat(item.amount || 0)
      grouped[key].dates.push(item.date || new Date().toLocaleDateString())
    })

    const finalReport = Object.keys(grouped).map(name => ({
      name,
      unit: grouped[name].unit,
      quantity: grouped[name].quantity,
      amount: grouped[name].amount.toFixed(2),
      used: usage[name] || 0,
      remaining: remaining[name] ?? grouped[name].quantity - (usage[name] || 0),
      date: grouped[name].dates[0] || 'N/A',
    }))

    setReportData(finalReport)
  }, [])

  return (
    <div className="report-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Grocery Report</h2>

      {reportData.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Total Quantity</th>
              <th>Used Quantity</th>
              <th>Remaining Quantity</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(item => (
              <tr key={item.name}>
                <td>{item.date}</td>
                <td>{item.name}</td>
                <td>
                  {item.quantity} {item.unit}
                </td>
                <td>
                  {item.used} {item.unit}
                </td>
                <td>
                  {item.remaining} {item.unit}
                </td>
                <td>₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Reports
