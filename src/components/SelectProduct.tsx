import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getProductsAsPerSelectedBuyer, CATEGORY_TO_ID } from '../services/billingService';
import type { ProductPrice, BillItem } from '../services/billingService';
import { CategoryFilter, type CategoryOption } from './CategoryFilter';
import { ProductCard } from './ProductCard';

interface Props {
  buyerId: number;
  billItems: BillItem[];
  onAdd: (p: ProductPrice) => void;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
}

export function SelectProduct({ buyerId, billItems, onAdd, onRemove, onQuantityChange }: Props) {
  const [products, setProducts] = useState<ProductPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CategoryOption>('all');
  const [search, setSearch] = useState('');

  const fetchProducts = async (cat: CategoryOption) => {
    setLoading(true);
    try {
      const categoryId = cat === 'all' ? undefined : CATEGORY_TO_ID[cat];
      const data = await getProductsAsPerSelectedBuyer({ buyerId, categoryId });
      setProducts(data.productPrices);
    } catch {
      toast.error('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts('all');
  }, [buyerId]);

  const handleCategoryChange = (cat: CategoryOption) => {
    setCategory(cat);
    fetchProducts(cat);
  };

  const filtered = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase()) ||
    p.productId.toString().includes(search)
  );

  const totalItems = billItems.reduce((s, i) => s + i.quantity, 0);
  const totalValue = billItems.reduce((s, i) => s + i.totalPrice, 0);

  return (
    <div>
      <div className="mb-3">
        <CategoryFilter selected={category} onChange={handleCategoryChange} />
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-2 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
          {filtered.length === 0
            ? <div className="col-span-2 text-center py-10 text-gray-400">No products found</div>
            : filtered.map(p => (
                <ProductCard
                  key={p.productId}
                  product={p}
                  billItem={billItems.find(i => i.product.productId === p.productId)}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onQuantityChange={onQuantityChange}
                />
              ))
          }
        </div>
      )}

      {billItems.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex justify-between text-sm">
          <span className="text-blue-700"><strong>{totalItems}</strong> item(s) selected</span>
          <span className="font-bold text-blue-800">₹{totalValue.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
}