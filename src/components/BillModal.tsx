import { useCallback, useState } from 'react';
import { useBilling } from '../hooks/useBilling';
import { StepIndicator } from './StepIndicator';
import { SelectBuyer } from './SelectBuyer';
import { SelectProduct } from './SelectProduct';
import { GenerateBill } from './GenerateBill';

import type { Bill } from '../services/billingService';
import { IoClose } from 'react-icons/io5';

const STEPS = [
  { label: 'Select Buyer',        description: 'Choose customer' },
  { label: 'Add Products',        description: 'Pick items' },
  { label: 'Preview & Generate',  description: 'Review & save' },
];

interface BillModalProps {
  onClose: () => void;
  onBillCreated: (bill: Bill) => void;
}

export function BillModal({ onClose, onBillCreated }: BillModalProps) {
  const [billSaved, setBillSaved] = useState(false);
  const {
    step, selectedBuyer, billItems, subtotal, tax, totalAmount,
    selectBuyer, addProduct, removeProduct, updateQuantity,
    nextStep, prevStep, reset,
  } = useBilling();

  const handleClose = useCallback(() => { reset(); onClose(); }, [reset, onClose]);

  const handleBillSaved = useCallback((bill: Bill) => {
    setBillSaved(true);
    onBillCreated(bill);
  }, [onBillCreated]);

  const canNext = step === 1 ? !!selectedBuyer : step === 2 ? billItems.length > 0 : false;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Generate Bill</h1>
            <p className="text-xs text-gray-400 mt-0.5">Step {step} of {STEPS.length}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
          ><IoClose/></button>
        </div>

        <div className="px-4 sm:px-6 pt-4 sm:pt-5 flex-shrink-0">
          <StepIndicator currentStep={step} steps={STEPS} />
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-2">
          {step === 1 && <SelectBuyer selectedBuyer={selectedBuyer} onSelectBuyer={selectBuyer} />}
          {step === 2 && selectedBuyer && (
            <SelectProduct
              buyerId={selectedBuyer.id}
              billItems={billItems}
              onAdd={addProduct}
              onRemove={removeProduct}
              onQuantityChange={updateQuantity}
            />
          )}
          {step === 3 && selectedBuyer && (
            <GenerateBill
              buyer={selectedBuyer}
              billItems={billItems}
              subtotal={subtotal}
              tax={tax}
              totalAmount={totalAmount}
              onBillSaved={handleBillSaved}
            />
          )}
        </div>

        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
          {!(step === 3 && billSaved) && (
            <button
              onClick={step === 1 ? handleClose : prevStep}
              className="px-5 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
          )}

          {step < 3 && (
            <button
              onClick={nextStep}
              disabled={!canNext}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {step === 1 ? 'Continue →' : 'Preview Bill →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}