"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryTabs;
function CategoryTabs(_a) {
    var categories = _a.categories, selectedCategory = _a.selectedCategory, onCategoryChange = _a.onCategoryChange, serviceCounts = _a.serviceCounts;
    var getServiceCount = function (categoryId) {
        if (categoryId === 'all') {
            return Object.values(serviceCounts).reduce(function (sum, count) { return sum + count; }, 0);
        }
        return serviceCounts[categoryId] || 0;
    };
    var allCategories = __spreadArray([
        { id: 'all', name: '전체', color: '#6B7280', order: 0 }
    ], categories.filter(function (c) { return c.isActive; }).sort(function (a, b) { return a.order - b.order; }), true);
    return (<div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2 min-w-max px-1">
        {allCategories.map(function (category) {
            var isSelected = selectedCategory === category.id;
            var serviceCount = getServiceCount(category.id);
            return (<button key={category.id} onClick={function () { return onCategoryChange(category.id); }} className={"flex items-center gap-2 px-3 md:px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ".concat(isSelected
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
              {category.id !== 'all' && (<div className={"w-2 h-2 md:w-3 md:h-3 rounded-full ".concat(isSelected ? 'bg-white/30' : '')} style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.3)' : category.color }}/>)}
              <span className="text-xs md:text-sm font-medium">{category.name}</span>
              <span className={"px-1.5 md:px-2 py-0.5 rounded-full text-xs font-medium ".concat(isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-gray-600')}>
                {serviceCount}
              </span>
            </button>);
        })}
      </div>
    </div>);
}
