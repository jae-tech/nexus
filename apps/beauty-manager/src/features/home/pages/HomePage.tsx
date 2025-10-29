import { useState, useEffect } from 'react';
import { Cake, Calendar, CalendarDays, ChevronRight, Heart, Plus, Scissors, User, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCustomers } from '@/hooks/use-database';
import { useReservationsByDate } from '@/hooks/use-reservations';
import type { Customer, Staff, Service, ReservationWithDetails } from '@/lib/api-types';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const today = new Date().toISOString().split('T')[0];

  // DB 데이터 가져오기
  const { customers, loading: customersLoading } = useCustomers();
  const { reservations: todayReservationList, loading: reservationsLoading } = useReservationsByDate(today);

  // 직원 및 서비스 데이터
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [popularServices, setPopularServices] = useState<any[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  // 시간 업데이트 - 자동 새로고침 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 직원 데이터 로드
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setStaffLoading(true);
        const data = await window.api.db.getStaff();
        setStaff(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setStaffLoading(false);
      }
    };

    if (window.api) {
      fetchStaff();
    }
  }, []);

  // 서비스 및 인기 서비스 데이터 로드
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setServicesLoading(true);
        const [allServices, popularServicesData] = await Promise.all([
          window.api.db.getServices(),
          window.api.db.getPopularServices(5),
        ]);
        setServices(allServices);
        setPopularServices(popularServicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setServicesLoading(false);
      }
    };

    if (window.api) {
      fetchServices();
    }
  }, []);

  // 통계 데이터 계산
  const totalCustomers = customers.length;
  const todayReservations = todayReservationList.length;
  const activeStaff = staff.length;
  const activeServices = services.length;

  // 최근 등록 고객 (등록일 기준 최신 5명)
  const recentCustomers = customers
    .sort(
      (a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
    )
    .slice(0, 5);

  // 장기 미방문 고객 (30일 이상) - DB에서 visit history를 추적하지 않으므로 일단 빈 배열
  const longAbsentCustomers: Customer[] = [];

  // 생일 고객 체크 (오늘 생일인 고객)
  const birthdayCustomers = customers.filter((customer) => {
    if (!customer.birth_date) return false;
    const todayDate = new Date();
    const birthday = new Date(customer.birth_date);
    return (
      todayDate.getMonth() === birthday.getMonth() &&
      todayDate.getDate() === birthday.getDate()
    );
  });

  // 예약 상태별 통계
  const reservationStats = {
    scheduled: todayReservationList.filter((r) => r.status === 'pending' || r.status === 'confirmed')
      .length,
    completed: todayReservationList.filter((r) => r.status === 'completed')
      .length,
    cancelled: todayReservationList.filter((r) => r.status === 'cancelled')
      .length,
  };

  const quickActions = [
    {
      title: '새 예약 추가',
      description: '고객 예약을 빠르게 등록',
      icon: 'ri-calendar-event-line',
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      action: () => navigate({ to: '/appointments' }),
    },
    {
      title: '신규 고객 등록',
      description: '새로운 고객 정보 등록',
      icon: 'ri-user-add-line',
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700',
      action: () => navigate({ to: '/customers' }),
    },
    {
      title: '직원 스케줄 확인',
      description: '직원 근무 일정 관리',
      icon: 'ri-calendar-schedule-line',
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700',
      action: () => navigate({ to: '/staff' }),
    },
    {
      title: '서비스 관리',
      description: '서비스 메뉴 관리',
      icon: 'ri-scissors-line',
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700',
      action: () => navigate({ to: '/services' }),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '대기';
      case 'confirmed':
        return '확정';
      case 'completed':
        return '완료';
      case 'cancelled':
        return '취소';
      default:
        return status;
    }
  };

  const handleReservationClick = (reservationId: string) => {
    navigate({ to: `/appointments?highlight=${reservationId}` });
  };

  const handleCustomerClick = (customerId: number) => {
    navigate({ to: `/customers/${customerId}` });
  };

  return (
    <>
      <Header
        title="대시보드"
        actions={
          <Button onClick={() => navigate({ to: '/appointments' })}>
            <Plus size={20} className="mr-2 text-white" />
            새 예약
          </Button>
        }
      />

      <div className="p-4 md:p-8">
        {/* 생일 고객 알림 배너 */}
        {birthdayCustomers.length > 0 && (
          <div className="mb-6 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100 p-4">
            <div className="flex items-center">
              <Cake size={18} className="mr-3 text-gray-600" />
              <div>
                <h3 className="font-medium text-yellow-800">
                  오늘이 생일인 고객이 있어요! 🎉
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  {birthdayCustomers.map((c) => c.name).join(', ')}님의
                  생일입니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 상단 요약 카드 */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate({ to: '/customers' })}
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-blue-100 p-3">
                <User size={18} className="text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 고객</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalCustomers}명
                </p>
                <p className="mt-1 text-xs text-gray-500">클릭하여 관리</p>
              </div>
            </div>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate({ to: '/appointments' })}
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-green-100 p-3">
                <CalendarDays className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">오늘 예약</p>
                <p className="text-2xl font-bold text-gray-900">
                  {todayReservations}건
                </p>
                <div className="mt-1 flex gap-2 text-xs">
                  <span className="text-blue-600">
                    예약 {reservationStats.scheduled}
                  </span>
                  <span className="text-green-600">
                    완료 {reservationStats.completed}
                  </span>
                  <span className="text-red-600">
                    취소 {reservationStats.cancelled}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate({ to: '/staff' })}
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-purple-100 p-3">
                <Users size={18} className="text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">활성 직원</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeStaff}명
                </p>
                <p className="mt-1 text-xs text-gray-500">재직 중인 직원</p>
              </div>
            </div>
          </Card>

          <Card
            hover
            className="cursor-pointer"
            onClick={() => navigate({ to: '/services' })}
          >
            <div className="flex items-center">
              <div className="rounded-lg bg-orange-100 p-3">
                <Scissors size={18} className="text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  활성 서비스
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeServices}개
                </p>
                <p className="mt-1 text-xs text-gray-500">운영 중인 서비스</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-5">
          {/* 좌측 영역 - 오늘의 예약 (60% 폭) */}
          <div className="lg:col-span-3">
            <Card>
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      오늘의 예약
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {currentTime.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long',
                      })}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate({ to: '/appointments' })}
                  >
                    전체 보기
                  </Button>
                </div>

                {todayReservationList.length > 0 ? (
                  <div className="max-h-96 space-y-3 overflow-y-auto">
                    {todayReservationList.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
                        onClick={() => handleReservationClick(String(reservation.id))}
                      >
                        <div className="flex flex-1 items-center">
                          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <p className="truncate font-medium text-gray-900">
                                {reservation.customer_name}
                              </p>
                              <span className="text-sm font-medium text-blue-600">
                                {reservation.start_time}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span>{reservation.staff_name || '미정'}</span>
                              <span>•</span>
                              <span className="truncate">{reservation.service_name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(reservation.status)}`}
                          >
                            {getStatusText(reservation.status)}
                          </span>
                          <ChevronRight size={18} className="text-gray-600" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Calendar size={18} className="mb-3 text-gray-600" />
                    <p className="mb-2 text-lg text-gray-500">
                      오늘 예약이 없습니다
                    </p>
                    <p className="text-sm text-gray-400">
                      새로운 예약을 추가해보세요
                    </p>
                    <Button
                      className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => navigate({ to: '/appointments' })}
                    >
                      <Plus size={20} className="mr-2 text-white" />새 예약 추가
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* 우측 영역 - 빠른 작업 (40% 폭) */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">
                  빠른 작업
                </h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`flex w-full items-center rounded-xl p-4 ${action.color} ${action.hoverColor} transform text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl`}
                    >
                      <div className="mr-4 rounded-lg bg-white bg-opacity-20 p-2">
                        <i className={`${action.icon} text-xl`} />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">
                          {action.title}
                        </p>
                        <p className="text-sm text-white text-opacity-90">
                          {action.description}
                        </p>
                      </div>
                      <ChevronRight size={18} className="text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 하단 영역 - 최근 활동 */}
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
          {/* 최근 등록 고객 */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  최근 등록 고객
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate({ to: '/customers' })}
                >
                  전체 보기
                </Button>
              </div>

              <div className="space-y-3">
                {recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex cursor-pointer items-center rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    onClick={() => handleCustomerClick(customer.id!)}
                  >
                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <User size={18} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {customer.name}
                      </p>
                      <p className="truncate text-sm text-gray-600">
                        {customer.phone}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {customer.created_at ? Math.floor(
                        (new Date().getTime() -
                          new Date(customer.created_at).getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) : 0}
                      일 전
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 이번 주 인기 서비스 */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  인기 서비스 TOP 5
                </h3>
                <span className="text-sm text-gray-500">이번 주</span>
              </div>

              <div className="space-y-3">
                {popularServices.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : index === 1
                              ? 'bg-gray-100 text-gray-800'
                              : index === 2
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {service.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {service.total_bookings || 0}회
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* 장기 미방문 고객 알림 */}
          <Card>
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  미방문 고객 알림
                </h3>
                <span className="text-sm text-red-500">30일 이상</span>
              </div>

              <div className="py-8 text-center">
                <Heart className="h-10 w-10 mb-2 mx-auto text-gray-400" />
                <p className="font-medium text-gray-600">
                  데이터 준비 중
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  미방문 고객 추적 기능은 곧 추가됩니다
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
