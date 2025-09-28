"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FilterBar;
function FilterBar(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (<div className={"bg-white border-b border-gray-200 px-8 py-4 h-16 flex items-center ".concat(className)}>
      <div className="flex items-center justify-between w-full">
        {children}
      </div>
    </div>);
}
