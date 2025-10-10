import { useState } from 'react';
import {
  Check,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
  UserCheck,
  UserCog,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Staff } from '@/features/staff/api/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  open: boolean;
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
  { name: '회색', value: 'gray', class: 'bg-gray-500' },
];

const positionTemplates = [
  {
    name: '일반 뷰티샵',
    positions: [
      { name: '사장', color: 'yellow', level: 5 },
      { name: '매니저', color: 'gray', level: 4 },
      { name: '시니어', color: 'blue', level: 3 },
      { name: '주니어', color: 'green', level: 2 },
      { name: '인턴', color: 'purple', level: 1 },
    ],
  },
  {
    name: '대형 살롱',
    positions: [
      { name: '원장', color: 'yellow', level: 6 },
      { name: '부원장', color: 'gray', level: 5 },
      { name: '실장', color: 'blue', level: 4 },
      { name: '매니저', color: 'green', level: 3 },
      { name: '스타일리스트', color: 'pink', level: 2 },
      { name: '어시스턴트', color: 'purple', level: 1 },
    ],
  },
];

const roleTemplates = [
  {
    name: '종합 뷰티샵',
    roles: [
      { name: '헤어 디자이너', color: 'blue' },
      { name: '네일 아티스트', color: 'pink' },
      { name: '피부 관리사', color: 'green' },
      { name: '메이크업 아티스트', color: 'purple' },
      { name: '어시스턴트', color: 'gray' },
    ],
  },
  {
    name: '헤어 전문점',
    roles: [
      { name: '컷 전문가', color: 'blue' },
      { name: '염색 전문가', color: 'pink' },
      { name: '펌 전문가', color: 'green' },
      { name: '트리트먼트 전문가', color: 'purple' },
    ],
  },
];

