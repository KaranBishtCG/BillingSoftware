import type { Buyer, BillItem } from '../services/billingService';

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const tensArr = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function numToWords(n: number): string {
  n = Math.round(n);
  if (n === 0) return 'Zero';
  if (n < 20) return ones[n];
  if (n < 100) return tensArr[Math.floor(n / 10)] + (n % 10 ? ` ${ones[n % 10]}` : '');
  if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred${n % 100 ? ` ${numToWords(n % 100)}` : ''}`;
  if (n < 100000) return `${numToWords(Math.floor(n / 1000))} Thousand${n % 1000 ? ` ${numToWords(n % 1000)}` : ''}`;
  if (n < 10000000) return `${numToWords(Math.floor(n / 100000))} Lakh${n % 100000 ? ` ${numToWords(n % 100000)}` : ''}`;
  return `${numToWords(Math.floor(n / 10000000))} Crore${n % 10000000 ? ` ${numToWords(n % 10000000)}` : ''}`;
}

function amountInWords(amount: number): string {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  let result = `${numToWords(rupees)} Rupees`;
  if (paise > 0) result += ` and ${numToWords(paise)} Paise`;
  return `${result} Only`;
}

function fmt(n: number): string {
  return Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const COMPANY = {
  name: 'ELIXIR SOLUTIONS',
  tagline: 'Premium Sanitary Ware • Faucets • Bath Fittings • Accessories',
  address: 'Plot No. 45, Sector 18, Gurugram, Haryana – 122015',
  gstin: '06AAAAA0000A1Z5',
  state: 'Haryana',
  stateCode: '06',
  mobile: '+91 98100 00000',
};

interface InvoiceTemplateProps {
  buyer: Buyer;
  billItems: BillItem[];
  billNumber: string;
  billDate: string;
  showSignature?: boolean;
}

const InvoiceTemplate = ({ buyer, billItems, billNumber, billDate, showSignature = false }: InvoiceTemplateProps) => {
  const subtotal = billItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cgst     = subtotal * 0.025;
  const sgst     = subtotal * 0.025;
  const total    = subtotal + cgst + sgst;

  const MIN_ROWS = 8;
  const emptyRows = Math.max(0, MIN_ROWS - billItems.length);

  const s: Record<string, React.CSSProperties> = {
    page:        { width: '794px', fontFamily: 'Arial, sans-serif', fontSize: '11px', color: '#111', backgroundColor: '#fff', border: '1px solid #000' },
    header:      { display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #000' },
    logoBox:     { width: '96px', flexShrink: 0, borderRight: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' },
    logoText:    { fontSize: '22px', fontWeight: 900, color: '#1e3a8a', lineHeight: 1 },
    logoSub:     { fontSize: '9px', color: '#555', marginTop: '4px', textAlign: 'center' as const },
    companyBox:  { flex: 1, textAlign: 'center' as const, padding: '10px 8px 8px' },
    companyBadge:{ fontSize: '9px', fontWeight: 600, color: '#555', letterSpacing: '2px', textTransform: 'uppercase' as const },
    companyName: { fontSize: '22px', fontWeight: 900, color: '#1e3a8a', letterSpacing: '1px', textTransform: 'uppercase' as const, margin: '2px 0' },
    companyMeta: { fontSize: '10px', color: '#444', margin: '1px 0' },
    grid2:       { display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #000' },
    cell:        { padding: '6px 8px' },
    cellBorderR: { padding: '6px 8px', borderRight: '1px solid #000' },
    rowFlex:     { display: 'flex', gap: '4px', marginBottom: '3px', fontSize: '10px' },
    rowLabel:    { minWidth: '130px', fontWeight: 600 },
    sectionHdr:  { backgroundColor: '#e5e7eb', borderBottom: '1px solid #000', borderTop: '1px solid #000', textAlign: 'center' as const, fontWeight: 700, padding: '3px', fontSize: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' as const },
    th:          { border: '1px solid #000', padding: '5px 6px', textAlign: 'left' as const, backgroundColor: '#e5e7eb', fontWeight: 700, fontSize: '10px' },
    thR:         { border: '1px solid #000', padding: '5px 6px', textAlign: 'right' as const, backgroundColor: '#e5e7eb', fontWeight: 700, fontSize: '10px' },
    thC:         { border: '1px solid #000', padding: '5px 6px', textAlign: 'center' as const, backgroundColor: '#e5e7eb', fontWeight: 700, fontSize: '10px' },
    td:          { border: '1px solid #000', padding: '4px 6px', fontSize: '10px' },
    tdR:         { border: '1px solid #000', padding: '4px 6px', textAlign: 'right' as const, fontSize: '10px' },
    tdC:         { border: '1px solid #000', padding: '4px 6px', textAlign: 'center' as const, fontSize: '10px' },
    tdEmpty:     { border: '1px solid #000', padding: '4px 6px', height: '22px', fontSize: '10px' },
    footerGrid:  { display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #000' },
    totalRow:    { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #000', padding: '4px 8px', fontSize: '10px' },
    totalFinal:  { display: 'flex', justifyContent: 'space-between', padding: '5px 8px', fontSize: '11px', fontWeight: 700, backgroundColor: '#e5e7eb' },
    signBox:     { padding: '10px', display: 'flex', flexDirection: 'column' as const, alignItems: 'flex-end' },
    termsBox:    { padding: '8px', borderRight: '1px solid #000' },
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.logoBox}>
          <div>
            <div style={s.logoText}>ES</div>
            <div style={s.logoSub}>Elixir</div>
          </div>
        </div>
        <div style={s.companyBox}>
          <div style={s.companyBadge}>Tax Invoice</div>
          <div style={s.companyName}>{COMPANY.name}</div>
          <div style={s.companyMeta}>{COMPANY.tagline}</div>
          <div style={s.companyMeta}>{COMPANY.address}</div>
          <div style={s.companyMeta}><strong>GSTIN:</strong> {COMPANY.gstin} &nbsp;|&nbsp; <strong>Mobile:</strong> {COMPANY.mobile}</div>
        </div>
      </div>

      <div style={s.grid2}>
        <div style={s.cellBorderR}>
          <div style={s.rowFlex}><span style={s.rowLabel}>Invoice No</span><span>: <strong>{billNumber}</strong></span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>Invoice Date</span><span>: {billDate}</span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>Reverse Charge</span><span>: No</span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>State</span><span>: {COMPANY.state} (Code: {COMPANY.stateCode})</span></div>
        </div>
        <div style={s.cell}>
          <div style={s.rowFlex}><span style={s.rowLabel}>Transportation Mode</span><span>: —</span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>Vehicle No</span><span>: —</span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>Date of Supply</span><span>: {billDate}</span></div>
          <div style={s.rowFlex}><span style={s.rowLabel}>Place of Supply</span><span>: {buyer.state ?? '—'}</span></div>
        </div>
      </div>

      <div style={s.grid2}>
        {(['Details of Receiver (Billed To)', 'Details of Consignee (Shipped To)'] as const).map((label, i) => (
          <div key={label} style={i === 0 ? { borderRight: '1px solid #000' } : {}}>
            <div style={s.sectionHdr}>{label}</div>
            <div style={{ ...s.cell, fontSize: '10px' }}>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>Name</span><span>: {buyer.partyName}</span></div>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>Address</span><span>: {buyer.billingAddress}</span></div>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>City</span><span>: {buyer.city ?? '—'}</span></div>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>State</span><span>: {buyer.state ?? '—'}</span></div>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>GSTIN</span><span>: {buyer.gstin ?? '—'}</span></div>
              <div style={s.rowFlex}><span style={{ minWidth: '70px', fontWeight: 600 }}>Mobile</span><span>: {buyer.mobile}</span></div>
            </div>
          </div>
        ))}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...s.thC, width: '36px' }}>Sr No</th>
            <th style={s.th}>Name of Product / Service</th>
            <th style={{ ...s.thC, width: '60px' }}>Category</th>
            <th style={{ ...s.thC, width: '40px' }}>UOM</th>
            <th style={{ ...s.thC, width: '40px' }}>Qty</th>
            <th style={{ ...s.thR, width: '80px' }}>Rate (₹)</th>
            <th style={{ ...s.thR, width: '90px' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {billItems.map((item, idx) => (
            <tr key={item.product.productId}>
              <td style={s.tdC}>{idx + 1}</td>
              <td style={s.td}>{item.product.productName}</td>
              <td style={s.tdC}>{item.product.categoryName}</td>
              <td style={s.tdC}>PCS</td>
              <td style={s.tdC}>{item.quantity}</td>
              <td style={s.tdR}>{fmt(item.product.rate)}</td>
              <td style={s.tdR}>{fmt(item.totalPrice)}</td>
            </tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, idx) => (
            <tr key={`empty-${idx}`}>
              <td style={s.tdEmpty}>&nbsp;</td>
              <td style={s.tdEmpty}></td>
              <td style={s.tdEmpty}></td>
              <td style={s.tdEmpty}></td>
              <td style={s.tdEmpty}></td>
              <td style={s.tdEmpty}></td>
              <td style={s.tdEmpty}></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={s.footerGrid}>
        <div style={s.termsBox}>
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginBottom: '3px' }}>
              Total Invoice Value (in words)
            </div>
            <div style={{ fontSize: '10px', textTransform: 'capitalize' }}>{amountInWords(total)}</div>
          </div>
          <div style={{ borderTop: '1px solid #000', paddingTop: '6px' }}>
            <div style={{ fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}>Terms & Conditions</div>
            <div style={{ fontSize: '9px', lineHeight: 1.6 }}>
              <div>1. Goods once sold will not be taken back.</div>
              <div>2. Interest @ 18% p.a. will be charged after due date.</div>
              <div>3. Subject to Gurugram jurisdiction only.</div>
            </div>
          </div>
        </div>

        <div>
          <div style={s.totalRow}>
            <span>Total Amount Before Tax</span>
            <span>₹{fmt(subtotal)}</span>
          </div>
          <div style={s.totalRow}>
            <span>CGST @ 2.5%</span>
            <span>₹{fmt(cgst)}</span>
          </div>
          <div style={s.totalRow}>
            <span>SGST @ 2.5%</span>
            <span>₹{fmt(sgst)}</span>
          </div>
          <div style={s.totalFinal}>
            <span>Total Amount</span>
            <span>₹{fmt(total)}</span>
          </div>

          <div style={s.signBox}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#1e3a8a', marginBottom: showSignature ? '8px' : '40px' }}>
              For {COMPANY.name}
            </div>
            {showSignature && (
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#1e3a8a', fontStyle: 'italic', letterSpacing: '3px', marginBottom: '8px' }}>
                ES
              </div>
            )}
            <div style={{ borderTop: '1px solid #000', paddingTop: '4px', fontSize: '10px', fontWeight: 600 }}>
              Authorised Signatory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
