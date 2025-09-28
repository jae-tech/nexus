"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = CategoryManagementModal;
var react_1 = require("react");
var Button_1 = require("../../../components/base/Button");
var colorOptions = [
    { name: '파랑', value: 'blue', class: 'bg-blue-500' },
    { name: '분홍', value: 'pink', class: 'bg-pink-500' },
    { name: '초록', value: 'green', class: 'bg-green-500' },
    { name: '보라', value: 'purple', class: 'bg-purple-500' },
    { name: '노랑', value: 'yellow', class: 'bg-yellow-500' },
    { name: '회색', value: 'gray', class: 'bg-gray-500' }
];
function CategoryManagementModal(_a) {
    var categories = _a.categories, onClose = _a.onClose, onSave = _a.onSave, serviceCounts = _a.serviceCounts;
    var _b = (0, react_1.useState)(categories), categoryList = _b[0], setCategoryList = _b[1];
    var _c = (0, react_1.useState)(''), newCategoryName = _c[0], setNewCategoryName = _c[1];
    var _d = (0, react_1.useState)('blue'), newCategoryColor = _d[0], setNewCategoryColor = _d[1];
    var _e = (0, react_1.useState)(null), editingId = _e[0], setEditingId = _e[1];
    var _f = (0, react_1.useState)(''), editingName = _f[0], setEditingName = _f[1];
    var handleAddCategory = function () {
        if (!newCategoryName.trim())
            return;
        var newCategory = {
            id: Date.now().toString(),
            name: newCategoryName.trim(),
            color: newCategoryColor
        };
        setCategoryList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newCategory], false); });
        setNewCategoryName('');
        setNewCategoryColor('blue');
    };
    var handleEditStart = function (category) {
        setEditingId(category.id);
        setEditingName(category.name);
    };
    var handleEditSave = function () {
        if (!editingName.trim())
            return;
        setCategoryList(function (prev) { return prev.map(function (cat) {
            return cat.id === editingId
                ? __assign(__assign({}, cat), { name: editingName.trim() }) : cat;
        }); });
        setEditingId(null);
        setEditingName('');
    };
    var handleEditCancel = function () {
        setEditingId(null);
        setEditingName('');
    };
    var handleDeleteCategory = function (categoryId) {
        var serviceCount = serviceCounts[categoryId] || 0;
        if (serviceCount > 0) {
            if (!confirm("\uC774 \uCE74\uD14C\uACE0\uB9AC\uC5D0\uB294 ".concat(serviceCount, "\uAC1C\uC758 \uC11C\uBE44\uC2A4\uAC00 \uC788\uC2B5\uB2C8\uB2E4. \uC815\uB9D0 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"))) {
                return;
            }
        }
        setCategoryList(function (prev) { return prev.filter(function (cat) { return cat.id !== categoryId; }); });
    };
    var handleSave = function () {
        onSave(categoryList);
        onClose();
    };
    var getColorClass = function (color) {
        var colorMap = {
            blue: 'bg-blue-500',
            pink: 'bg-pink-500',
            green: 'bg-green-500',
            purple: 'bg-purple-500',
            yellow: 'bg-yellow-500',
            gray: 'bg-gray-500'
        };
        return colorMap[color] || 'bg-gray-500';
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">카테고리 관리</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* 좌측: 기존 카테고리 목록 */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">기존 카테고리</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {categoryList.map(function (category) { return (<div key={category.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={"w-4 h-4 rounded-full ".concat(getColorClass(category.color))}></div>
                  
                  {editingId === category.id ? (<div className="flex-1 flex items-center gap-2">
                      <input type="text" value={editingName} onChange={function (e) { return setEditingName(e.target.value); }} className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={function (e) {
                    if (e.key === 'Enter')
                        handleEditSave();
                    if (e.key === 'Escape')
                        handleEditCancel();
                }} autoFocus/>
                      <button onClick={handleEditSave} className="p-1 text-green-600 hover:text-green-700" title="저장">
                        <i className="ri-check-line"></i>
                      </button>
                      <button onClick={handleEditCancel} className="p-1 text-gray-400 hover:text-gray-600" title="취소">
                        <i className="ri-close-line"></i>
                      </button>
                    </div>) : (<>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({serviceCounts[category.id] || 0}개 서비스)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={function () { return handleEditStart(category); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="편집">
                          <i className="ri-edit-line"></i>
                        </button>
                        <button onClick={function () { return handleDeleteCategory(category.id); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="삭제">
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </div>
                    </>)}
                </div>); })}
            </div>
          </div>

          {/* 우측: 새 카테고리 추가 */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">새 카테고리 추가</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  카테고리명
                </label>
                <input type="text" value={newCategoryName} onChange={function (e) { return setNewCategoryName(e.target.value); }} placeholder="카테고리명을 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  색상 선택
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map(function (color) { return (<button key={color.value} onClick={function () { return setNewCategoryColor(color.value); }} className={"flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ".concat(newCategoryColor === color.value
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300')}>
                      <div className={"w-4 h-4 rounded-full ".concat(color.class)}></div>
                      <span className="text-sm">{color.name}</span>
                    </button>); })}
                </div>
              </div>

              <Button_1.default onClick={handleAddCategory} disabled={!newCategoryName.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                <i className="ri-add-line mr-2"></i>
                카테고리 추가
              </Button_1.default>
            </div>

            {/* 미리보기 */}
            {newCategoryName && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                <div className="flex items-center gap-2">
                  <div className={"w-4 h-4 rounded-full ".concat(getColorClass(newCategoryColor))}></div>
                  <span className="font-medium">{newCategoryName}</span>
                </div>
              </div>)}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button_1.default variant="outline" onClick={onClose}>
            취소
          </Button_1.default>
          <Button_1.default onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            변경사항 저장
          </Button_1.default>
        </div>
      </div>
    </div>);
}
