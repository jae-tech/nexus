import { ServiceItem, ServiceCategory } from '@/types';

export const mockServices: ServiceItem[] = [
  {
    id: '1',
    name: '여성 컷',
    categoryId: '1',
    categoryName: '헤어',
    basePrice: 35000,
    duration: 60,
    description: '기본 여성 헤어컷 서비스',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    monthlyUsage: 45,
    averageRating: 4.8,
    totalRevenue: 1575000,
    priceOptions: [
      { id: '1-1', name: '긴 머리 추가', additionalPrice: 5000, description: '어깨 아래 긴 머리' }
    ]
  },
  {
    id: '2',
    name: '남성 컷',
    categoryId: '1',
    categoryName: '헤어',
    basePrice: 25000,
    duration: 45,
    description: '기본 남성 헤어컷 서비스',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 38,
    averageRating: 4.6,
    totalRevenue: 950000
  },
  {
    id: '3',
    name: '염색',
    categoryId: '1',
    categoryName: '헤어',
    basePrice: 80000,
    duration: 120,
    description: '전체 염색 서비스 (컷 별도)',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-02-01',
    monthlyUsage: 28,
    averageRating: 4.9,
    totalRevenue: 2240000,
    priceOptions: [
      { id: '3-1', name: '디자인 염색', additionalPrice: 30000, description: '그라데이션, 옴브레 등' },
      { id: '3-2', name: '블리치 추가', additionalPrice: 20000, description: '탈색 필요시' }
    ]
  },
  {
    id: '4',
    name: '펌',
    categoryId: '1',
    categoryName: '헤어',
    basePrice: 120000,
    duration: 180,
    description: '기본 펌 서비스 (컷 별도)',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 22,
    averageRating: 4.7,
    totalRevenue: 2640000,
    priceOptions: [
      { id: '4-1', name: '디지털 펌', additionalPrice: 20000, description: '열펌 방식' }
    ]
  },
  {
    id: '5',
    name: '트리트먼트',
    categoryId: '1',
    categoryName: '헤어',
    basePrice: 45000,
    duration: 90,
    description: '모발 영양 트리트먼트',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 35,
    averageRating: 4.8,
    totalRevenue: 1575000
  },
  {
    id: '6',
    name: '젤네일',
    categoryId: '2',
    categoryName: '네일',
    basePrice: 50000,
    duration: 90,
    description: '기본 젤네일 서비스',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 42,
    averageRating: 4.9,
    totalRevenue: 2100000,
    priceOptions: [
      { id: '6-1', name: '연장 네일', additionalPrice: 10000, description: '길이 연장시' },
      { id: '6-2', name: '스톤 추가', additionalPrice: 5000, description: '스톤 장식' }
    ]
  },
  {
    id: '7',
    name: '네일아트',
    categoryId: '2',
    categoryName: '네일',
    basePrice: 20000,
    duration: 60,
    description: '기본 네일아트 (젤네일 별도)',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 38,
    averageRating: 4.7,
    totalRevenue: 760000,
    priceOptions: [
      { id: '7-1', name: '복잡한 아트', additionalPrice: 15000, description: '세밀한 디자인' }
    ]
  },
  {
    id: '8',
    name: '페이셜 케어',
    categoryId: '3',
    categoryName: '케어',
    basePrice: 70000,
    duration: 90,
    description: '기본 얼굴 관리 서비스',
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    monthlyUsage: 32,
    averageRating: 4.8,
    totalRevenue: 2240000,
    priceOptions: [
      { id: '8-1', name: '프리미엄 케어', additionalPrice: 30000, description: '고급 제품 사용' }
    ]
  }
];

export const mockServiceCategories: ServiceCategory[] = [
  { id: '1', name: '헤어', color: 'bg-blue-100 text-blue-800' },
  { id: '2', name: '네일', color: 'bg-pink-100 text-pink-800' },
  { id: '3', name: '케어', color: 'bg-green-100 text-green-800' },
  { id: '4', name: '기타', color: 'bg-gray-100 text-gray-800' }
];