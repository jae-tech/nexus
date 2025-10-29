import { useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  order: number;
  isActive: boolean;
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
  { name: '회색', value: 'gray', class: 'bg-gray-500' },
];

export default function CategoryManagementModal({
  categories,
  open,
  onClose,
  onSave,
  serviceCounts,
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
      color: newCategoryColor,
      order: categoryList.length,
      isActive: true,
    };

    setCategoryList((prev) => [...prev, newCategory]);
    setNewCategoryName('');
    setNewCategoryColor('blue');
  };

  const handleEditStart = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditSave = () => {
    if (!editingName.trim()) return;

    setCategoryList((prev) =>
      prev.map((cat) =>
        cat.id === editingId ? { ...cat, name: editingName.trim() } : cat
      )
    );
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
      if (
        !confirm(
          `이 카테고리에는 ${serviceCount}개의 서비스가 있습니다. 정말 삭제하시겠습니까?`
        )
      ) {
        return;
      }
    }
    setCategoryList((prev) => prev.filter((cat) => cat.id !== categoryId));
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
      gray: 'bg-gray-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl overflow-hidden p-0">
        <DialogHeader className="border-b border-gray-200 p-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            카테고리 관리
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          {/* 좌측: 기존 카테고리 목록 */}
          <div className="flex-1 border-r border-gray-200 p-6">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              기존 카테고리
            </h3>
            <div className="max-h-[500px] space-y-3 overflow-y-auto">
              {categoryList.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3"
                >
                  <div
                    className={`h-4 w-4 rounded-full ${getColorClass(category.color)}`}
                  />

                  {editingId === category.id ? (
                    <div className="flex flex-1 items-center gap-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <Check size={20} className="text-white" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="취소"
                      >
                        <X size={16} className="text-gray-600 hover:text-gray-800" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {category.name}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          ({serviceCounts[category.id] || 0}개 서비스)
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditStart(category)}
                          className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                          title="편집"
                        >
                          <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-1 text-gray-400 transition-colors hover:text-red-600"
                          title="삭제"
                        >
                          <Trash2 size={20} className="text-gray-600 hover:text-red-600" />
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
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              새 카테고리 추가
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  카테고리명
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="카테고리명을 입력하세요"
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
                      onClick={() => setNewCategoryColor(color.value)}
                      className={`flex items-center gap-2 rounded-lg border-2 p-2 transition-colors ${
                        newCategoryColor === color.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`h-4 w-4 rounded-full ${color.class}`} />
                      <span className="text-sm">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                variant="default"
                className="w-full"
              >
                <Plus size={20} className="mr-2 text-white" />
                카테고리 추가
              </Button>
            </div>

            {/* 미리보기 */}
            {newCategoryName && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  미리보기
                </h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-full ${getColorClass(newCategoryColor)}`}
                  />
                  <span className="font-medium">{newCategoryName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 pb-6 pt-4">
          <DialogFooter className="flex-row justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleSave}
              variant="default"
            >
              변경사항 저장
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
