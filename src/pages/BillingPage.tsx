import { useState, useEffect } from 'react';
import { fetchBills } from '../services/billingService';
import type { Bill, BillListItem } from '../services/billingService';
import { BillModal } from '../components/BillModal';


export function BillingPage() {
  const [showModal, setShowModal] = useState(false);
  const [bills, setBills] = useState<BillListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills().then(data => { setBills(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">

        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Billing</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-0.5">Manage invoices and bills</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            + Generate Bill
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent Bills</h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-12 sm:py-16">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : bills.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl mb-3">🧾</div>
              <p className="text-gray-500 font-medium">No bills generated yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "Generate Bill" to create your first invoice</p>
            </div>
          ) : (
            <>
              {/* Mobile: card list */}
              <div className="sm:hidden divide-y divide-gray-100">
                {bills.map(bill => (
                  <div key={bill.id} className="px-4 py-3">
                    <div className="flex justify-between items-start mb-0.5">
                      <span className="font-mono text-sm font-semibold text-blue-600">{bill.invoiceNumber}</span>
                      <span className="font-bold text-gray-900">₹{bill.totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-0.5">{bill.partyName}</div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{bill.invoiceDate}</span>
                      <span>GST ₹{bill.taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="py-3 px-6 font-semibold text-gray-600">Invoice No.</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Party Name</th>
                      <th className="py-3 px-6 font-semibold text-gray-600">Date</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 text-right">Subtotal</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 text-right">GST</th>
                      <th className="py-3 px-6 font-semibold text-gray-600 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map(bill => (
                      <tr key={bill.id} className="border-t border-gray-50 hover:bg-gray-50">
                        <td className="py-3 px-6 font-mono text-blue-600">{bill.invoiceNumber}</td>
                        <td className="py-3 px-6 text-gray-800">{bill.partyName}</td>
                        <td className="py-3 px-6 text-gray-500">{bill.invoiceDate}</td>
                        <td className="py-3 px-6 text-right text-gray-700">₹{bill.subTotal.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-6 text-right text-gray-500">₹{bill.taxAmount.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-6 text-right font-semibold text-gray-900">₹{bill.totalAmount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <BillModal
          onClose={() => setShowModal(false)}
          onBillCreated={(bill: Bill) => {
            const listItem: BillListItem = {
              id: Number(bill.id ?? 0),
              invoiceDate: bill.createdAt
                ? new Date(bill.createdAt).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              invoiceNumber: bill.invoiceNumber ?? '',
              partyName: bill.buyer.partyName,
              subTotal: bill.subtotal,
              taxAmount: bill.tax,
              totalAmount: bill.totalAmount,
            };
            setBills(prev => [listItem, ...prev]);
          }}
        />
      )}
    </div>
  );
}