// src/components/PaymentPanel.tsx
import { useState } from 'react'
import InstallmentPlanner from './InstallmentPlanner'

type Props = { price: number }

const PaymentPanel = ({ price }: Props) => {
  const discountedPrice = price - price * 0.15
  const [paymentOption, setPaymentOption] = useState<'full' | 'installment'>('full')

  return (
    <div className="border-2 border-white bg-orange-100 rounded-lg p-5 text-black">
      {/* Real Price */}
      <p className="text-right font-semibold text-black mb-2">
        PRICE: <span className="text-black">LKR {price.toLocaleString()}.00</span>
      </p>

      <div className="text-center mb-4">
        <p className="font-bold text-xl text-black">Full Payment</p>
        <p className="font-semibold text-black">With 15% Discount</p>

        <div className="bg-gray-200 text-black font-bold text-lg py-2 px-4 rounded mt-2">
          LKR {discountedPrice.toLocaleString()}.00
        </div>
      </div>

      {/* Installment Planner */}
      <InstallmentPlanner price={price} />

      {/* Payment Option Toggle */}
      <div className="flex gap-6 justify-center my-3 text-sm font-medium text-black">
        <label className="flex items-center gap-1 cursor-pointer text-black">
          <input
            type="radio"
            name="payment"
            value="full"
            checked={paymentOption === 'full'}
            onChange={() => setPaymentOption('full')}
          />
          Full Payment
        </label>

        <label className="flex items-center gap-1 cursor-pointer text-black">
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
      <div className="flex items-center justify-between mt-3 text-black">
        <span className="font-semibold text-black">
          LKR {price.toLocaleString()}.00
        </span>

        <div className="flex gap-2">
          <button className="bg-orange-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
            BUY NOW
          </button>

          <button className="bg-orange-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
            ADD CART
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPanel