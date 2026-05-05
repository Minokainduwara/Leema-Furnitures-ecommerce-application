// src/components/PaymentPanel.tsx
import { useState } from 'react'
import InstallmentPlanner from './InstallmentPlanner'

type Props = { price: number }

const PaymentPanel = ({ price }: Props) => {
  const discountedPrice = price - price * 0.15
  const [paymentOption, setPaymentOption] = useState<'full' | 'installment'>('full')

  return (
    <div className="border-2 border-teal-400 bg-orange-400 rounded-lg p-5">
      {/* Real Price */}
      <p className="text-right font-semibold text-white-700 mb-2">
        PRICE: <span className="text-white">LKR {price.toLocaleString()}.00</span>
      </p>


      <div className="text-center mb-4">
        <p className="font-bold text-xl">Full Payment</p>
        <p className="text-black font-semibold">With 15% Discount</p>
        <div className="bg-gray-200 text-black font-bold text-lg py-2 px-4 rounded mt-2">
          LKR {discountedPrice.toLocaleString()}.00
        </div>
      </div>

      {/* Installment Planner */}
      <InstallmentPlanner price={price} />

      {/* Payment Option Toggle */}
      <div className="flex gap-6 justify-center my-3 text-sm font-medium">
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="full"
            checked={paymentOption === 'full'}
            onChange={() => setPaymentOption('full')}
          />
          Full Payment
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="payment"
            value="installment"
            checked={paymentOption === 'installment'}
            onChange={() => setPaymentOption('installment')}
          />
          Installment Planner
        </label>
      </div>

      {/* Buy Buttons */}
      <div className="flex items-center justify-between mt-3">
        <span className="font-semibold">LKR {price.toLocaleString()}.00</span>
        <div className="flex gap-2">
          <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
            BUY NOW
          </button>
          <button className="bg-gray-800 text-white px-4 py-2 rounded font-bold hover:bg-gray-900">
            ADD CART
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPanel