import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllBuyers } from '../services/billingService';
import type { Buyer } from '../services/billingService';
import { BuyerCard } from './BuyerCard';
import { AddBuyerModal } from './AddBuyerModal';

interface Props {
  selectedBuyer: Buyer | null;
  onSelectBuyer: (buyer: Buyer) => void;
}

export function SelectBuyer({ selectedBuyer, onSelectBuyer }: Props) {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddBuyer, setShowAddBuyer] = useState(false);

  useEffect(() => {
    getAllBuyers()
      .then(data => { setBuyers(data); setLoading(false); })
      .catch(() => { toast.error('Failed to load buyers. Please try again.'); setLoading(false); });
  }, []);

  const handleBuyerAdded = (buyer: Buyer) => {
    setBuyers(prev => [buyer, ...prev]);
    onSelectBuyer(buyer);
    setShowAddBuyer(false);
  };

  const filtered = buyers.filter(b =>
    b.partyName?.toLowerCase().includes(search.toLowerCase()) ||
    b.mobile?.includes(search) ||
    (b.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Select Buyer</h2>
          <p className="text-xs text-gray-500">Choose the customer to bill</p>
        </div>
        <button
          onClick={() => setShowAddBuyer(true)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
        >
          + Add Buyer
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search by name, phone, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-3 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Buyer grid */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1">
          {filtered.length === 0
            ? <div className="col-span-2 text-center py-10 text-gray-400">No buyers found</div>
            : filtered.map(b => (
                <BuyerCard key={b.id} buyer={b} isSelected={selectedBuyer?.id === b.id} onSelect={onSelectBuyer} />
              ))
          }
        </div>
      )}

      {/* Add Buyer modal */}
      {showAddBuyer && (
        <AddBuyerModal
          onClose={() => setShowAddBuyer(false)}
          onBuyerAdded={handleBuyerAdded}
        />
      )}
    </div>
  );
}