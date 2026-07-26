import type { ProductPrice, BillItem } from '../services/billingService';

const CATEGORY_BADGE: Record<string, string> = {
  'Taps':         'bg-blue-100 text-blue-700',
  'Showers':      'bg-purple-100 text-purple-700',
  'Wash Basin':   'bg-orange-100 text-orange-700',
  'Drain Covers': 'bg-green-100 text-green-700',
};

interface ProductCardProps {
  product: ProductPrice;
  billItem: BillItem | undefined;
  onAdd: (p: ProductPrice) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
}

export function ProductCard({ product, billItem, onAdd, onRemove, onQuantityChange }: ProductCardProps) {
  const selected = !!billItem;
  const id = product.productId.toString();
  return (
    <div className={`rounded-xl border-2 transition-all duration-200 overflow-hidden ${
      selected ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
    }`}>
      {product.imagePath && (
        <img
          src={product.imagePath}
          alt={product.productName}
          className="w-full h-28 object-contain"
        />
      )}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{product.productName}</p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_BADGE[product.categoryName] ?? 'bg-gray-100 text-gray-600'}`}>
            {product.categoryName}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-gray-900">₹{product.rate.toLocaleString('en-IN')}</span>
          {selected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => billItem!.quantity === 1 ? onRemove(id) : onQuantityChange(id, billItem!.quantity - 1)}
                className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700"
              >−</button>
              <span className="w-5 text-center text-sm font-semibold">{billItem!.quantity}</span>
              <button
                onClick={() => onQuantityChange(id, billItem!.quantity + 1)}
                className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700"
              >+</button>
            </div>
          ) : (
            <button
              onClick={() => onAdd(product)}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium hover:bg-blue-700 transition-colors"
            >+ Add</button>
          )}
        </div>
      </div>
    </div>
  );
}