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
  {id: '6', name: 'Basmati Rice', unit: 'kg'},
  {id: '7', name: 'Sunflower Oil', unit: 'litre'},
  {id: '8', name: 'Brown Sugar', unit: 'kg'},
  {id: '9', name: 'Table Salt', unit: 'kg'},
  {id: '10', name: 'All Purpose Flour', unit: 'kg'},
]

const GroceryEntryPage = ({onEntriesChanged}) => {
  const navigate = useNavigate()

  const [entries, setEntries] = useState([])
  const [searchText, setSearchText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
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
    if (onEntriesChanged) {
      onEntriesChanged(entries)
    }
  }, [entries, onEntriesChanged])

  const handleSearchChange = e => {
    const {value} = e.target
    setSearchText(value)
    setSelectedItem(null) // Clear selected item when search text changes

    if (value.length >= 2) {
      const filteredSuggestions = groceryItems.filter(item =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = item => {
    setSearchText(item.name)
    setSelectedItem(item)
    setSuggestions([])
  }

  const handleAddOrUpdate = () => {
    if (!selectedItem) {
      alert('Please select an item from the suggestions.')
      return
    }

    const qty = parseFloat(quantity)
    const pr = parseFloat(price)

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
      id: editId || `${selectedItem.id}-${Date.now()}`,
      name: selectedItem.name,
      unit: selectedItem.unit,
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

    setSearchText('')
    setSelectedItem(null)
    setQuantity('')
    setPrice('')
    setSuggestions([])
  }

  const handleDelete = id => {
    const updated = entries.filter(entry => entry.id !== id)
    setEntries(updated)
  }

  const handleEdit = entry => {
    const itemToEdit = groceryItems.find(i => i.name === entry.name)
    setSearchText(entry.name)
    setSelectedItem(itemToEdit)
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
        <input
          type="text"
          id="item"
          placeholder="Search for an item..."
          value={searchText}
          onChange={handleSearchChange}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map(item => (
              <li key={item.id} onClick={() => handleSuggestionClick(item)}>
                {item.name}
              </li>
            ))}
          </ul>
        )}
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

      <button
        className="btn add-btn"
        onClick={handleAddOrUpdate}
        disabled={!selectedItem}
      >
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
