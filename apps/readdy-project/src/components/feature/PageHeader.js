"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PageHeader;
function PageHeader(_a) {
    var title = _a.title, searchBar = _a.searchBar, actions = _a.actions, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (<div className={"bg-white border-b border-gray-200 px-8 py-6 h-20 flex items-center ".concat(className)}>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {searchBar}
          {actions}
        </div>
      </div>
    </div>);
}
