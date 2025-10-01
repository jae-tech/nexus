import { useState } from 'react';
import { Edit, Trash2, Check, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Button } from '@nexus/ui';

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface CategoryManagementModalProps {
  categories: Category[];
  open: boolean;
  onClose: () => void;
  onSave: (categories: Category[]) => void;
  serviceCounts: Record<string, number>;
}

const colorOptions = [
  { name: '파랑', value: 'blue', class: 'bg-blue-500' },
  { name: '분홍', value: 'pink', class: 'bg-pink-500' },
  { name: '초록', value: 'green', class: 'bg-green-500' },
  { name: '보라', value: 'purple', class: 'bg-purple-500' },
  { name: '노랑', value: 'yellow', class: 'bg-yellow-500' },
  { name: '회색', value: 'gray', class: 'bg-gray-500' }
];

export default function CategoryManagementModal({
  categories,
  open,
  onClose,
  onSave,
  serviceCounts
}: CategoryManagementModalProps) {
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('blue');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      color: newCategoryColor
    };

    setCategoryList(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('blue');
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditSave = () => {
    if (!editingName.trim()) return;

    setCategoryList(prev => prev.map(cat =>
      cat.id === editingId
        ? { ...cat, name: editingName.trim() }
        : cat
    ));
    setEditingId(null);
    setEditingName('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    const serviceCount = serviceCounts[categoryId] || 0;
    if (serviceCount > 0) {
      if (!confirm(`이 카테고리에는 ${serviceCount}개의 서비스가 있습니다. 정말 삭제하시겠습니까?`)) {
        return;
      }
    }
    setCategoryList(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const handleSave = () => {
    onSave(categoryList);
    onClose();
  };

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>카테고리 관리</DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* 좌측: 기존 카테고리 목록 */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">기존 카테고리</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {categoryList.map((category) => (
                <div key={category.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${getColorClass(category.color)}`}></div>

                  {editingId === category.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave();
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        autoFocus
                      />
                      <button
                        onClick={handleEditSave}
                        className="p-1 text-green-600 hover:text-green-700"
                        title="저장"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="취소"
                      >
                        <Plus size={16} className="rotate-45" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{category.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({serviceCounts[category.id] || 0}개 서비스)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditStart(category)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="편집"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
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
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="카테고리명을 입력하세요"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onClick={() => setNewCategoryColor(color.value)}
                      className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-colors ${
                        newCategoryColor === color.value
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
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                카테고리 추가
              </button>
            </div>

            {/* 미리보기 */}
            {newCategoryName && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">미리보기</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full ${getColorClass(newCategoryColor)}`}></div>
                  <span className="font-medium">{newCategoryName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            변경사항 저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
