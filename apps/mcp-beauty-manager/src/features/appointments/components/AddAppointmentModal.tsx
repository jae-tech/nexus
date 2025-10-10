import { useState } from 'react';
import { Calendar, Check, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

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
  status: 'active' | 'on_leave' | 'terminated';
  monthlyCustomers: number;
}

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  duration: number;
  active: boolean;
}

interface Appointment {
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
}

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (appointment: Appointment) => void;
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

export default function AddAppointmentModal({
  open,
  onClose,
  onAdd,
  customers,
  staff,
  services,
}: AddAppointmentModalProps) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);
  const [memo, setMemo] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    gender: '여성',
    birthday: '',
    memo: '',
  });

  // 검색된 고객 목록
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      customer.phone.includes(customerSearch)
  );

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
    (sum, service) => sum + service.basePrice,
    0
  );

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

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

  const handleNewCustomerSubmit = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('이름과 전화번호는 필수입니다.');
      return;
    }

    // 전화번호 중복 체크
    const existingCustomer = customers.find(
      (c) => c.phone === newCustomer.phone
    );
    if (existingCustomer) {
      alert('이미 등록된 전화번호입니다.');
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      ...newCustomer,
      registeredDate: new Date().toISOString().split('T')[0],
      visitCount: 0,
      lastVisit: '',
      lastService: '',
      mainStaff: '',
    };

    setSelectedCustomer(customer);
    setShowNewCustomerForm(false);
    setNewCustomer({
      name: '',
      phone: '',
      gender: '여성',
      birthday: '',
      memo: '',
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

    const appointment: Appointment = {
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
        price: service.basePrice,
      })),
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      status: 'scheduled',
      memo: memo.trim() || undefined,
      amount: customAmount ? parseInt(customAmount, 10) : totalAmount,
    };

    onAdd(appointment);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedCustomer !== null;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return selectedServices.length > 0;
      case 4:
        return selectedEmployee !== null;
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl overflow-hidden p-0">
        <div className="flex h-full">
          {/* 메인 컨텐츠 */}
          <div className="flex flex-1 flex-col">
            {/* 헤더 */}
            <div className="border-b border-gray-200 px-6 py-4">
              <DialogHeader>
                <DialogTitle>새 예약 추가</DialogTitle>
              </DialogHeader>

            {/* 진행 단계 */}
            <div className="mt-4 flex items-center">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      stepNum === step
                        ? 'bg-blue-500 text-white'
                        : stepNum < step
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum < step ? <Check size={20} className="text-white" /> : stepNum}
                  </div>
                  {stepNum < 5 && (
                    <div
                      className={`mx-2 h-1 w-12 ${
                        stepNum < step ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: 고객 선택 */}
            {step === 1 && (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  고객 선택
                </h3>

                {!showNewCustomerForm ? (
                  <>
                    <div className="mb-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="고객명 또는 전화번호로 검색"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => setShowNewCustomerForm(true)}
                        className="rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600"
                      >
                        신규 등록
                      </button>
                    </div>
                    <div className="max-h-96 space-y-2 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                            selectedCustomer?.id === customer.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {customer.phone}
                              </div>
                              <div className="text-sm text-gray-500">
                                최근 방문: {customer.lastVisit || '없음'} (
                                {customer.lastService || '없음'})
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              방문 {customer.visitCount}회
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">
                        신규 고객 등록
                      </h4>
                      <button
                        onClick={() => setShowNewCustomerForm(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={16} className="text-gray-600 hover:text-gray-800" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          이름 *
                        </label>
                        <input
                          type="text"
                          value={newCustomer.name}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="고객 이름"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          전화번호 *
                        </label>
                        <input
                          type="tel"
                          value={newCustomer.phone}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="010-0000-0000"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          성별
                        </label>
                        <select
                          value={newCustomer.gender}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              gender: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="여성">여성</option>
                          <option value="남성">남성</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          생년월일
                        </label>
                        <input
                          type="date"
                          value={newCustomer.birthday}
                          onChange={(e) =>
                            setNewCustomer((prev) => ({
                              ...prev,
                              birthday: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        메모
                      </label>
                      <textarea
                        value={newCustomer.memo}
                        onChange={(e) =>
                          setNewCustomer((prev) => ({
                            ...prev,
                            memo: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="특이사항이나 메모를 입력하세요"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleNewCustomerSubmit}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                      >
                        등록하고 선택
                      </button>
                      <button
                        onClick={() => setShowNewCustomerForm(false)}
                        className="rounded-lg bg-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-400"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: 날짜/시간 선택 */}
            {step === 2 && (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  날짜 및 시간 선택
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
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
                <div className="mt-4 rounded-lg bg-blue-50 p-4">
                  <div className="text-sm text-blue-800">
                    <Calendar size={18} className="mr-1 text-gray-600" />
                    선택된 일정:{' '}
                    {format(new Date(selectedDate), 'yyyy년 M월 d일 EEEE', {
                      locale: ko,
                    })}{' '}
                    {selectedTime}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 서비스 선택 */}
            {step === 3 && (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  서비스 선택
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
                                    {service.basePrice.toLocaleString()}원
                                  </div>
                                </div>
                                {selectedServices.find(
                                  (s) => s.id === service.id
                                ) && (
                                  <Check size={20} className="text-white" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="mt-4 rounded-lg bg-green-50 p-4">
                    <div className="text-sm text-green-800">
                      <div className="mb-1 font-medium">선택된 서비스:</div>
                      {selectedServices.map((service) => (
                        <div key={service.id}>
                          • {service.name} ({service.duration}분,{' '}
                          {service.basePrice.toLocaleString()}원)
                        </div>
                      ))}
                      <div className="mt-2 font-medium">
                        총 소요시간: {totalDuration}분 | 총 금액:{' '}
                        {totalAmount.toLocaleString()}원
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: 담당 직원 선택 */}
            {step === 4 && (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  담당 직원 선택
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {staff
                    .filter((employee) => employee.status === 'active')
                    .map((employee) => (
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
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {employee.role}
                            </div>
                            <div className="text-sm text-gray-500">
                              이번 달 담당 고객: {employee.monthlyCustomers}명
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 5: 상세 정보 입력 */}
            {step === 5 && (
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  상세 정보 입력
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      시술 메모 (선택사항)
                    </label>
                    <textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="특별한 요청사항이나 주의사항을 입력하세요"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      금액 (선택사항)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={`기본 금액: ${totalAmount.toLocaleString()}원`}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      입력하지 않으면 서비스 기본 금액이 적용됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="border-t border-gray-200 px-6 pb-6 pt-4">
            <DialogFooter className="flex-row justify-between">
              <Button
                onClick={handlePrev}
                disabled={step === 1}
                variant="outline"
              >
                이전
              </Button>
              {step < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  variant="default"
                >
                  다음
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  disabled={!canProceed()}
                  variant="default"
                >
                  예약 추가
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            예약 미리보기
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-sm text-gray-600">고객</div>
              <div className="font-medium text-gray-900">
                {selectedCustomer ? selectedCustomer.name : '선택되지 않음'}
              </div>
              {selectedCustomer && (
                <div className="text-sm text-gray-600">
                  {selectedCustomer.phone}
                </div>
              )}
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
                        {service.duration}분 · {service.basePrice.toLocaleString()}
                        원
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 border-t border-gray-200 pt-2">
                    <div className="text-sm font-medium text-gray-900">
                      총 {totalDuration}분 · {totalAmount.toLocaleString()}원
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
                {selectedEmployee ? selectedEmployee.name : '선택되지 않음'}
              </div>
              {selectedEmployee && (
                <div className="text-sm text-gray-600">
                  {selectedEmployee.role}
                </div>
              )}
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
      </DialogContent>
    </Dialog>
  );
}
