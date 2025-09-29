
interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  serviceCounts: Record<string, number>;
}

export default function CategoryTabs({ categories, selectedCategory, onCategoryChange, serviceCounts }: CategoryTabsProps) {
  const getServiceCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return Object.values(serviceCounts).reduce((sum, count) => sum + count, 0);
    }
    return serviceCounts[categoryId] || 0;
  };

  const allCategories = [
    { id: 'all', name: '전체', color: '#6B7280', order: 0 },
    ...categories.filter(c => c.isActive).sort((a, b) => a.order - b.order)
  ];

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max px-1">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const serviceCount = getServiceCount(category.id);
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm border-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
              }`}
            >
              {category.id !== 'all' && (
                <div
                  className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${isSelected ? 'bg-white/30' : ''}`}
                  style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : category.color }}
                />
              )}
              <span className="text-xs md:text-sm font-medium">{category.name}</span>
              <span
                className={`px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600'
                }`}
              >
                {serviceCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}