"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Toast;
var react_1 = require("react");
function Toast(_a) {
    var message = _a.message, type = _a.type, _b = _a.duration, duration = _b === void 0 ? 3000 : _b, onClose = _a.onClose;
    var _c = (0, react_1.useState)(true), isVisible = _c[0], setIsVisible = _c[1];
    (0, react_1.useEffect)(function () {
        var timer = setTimeout(function () {
            setIsVisible(false);
            setTimeout(onClose, 300); // 애니메이션 완료 후 제거
        }, duration);
        return function () { return clearTimeout(timer); };
    }, [duration, onClose]);
    var getToastStyles = function () {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };
    var getIcon = function () {
        switch (type) {
            case 'success':
                return 'ri-check-line';
            case 'error':
                return 'ri-close-line';
            case 'warning':
                return 'ri-alert-line';
            case 'info':
                return 'ri-information-line';
            default:
                return 'ri-information-line';
        }
    };
    return (<div className={"fixed top-4 right-4 z-50 transition-all duration-300 ".concat(isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0')}>
      <div className={"flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ".concat(getToastStyles())}>
        <i className={"".concat(getIcon(), " text-lg")}></i>
        <span className="text-sm font-medium">{message}</span>
        <button onClick={function () {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }} className="ml-2 hover:opacity-80 transition-opacity">
          <i className="ri-close-line text-lg"></i>
        </button>
      </div>
    </div>);
}
