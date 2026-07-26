interface Buyer {
  id: number;
  partyName: string;
  email?: string;
  mobile: string;
  billingAddress: string;
  gstin?: string;
}

interface BuyerCardProps {
  buyer: Buyer;
  isSelected: boolean;
  onSelect: (buyer: Buyer) => void;
}

export function BuyerCard({ buyer, isSelected, onSelect }: BuyerCardProps) {
  return (
    <div
      onClick={() => onSelect(buyer)}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
            {buyer.partyName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">{buyer.mobile}</p>
          <p className="text-xs text-gray-400 mt-0.5 truncate">{buyer.billingAddress}</p>
          {buyer.gstin && <p className="text-xs text-gray-400 mt-0.5">GSTIN: {buyer.gstin}</p>}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
          isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </div>
  );
}