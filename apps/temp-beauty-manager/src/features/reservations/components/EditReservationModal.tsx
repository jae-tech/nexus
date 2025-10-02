import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  status: 'active' | 'inactive';
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
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
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
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
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
  const [memo, setMemo] = useState(reservation.memo || '');
  const [customAmount, setCustomAmount] = useState(
    reservation.amount?.toString() || ''
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
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
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
      alert('필수 정보를 모두 입력해주세요.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white">
        {/* 메인 컨텐츠 */}
        <div className="flex flex-1 flex-col">
          {/* 헤더 */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">예약 수정</h2>
              <button
                onClick={onClose}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 고객 정보 */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  고객 정보
                </h3>
                <div className="rounded-lg bg-gray-50 p-4">
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
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  날짜 및 시간
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      시작 시간
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 서비스 선택 */}
              <div>
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  서비스
                </h3>
                <div className="space-y-4">
                  {['헤어', '네일', '케어'].map((category) => {
                    const categoryServices = services.filter(
                      (service) => service.category === category
                    );
                    if (categoryServices.length === 0) return null;

                    return (
                      <div key={category}>
                        <h4 className="mb-2 font-medium text-gray-900">
                          {category}
                        </h4>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          {categoryServices.map((service) => (
                            <div
                              key={service.id}
                              onClick={() => handleServiceToggle(service)}
                              className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                                selectedServices.find(
                                  (s) => s.id === service.id
                                )
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {service.name}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {service.duration}분 ·{' '}
                                    {service.price.toLocaleString()}원
                                  </div>
                                </div>
                                {selectedServices.find(
                                  (s) => s.id === service.id
                                ) && (
                                  <i className="ri-check-line text-blue-500" />
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
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  담당 직원
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {staff.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                        selectedEmployee?.id === employee.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                          <i className="ri-user-line text-gray-600" />
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
                <h3 className="mb-3 text-lg font-medium text-gray-900">
                  예약 상태
                </h3>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as Reservation['status'])
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">예약됨</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                  <option value="no-show">노쇼</option>
                </select>
              </div>

              {/* 메모 및 금액 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    메모
                  </label>
                  <textarea
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="특별한 요청사항이나 주의사항"
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    금액
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={`기본 금액: ${totalAmount.toLocaleString()}원`}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">예약 정보</h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">고객</div>
              <div className="font-medium text-gray-900">
                {selectedCustomer?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedCustomer?.phone}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">일정</div>
              <div className="font-medium text-gray-900">
                {format(new Date(selectedDate), 'M월 d일 (E)', { locale: ko })}
              </div>
              <div className="text-sm text-gray-600">
                {selectedTime} -{' '}
                {totalDuration > 0
                  ? calculateEndTime(selectedTime, totalDuration)
                  : '미정'}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">서비스</div>
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
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="text-sm font-medium text-gray-900">
                      총 {totalDuration}분 ·{' '}
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

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">담당 직원</div>
              <div className="font-medium text-gray-900">
                {selectedEmployee?.name}
              </div>
              <div className="text-sm text-gray-600">
                {selectedEmployee?.role}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">상태</div>
              <div
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                  selectedStatus === 'scheduled'
                    ? 'bg-blue-100 text-blue-800'
                    : selectedStatus === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : selectedStatus === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                }`}
              >
                {selectedStatus === 'scheduled'
                  ? '예약됨'
                  : selectedStatus === 'completed'
                    ? '완료'
                    : selectedStatus === 'cancelled'
                      ? '취소'
                      : '노쇼'}
              </div>
            </div>

            {memo && (
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-1 text-sm text-gray-600">메모</div>
                <div className="text-sm text-gray-900">{memo}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
