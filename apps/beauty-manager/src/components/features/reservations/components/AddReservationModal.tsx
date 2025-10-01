import { useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Check, User, Calendar } from "lucide-react";

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
}

interface AddReservationModalProps {
  onClose: () => void;
  onAdd: (reservation: Reservation) => void;
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

export default function AddReservationModal({
  onClose,
  onAdd,
  customers,
  staff,
  services,
}: AddReservationModalProps) {
  const [step, setStep] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);
  const [memo, setMemo] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    gender: "여성",
    birthday: "",
    memo: "",
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
      alert("이름과 전화번호는 필수입니다.");
      return;
    }

    // 전화번호 중복 체크
    const existingCustomer = customers.find(
      (c) => c.phone === newCustomer.phone
    );
    if (existingCustomer) {
      alert("이미 등록된 전화번호입니다.");
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      ...newCustomer,
      registeredDate: new Date().toISOString().split("T")[0],
      visitCount: 0,
      lastVisit: "",
      lastService: "",
      mainStaff: "",
    };

    setSelectedCustomer(customer);
    setShowNewCustomerForm(false);
    setNewCustomer({
      name: "",
      phone: "",
      gender: "여성",
      birthday: "",
      memo: "",
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

    const reservation: Reservation = {
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
      status: "scheduled",
      memo: memo.trim() || undefined,
      amount: customAmount ? parseInt(customAmount, 10) : totalAmount,
    };

    onAdd(reservation);
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
    <div className="modal-overlay">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                새 예약 추가
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* 진행 단계 */}
            <div className="flex items-center mt-4">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNum === step
                        ? "bg-blue-500 text-white"
                        : stepNum < step
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {stepNum < step ? (
                      <Check size={16} />
                    ) : (
                      stepNum
                    )}
                  </div>
                  {stepNum < 5 && (
                    <div
                      className={`w-12 h-1 mx-2 ${
                        stepNum < step ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                      />
                      <button
                        onClick={() => setShowNewCustomerForm(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        신규 등록
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedCustomer?.id === customer.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
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
                                최근 방문: {customer.lastVisit || "없음"} (
                                {customer.lastService || "없음"})
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
                        <X size={20} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                          placeholder="고객 이름"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                          placeholder="010-0000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                        >
                          <option value="여성">여성</option>
                          <option value="남성">남성</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                        placeholder="특이사항이나 메모를 입력하세요"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleNewCustomerSubmit}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        등록하고 선택
                      </button>
                      <button
                        onClick={() => setShowNewCustomerForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  날짜 및 시간 선택
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      날짜
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={format(new Date(), "yyyy-MM-dd")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <Calendar size={16} className="mr-1 inline" />
                    선택된 일정:{" "}
                    {format(new Date(selectedDate), "yyyy년 M월 d일 EEEE", {
                      locale: ko,
                    })}{" "}
                    {selectedTime}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: 서비스 선택 */}
            {step === 3 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  서비스 선택
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

                {selectedServices.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      <div className="font-medium mb-1">선택된 서비스:</div>
                      {selectedServices.map((service) => (
                        <div key={service.id}>
                          • {service.name} ({service.duration}분,{" "}
                          {service.price.toLocaleString()}원)
                        </div>
                      ))}
                      <div className="mt-2 font-medium">
                        총 소요시간: {totalDuration}분 | 총 금액:{" "}
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  담당 직원 선택
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff
                    .filter((employee) => employee.status === "active")
                    .map((employee) => (
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
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gray-600" />
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
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  상세 정보 입력
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시술 메모 (선택사항)
                    </label>
                    <textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="특별한 요청사항이나 주의사항을 입력하세요"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      금액 (선택사항)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder={`기본 금액: ${totalAmount.toLocaleString()}원`}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-ring"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      입력하지 않으면 서비스 기본 금액이 적용됩니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 하단 버튼 - 통일된 Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
            {step > 1 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
              >
                이전
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={!canProceed()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                예약 추가
              </button>
            )}
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            예약 미리보기
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">고객</div>
              <div className="font-medium text-gray-900">
                {selectedCustomer ? selectedCustomer.name : "선택되지 않음"}
              </div>
              {selectedCustomer && (
                <div className="text-sm text-gray-600">
                  {selectedCustomer.phone}
                </div>
              )}
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
                      총 {totalDuration}분 · {totalAmount.toLocaleString()}원
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
                {selectedEmployee ? selectedEmployee.name : "선택되지 않음"}
              </div>
              {selectedEmployee && (
                <div className="text-sm text-gray-600">
                  {selectedEmployee.role}
                </div>
              )}
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
