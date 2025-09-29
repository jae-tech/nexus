import { Customer } from '@/types';

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: '김민지',
    phone: '010-1234-5678',
    gender: '여성',
    birthday: '1995-03-15',
    registeredDate: '2024-01-15',
    memo: '염색 알레르기 있음, 자연스러운 스타일 선호',
    visitCount: 8,
    lastVisit: '2024-12-10',
    lastService: '컷 + 염색',
    mainStaff: '이수진'
  },
  {
    id: 2,
    name: '박지영',
    phone: '010-2345-6789',
    gender: '여성',
    birthday: '1988-07-22',
    registeredDate: '2023-11-20',
    memo: '짧은 스타일 선호, 매월 정기 방문',
    visitCount: 15,
    lastVisit: '2024-12-08',
    lastService: '펌 + 트리트먼트',
    mainStaff: '김하늘'
  },
  {
    id: 3,
    name: '최서연',
    phone: '010-3456-7890',
    gender: '여성',
    birthday: '1992-11-08',
    registeredDate: '2024-02-28',
    memo: '네일아트 전문, 화려한 디자인 좋아함',
    visitCount: 6,
    lastVisit: '2024-12-05',
    lastService: '젤네일 + 아트',
    mainStaff: '정미래'
  },
  {
    id: 4,
    name: '이하은',
    phone: '010-4567-8901',
    gender: '여성',
    birthday: '1990-05-12',
    registeredDate: '2023-08-10',
    memo: '민감성 피부, 순한 제품만 사용',
    visitCount: 12,
    lastVisit: '2024-12-03',
    lastService: '페이셜 케어',
    mainStaff: '박소영'
  },
  {
    id: 5,
    name: '정유진',
    phone: '010-5678-9012',
    gender: '여성',
    birthday: '1997-09-25',
    registeredDate: '2024-03-12',
    memo: '트렌디한 스타일 추구, SNS 참고 많이 함',
    visitCount: 4,
    lastVisit: '2024-11-28',
    lastService: '컷 + 스타일링',
    mainStaff: '이수진'
  }
];
