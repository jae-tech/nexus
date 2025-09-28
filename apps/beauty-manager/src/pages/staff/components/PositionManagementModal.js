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
exports.default = PositionManagementModal;
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
var positionTemplates = [
    {
        name: '일반 뷰티샵',
        positions: [
            { name: '사장', color: 'yellow', level: 5 },
            { name: '매니저', color: 'gray', level: 4 },
            { name: '시니어', color: 'blue', level: 3 },
            { name: '주니어', color: 'green', level: 2 },
            { name: '인턴', color: 'purple', level: 1 }
        ]
    },
    {
        name: '대형 살롱',
        positions: [
            { name: '원장', color: 'yellow', level: 6 },
            { name: '부원장', color: 'gray', level: 5 },
            { name: '실장', color: 'blue', level: 4 },
            { name: '매니저', color: 'green', level: 3 },
            { name: '스타일리스트', color: 'pink', level: 2 },
            { name: '어시스턴트', color: 'purple', level: 1 }
        ]
    }
];
var roleTemplates = [
    {
        name: '종합 뷰티샵',
        roles: [
            { name: '헤어 디자이너', color: 'blue' },
            { name: '네일 아티스트', color: 'pink' },
            { name: '피부 관리사', color: 'green' },
            { name: '메이크업 아티스트', color: 'purple' },
            { name: '어시스턴트', color: 'gray' }
        ]
    },
    {
        name: '헤어 전문점',
        roles: [
            { name: '컷 전문가', color: 'blue' },
            { name: '염색 전문가', color: 'pink' },
            { name: '펌 전문가', color: 'green' },
            { name: '트리트먼트 전문가', color: 'purple' }
        ]
    }
];
function PositionManagementModal(_a) {
    var _b, _c;
    var positions = _a.positions, roles = _a.roles, onClose = _a.onClose, onSave = _a.onSave, staffList = _a.staffList;
    var _d = (0, react_1.useState)('positions'), activeTab = _d[0], setActiveTab = _d[1];
    var _e = (0, react_1.useState)(positions), positionList = _e[0], setPositionList = _e[1];
    var _f = (0, react_1.useState)(roles), roleList = _f[0], setRoleList = _f[1];
    // 직급 관련 상태
    var _g = (0, react_1.useState)(''), newPositionName = _g[0], setNewPositionName = _g[1];
    var _h = (0, react_1.useState)('blue'), newPositionColor = _h[0], setNewPositionColor = _h[1];
    var _j = (0, react_1.useState)(1), newPositionLevel = _j[0], setNewPositionLevel = _j[1];
    var _k = (0, react_1.useState)(null), editingPositionId = _k[0], setEditingPositionId = _k[1];
    var _l = (0, react_1.useState)(''), editingPositionName = _l[0], setEditingPositionName = _l[1];
    var _m = (0, react_1.useState)(''), selectedPositionTemplate = _m[0], setSelectedPositionTemplate = _m[1];
    // 직무 관련 상태
    var _o = (0, react_1.useState)(''), newRoleName = _o[0], setNewRoleName = _o[1];
    var _p = (0, react_1.useState)('blue'), newRoleColor = _p[0], setNewRoleColor = _p[1];
    var _q = (0, react_1.useState)(null), editingRoleId = _q[0], setEditingRoleId = _q[1];
    var _r = (0, react_1.useState)(''), editingRoleName = _r[0], setEditingRoleName = _r[1];
    var _s = (0, react_1.useState)(''), selectedRoleTemplate = _s[0], setSelectedRoleTemplate = _s[1];
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
    var getPositionUsageCount = function (positionId) {
        var _a;
        var positionName = (_a = positionList.find(function (p) { return p.id === positionId; })) === null || _a === void 0 ? void 0 : _a.name.toLowerCase();
        if (!positionName)
            return 0;
        var mapping = {
            '사장': 'owner',
            '원장': 'owner',
            '매니저': 'manager',
            '부원장': 'manager',
            '실장': 'manager',
            '시니어': 'senior',
            '스타일리스트': 'senior',
            '주니어': 'junior',
            '인턴': 'intern',
            '어시스턴트': 'intern'
        };
        var mappedPosition = mapping[positionName];
        if (!mappedPosition)
            return 0;
        return staffList.filter(function (staff) { return staff.position === mappedPosition; }).length;
    };
    var getRoleUsageCount = function (roleId) {
        var _a;
        var roleName = (_a = roleList.find(function (r) { return r.id === roleId; })) === null || _a === void 0 ? void 0 : _a.name;
        if (!roleName)
            return 0;
        return staffList.filter(function (staff) { return staff.role === roleName; }).length;
    };
    // 직급 관리 함수들
    var handleAddPosition = function () {
        if (!newPositionName.trim())
            return;
        var newPosition = {
            id: Date.now().toString(),
            name: newPositionName.trim(),
            color: newPositionColor,
            level: newPositionLevel,
            order: positionList.length
        };
        setPositionList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newPosition], false); });
        setNewPositionName('');
        setNewPositionColor('blue');
        setNewPositionLevel(1);
    };
    var handleEditPositionStart = function (position) {
        setEditingPositionId(position.id);
        setEditingPositionName(position.name);
    };
    var handleEditPositionSave = function () {
        if (!editingPositionName.trim())
            return;
        setPositionList(function (prev) { return prev.map(function (pos) {
            return pos.id === editingPositionId
                ? __assign(__assign({}, pos), { name: editingPositionName.trim() }) : pos;
        }); });
        setEditingPositionId(null);
        setEditingPositionName('');
    };
    var handleDeletePosition = function (positionId) {
        var usageCount = getPositionUsageCount(positionId);
        if (usageCount > 0) {
            if (!confirm("\uC774 \uC9C1\uAE09\uC744 \uC0AC\uC6A9\uD558\uB294 \uC9C1\uC6D0\uC774 ".concat(usageCount, "\uBA85 \uC788\uC2B5\uB2C8\uB2E4. \uC815\uB9D0 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"))) {
                return;
            }
        }
        setPositionList(function (prev) { return prev.filter(function (pos) { return pos.id !== positionId; }); });
    };
    var handleApplyPositionTemplate = function () {
        var template = positionTemplates.find(function (t) { return t.name === selectedPositionTemplate; });
        if (!template)
            return;
        if (positionList.length > 0) {
            if (!confirm('기존 직급 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')) {
                return;
            }
        }
        var newPositions = template.positions.map(function (pos, index) { return ({
            id: Date.now().toString() + index,
            name: pos.name,
            color: pos.color,
            level: pos.level,
            order: index
        }); });
        setPositionList(newPositions);
        setSelectedPositionTemplate('');
    };
    // 직무 관리 함수들
    var handleAddRole = function () {
        if (!newRoleName.trim())
            return;
        var newRole = {
            id: Date.now().toString(),
            name: newRoleName.trim(),
            color: newRoleColor,
            order: roleList.length
        };
        setRoleList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newRole], false); });
        setNewRoleName('');
        setNewRoleColor('blue');
    };
    var handleEditRoleStart = function (role) {
        setEditingRoleId(role.id);
        setEditingRoleName(role.name);
    };
    var handleEditRoleSave = function () {
        if (!editingRoleName.trim())
            return;
        setRoleList(function (prev) { return prev.map(function (role) {
            return role.id === editingRoleId
                ? __assign(__assign({}, role), { name: editingRoleName.trim() }) : role;
        }); });
        setEditingRoleId(null);
        setEditingRoleName('');
    };
    var handleDeleteRole = function (roleId) {
        var usageCount = getRoleUsageCount(roleId);
        if (usageCount > 0) {
            if (!confirm("\uC774 \uC9C1\uBB34\uB97C \uC0AC\uC6A9\uD558\uB294 \uC9C1\uC6D0\uC774 ".concat(usageCount, "\uBA85 \uC788\uC2B5\uB2C8\uB2E4. \uC815\uB9D0 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"))) {
                return;
            }
        }
        setRoleList(function (prev) { return prev.filter(function (role) { return role.id !== roleId; }); });
    };
    var handleApplyRoleTemplate = function () {
        var template = roleTemplates.find(function (t) { return t.name === selectedRoleTemplate; });
        if (!template)
            return;
        if (roleList.length > 0) {
            if (!confirm('기존 직무 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')) {
                return;
            }
        }
        var newRoles = template.roles.map(function (role, index) { return ({
            id: Date.now().toString() + index,
            name: role.name,
            color: role.color,
            order: index
        }); });
        setRoleList(newRoles);
        setSelectedRoleTemplate('');
    };
    var handleSave = function () {
        onSave(positionList, roleList);
        onClose();
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">직급/직무 관리</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {[
            { id: 'positions', label: '직급 관리' },
            { id: 'roles', label: '직무 관리' }
        ].map(function (tab) { return (<button key={tab.id} onClick={function () { return setActiveTab(tab.id); }} className={"py-4 px-1 border-b-2 font-medium text-sm transition-colors ".concat(activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700')}>
                {tab.label}
              </button>); })}
          </div>
        </div>

        <div className="flex h-[600px]">
          {activeTab === 'positions' ? (<>
              {/* 좌측: 기존 직급 목록 */}
              <div className="flex-1 p-6 border-r border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기존 직급</h3>
                <div className="space-y-3 max-h-[460px] overflow-y-auto">
                  {positionList.sort(function (a, b) { return b.level - a.level; }).map(function (position) { return (<div key={position.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="cursor-move text-gray-400">
                        <i className="ri-drag-move-2-line"></i>
                      </div>
                      <div className={"w-4 h-4 rounded-full ".concat(getColorClass(position.color))}></div>
                      
                      {editingPositionId === position.id ? (<div className="flex-1 flex items-center gap-2">
                          <input type="text" value={editingPositionName} onChange={function (e) { return setEditingPositionName(e.target.value); }} className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={function (e) {
                        if (e.key === 'Enter')
                            handleEditPositionSave();
                        if (e.key === 'Escape')
                            setEditingPositionId(null);
                    }} autoFocus/>
                          <button onClick={handleEditPositionSave} className="p-1 text-green-600 hover:text-green-700" title="저장">
                            <i className="ri-check-line"></i>
                          </button>
                          <button onClick={function () { return setEditingPositionId(null); }} className="p-1 text-gray-400 hover:text-gray-600" title="취소">
                            <i className="ri-close-line"></i>
                          </button>
                        </div>) : (<>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{position.name}</span>
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                레벨 {position.level}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({getPositionUsageCount(position.id)}명 사용 중)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={function () { return handleEditPositionStart(position); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="편집">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button onClick={function () { return handleDeletePosition(position.id); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="삭제">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </>)}
                    </div>); })}
                  {positionList.length === 0 && (<div className="text-center py-8 text-gray-500">
                      <i className="ri-user-star-line text-4xl mb-2"></i>
                      <p>등록된 직급이 없습니다.</p>
                    </div>)}
                </div>
              </div>

              {/* 우측: 새 직급 추가 */}
              <div className="flex-1 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 직급 추가</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급명
                    </label>
                    <input type="text" value={newPositionName} onChange={function (e) { return setNewPositionName(e.target.value); }} placeholder="직급명을 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급 레벨
                    </label>
                    <select value={newPositionLevel} onChange={function (e) { return setNewPositionLevel(parseInt(e.target.value)); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (level) { return (<option key={level} value={level}>레벨 {level}</option>); })}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">높은 레벨일수록 상급자입니다</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map(function (color) { return (<button key={color.value} onClick={function () { return setNewPositionColor(color.value); }} className={"flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ".concat(newPositionColor === color.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                          <div className={"w-4 h-4 rounded-full ".concat(color.class)}></div>
                          <span className="text-sm">{color.name}</span>
                        </button>); })}
                    </div>
                  </div>

                  <Button_1.default onClick={handleAddPosition} disabled={!newPositionName.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                    <i className="ri-add-line mr-2"></i>
                    직급 추가
                  </Button_1.default>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">기본 템플릿 적용</h4>
                  <div className="space-y-3">
                    <select value={selectedPositionTemplate} onChange={function (e) { return setSelectedPositionTemplate(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">템플릿을 선택하세요</option>
                      {positionTemplates.map(function (template) { return (<option key={template.name} value={template.name}>
                          {template.name}
                        </option>); })}
                    </select>
                    {selectedPositionTemplate && (<div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">미리보기:</h5>
                        <div className="space-y-1">
                          {(_b = positionTemplates
                    .find(function (t) { return t.name === selectedPositionTemplate; })) === null || _b === void 0 ? void 0 : _b.positions.sort(function (a, b) { return b.level - a.level; }).map(function (pos, index) { return (<div key={index} className="flex items-center gap-2 text-sm">
                              <div className={"w-3 h-3 rounded-full ".concat(getColorClass(pos.color))}></div>
                              <span>{pos.name} (레벨 {pos.level})</span>
                            </div>); })}
                        </div>
                        <Button_1.default onClick={handleApplyPositionTemplate} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-sm">
                          템플릿 적용
                        </Button_1.default>
                      </div>)}
                  </div>
                </div>

                {/* 미리보기 */}
                {newPositionName && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                    <div className="flex items-center gap-2">
                      <div className={"w-4 h-4 rounded-full ".concat(getColorClass(newPositionColor))}></div>
                      <span className="font-medium">{newPositionName}</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        레벨 {newPositionLevel}
                      </span>
                    </div>
                  </div>)}
              </div>
            </>) : (<>
              {/* 좌측: 기존 직무 목록 */}
              <div className="flex-1 p-6 border-r border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기존 직무</h3>
                <div className="space-y-3 max-h-[460px] overflow-y-auto">
                  {roleList.map(function (role) { return (<div key={role.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="cursor-move text-gray-400">
                        <i className="ri-drag-move-2-line"></i>
                      </div>
                      <div className={"w-4 h-4 rounded-full ".concat(getColorClass(role.color))}></div>
                      
                      {editingRoleId === role.id ? (<div className="flex-1 flex items-center gap-2">
                          <input type="text" value={editingRoleName} onChange={function (e) { return setEditingRoleName(e.target.value); }} className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onKeyDown={function (e) {
                        if (e.key === 'Enter')
                            handleEditRoleSave();
                        if (e.key === 'Escape')
                            setEditingRoleId(null);
                    }} autoFocus/>
                          <button onClick={handleEditRoleSave} className="p-1 text-green-600 hover:text-green-700" title="저장">
                            <i className="ri-check-line"></i>
                          </button>
                          <button onClick={function () { return setEditingRoleId(null); }} className="p-1 text-gray-400 hover:text-gray-600" title="취소">
                            <i className="ri-close-line"></i>
                          </button>
                        </div>) : (<>
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{role.name}</span>
                            <span className="block text-sm text-gray-500">
                              ({getRoleUsageCount(role.id)}명 사용 중)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={function () { return handleEditRoleStart(role); }} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="편집">
                              <i className="ri-edit-line"></i>
                            </button>
                            <button onClick={function () { return handleDeleteRole(role.id); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="삭제">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </>)}
                    </div>); })}
                  {roleList.length === 0 && (<div className="text-center py-8 text-gray-500">
                      <i className="ri-user-settings-line text-4xl mb-2"></i>
                      <p>등록된 직무가 없습니다.</p>
                    </div>)}
                </div>
              </div>

              {/* 우측: 새 직무 추가 */}
              <div className="flex-1 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">새 직무 추가</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직무명
                    </label>
                    <input type="text" value={newRoleName} onChange={function (e) { return setNewRoleName(e.target.value); }} placeholder="직무명을 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map(function (color) { return (<button key={color.value} onClick={function () { return setNewRoleColor(color.value); }} className={"flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ".concat(newRoleColor === color.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                          <div className={"w-4 h-4 rounded-full ".concat(color.class)}></div>
                          <span className="text-sm">{color.name}</span>
                        </button>); })}
                    </div>
                  </div>

                  <Button_1.default onClick={handleAddRole} disabled={!newRoleName.trim()} className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
                    <i className="ri-add-line mr-2"></i>
                    직무 추가
                  </Button_1.default>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">기본 템플릿 적용</h4>
                  <div className="space-y-3">
                    <select value={selectedRoleTemplate} onChange={function (e) { return setSelectedRoleTemplate(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">템플릿을 선택하세요</option>
                      {roleTemplates.map(function (template) { return (<option key={template.name} value={template.name}>
                          {template.name}
                        </option>); })}
                    </select>
                    {selectedRoleTemplate && (<div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">미리보기:</h5>
                        <div className="space-y-1">
                          {(_c = roleTemplates
                    .find(function (t) { return t.name === selectedRoleTemplate; })) === null || _c === void 0 ? void 0 : _c.roles.map(function (role, index) { return (<div key={index} className="flex items-center gap-2 text-sm">
                              <div className={"w-3 h-3 rounded-full ".concat(getColorClass(role.color))}></div>
                              <span>{role.name}</span>
                            </div>); })}
                        </div>
                        <Button_1.default onClick={handleApplyRoleTemplate} className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white text-sm">
                          템플릿 적용
                        </Button_1.default>
                      </div>)}
                  </div>
                </div>

                {/* 미리보기 */}
                {newRoleName && (<div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                    <div className="flex items-center gap-2">
                      <div className={"w-4 h-4 rounded-full ".concat(getColorClass(newRoleColor))}></div>
                      <span className="font-medium">{newRoleName}</span>
                    </div>
                  </div>)}
              </div>
            </>)}
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
