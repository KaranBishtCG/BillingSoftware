import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'react-toastify';
import { saveBill } from '../services/billingService';
import InvoiceTemplate from './InvoiceTemplate';
import type { Bill, Buyer, BillItem } from '../services/billingService';

interface Props {
  buyer: Buyer;
  billItems: BillItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
  onBillSaved: (bill: Bill) => void;
}

export function GenerateBill({ buyer, billItems, subtotal, tax, totalAmount, onBillSaved }: Props) {
  const [saving, setSaving]       = useState(false);
  const [exporting, setExporting] = useState(false);
  const [savedBill, setSavedBill] = useState<Bill | null>(null);
  const pdfRef   = useRef<HTMLDivElement>(null);
  const printRef  = useRef<HTMLDivElement>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      const bill = await saveBill({ buyer, items: billItems, subtotal, tax, totalAmount, status: 'generated' });
      setSavedBill(bill);
      onBillSaved(bill);
      toast.success(`Bill ${bill.invoiceNumber} saved successfully!`);
    } catch {
      toast.error('Failed to save the bill. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const captureInvoicePDF = async (ref: React.RefObject<HTMLDivElement | null>): Promise<jsPDF | null> => {
    if (!ref.current) return null;
    setExporting(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      const imgData   = canvas.toDataURL('image/png');
      const pdf       = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW     = pdf.internal.pageSize.getWidth();
      const pageH     = pdf.internal.pageSize.getHeight();
      const imgH      = (canvas.height * pageW) / canvas.width;

      if (imgH <= pageH) {
        pdf.addImage(imgData, 'PNG', 0, 0, pageW, imgH);
      } else {
        let yOffset = 0;
        while (yOffset < imgH) {
          pdf.addImage(imgData, 'PNG', 0, -yOffset, pageW, imgH);
          yOffset += pageH;
          if (yOffset < imgH) pdf.addPage();
        }
      }
      return pdf;
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadPDF = async () => {
    const toastId = toast.loading('Generating PDF…');
    const pdf = await captureInvoicePDF(pdfRef);
    if (!pdf) { toast.dismiss(toastId); return; }
    pdf.save(`${savedBill?.invoiceNumber ?? 'invoice'}.pdf`);
    toast.update(toastId, { render: 'PDF downloaded!', type: 'success', isLoading: false, autoClose: 2500 });
  };

  const handlePrint = async () => {
    const toastId = toast.loading('Preparing print…');
    const pdf = await captureInvoicePDF(printRef);
    if (!pdf) { toast.dismiss(toastId); return; }
    const blobUrl = pdf.output('bloburl');
    const win = window.open(blobUrl as unknown as string, '_blank');
    if (win) setTimeout(() => win.print(), 500);
    toast.update(toastId, { render: 'Print dialog opened!', type: 'success', isLoading: false, autoClose: 2500 });
  };

  const billDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Invoice Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Party</span>
            <span className="font-medium text-gray-800">{buyer.partyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Items selected</span>
            <span className="text-gray-700">{billItems.length} product(s)</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-800">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">GST (5%)</span>
            <span className="text-gray-700">₹{Math.round(tax).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-gray-200 pt-2">
            <span className="text-gray-800">Total</span>
            <span className="text-blue-600">₹{Math.round(totalAmount).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {!savedBill ? (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
        >
          {saving
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</>
            : 'Generate & Save Bill'}
        </button>
      ) : (
        <>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              disabled={exporting}
              className="flex-1 py-2.5 bg-gray-700 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
            >
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={exporting}
              className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
            >
              Download PDF
            </button>
          </div>
        </>
      )}

      <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }} aria-hidden="true">
        <div ref={pdfRef}>
          <InvoiceTemplate
            buyer={buyer}
            billItems={billItems}
            billNumber={savedBill?.invoiceNumber ?? 'DRAFT'}
            billDate={billDate}
            showSignature
          />
        </div>
      </div>

      <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -1 }} aria-hidden="true">
        <div ref={printRef}>
          <InvoiceTemplate
            buyer={buyer}
            billItems={billItems}
            billNumber={savedBill?.invoiceNumber ?? 'DRAFT'}
            billDate={billDate}
          />
        </div>
      </div>
    </div>
  );
}