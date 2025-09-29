import { Reservation } from '@/types';

export const mockReservations: Reservation[] = [
  {
    id: '1',
    customerId: '1',
    customerName: '김민지',
    customerPhone: '010-1234-5678',
    date: '2024-12-29',
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
    createdAt: '2024-12-20T09:00:00Z'
  },
  {
    id: '2',
    customerId: '2',
    customerName: '박지영',
    customerPhone: '010-2345-6789',
    date: '2024-12-29',
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
    createdAt: '2024-12-22T14:30:00Z'
  },
  {
    id: '3',
    customerId: '3',
    customerName: '최서연',
    customerPhone: '010-3456-7890',
    date: '2024-12-29',
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
    createdAt: '2024-12-23T11:15:00Z'
  },
  {
    id: '4',
    customerId: '4',
    customerName: '이하은',
    customerPhone: '010-4567-8901',
    date: '2024-12-30',
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
    createdAt: '2024-12-24T16:20:00Z'
  },
  {
    id: '5',
    customerId: '5',
    customerName: '정유진',
    customerPhone: '010-5678-9012',
    date: '2024-12-30',
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
    createdAt: '2024-12-25T10:45:00Z'
  }
];

export const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];