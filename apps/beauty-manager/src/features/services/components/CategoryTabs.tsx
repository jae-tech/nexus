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

export default function CategoryTabs({
  categories,
  selectedCategory,
  onCategoryChange,
  serviceCounts,
}: CategoryTabsProps) {
  const getServiceCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return Object.values(serviceCounts).reduce(
        (sum, count) => sum + count,
        0
      );
    }
    return serviceCounts[categoryId] || 0;
  };

  const allCategories = [
    { id: 'all', name: '전체', color: '#6B7280', order: 0 },
    ...categories.filter((c) => c.isActive).sort((a, b) => a.order - b.order),
  ];

  return (
    <div className="scrollbar-hide overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 px-1">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          const serviceCount = getServiceCount(category.id);

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 transition-all duration-200 md:px-4 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.id !== 'all' && (
                <div
                  className={`h-2 w-2 rounded-full md:h-3 md:w-3 ${isSelected ? 'bg-white/30' : ''}`}
                  style={{
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.3)'
                      : category.color,
                  }}
                />
              )}
              <span className="text-xs font-medium md:text-sm">
                {category.name}
              </span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-medium md:px-2 ${
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