export default function PositionManagementModal({
  positions,
  roles,
  open,
  onClose,
  onSave,
  staffList,
}: PositionManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'roles'>(
    'positions'
  );
  const [positionList, setPositionList] = useState<Position[]>(positions);
  const [roleList, setRoleList] = useState<Role[]>(roles);

  // 직급 관련 상태
  const [newPositionName, setNewPositionName] = useState('');
  const [newPositionColor, setNewPositionColor] = useState('blue');
  const [newPositionLevel, setNewPositionLevel] = useState(1);
  const [editingPositionId, setEditingPositionId] = useState<string | null>(
    null
  );
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
      gray: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const getPositionUsageCount = (positionId: string) => {
    const positionName = positionList
      .find((p) => p.id === positionId)
      ?.name.toLowerCase();
    if (!positionName) return 0;

    const mapping = {
      사장: 'owner',
      원장: 'owner',
      매니저: 'manager',
      부원장: 'manager',
      실장: 'manager',
      시니어: 'senior',
      스타일리스트: 'senior',
      주니어: 'junior',
      인턴: 'intern',
      어시스턴트: 'intern',
    };

    const mappedPosition = mapping[positionName as keyof typeof mapping];
    if (!mappedPosition) return 0;

    return staffList.filter((staff) => staff.position === mappedPosition)
      .length;
  };

  const getRoleUsageCount = (roleId: string) => {
    const roleName = roleList.find((r) => r.id === roleId)?.name;
    if (!roleName) return 0;
    return staffList.filter((staff) => staff.role === roleName).length;
  };

  // 직급 관리 함수들
  const handleAddPosition = () => {
    if (!newPositionName.trim()) return;

    const newPosition: Position = {
      id: Date.now().toString(),
      name: newPositionName.trim(),
      color: newPositionColor,
      level: newPositionLevel,
      order: positionList.length,
    };

    setPositionList((prev) => [...prev, newPosition]);
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

    setPositionList((prev) =>
      prev.map((pos) =>
        pos.id === editingPositionId
          ? { ...pos, name: editingPositionName.trim() }
          : pos
      )
    );
    setEditingPositionId(null);
    setEditingPositionName('');
  };

  const handleDeletePosition = (positionId: string) => {
    const usageCount = getPositionUsageCount(positionId);
    if (usageCount > 0) {
      if (
        !confirm(
          `이 직급을 사용하는 직원이 ${usageCount}명 있습니다. 정말 삭제하시겠습니까?`
        )
      ) {
        return;
      }
    }
    setPositionList((prev) => prev.filter((pos) => pos.id !== positionId));
  };

  const handleApplyPositionTemplate = () => {
    const template = positionTemplates.find(
      (t) => t.name === selectedPositionTemplate
    );
    if (!template) return;

    if (positionList.length > 0) {
      if (
        !confirm('기존 직급 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')
      ) {
        return;
      }
    }

    const newPositions = template.positions.map((pos, index) => ({
      id: Date.now().toString() + index,
      name: pos.name,
      color: pos.color,
      level: pos.level,
      order: index,
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
      order: roleList.length,
    };

    setRoleList((prev) => [...prev, newRole]);
    setNewRoleName('');
    setNewRoleColor('blue');
  };

  const handleEditRoleStart = (role: Role) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
  };

  const handleEditRoleSave = () => {
    if (!editingRoleName.trim()) return;

    setRoleList((prev) =>
      prev.map((role) =>
        role.id === editingRoleId
          ? { ...role, name: editingRoleName.trim() }
          : role
      )
    );
    setEditingRoleId(null);
    setEditingRoleName('');
  };

  const handleDeleteRole = (roleId: string) => {
    const usageCount = getRoleUsageCount(roleId);
    if (usageCount > 0) {
      if (
        !confirm(
          `이 직무를 사용하는 직원이 ${usageCount}명 있습니다. 정말 삭제하시겠습니까?`
        )
      ) {
        return;
      }
    }
    setRoleList((prev) => prev.filter((role) => role.id !== roleId));
  };

  const handleApplyRoleTemplate = () => {
    const template = roleTemplates.find((t) => t.name === selectedRoleTemplate);
    if (!template) return;

    if (roleList.length > 0) {
      if (
        !confirm('기존 직무 목록을 모두 삭제하고 템플릿을 적용하시겠습니까?')
      ) {
        return;
      }
    }

    const newRoles = template.roles.map((role, index) => ({
      id: Date.now().toString() + index,
      name: role.name,
      color: role.color,
      order: index,
    }));

    setRoleList(newRoles);
    setSelectedRoleTemplate('');
  };

  const handleSave = () => {
    onSave(positionList, roleList);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-6xl overflow-hidden p-0">
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            직급/직무 관리
          </DialogTitle>
        </DialogHeader>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[
              { id: 'positions', label: '직급 관리' },
              { id: 'roles', label: '직무 관리' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
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
              <div className="flex-1 border-r border-gray-200 p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  기존 직급
                </h3>
                <div className="max-h-[460px] space-y-3 overflow-y-auto">
                  {positionList
                    .sort((a, b) => b.level - a.level)
                    .map((position) => (
                      <div
                        key={position.id}
                        className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                      >
                        <div className="cursor-move text-gray-400">
                          <GripVertical className="h-5 w-5" />
                        </div>
                        <div
                          className={`h-4 w-4 rounded-full ${getColorClass(position.color)}`}
                        />

                        {editingPositionId === position.id ? (
                          <div className="flex flex-1 items-center gap-2">
                            <input
                              type="text"
                              value={editingPositionName}
                              onChange={(e) =>
                                setEditingPositionName(e.target.value)
                              }
                              className="flex-1 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditPositionSave();
                                if (e.key === 'Escape')
                                  setEditingPositionId(null);
                              }}
                              autoFocus
                            />
                            <button
                              onClick={handleEditPositionSave}
                              className="p-1 text-green-600 hover:text-green-700"
                              title="저장"
                            >
                              <Check size={20} className="text-white" />
                            </button>
                            <button
                              onClick={() => setEditingPositionId(null)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                              title="취소"
                            >
                              <X
                                size={16}
                                className="text-gray-600 hover:text-gray-800"
                              />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {position.name}
                                </span>
                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                                  레벨 {position.level}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                ({getPositionUsageCount(position.id)}명 사용 중)
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() =>
                                  handleEditPositionStart(position)
                                }
                                className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                                title="편집"
                              >
                                <Pencil
                                  size={20}
                                  className="text-gray-600 hover:text-blue-600"
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeletePosition(position.id)
                                }
                                className="p-1 text-gray-400 transition-colors hover:text-red-600"
                                title="삭제"
                              >
                                <Trash2
                                  size={20}
                                  className="text-gray-600 hover:text-red-600"
                                />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  {positionList.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <UserCheck className="mb-2 h-12 w-12" />
                      <p>등록된 직급이 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 우측: 새 직급 추가 */}
              <div className="flex-1 p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  새 직급 추가
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      직급명
                    </label>
                    <input
                      type="text"
                      value={newPositionName}
                      onChange={(e) => setNewPositionName(e.target.value)}
                      placeholder="직급명을 입력하세요"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      직급 레벨
                    </label>
                    <select
                      value={newPositionLevel}
                      onChange={(e) =>
                        setNewPositionLevel(parseInt(e.target.value))
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                        <option key={level} value={level}>
                          레벨 {level}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      높은 레벨일수록 상급자입니다
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewPositionColor(color.value)}
                          className={`flex items-center gap-2 rounded-lg border-2 p-2 transition-colors ${
                            newPositionColor === color.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full ${color.class}`}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddPosition}
                    disabled={!newPositionName.trim()}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={20} className="mr-2 text-white" />
                    직급 추가
                  </Button>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-700">
                    기본 템플릿 적용
                  </h4>
                  <div className="space-y-3">
                    <select
                      value={selectedPositionTemplate}
                      onChange={(e) =>
                        setSelectedPositionTemplate(e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">템플릿을 선택하세요</option>
                      {positionTemplates.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {selectedPositionTemplate && (
                      <div className="rounded-lg bg-gray-50 p-3">
                        <h5 className="mb-2 text-sm font-medium text-gray-700">
                          미리보기:
                        </h5>
                        <div className="space-y-1">
                          {positionTemplates
                            .find((t) => t.name === selectedPositionTemplate)
                            ?.positions.sort((a, b) => b.level - a.level)
                            .map((pos, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div
                                  className={`h-3 w-3 rounded-full ${getColorClass(pos.color)}`}
                                />
                                <span>
                                  {pos.name} (레벨 {pos.level})
                                </span>
                              </div>
                            ))}
                        </div>
                        <Button
                          onClick={handleApplyPositionTemplate}
                          className="mt-3 w-full bg-green-600 text-sm text-white hover:bg-green-700"
                        >
                          템플릿 적용
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 미리보기 */}
                {newPositionName && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      미리보기
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${getColorClass(newPositionColor)}`}
                      />
                      <span className="font-medium">{newPositionName}</span>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
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
              <div className="flex-1 border-r border-gray-200 p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  기존 직무
                </h3>
                <div className="max-h-[460px] space-y-3 overflow-y-auto">
                  {roleList.map((role) => (
                    <div
                      key={role.id}
                      className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                    >
                      <div className="cursor-move text-gray-400">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full ${getColorClass(role.color)}`}
                      />

                      {editingRoleId === role.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            type="text"
                            value={editingRoleName}
                            onChange={(e) => setEditingRoleName(e.target.value)}
                            className="flex-1 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <Check size={20} className="text-white" />
                          </button>
                          <button
                            onClick={() => setEditingRoleId(null)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="취소"
                          >
                            <X
                              size={16}
                              className="text-gray-600 hover:text-gray-800"
                            />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">
                              {role.name}
                            </span>
                            <span className="block text-sm text-gray-500">
                              ({getRoleUsageCount(role.id)}명 사용 중)
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditRoleStart(role)}
                              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                              title="편집"
                            >
                              <Pencil
                                size={20}
                                className="text-gray-600 hover:text-blue-600"
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-1 text-gray-400 transition-colors hover:text-red-600"
                              title="삭제"
                            >
                              <Trash2
                                size={20}
                                className="text-gray-600 hover:text-red-600"
                              />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  {roleList.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <UserCog className="mb-2 h-12 w-12" />
                      <p>등록된 직무가 없습니다.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 우측: 새 직무 추가 */}
              <div className="flex-1 p-6">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  새 직무 추가
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      직무명
                    </label>
                    <input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="직무명을 입력하세요"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      색상 선택
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setNewRoleColor(color.value)}
                          className={`flex items-center gap-2 rounded-lg border-2 p-2 transition-colors ${
                            newRoleColor === color.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div
                            className={`h-4 w-4 rounded-full ${color.class}`}
                          />
                          <span className="text-sm">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAddRole}
                    disabled={!newRoleName.trim()}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Plus size={20} className="mr-2 text-white" />
                    직무 추가
                  </Button>
                </div>

                {/* 기본 템플릿 */}
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="mb-3 text-sm font-medium text-gray-700">
                    기본 템플릿 적용
                  </h4>
                  <div className="space-y-3">
                    <select
                      value={selectedRoleTemplate}
                      onChange={(e) => setSelectedRoleTemplate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">템플릿을 선택하세요</option>
                      {roleTemplates.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                    {selectedRoleTemplate && (
                      <div className="rounded-lg bg-gray-50 p-3">
                        <h5 className="mb-2 text-sm font-medium text-gray-700">
                          미리보기:
                        </h5>
                        <div className="space-y-1">
                          {roleTemplates
                            .find((t) => t.name === selectedRoleTemplate)
                            ?.roles.map((role, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm"
                              >
                                <div
                                  className={`h-3 w-3 rounded-full ${getColorClass(role.color)}`}
                                />
                                <span>{role.name}</span>
                              </div>
                            ))}
                        </div>
                        <Button
                          onClick={handleApplyRoleTemplate}
                          className="mt-3 w-full bg-green-600 text-sm text-white hover:bg-green-700"
                        >
                          템플릿 적용
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 미리보기 */}
                {newRoleName && (
                  <div className="mt-6 rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      미리보기
                    </h4>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${getColorClass(newRoleColor)}`}
                      />
                      <span className="font-medium">{newRoleName}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-gray-200 px-6 pb-6 pt-4">
          <DialogFooter className="flex-row justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button onClick={handleSave} variant="default">
              변경사항 저장
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
