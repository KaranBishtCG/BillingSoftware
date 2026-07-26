import type { Bill } from '../services/billingService';

type BillDocumentProps = {
  bill: Pick<Bill, 'buyer' | 'items'>;
  billNumber?: string;
};

export function BillDocument({ bill, billNumber }: BillDocumentProps) {
  const subtotal = bill.items.reduce((s, i) => s + i.totalPrice, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="bg-white p-6 text-sm">
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-blue-600">Elixir Solutions</h2>
          <p className="text-xs text-gray-400 mt-1">Premium Sanitary & Plumbing Solutions</p>
          <p className="text-xs text-gray-400">GSTIN: 29AAAAA0000A1Z5</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-700">TAX INVOICE</p>
          <p className="text-xs text-gray-500 mt-1">#{billNumber || 'DRAFT'}</p>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase mb-1">Bill To</p>
        <p className="font-bold text-gray-800">{bill.buyer.partyName}</p>
        <p className="text-xs text-gray-500">{bill.buyer.billingAddress}</p>
        <p className="text-xs text-gray-500">{bill.buyer.mobile}</p>
        {bill.buyer.gstin && <p className="text-xs text-gray-500">GSTIN: {bill.buyer.gstin}</p>}
      </div>

      <table className="w-full mb-5 text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left py-2 px-3 font-semibold text-gray-600">#</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-600">Product</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-600">Category</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600">Rate</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600">Qty</th>
            <th className="text-right py-2 px-3 font-semibold text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item, i) => (
            <tr key={item.product.productId} className="border-b border-gray-100">
              <td className="py-2 px-3 text-gray-400">{i + 1}</td>
              <td className="py-2 px-3 text-gray-800">{item.product.productName}</td>
              <td className="py-2 px-3 text-gray-400">{item.product.categoryName}</td>
              <td className="py-2 px-3 text-right">₹{item.product.rate.toLocaleString('en-IN')}</td>
              <td className="py-2 px-3 text-right">{item.quantity}</td>
              <td className="py-2 px-3 text-right font-semibold">₹{item.totalPrice.toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-52 text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">GST (5%)</span><span>₹{Math.round(tax).toLocaleString('en-IN')}</span></div>
          <div className="flex justify-between border-t-2 border-gray-200 pt-2 font-bold text-sm">
            <span>Total</span>
            <span className="text-blue-600">₹{Math.round(total).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 border-t border-gray-100 pt-4">
        Thank you for your business! — Elixir Solutions
      </p>
    </div>
  );
}