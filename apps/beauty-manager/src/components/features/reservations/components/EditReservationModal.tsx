import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Check, User } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@nexus/ui";

interface Customer {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  registeredDate: string;
  memo: string;
  visitCount: number;
  lastVisit: string;
  lastService: string;
  mainStaff: string;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: "active" | "inactive";
  monthlyCustomers: number;
}

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  active: boolean;
}

interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  employeeId: string;
  employeeName: string;
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  memo?: string;
  amount?: number;
  createdAt: string;
}

interface EditReservationModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSave: (reservation: Reservation) => void;
  customers: Customer[];
  staff: Staff[];
  services: Service[];
}

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

export default function EditReservationModal({
  reservation,
  onClose,
  onSave,
  customers,
  staff,
  services,
}: EditReservationModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(reservation.date);
  const [selectedTime, setSelectedTime] = useState(reservation.startTime);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(reservation.status);
  const [memo, setMemo] = useState(reservation.memo || "");
  const [customAmount, setCustomAmount] = useState(
    reservation.amount?.toString() || ""
  );

  // 초기 데이터 설정
  useEffect(() => {
    // 고객 설정
    const customer = customers.find(
      (c) => c.id.toString() === reservation.customerId
    );
    if (customer) {
      setSelectedCustomer(customer);
    }

    // 직원 설정
    const employee = staff.find((s) => s.id === reservation.employeeId);
    if (employee) {
      setSelectedEmployee(employee);
    }

    // 서비스 설정
    const reservationServices = reservation.services
      .map((resService) => {
        return services.find((s) => s.id === resService.id);
      })
      .filter(Boolean) as Service[];
    setSelectedServices(reservationServices);
  }, [reservation, customers, staff, services]);

  // 선택된 서비스들의 총 소요시간 계산
  const totalDuration = selectedServices.reduce(
    (sum, service) => sum + service.duration,
    0
  );

  // 종료 시간 계산
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`;
  };

  // 총 금액 계산
  const totalAmount = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const handleServiceToggle = (service: Service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === service.id);
      if (exists) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSave = () => {
    if (
      !selectedCustomer ||
      !selectedEmployee ||
      selectedServices.length === 0
    ) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    const updatedReservation: Reservation = {
      ...reservation,
      customerId: selectedCustomer.id.toString(),
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      date: selectedDate,
      startTime: selectedTime,
      endTime: calculateEndTime(selectedTime, totalDuration),
      services: selectedServices.map((service) => ({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
      })),
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      status: selectedStatus,
      memo: memo.trim() || undefined,
      amount: customAmount ? parseInt(customAmount) : totalAmount,
    };

    onSave(updatedReservation);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">예약 수정</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 고객 정보 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  고객 정보
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-900">
                    {selectedCustomer?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedCustomer?.phone}
                  </div>
                </div>
              </div>

              {/* 날짜 및 시간 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  날짜 및 시간
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <Select
                      value={selectedTime}
                      onValueChange={(value) => setSelectedTime(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="시간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* 서비스 선택 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  서비스
                </h3>
                <div className="space-y-4">
                  {["헤어", "네일", "케어"].map((category) => {
                    const categoryServices = services.filter(
                      (service) => service.category === category
                    );
                    if (categoryServices.length === 0) return null;

                    return (
                      <div key={category}>
                        <h4 className="font-medium text-gray-900 mb-2">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryServices.map((service) => (
                            <div
                              key={service.id}
                              onClick={() => handleServiceToggle(service)}
                              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                selectedServices.find(
                                  (s) => s.id === service.id
                                )
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {service.duration}분 ·{" "}
                                    {service.price.toLocaleString()}원
                                  </div>
                                </div>
                                {selectedServices.find(
                                  (s) => s.id === service.id
                                ) && (
                                  <Check size={20} className="text-blue-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 담당 직원 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  담당 직원
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedEmployee?.id === employee.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {employee.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 예약 상태 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  예약 상태
                </h3>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as Reservation["status"])
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">예약됨</SelectItem>
                    <SelectItem value="completed">완료</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                    <SelectItem value="no-show">노쇼</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 메모 및 금액 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메모
                  </label>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="특별한 요청사항이나 주의사항"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    금액
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`기본 금액: ${totalAmount.toLocaleString()}원`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer - 통일된 버튼 배치 */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">예약 정보</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">고객</div>
              <div className="font-medium text-gray-900">
                {selectedCustomer?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedCustomer?.phone}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">일정</div>
              <div className="font-medium text-gray-900">
                {format(new Date(selectedDate), "M월 d일 (E)", { locale: ko })}
              </div>
              <div className="text-sm text-gray-600">
                {selectedTime} -{" "}
                {totalDuration > 0
                  ? calculateEndTime(selectedTime, totalDuration)
                  : "미정"}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">서비스</div>
              {selectedServices.length > 0 ? (
                <div className="space-y-1">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="text-sm">
                      <div className="font-medium text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-gray-600">
                        {service.duration}분 · {service.price.toLocaleString()}
                        원
                      </div>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="text-sm font-medium text-gray-900">
                      총 {totalDuration}분 ·{" "}
                      {(customAmount
                        ? parseInt(customAmount)
                        : totalAmount
                      ).toLocaleString()}
                      원
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">선택되지 않음</div>
              )}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">담당 직원</div>
              <div className="font-medium text-gray-900">
                {selectedEmployee?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedEmployee?.role}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">상태</div>
              <div
                className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  selectedStatus === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : selectedStatus === "completed"
                      ? "bg-green-100 text-green-800"
                      : selectedStatus === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {selectedStatus === "scheduled"
                  ? "예약됨"
                  : selectedStatus === "completed"
                    ? "완료"
                    : selectedStatus === "cancelled"
                      ? "취소"
                      : "노쇼"}
              </div>
            </div>

            {memo && (
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">메모</div>
                <div className="text-sm text-gray-900">{memo}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
