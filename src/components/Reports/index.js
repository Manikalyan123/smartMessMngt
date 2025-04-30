import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import './index.css'

const Reports = () => {
  const navigate = useNavigate()
  const [reportData, setReportData] = useState([])

  const loadReportData = () => {
    const entries = JSON.parse(localStorage.getItem('groceryEntries')) || []
    const usage = JSON.parse(localStorage.getItem('groceryUsage')) || {}

    // Calculate total quantity for each item
    const itemTotals = {}
    entries.forEach(item => {
      if (!itemTotals[item.name]) {
        itemTotals[item.name] = {
          quantity: 0,
          unit: item.unit,
          price: item.price || 0,
        }
      }
      itemTotals[item.name].quantity += parseFloat(item.quantity)
    })

    // Calculate used quantity and remaining for each item
    const reportItems = Object.keys(itemTotals).map(name => {
      const usedQty = usage[name]?.days?.reduce((sum, val) => sum + val, 0) || 0
      const remainingQty = itemTotals[name].quantity - usedQty

      return {
        id: `${name}-${Date.now()}`, // Unique ID for each row
        name,
        unit: itemTotals[name].unit,
        totalQuantity: itemTotals[name].quantity,
        usedQuantity: usedQty,
        remainingQuantity: remainingQty,
        price: itemTotals[name].price,
        amount: usedQty * itemTotals[name].price,
      }
    })

    setReportData(reportItems)
  }

  useEffect(() => {
    loadReportData()

    // Update when storage changes
    const handleStorageChange = () => {
      loadReportData()
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="report-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Grocery Stock Report</h2>

      {reportData.length === 0 ? (
        <p>No report data available.</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Item Name</th>
              <th>Total Quantity</th>
              <th>Used Quantity</th>
              <th>Remaining Quantity</th>
              <th>Price/Unit</th>
              <th>Total Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map(item => (
              <tr key={item.id}>
                <td>{reportData.findIndex(i => i.id === item.id) + 1}</td>
                <td>{item.name}</td>
                <td>
                  {item.totalQuantity.toFixed(2)} {item.unit}
                </td>
                <td>
                  {item.usedQuantity.toFixed(2)} {item.unit}
                </td>
                <td>
                  {item.remainingQuantity.toFixed(2)} {item.unit}
                </td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Reports
