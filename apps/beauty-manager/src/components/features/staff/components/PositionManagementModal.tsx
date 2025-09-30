
import { useState } from 'react';
import { Staff } from '@/mocks/staff';

interface Position {
  id: string;
  name: string;
  color: string;
  level: number;
  order: number;
}

interface Role {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface PositionManagementModalProps {
  positions: Position[];
  roles: Role[];
  onClose: () => void;
  onSave: (positions: Position[], roles: Role[]) => void;
  staffList: Staff[];
}

const colorOptions = [
  { name: '파랑', value: 'blue', class: 'bg-blue-500' },
  { name: '분홍', value: 'pink', class: 'bg-pink-500' },
  { name: '초록', value: 'green', class: 'bg-green-500' },
  { name: '보라', value: 'purple', class: 'bg-purple-500' },
  { name: '노랑', value: 'yellow', class: 'bg-yellow-500' },
  { name: '회색', value: 'gray', class: 'bg-gray-500' }
];

const positionTemplates = [
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

const roleTemplates = [
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

export default function PositionManagementModal({ 
  positions, 
  roles, 
  onClose, 
  onSave, 
  staffList 
}: PositionManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'roles'>('positions');
  const [positionList, setPositionList] = useState<Position[]>(positions);
  const [roleList, setRoleList] = useState<Role[]>(roles);
  
  // 직급 관련 상태
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionColor, setNewPositionColor] = useState('blue');
  const [newPositionLevel, setNewPositionLevel] = useState(1);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(null);
  const [editingPositionName, setEditingPositionName] = useState('');
  const [selectedPositionTemplate, setSelectedPositionTemplate] = useState('');
  
  // 직무 관련 상태
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleColor, setNewRoleColor] = useState('blue');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editingRoleName, setEditingRoleName] = useState('');
  const [selectedRoleTemplate, setSelectedRoleTemplate] = useState('');

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      pink: 'bg-pink-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getPositionUsageCount = (positionId: string) => {
    const positionName = positionList.find(p => p.id === positionId)?.name.toLowerCase();
    if (!positionName) return 0;
    
    const mapping = {
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
    
    const mappedPosition = mapping[positionName as keyof typeof mapping];
    if (!mappedPosition) return 0;
    
    return staffList.filter(staff => staff.position === mappedPosition).length;
  };

  const getRoleUsageCount = (roleId: string) => {
    const roleName = roleList.find(r => r.id === roleId)?.name;
    if (!roleName) return 0;
    return staffList.filter(staff => staff.role === roleName).length;
  };

  // 직급 관리 함수들
  const handleAddPosition = () => {
    if (!newPositionName.trim()) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      name: newPositionName.trim(),
      color: newPositionColor,
      level: newPositionLevel,
      order: positionList.length
    };

