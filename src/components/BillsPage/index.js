import React, {useState, useEffect, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
// import { Button } from '@/components/ui/button'; //Removed this as it was causing an error
// import { Input } from '@/components/ui/input';  //Removed this as it was causing an error
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';  //Removed this as it was causing an error
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
//   } from "@/components/ui/dialog"  //Removed this as it was causing an error
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"  //Removed this as it was causing an error
// import { AlertCircle } from "lucide-react"  //Removed this as it was causing an error

// interface BillItem {  //Removed this as it was causing an error
//   id: string;
//   description: string;
//   amount: number;
//   date: string;
// }

// type NewBillType = Omit<BillItem, 'id' | 'date'>;  //Removed this as it was causing an error

const BillsPage = () => {
  const navigate = useNavigate()
  const [bills, setBills] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedBills = localStorage.getItem('hostelBills')
      return savedBills ? JSON.parse(savedBills) : []
    }
    return []
  })
  const [newBill, setNewBill] = useState({
    description: '',
    amount: 0,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState(null)
  const [numberOfStudents, setNumberOfStudents] = useState(900) // Default value
  const [numberOfWorkers, setNumberOfWorkers] = useState(0)
  const [workerSalary, setWorkerSalary] = useState(0)
  const [machineRepairCost, setMachineRepairCost] = useState(0)

  // Function to calculate the amount each student owes
  const calculatePerStudentAmount = useCallback(() => {
    if (bills.length === 0 && numberOfStudents === 0) return 0

    const totalGroceryAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
    const totalWorkerSalary = numberOfWorkers * workerSalary
    const totalAmount =
      totalGroceryAmount + totalWorkerSalary + machineRepairCost

    return (totalAmount / numberOfStudents).toFixed(2)
  }, [
    bills,
    numberOfStudents,
    numberOfWorkers,
    workerSalary,
    machineRepairCost,
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hostelBills', JSON.stringify(bills))
      localStorage.setItem('hostelStudents', numberOfStudents.toString())
    }
  }, [bills, numberOfStudents])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStudents = localStorage.getItem('hostelStudents')
      if (savedStudents) {
        setNumberOfStudents(parseInt(savedStudents, 10))
      }
    }
  }, [])

  const handleAddBill = () => {
    if (!newBill.description.trim()) {
      setError('Please enter a description for the bill.')
      return
    }
    if (newBill.amount <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }
    setError(null) // Clear any previous error

    const billToAdd = {
      id: crypto.randomUUID(),
      description: newBill.description,
      amount: newBill.amount,
      date: new Date().toLocaleDateString(),
    }
    setBills(prevBills => [...prevBills, billToAdd])
    setNewBill({description: '', amount: 0}) // Reset form
    setIsDialogOpen(false) // Close dialog
  }

  const handleDeleteBill = id => {
    setBills(prevBills => prevBills.filter(bill => bill.id !== id))
  }

  const perStudentAmount = calculatePerStudentAmount()

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-center">
        Hostel Bills
      </h2>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="students" className="w-full sm:w-auto text-right">
            No. of Students:
          </label>
          <input
            id="students"
            type="number"
            value={numberOfStudents || ''}
            onChange={e =>
              setNumberOfStudents(parseInt(e.target.value, 10) || 0)
            }
            className="w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="workers" className="w-full sm:w-auto text-right">
            No. of Workers:
          </label>
          <input
            id="workers"
            type="number"
            value={numberOfWorkers || ''}
            onChange={e =>
              setNumberOfWorkers(parseInt(e.target.value, 10) || 0)
            }
            className="w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="salary" className="w-full sm:w-auto text-right">
            Worker Salary (₹):
          </label>
          <input
            id="salary"
            type="number"
            value={workerSalary || ''}
            onChange={e => setWorkerSalary(parseFloat(e.target.value) || 0)}
            className="w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="repair" className="w-full sm:w-auto text-right">
            Machine Repair Cost (₹):
          </label>
          <input
            id="repair"
            type="number"
            value={machineRepairCost || ''}
            onChange={e =>
              setMachineRepairCost(parseFloat(e.target.value) || 0)
            }
            className="w-full sm:w-64"
          />
        </div>
      </div>

      <div
        className="dialog"
        style={{display: isDialogOpen ? 'block' : 'none'}}
      >
        <div className="dialog-content">
          <div className="dialog-header">
            <h2 className="dialog-title">Add New Bill</h2>
            <p className="dialog-description">
              Enter the details of the new bill.
            </p>
          </div>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <input
                id="description"
                value={newBill.description}
                onChange={e =>
                  setNewBill({...newBill, description: e.target.value})
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="amount" className="text-right">
                Amount (₹)
              </label>
              <input
                id="amount"
                type="number"
                value={newBill.amount || ''}
                onChange={e =>
                  setNewBill({
                    ...newBill,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          {error && (
            <div className="alert alert-error">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.033 0 1.553-1.027 1.093-1.943l-5-14.509a2.004 2.004 0 00-3.864 0l-5 14.509c-.46 1.916.06 2.943 1.093 2.943z"
                />
              </svg>
              <h3 className="font-bold">Error</h3>
              <div className="alert-description">{error}</div>
            </div>
          )}
          <div className="dialog-footer flex justify-end gap-2">
            <button onClick={() => setIsDialogOpen(false)}>Cancel</button>
            <button onClick={handleAddBill}>Add</button>
          </div>
        </div>
      </div>
      <button className="mb-4 md:mb-6" onClick={() => setIsDialogOpen(true)}>
        Add Bill
      </button>

      <table className="grocery-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount (₹)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map(bill => (
            <tr key={bill.id}>
              <td>{bill.description}</td>
              <td>{bill.amount}</td>
              <td>{bill.date}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBill(bill.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 md:mt-8 p-4 bg-gray-100 rounded-md shadow-md">
        <h3 className="text-lg md:text-xl font-semibold mb-2">
          Bill Distribution
        </h3>
        <p className="text-gray-700">
          Total Grocery Amount: ₹
          {bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
        </p>
        <p className="text-gray-700">
          Total Workers Salary: ₹{(numberOfWorkers * workerSalary).toFixed(2)}
        </p>
        <p className="text-gray-700">
          Total Machine Repair Costs: ₹{machineRepairCost.toFixed(2)}
        </p>
        <p className="text-gray-700">
          Total Amount: ₹
          {(
            bills.reduce((sum, bill) => sum + bill.amount, 0) +
            numberOfWorkers * workerSalary +
            machineRepairCost
          ).toFixed(2)}
        </p>
        <p className="text-gray-700">
          Amount Each Student Owes: ₹{perStudentAmount}
        </p>
        <p className="text-gray-700">
          Amount Each Student Owes (Daily): ₹
          {(parseFloat(perStudentAmount) / 30).toFixed(2)}
        </p>
      </div>
      <div className="mt-6">
        <button onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default BillsPage
