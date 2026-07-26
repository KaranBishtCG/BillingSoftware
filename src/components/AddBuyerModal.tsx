import { useState } from 'react';
import { toast } from 'react-toastify';
import { IoClose } from 'react-icons/io5';
import { createBuyer } from '../services/billingService';
import type { Buyer, CreateBuyerInput } from '../services/billingService';

interface Props {
  onClose: () => void;
  onBuyerAdded: (buyer: Buyer) => void;
}

const EMPTY: CreateBuyerInput = {
  partyName: '',
  gstin: '',
  mobile: '',
  email: '',
  billingAddress: '',
  state: '',
  city: '',
};

const inputCls =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-gray-400';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

export function AddBuyerModal({ onClose, onBuyerAdded }: Props) {
  const [form, setForm] = useState<CreateBuyerInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  const set =
    (field: keyof CreateBuyerInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partyName.trim()) { toast.error('Party Name is required.'); return; }
    if (!form.mobile.trim())    { toast.error('Mobile number is required.'); return; }
    if (!form.billingAddress.trim()) { toast.error('Billing Address is required.'); return; }

    setSaving(true);
    try {
      const buyer = await createBuyer(form);
      toast.success(`${buyer.partyName} added successfully!`);
      onBuyerAdded(buyer);
    } catch {
      toast.error('Failed to add buyer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Add New Buyer</h2>
            <p className="text-xs text-gray-400 mt-0.5">Fields marked <span className="text-red-500">*</span> are required</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
          >
            <IoClose size={16} />
          </button>
        </div>

        <form
          id="add-buyer-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">

            <div className="sm:col-span-2">
              <label className={labelCls}>Party Name <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                placeholder="e.g. Raj Plumbing Works"
                value={form.partyName}
                onChange={set('partyName')}
              />
            </div>

            <div>
              <label className={labelCls}>GSTIN</label>
              <input
                className={inputCls}
                placeholder="e.g. 29ABCDE1234F1Z5"
                value={form.gstin}
                onChange={set('gstin')}
                maxLength={15}
              />
            </div>

            <div>
              <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
              <input
                className={inputCls}
                placeholder="e.g. 9876543210"
                value={form.mobile}
                onChange={set('mobile')}
                type="tel"
                maxLength={10}
                inputMode="numeric"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Email</label>
              <input
                className={inputCls}
                placeholder="e.g. contact@company.com"
                value={form.email}
                onChange={set('email')}
                type="email"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Billing Address <span className="text-red-500">*</span></label>
              <textarea
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder="e.g. 12, Market Road, Bangalore"
                value={form.billingAddress}
                onChange={set('billingAddress')}
              />
            </div>

            <div>
              <label className={labelCls}>State</label>
              <input
                className={inputCls}
                placeholder="e.g. Karnataka"
                value={form.state}
                onChange={set('state')}
              />
            </div>

            <div>
              <label className={labelCls}>City</label>
              <input
                className={inputCls}
                placeholder="e.g. Bangalore"
                value={form.city}
                onChange={set('city')}
              />
            </div>
          </div>
        </form>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex-shrink-0">
          <button
            type="submit"
            form="add-buyer-form"
            disabled={saving}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {saving
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Adding...</>
              : 'Add Buyer'}
          </button>
        </div>
      </div>
    </div>
  );
}
