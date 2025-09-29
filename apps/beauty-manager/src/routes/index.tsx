import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@nexus/ui'
import Card from '@/components/ui/Card'
import PageHeader from '@/components/common/PageHeader'
import { mockCustomers } from '@/mocks/customers'
import { Calendar, CalendarPlus, UserPlus, Clock, Scissors } from 'lucide-react'

function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  // 통계 데이터 계산
  const totalCustomers = mockCustomers.length
  const todayReservations = 3 // 모의 데이터
  const activeStaff = 4
  const activeServices = 12

  // 오늘의 예약 목록 (모의 데이터)
  const todayReservationList = [
    {
      id: '1',
      customerName: '김민지',
      startTime: '10:00',
      employeeName: '이수진',
      service: '컷 + 염색',
      status: 'scheduled'
    },
    {
      id: '2',
      customerName: '박지영',
      startTime: '14:00',
      employeeName: '김하늘',
      service: '펌 + 트리트먼트',
      status: 'scheduled'
    },
    {
      id: '3',
      customerName: '최서연',
      startTime: '16:30',
      employeeName: '정미래',
      service: '젤네일 + 아트',
      status: 'scheduled'
    }
  ]

  // 최근 등록 고객
  const recentCustomers = mockCustomers.slice(0, 3)

  // 빠른 작업 버튼들
  const quickActions = [
    {
      title: '새 예약 추가',
      description: '고객 예약을 빠르게 등록',
      icon: CalendarPlus,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      path: '/reservations'
    },
    {
      title: '신규 고객 등록',
      description: '새로운 고객 정보 등록',
      icon: UserPlus,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      path: '/customers'
    },
    {
      title: '직원 스케줄 확인',
      description: '직원 근무 일정 관리',
      icon: Clock,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      path: '/staff'
    },
    {
      title: '서비스 관리',
      description: '서비스 메뉴 관리',
      icon: Scissors,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      path: '/services'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '예약됨'
      case 'completed':
        return '완료'
      case 'cancelled':
        return '취소'
      default:
        return status
    }
  }

  return (
    <div className="transition-all duration-300 pt-20">
      <PageHeader
        title="대시보드"
        actions={
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/reservations">
              <Button variant="primary" size="sm">
                <i className="ri-add-line mr-1 md:mr-2"></i>
                <span className="hidden sm:inline">새 예약</span>
                <span className="sm:hidden">예약</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* 상단 요약 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card hover className="cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <i className="ri-user-line text-2xl text-blue-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 고객</p>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}명</p>
                <p className="text-xs text-gray-500 mt-1">클릭하여 관리</p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <i className="ri-calendar-event-line text-2xl text-green-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오늘 예약</p>
                <p className="text-2xl font-bold text-gray-900">{todayReservations}건</p>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="text-blue-600">예약 3</span>
                  <span className="text-green-600">완료 0</span>
                  <span className="text-red-600">취소 0</span>
                </div>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <i className="ri-team-line text-2xl text-purple-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 직원</p>
                <p className="text-2xl font-bold text-gray-900">{activeStaff}명</p>
                <p className="text-xs text-gray-500 mt-1">재직 중인 직원</p>
              </div>
            </div>
          </Card>

          <Card hover className="cursor-pointer">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <i className="ri-scissors-line text-2xl text-orange-600"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 서비스</p>
                <p className="text-2xl font-bold text-gray-900">{activeServices}개</p>
                <p className="text-xs text-gray-500 mt-1">운영 중인 서비스</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          {/* 좌측 영역 - 오늘의 예약 */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">오늘의 예약</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {currentTime.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                  </div>
                  <Link to="/reservations">
                    <Button variant="outline" size="sm">전체 보기</Button>
                  </Link>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {todayReservationList.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                          <i className="ri-user-line text-blue-600"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-gray-900 truncate">{reservation.customerName}</p>
                            <span className="text-sm font-medium text-blue-600">
                              {reservation.startTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>{reservation.employeeName}</span>
                            <span>•</span>
                            <span className="truncate">{reservation.service}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </span>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 우측 영역 - 빠른 작업 */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Link key={index} to={action.path}>
                        <button
                          className={`w-full flex items-center p-4 rounded-xl ${action.color} ${action.hoverColor} text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
                        >
                          <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
                            <IconComponent size={24} className="text-white" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-white">{action.title}</p>
                            <p className="text-sm text-white text-opacity-90">{action.description}</p>
                          </div>
                          <i className="ri-arrow-right-s-line ml-auto text-white text-opacity-70"></i>
                        </button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 하단 영역 - 3개 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* 최근 등록 고객 */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">최근 등록 고객</h3>
                <Link to="/customers">
                  <Button variant="outline" size="sm">전체 보기</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <i className="ri-user-line text-blue-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                      <p className="text-sm text-gray-600 truncate">{customer.phone}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.floor((new Date().getTime() - new Date(customer.registeredDate).getTime()) / (1000 * 60 * 60 * 24))}일 전
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 인기 서비스 TOP 5 */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">인기 서비스 TOP 5</h3>
                <span className="text-sm text-gray-500">이번 주</span>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: '여성 컷', price: '35,000원', count: '46회' },
                  { rank: 2, name: '마시지', price: '80,000원', count: '46회' },
                  { rank: 3, name: '아이브로우', price: '25,000원', count: '46회' },
                  { rank: 4, name: '페이셜 케어', price: '70,000원', count: '43회' },
                  { rank: 5, name: '화장', price: '', count: '43회' }
                ].map((service) => (
                  <div key={service.rank} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full flex items-center justify-center mr-3">
                        {service.rank}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.price}</p>
                      </div>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">{service.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 미방문 고객 알림 */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">미방문 고객 알림</h3>
                <span className="text-sm text-red-500">30일 이상</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: '정유진', phone: '010-5678-9012', days: '305일', isOverdue: true },
                  { name: '최서연', phone: '010-3456-7890', days: '298일', isOverdue: true },
                  { name: '김민지', phone: '010-1234-5678', days: '오늘방문', isOverdue: false }
                ].map((customer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-user-line text-red-600"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${customer.isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                      {customer.days}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})