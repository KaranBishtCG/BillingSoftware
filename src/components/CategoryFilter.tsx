export type ProductCategory = 'Taps' | 'Showers' | 'Wash Basin' | 'Drain Covers';

export type CategoryOption = ProductCategory | 'all';

const CATEGORIES: { value: CategoryOption; label: string }[] = [
  { value: 'all',          label: 'All Products' },
  { value: 'Taps',         label: 'Taps' },
  { value: 'Showers',      label: 'Showers' },
  { value: 'Wash Basin',   label: 'Wash Basin' },
  { value: 'Drain Covers', label: 'Drain Covers' },
];

interface CategoryFilterProps {
  selected: CategoryOption;
  onChange: (cat: CategoryOption) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map(cat => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            selected === cat.value
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}