    setPositionList(prev => [...prev, newPosition]);
    setNewPositionName('');
    setNewPositionColor('blue');
    setNewPositionLevel(1);
  };

  const handleEditPositionStart = (position: Position) => {
    setEditingPositionId(position.id);
    setEditingPositionName(position.name);
  };

  const handleEditPositionSave = () => {
    if (!editingPositionName.trim()) return;

    setPositionList(prev => prev.map(pos => 
      pos.id === editingPositionId 
        ? { ...pos, name: editingPositionName.trim() }
        : pos
    ));
    setEditingPositionId(null);
    setEditingPositionName('');
  };

  const handleDeletePosition = (positionId: string) => {
    const usageCount = getPositionUsageCount(positionId);
    if (usageCount > 0) {
      if (!confirm(`이 직급을 사용하는 직원이 ${usageCount}명 있습니다. 정말 삭제하시겠습니까?`)) {
        return;
      }
    }
    setPositionList(prev => prev.filter(pos => pos.id !== positionId));
  };

  const handleApplyPositionTemplate = () => {
    const template = positionTemplates.find(t => t.name === selectedPositionTemplate);
    if (!template) return;

    if (positionList.length > 0) {
      if (!confirm('기존 직급 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')) {
        return;
      }
    }

    const newPositions = template.positions.map((pos, index) => ({
      id: Date.now().toString() + index,
      name: pos.name,
      color: pos.color,
      level: pos.level,
      order: index
    }));

    setPositionList(newPositions);
    setSelectedPositionTemplate('');
  };

  // 직무 관리 함수들
  const handleAddRole = () => {
    if (!newRoleName.trim()) return;

    const newRole: Role = {
      id: Date.now().toString(),
      name: newRoleName.trim(),
      color: newRoleColor,
      order: roleList.length
    };

    setRoleList(prev => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleColor('blue');
  };

  const handleEditRoleStart = (role: Role) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
  };

  const handleEditRoleSave = () => {
    if (!editingRoleName.trim()) return;

    setRoleList(prev => prev.map(role => 
      role.id === editingRoleId 
        ? { ...role, name: editingRoleName.trim() }
        : role
    ));
    setEditingRoleId(null);
    setEditingRoleName('');
  };

  const handleDeleteRole = (roleId: string) => {
    const usageCount = getRoleUsageCount(roleId);
    if (usageCount > 0) {
      if (!confirm(`이 직무를 사용하는 직원이 ${usageCount}명 있습니다. 정말 삭제하시겠습니까?`)) {
        return;
      }
    }
    setRoleList(prev => prev.filter(role => role.id !== roleId));
  };

  const handleApplyRoleTemplate = () => {
    const template = roleTemplates.find(t => t.name === selectedRoleTemplate);
    if (!template) return;

    if (roleList.length > 0) {
      if (!confirm('기존 직무 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')) {
        return;
      }
    }

    const newRoles = template.roles.map((role, index) => ({
      id: Date.now().toString() + index,
      name: role.name,
      color: role.color,
      order: index
    }));

    setRoleList(newRoles);
    setSelectedRoleTemplate('');
  };

  const handleSave = () => {
    onSave(positionList, roleList);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">직급/직무 관리</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex space-x-8">
            {[
              { id: 'positions', label: '직급 관리' },
              { id: 'roles', label: '직무 관리' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex h-[600px]">
          {activeTab === 'positions' ? (
            <>
              {/* 좌측: 기존 직급 목록 */}
              <div className="flex-1 p-6 border-r border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기존 직급</h3>
                <div className="space-y-3 max-h-[460px] overflow-y-auto">
                  {positionList.sort((a, b) => b.level - a.level).map((position) => (
                    <div key={position.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="cursor-move text-gray-400">
                        <i className="ri-drag-move-2-line"></i>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${getColorClass(position.color)}`}></div>
                      
                      {editingPositionId === position.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingPositionName}
                            onChange={(e) => setEditingPositionName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus-ring"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditPositionSave();
                              if (e.key === 'Escape') setEditingPositionId(null);
                            }}
                            autoFocus
                          />
                          <button
                            onClick={handleEditPositionSave}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="저장"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                          <button
                            onClick={() => setEditingPositionId(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="취소"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ) : (
                        <>
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
                            <button
                              onClick={() => handleEditPositionStart(position)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="편집"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeletePosition(position.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="삭제"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {positionList.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <i className="ri-user-star-line text-4xl mb-2"></i>
                      <p>등록된 직급이 없습니다.</p>
                    </div>
                  )}
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
                    <input
                      type="text"
                      value={newPositionName}
                      onChange={(e) => setNewPositionName(e.target.value)}
                      placeholder="직급명을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      직급 레벨
                    </label>
                    <select
                      value={newPositionLevel}
                      onChange={(e) => setNewPositionLevel(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(level => (
                        <option key={level} value={level}>레벨 {level}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">높은 레벨일수록 상급자입니다</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewPositionColor(color.value)}
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                            newPositionColor === color.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddPosition}
                    disabled={!newPositionName.trim()}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <i className="ri-add-line mr-2"></i>
                    직급 추가
                  </button>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">기본 템플릿 적용</h4>
                  <div className="space-y-3">
                    <select
                      value={selectedPositionTemplate}
                      onChange={(e) => setSelectedPositionTemplate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                    >
                      <option value="">템플릿을 선택하세요</option>
                      {positionTemplates.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {selectedPositionTemplate && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">미리보기:</h5>
                        <div className="space-y-1">
                          {positionTemplates
                            .find(t => t.name === selectedPositionTemplate)?.positions
                            .sort((a, b) => b.level - a.level)
                            .map((pos, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className={`w-3 h-3 rounded-full ${getColorClass(pos.color)}`}></div>
                              <span>{pos.name} (레벨 {pos.level})</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleApplyPositionTemplate}
                          className="w-full mt-3 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                        >
                          템플릿 적용
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 미리보기 */}
                {newPositionName && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getColorClass(newPositionColor)}`}></div>
                      <span className="font-medium">{newPositionName}</span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        레벨 {newPositionLevel}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* 좌측: 기존 직무 목록 */}
              <div className="flex-1 p-6 border-r border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">기존 직무</h3>
                <div className="space-y-3 max-h-[460px] overflow-y-auto">
                  {roleList.map((role) => (
                    <div key={role.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="cursor-move text-gray-400">
                        <i className="ri-drag-move-2-line"></i>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${getColorClass(role.color)}`}></div>
                      
                      {editingRoleId === role.id ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded focus-ring"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditRoleSave();
                              if (e.key === 'Escape') setEditingRoleId(null);
                            }}
                            autoFocus
                          />
                          <button
                            onClick={handleEditRoleSave}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="저장"
                          >
                            <i className="ri-check-line"></i>
                          </button>
                          <button
                            onClick={() => setEditingRoleId(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="취소"
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{role.name}</span>
                            <span className="block text-sm text-gray-500">
                              ({getRoleUsageCount(role.id)}명 사용 중)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditRoleStart(role)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="편집"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="삭제"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {roleList.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <i className="ri-user-settings-line text-4xl mb-2"></i>
                      <p>등록된 직무가 없습니다.</p>
                    </div>
                  )}
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
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="직무명을 입력하세요"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewRoleColor(color.value)}
                          className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                            newRoleColor === color.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-full ${color.class}`}></div>
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddRole}
                    disabled={!newRoleName.trim()}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <i className="ri-add-line mr-2"></i>
                    직무 추가
                  </button>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">기본 템플릿 적용</h4>
                  <div className="space-y-3">
                    <select
                      value={selectedRoleTemplate}
                      onChange={(e) => setSelectedRoleTemplate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                    >
                      <option value="">템플릿을 선택하세요</option>
                      {roleTemplates.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {selectedRoleTemplate && (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">미리보기:</h5>
                        <div className="space-y-1">
                          {roleTemplates
                            .find(t => t.name === selectedRoleTemplate)?.roles
                            .map((role, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className={`w-3 h-3 rounded-full ${getColorClass(role.color)}`}></div>
                              <span>{role.name}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleApplyRoleTemplate}
                          className="w-full mt-3 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                        >
                          템플릿 적용
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 미리보기 */}
                {newRoleName && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getColorClass(newRoleColor)}`}></div>
                      <span className="font-medium">{newRoleName}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer - 통일된 버튼 배치 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            변경사항 저장
          </button>
        </div>
      </div>
    </div>
  );
}