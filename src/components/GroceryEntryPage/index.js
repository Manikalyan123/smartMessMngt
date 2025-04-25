import React, {useEffect, useState} from 'react'
import './index.css'
import {useNavigate} from 'react-router-dom'

// Sample grocery items
const groceryItems = [
  {id: '1', name: 'Rice', unit: 'kg'},
  {id: '2', name: 'Wheat Flour', unit: 'kg'},
  {id: '3', name: 'Oil', unit: 'litre'},
  {id: '4', name: 'Sugar', unit: 'kg'},
  {id: '5', name: 'Salt', unit: 'kg'},
]

const GroceryEntryPage = () => {
  const navigate = useNavigate()

  const [entries, setEntries] = useState([])
  const [selectedItemId, setSelectedItemId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    const savedEntries =
      JSON.parse(localStorage.getItem('groceryEntries')) || []
    setEntries(savedEntries)
  }, [])

  useEffect(() => {
    localStorage.setItem('groceryEntries', JSON.stringify(entries))
  }, [entries])

  const handleAddOrUpdate = () => {
    const item = groceryItems.find(i => i.id === selectedItemId)
    const qty = parseFloat(quantity)
    const pr = parseFloat(price)

    if (!item) {
      alert('Please select an item')
      return
    }

    if (Number.isNaN(qty) || qty <= 0) {
      alert('Enter a valid quantity')
      return
    }

    if (Number.isNaN(pr) || pr <= 0) {
      alert('Enter a valid price')
      return
    }

    const amount = qty * pr
    const newEntry = {
      id: editId || `${item.id}-${Date.now()}`, // use existing ID if editing
      name: item.name,
      unit: item.unit,
      quantity: qty,
      price: pr,
      amount: amount.toFixed(2),
      date: new Date().toLocaleDateString(),
    }

    if (editId) {
      setEntries(entries.map(e => (e.id === editId ? newEntry : e)))
      setEditId(null)
    } else {
      setEntries([...entries, newEntry])
    }

    setSelectedItemId('')
    setQuantity('')
    setPrice('')
  }

  const handleDelete = id => {
    const updated = entries.filter(entry => entry.id !== id)
    setEntries(updated)
  }

  const handleEdit = entry => {
    setSelectedItemId(groceryItems.find(i => i.name === entry.name)?.id || '')
    setQuantity(entry.quantity)
    setPrice(entry.price)
    setEditId(entry.id)
  }

  const subtotal = entries.reduce(
    (acc, item) => acc + parseFloat(item.amount),
    0,
  )

  return (
    <div className="grocery-entry">
      <button className="btn back-btn" onClick={() => navigate('/dashboard')}>
        ← Back
      </button>
      <h2>Grocery Entry</h2>

      <div className="form-group">
        <label htmlFor="item">Select Item</label>
        <select
          id="item"
          value={selectedItemId}
          onChange={e => setSelectedItemId(e.target.value)}
        >
          <option value="">-- Choose an item --</option>
          {groceryItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price (₹)</label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          placeholder="Enter price per unit"
        />
      </div>

      <button className="btn add-btn" onClick={handleAddOrUpdate}>
        {editId ? 'Update Item' : 'Add Item'}
      </button>

      <table className="grocery-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Amount (₹)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(entry => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>
                {entry.quantity} {entry.unit}
              </td>
              <td>₹{entry.amount}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(entry)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(entry.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {entries.length > 0 && (
            <tr>
              <td colSpan="2" style={{textAlign: 'right', fontWeight: 'bold'}}>
                Subtotal
              </td>
              <td colSpan="2" style={{fontWeight: 'bold'}}>
                ₹{subtotal.toFixed(2)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default GroceryEntryPage
