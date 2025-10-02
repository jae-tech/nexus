export interface VisitRecord {
  id: string;
  date: string;
  services: string[];
  employee: {
    id: string;
    name: string;
    avatar?: string;
  };
  memo?: string;
  amount?: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  gender?: 'male' | 'female';
  birthDate?: string;
  registeredAt: string;
  personalMemo: string;
  visitHistory: VisitRecord[];
}

export const mockCustomerDetail: Customer = {
  id: '1',
  name: '김민지',
  phone: '010-1234-5678',
  gender: 'female',
  birthDate: '1995-03-15',
  registeredAt: '2024-01-15',
  personalMemo:
    '염색 알레르기 있음, 자연스러운 스타일 선호. 매번 같은 스타일링 요청하는 편이고, 트리트먼트는 꼭 받으시길 좋아함.',
  visitHistory: [
    {
      id: '1',
      date: '2024-12-10',
      services: ['여성 컷', '염색'],
      employee: {
        id: '1',
        name: '이수진',
        avatar:
          'https://readdy.ai/api/search-image?query=Professional%20female%20hairstylist%20portrait%2C%20realistic%20photography%2C%20warm%20lighting%2C%20friendly%20smile%2C%20salon%20background%2C%20professional%20appearance&width=40&height=40&seq=staff1&orientation=squarish',
      },
      memo: '어깨 길이로 자르고 내추럴 브라운 염색. 앞머리 시스루로 정리',
      amount: 85000,
    },
    {
      id: '2',
      date: '2024-11-15',
      services: ['여성 컷', '트리트먼트'],
      employee: {
        id: '1',
        name: '이수진',
        avatar:
          'https://readdy.ai/api/search-image?query=Professional%20female%20hairstylist%20portrait%2C%20realistic%20photography%2C%20warm%20lighting%2C%20friendly%20smile%2C%20salon%20background%2C%20professional%20appearance&width=40&height=40&seq=staff1&orientation=squarish',
      },
      memo: '기존 스타일 유지하면서 다듬기. 케라틴 트리트먼트 적용',
      amount: 65000,
    },
    {
      id: '3',
      date: '2024-10-22',
      services: ['여성 컷', '퍼머'],
      employee: {
        id: '2',
        name: '김하늘',
        avatar:
          'https://readdy.ai/api/search-image?query=Professional%20female%20hairstylist%20portrait%2C%20realistic%20photography%2C%20warm%20lighting%2C%20friendly%20smile%2C%20salon%20background%2C%20professional%20appearance&width=40&height=40&seq=staff2&orientation=squarish',
      },
      memo: '볼륨 퍼머로 자연스러운 웨이브 연출',
      amount: 95000,
    },
    {
      id: '4',
      date: '2024-09-28',
      services: ['여성 컷'],
      employee: {
        id: '1',
        name: '이수진',
        avatar:
          'https://readdy.ai/api/search-image?query=Professional%20female%20hairstylist%20portrait%2C%20realistic%20photography%2C%20warm%20lighting%2C%20friendly%20smile%2C%20salon%20background%2C%20professional%20appearance&width=40&height=40&seq=staff1&orientation=squarish',
      },
      memo: '레이어드 컷으로 볼륨감 살리기',
      amount: 35000,
    },
    {
      id: '5',
      date: '2024-08-20',
      services: ['여성 컷', '염색', '트리트먼트'],
      employee: {
        id: '1',
        name: '이수진',
        avatar:
          'https://readdy.ai/api/search-image?query=Professional%20female%20hairstylist%20portrait%2C%20realistic%20photography%2C%20warm%20lighting%2C%20friendly%20smile%2C%20salon%20background%2C%20professional%20appearance&width=40&height=40&seq=staff1&orientation=squarish',
      },
      memo: '첫 방문. 긴 머리에서 단발로 변신. 애쉬 브라운 염색',
      amount: 120000,
    },
  ],
};
