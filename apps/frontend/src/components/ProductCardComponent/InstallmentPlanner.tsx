// src/components/InstallmentPlanner.tsx
import { useState } from 'react'

type Props = { price: number }

const InstallmentPlanner = ({ price }: Props) => {
  const [downPayment, setDownPayment] = useState('')
  const [months, setMonths] = useState('')
  const [monthly, setMonthly] = useState<number | null>(null)
  const [error, setError] = useState('')

  const minDown = price * 0.3   // must be > 30% of full price

  const calculate = () => {
    const dp = parseFloat(downPayment)
    const m = parseInt(months)

    if (!dp || !m) return setError('Please fill all fields.')
    if (dp < minDown) return setError(`Down payment must be more than LKR ${minDown.toLocaleString()}.`)
    if (m > 12) return setError('Maximum 12 months.')
    if (m < 1) return setError('Minimum 1 month.')

    setError('')
    const result = (price - dp) / m
    setMonthly(result)
  }

  return (
    <div className="border-t pt-4 mt-2">
      <p className="font-bold text-center mb-3">Installment Planner</p>

      <div className="grid grid-cols-2 gap-2 items-center text-sm mb-2">
        <div>
          <label className="font-medium">Down Payment</label>
          <p className="text-black text-xs">Must be more than 30% of full payment</p>
        </div>
        <input
          type="number"
          value={downPayment}
          onChange={e => setDownPayment(e.target.value)}
          placeholder={`Min: ${minDown.toLocaleString()}`}
          className="border rounded px-2 py-1 w-full text-black bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 items-center text-sm mb-1">
        <label className="font-medium">Payment Duration</label>
        <div>
          <input
            type="number"
            value={months}
            onChange={e => setMonths(e.target.value)}
            placeholder="Months (max 12)"
            className="border rounded px-2 py-1 w-full text-black  bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <p className="text-right text-xs text-white-500">Maximum 12 months</p>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      <div className="flex justify-between items-center mt-2">
        <button
          onClick={calculate}
          className="bg-teal-500 text-black px-4 py-1.5 rounded font-semibold hover:bg-teal-600"
        >
          Calculate
        </button>
        {monthly !== null && (
          <div className="text-right">
            <p className="text-xs text-green-700">Monthly payment</p>
            <p className="font-bold text-green-700">LKR {monthly.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default InstallmentPlanner