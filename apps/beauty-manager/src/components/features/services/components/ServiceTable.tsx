
import React from 'react';
import { Edit, Trash2, Star } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서비스명
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소요시간
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이번달 이용
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                만족도
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr
                key={service.id}
                className={`hover:bg-gray-50 ${!service.isActive ? 'opacity-60' : ''}`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    {service.monthlyUsage > 30 && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        HOT
                      </span>
                    )}
                  </div>
                  {service.description && (
                    <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {service.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      categoryColors[service.categoryId] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {service.categoryName}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(service.basePrice)}원
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDuration(service.duration)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(service.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-ring ${
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
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{service.monthlyUsage}회</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.floor(service.averageRating)
                              ? 'fill-yellow-400'
                              : 'text-gray-300'
                          }
                          fill={i < Math.floor(service.averageRating) ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(service)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(service.id)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="삭제"
                    >
                      <Trash2 size={16} />
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
