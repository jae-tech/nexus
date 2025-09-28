"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBar;
var react_1 = require("react");
function SearchBar(_a) {
    var _b = _a.placeholder, placeholder = _b === void 0 ? "검색어를 입력하세요" : _b, onSearch = _a.onSearch, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = (0, react_1.useState)(''), query = _d[0], setQuery = _d[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        onSearch === null || onSearch === void 0 ? void 0 : onSearch(query);
    };
    var handleClear = function () {
        setQuery('');
        onSearch === null || onSearch === void 0 ? void 0 : onSearch('');
    };
    return (<form onSubmit={handleSubmit} className={"relative ".concat(className)}>
      <div className="relative">
        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
        <input type="text" value={query} onChange={function (e) { return setQuery(e.target.value); }} placeholder={placeholder} className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"/>
        {query && (<button type="button" onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <i className="ri-close-line text-lg"></i>
          </button>)}
      </div>
    </form>);
}
