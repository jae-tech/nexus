"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockPriceHistory = exports.mockServiceCategories = void 0;
exports.mockServiceCategories = [
    {
        id: '1',
        name: '헤어',
        color: '#3B82F6',
        icon: 'ri-scissors-line',
        order: 1,
        isActive: true
    },
    {
        id: '2',
        name: '네일',
        color: '#EC4899',
        icon: 'ri-hand-heart-line',
        order: 2,
        isActive: true
    },
    {
        id: '3',
        name: '케어',
        color: '#10B981',
        icon: 'ri-heart-pulse-line',
        order: 3,
        isActive: true
    },
    {
        id: '4',
        name: '기타',
        color: '#6B7280',
        icon: 'ri-more-line',
        order: 4,
        isActive: true
    }
];
exports.mockPriceHistory = [
    {
        id: '1',
        serviceId: '1',
        oldPrice: 30000,
        newPrice: 35000,
        changeDate: '2024-01-15',
        reason: '물가 상승 반영',
        updatedBy: '김매니저'
    },
    {
        id: '2',
        serviceId: '3',
        oldPrice: 75000,
        newPrice: 80000,
        changeDate: '2024-02-01',
        reason: '재료비 인상',
        updatedBy: '김매니저'
    }
];
