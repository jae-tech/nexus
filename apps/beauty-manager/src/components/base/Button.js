"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Button;
var ui_1 = require("@nexus/ui");
var utils_1 = require("@/lib/utils");
function Button(_a) {
    var _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'default' : _c, children = _a.children, _d = _a.className, className = _d === void 0 ? '' : _d, props = __rest(_a, ["variant", "size", "children", "className"]);
    // 기존 variant를 Nexus UI variant로 매핑
    var nexusVariant = variant === 'primary' ? 'default' :
        variant === 'secondary' ? 'outline' :
            variant === 'icon' ? 'ghost' : variant;
    // 기존 size를 Nexus UI size로 매핑
    var nexusSize = size === 'md' ? 'default' : size;
    return (<ui_1.Button variant={nexusVariant} size={nexusSize} className={(0, utils_1.cn)(className)} {...props}>
      {children}
    </ui_1.Button>);
}
