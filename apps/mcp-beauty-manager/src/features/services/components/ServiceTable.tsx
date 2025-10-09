import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description?: string;
  isActive: boolean;
  monthlyUsage: number;
  averageRating: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

interface ServiceTableProps {
  services: Service[];
  onToggleActive: (serviceId: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const categoryColors: Record<string, string> = {
  '1': 'bg-blue-100 text-blue-800',
  '2': 'bg-pink-100 text-pink-800',
  '3': 'bg-green-100 text-green-800',
  '4': 'bg-gray-100 text-gray-800',
};

export default function ServiceTable({
  services,
  onToggleActive,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                서비스명
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                카테고리
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                가격
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                소요시간
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                이번달 이용
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                만족도
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {services.map((service) => (
              <tr
                key={service.id}
                className={`hover:bg-gray-50 ${!service.isActive ? 'opacity-60' : ''}`}
              >
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">
                      {service.name}
                    </div>
                    {service.monthlyUsage > 30 && (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        HOT
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <div className="mt-1 line-clamp-1 text-sm text-gray-500">
                      {service.description}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <span
                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                      categoryColors[service.categoryId] ||
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.categoryName}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(service.basePrice)}원
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="text-sm text-gray-600">
                    {formatDuration(service.duration)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <button
                    onClick={() => onToggleActive(service.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      service.isActive ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        service.isActive ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {service.monthlyUsage}회
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(service.averageRating)
                              ? 'ri-star-fill'
                              : i === Math.floor(service.averageRating) &&
                                  service.averageRating % 1 >= 0.5
                                ? 'ri-star-half-fill'
                                : 'ri-star-line text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-gray-600">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="rounded p-1 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="수정"
                    >
                      <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="삭제"
                    >
                      <Trash2 size={20} className="text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
