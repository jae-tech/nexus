"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Card;
var ui_1 = require("@nexus/ui");
var utils_1 = require("@/lib/utils");
function Card(_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.hover, hover = _c === void 0 ? false : _c, onClick = _a.onClick;
    var hoverClasses = hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : '';
    var focusClasses = onClick ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : '';
    return (<ui_1.Card className={(0, utils_1.cn)('p-5', hoverClasses, focusClasses, className)} onClick={onClick} tabIndex={onClick ? 0 : undefined} onKeyDown={onClick ? function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        } : undefined}>
      {children}
    </ui_1.Card>);
}
