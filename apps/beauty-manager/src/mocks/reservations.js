"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceCategories = exports.timeSlots = exports.mockReservations = void 0;
exports.mockReservations = [
    {
        id: '1',
        customerId: '1',
        customerName: '김민지',
        customerPhone: '010-1234-5678',
        date: '2024-12-16',
        startTime: '10:00',
        endTime: '12:00',
        services: [
            { id: '1', name: '여성 컷', duration: 60, price: 35000 },
            { id: '3', name: '염색', duration: 120, price: 80000 }
        ],
        employeeId: '1',
        employeeName: '이수진',
        status: 'scheduled',
        memo: '자연스러운 브라운 톤으로 염색 희망',
        amount: 115000,
        createdAt: '2024-12-10T09:00:00Z'
    },
    {
        id: '2',
        customerId: '2',
        customerName: '박지영',
        customerPhone: '010-2345-6789',
        date: '2024-12-16',
        startTime: '14:00',
        endTime: '17:00',
        services: [
            { id: '4', name: '펌', duration: 180, price: 120000 }
        ],
        employeeId: '2',
        employeeName: '김하늘',
        status: 'scheduled',
        memo: '볼륨 펌으로 부탁드립니다',
        amount: 120000,
        createdAt: '2024-12-12T14:30:00Z'
    },
    {
        id: '3',
        customerId: '3',
        customerName: '최서연',
        customerPhone: '010-3456-7890',
        date: '2024-12-16',
        startTime: '16:30',
        endTime: '18:00',
        services: [
            { id: '6', name: '젤네일', duration: 90, price: 50000 }
        ],
        employeeId: '3',
        employeeName: '정미래',
        status: 'scheduled',
        memo: '크리스마스 테마 네일아트',
        amount: 50000,
        createdAt: '2024-12-13T11:15:00Z'
    },
    {
        id: '4',
        customerId: '4',
        customerName: '이하은',
        customerPhone: '010-4567-8901',
        date: '2024-12-17',
        startTime: '11:00',
        endTime: '12:30',
        services: [
            { id: '8', name: '페이셜 케어', duration: 90, price: 70000 }
        ],
        employeeId: '4',
        employeeName: '박소영',
        status: 'scheduled',
        memo: '민감성 피부용 제품 사용',
        amount: 70000,
        createdAt: '2024-12-14T16:20:00Z'
    },
    {
        id: '5',
        customerId: '5',
        customerName: '정유진',
        customerPhone: '010-5678-9012',
        date: '2024-12-17',
        startTime: '15:00',
        endTime: '16:00',
        services: [
            { id: '2', name: '남성 컷', duration: 45, price: 25000 }
        ],
        employeeId: '1',
        employeeName: '이수진',
        status: 'scheduled',
        memo: '짧게 깔끔하게',
        amount: 25000,
        createdAt: '2024-12-15T10:45:00Z'
    },
    {
        id: '6',
        customerId: '1',
        customerName: '김민지',
        customerPhone: '010-1234-5678',
        date: '2024-12-15',
        startTime: '10:00',
        endTime: '11:00',
        services: [
            { id: '1', name: '여성 컷', duration: 60, price: 35000 }
        ],
        employeeId: '1',
        employeeName: '이수진',
        status: 'completed',
        memo: '레이어드 컷',
        amount: 35000,
        createdAt: '2024-12-10T09:00:00Z'
    },
    {
        id: '7',
        customerId: '2',
        customerName: '박지영',
        customerPhone: '010-2345-6789',
        date: '2024-12-18',
        startTime: '13:00',
        endTime: '15:30',
        services: [
            { id: '5', name: '트리트먼트', duration: 90, price: 45000 },
            { id: '1', name: '여성 컷', duration: 60, price: 35000 }
        ],
        employeeId: '2',
        employeeName: '김하늘',
        status: 'scheduled',
        memo: '모발 손상 케어 중점',
        amount: 80000,
        createdAt: '2024-12-16T09:30:00Z'
    },
    {
        id: '8',
        customerId: '3',
        customerName: '최서연',
        customerPhone: '010-3456-7890',
        date: '2024-12-19',
        startTime: '10:30',
        endTime: '12:00',
        services: [
            { id: '7', name: '네일아트', duration: 60, price: 20000 }
        ],
        employeeId: '3',
        employeeName: '정미래',
        status: 'scheduled',
        memo: '심플한 프렌치 네일',
        amount: 20000,
        createdAt: '2024-12-16T14:20:00Z'
    }
];
exports.timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];
exports.serviceCategories = [
    { id: 'hair', name: '헤어', color: 'bg-blue-100 text-blue-800' },
    { id: 'nail', name: '네일', color: 'bg-pink-100 text-pink-800' },
    { id: 'care', name: '케어', color: 'bg-green-100 text-green-800' },
    { id: 'other', name: '기타', color: 'bg-gray-100 text-gray-800' }
];
