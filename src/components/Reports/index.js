import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

const Reports = () => {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState([])

  const loadReportData = () => {
    const entries = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const usage = JSON.parse(localStorage.getItem('groceryUsage')) || {}

    const grouped = {}
    entries.forEach(item => {
      const {name, unit, price, amount, quantity, date} = item
      if (!grouped[name]) {
        grouped[name] = {
          name,
          unit,
          price: parseFloat(price),
          quantity: 0,
          amount: 0,
          dates: [],
          dailyUsage: Array(31).fill(0),
        }
      }
      grouped[name].quantity += parseFloat(quantity)
      grouped[name].amount += parseFloat(amount || 0)
      grouped[name].dates.push(date || new Date().toISOString().split('T')[0])
    })

    Object.keys(usage).forEach(itemName => {
      if (grouped[itemName] && usage[itemName]?.days) {
        grouped[itemName].dailyUsage = usage[itemName].days.map(
          val => parseFloat(val) || 0,
        )
      }
    })

    const finalReport = Object.keys(grouped).map(name => {
      const item = grouped[name]
      const totalUsedQty = item.dailyUsage.reduce((sum, qty) => sum + qty, 0)
      const totalAmount = totalUsedQty * item.price
      const firstUsageDate = item.dates[0] || 'N/A'

      return {
        id: `${name}-${Math.random().toString(36).substr(2, 9)}`, // More robust unique ID
        name,
        unit: item.unit,
        dailyUsage: item.dailyUsage,
        totalUsedQty: totalUsedQty.toFixed(2),
        price: item.price.toFixed(2),
        amount: totalAmount.toFixed(2),
        date: firstUsageDate,
      }
    })

    setReportData(finalReport)
  }

  useEffect(() => {
    loadReportData()

    const handleDataUpdate = () => loadReportData()
    window.addEventListener('groceryDataUpdated', handleDataUpdate)
    return () =>
      window.removeEventListener('groceryDataUpdated', handleDataUpdate)
  }, [])

  return (
    <div className="report-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Grocery Expenditure Report</h2>

      {reportData.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table className="report-table" border="1" cellPadding="5">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item</th>
              {Array.from({length: 31}, (_, i) => (
                <th key={`day-header-${i}`}>{i + 1}</th>
              ))}
              <th>Total</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                {item.dailyUsage.map(usage => {
                  const dayId = `${
                    item.id
                  }-day-${usage}-${Math.random().toString(36).substr(2, 5)}`
                  return (
                    <td key={dayId}>{usage > 0 ? usage.toFixed(2) : '-'}</td>
                  )
                })}
                <td>
                  {item.totalUsedQty} {item.unit}
                </td>
                <td>₹{item.price}</td>
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
