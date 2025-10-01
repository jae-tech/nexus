import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@nexus/ui";
import PageHeader from "@/components/common/PageHeader";
import { mockCustomers } from "@/mocks/customers";
import { Plus } from "lucide-react";

import { StatsGrid } from "@/components/features/dashboard/components/StatsGrid";
import { TodayReservations } from "@/components/features/dashboard/components/TodayReservations";
import { QuickActions } from "@/components/features/dashboard/components/QuickActions";
import { RecentCustomers } from "@/components/features/dashboard/components/RecentCustomers";
import { PopularServices } from "@/components/features/dashboard/components/PopularServices";
import { OverdueCustomers } from "@/components/features/dashboard/components/OverdueCustomers";

function DashBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // 통계 데이터
  const stats = {
    totalCustomers: mockCustomers.length,
    todayReservations: 3,
    activeStaff: 4,
    activeServices: 12,
  };

  // 오늘의 예약 목록
  const todayReservationList = [
    {
      id: "1",
      customerName: "김민지",
      startTime: "10:00",
      employeeName: "이수진",
      service: "컷 + 염색",
      status: "scheduled" as const,
    },
    {
      id: "2",
      customerName: "박지영",
      startTime: "14:00",
      employeeName: "김하늘",
      service: "펌 + 트리트먼트",
      status: "scheduled" as const,
    },
    {
      id: "3",
      customerName: "최서연",
      startTime: "16:30",
      employeeName: "정미래",
      service: "젤네일 + 아트",
      status: "scheduled" as const,
    },
  ];

  // 최근 등록 고객
  const recentCustomers = mockCustomers.slice(0, 3);

  // 인기 서비스
  const popularServices = [
    {
      rank: 1,
      name: "여성 컷",
      price: "35,000원",
      count: "46회",
    },
    { rank: 2, name: "마시지", price: "80,000원", count: "46회" },
    {
      rank: 3,
      name: "아이브로우",
      price: "25,000원",
      count: "46회",
    },
    {
      rank: 4,
      name: "페이셜 케어",
      price: "70,000원",
      count: "43회",
    },
    { rank: 5, name: "화장", price: "", count: "43회" },
  ];

  // 미방문 고객
  const overdueCustomers = [
    {
      name: "정유진",
      phone: "010-5678-9012",
      days: "305일",
      isOverdue: true,
    },
    {
      name: "최서연",
      phone: "010-3456-7890",
      days: "298일",
      isOverdue: true,
    },
    {
      name: "김민지",
      phone: "010-1234-5678",
      days: "오늘방문",
      isOverdue: false,
    },
  ];

  return (
    <div className="transition-all duration-300 pt-20">
      <PageHeader
        title="대시보드"
        actions={
          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/reservations">
              <Button variant="primary" size="sm">
                <Plus size={16} className="mr-1 md:mr-2" />
                <span className="hidden sm:inline">새 예약</span>
                <span className="sm:hidden">예약</span>
              </Button>
            </Link>
          </div>
        }
      />

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* 상단 통계 카드 */}
        <StatsGrid stats={stats} />

        {/* 메인 컨텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          {/* 좌측 영역 - 오늘의 예약 */}
          <div className="lg:col-span-3">
            <TodayReservations
              reservations={todayReservationList}
              currentDate={currentTime}
            />
          </div>

          {/* 우측 영역 - 빠른 작업 */}
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
        </div>

        {/* 하단 영역 - 3개 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <RecentCustomers customers={recentCustomers} />
          <PopularServices services={popularServices} />
          <OverdueCustomers customers={overdueCustomers} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/dashboard")({
  component: DashBoard,
});
