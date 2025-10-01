import { Link } from "@tanstack/react-router";
import { Button } from "@nexus/ui";
import { Plus, Calendar } from "lucide-react";
import { DashboardSection } from "./DashboardSection";
import { SectionHeader } from "./SectionHeader";
import { ReservationItem } from "./ReservationItem";

interface Reservation {
  id: string;
  customerName: string;
  startTime: string;
  employeeName: string;
  service: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface TodayReservationsProps {
  reservations: Reservation[];
  currentDate: Date;
}

export function TodayReservations({
  reservations,
  currentDate,
}: TodayReservationsProps) {
  const dateString = currentDate.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <DashboardSection className="h-full flex flex-col">
      <SectionHeader
        title="오늘의 예약"
        subtitle={dateString}
        showViewAll
        viewAllPath="/reservations"
      />

      {reservations.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {reservations.map((reservation) => (
            <ReservationItem key={reservation.id} {...reservation} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Calendar size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg mb-2">오늘 예약이 없습니다</p>
          <p className="text-gray-400 text-sm">새로운 예약을 추가해보세요</p>
          <Link to="/reservations">
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus size={16} className="mr-2" />
              새 예약 추가
            </Button>
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
