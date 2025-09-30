import { mockCustomerDetail } from "@/mocks/customerDetail";
import { Customer } from "@/types";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";

// 시술 기록 타입 정의
interface Treatment {
  id: string;
  date: string;
  amount: number;
  services: Array<{
    name: string;
    staff: string;
  }>;
  memo?: string;
}

// 고객 상세 정보 타입 정의
interface CustomerDetail {
  totalSpent: number;
  averageSpent: number;
  last30DaysVisits: number;
  points: number;
  treatments: Treatment[];
}

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit?: () => void;
  onAddTreatment?: () => void;
}

export default function CustomerDetailModal({
  customer,
  onClose,
  onEdit,
  onAddTreatment,
}: CustomerDetailModalProps) {
  // Mock 데이터에서 고객 상세 정보 가져오기 (실제로는 customer.id로 조회)
  const customerDetailData = mockCustomerDetail;

  // 고객별 상세 정보 (실제 구현시에는 API에서 가져올 데이터)
  const customerDetail: CustomerDetail = {
    totalSpent: 850000,
    averageSpent: 85000,
    last30DaysVisits: 2,
    points: 8500,
    treatments:
      customerDetailData.visitHistory?.map((visit) => ({
        id: visit.id,
        date: visit.date,
        amount: visit.amount || 0,
        services:
          visit.services?.map((service) => ({
            name: service,
            staff: visit.employee?.name || "직원 정보 없음",
          })) || [],
        memo: visit.memo,
      })) || [],
  };

  const getCustomerTypeLabel = (customer: Customer) => {
    const registeredDate = new Date(customer.registeredDate);
    const today = new Date();
    const daysSinceRegistered = Math.floor(
      (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceRegistered <= 30) {
      return { text: "NEW", color: "bg-green-100 text-green-800" };
    }

    if (customer.visitCount >= 10) {
      return { text: "VIP", color: "bg-purple-100 text-purple-800" };
    }

    if (customer.visitCount >= 5) {
      return { text: "단골", color: "bg-blue-100 text-blue-800" };
    }

    return null;
  };

  const getVisitStatus = (lastVisit?: string) => {
    if (!lastVisit) return { text: "방문 기록 없음", color: "text-gray-500" };

    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7)
      return { text: `${diffDays}일 전`, color: "text-green-600" };
    if (diffDays <= 30)
      return { text: `${diffDays}일 전`, color: "text-yellow-600" };
    return { text: `${diffDays}일 전`, color: "text-red-600" };
  };

  const customerType = getCustomerTypeLabel(customer);
  const visitStatus = getVisitStatus(customer.lastVisit);

  return (
    <Modal isOpen={true} onClose={onClose} size="4xl">
      {/* Modal이 자체적으로 구조를 관리하므로 Fragment 불필요 */}
      <ModalHeader onClose={onClose}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <i className="ri-user-line text-blue-600 text-2xl"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {customer.name}
              </h2>
              {customerType && (
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${customerType.color}`}
                >
                  {customerType.text}
                </span>
              )}
            </div>
            <p className="text-gray-600">{customer.phone}</p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 기본 정보 */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  기본 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">성별</span>
                    <span className="text-gray-800 font-medium">
                      {customer.gender}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">생년월일</span>
                    <span className="text-gray-800 font-medium">
                      {customer.birthday || "미등록"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">등록일</span>
                    <span className="text-gray-800 font-medium">
                      {new Date(customer.registeredDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 방문 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  방문 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">총 방문 횟수</span>
                    <span className="text-blue-600 font-semibold">
                      {customer.visitCount}회
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">최근 방문</span>
                    <span className={visitStatus.color}>
                      {visitStatus.text}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">최근 서비스</span>
                    <span className="text-gray-800 font-medium">
                      {customer.lastService || "없음"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">담당 직원</span>
                    <span className="text-gray-800 font-medium">
                      {customer.mainStaff || "없음"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 최근 시술 이력 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                최근 시술 이력
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {customerDetail.treatments
                  ?.slice(0, 5)
                  .map((treatment: Treatment) => (
                    <div
                      key={treatment.id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {treatment.date}
                        </span>
                        <span className="text-sm text-blue-600 font-semibold">
                          {treatment.amount.toLocaleString()}원
                        </span>
                      </div>
                      <div className="space-y-1">
                        {treatment.services.map((service, idx: number) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {service.name} - {service.staff}
                          </div>
                        ))}
                      </div>
                      {treatment.memo && (
                        <div className="mt-2 text-xs text-gray-500 italic">
                          {treatment.memo}
                        </div>
                      )}
                    </div>
                  )) || (
                  <div className="text-center text-gray-500 py-4">
                    시술 기록이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 메모 */}
          {customer.memo && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                특이사항
              </h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-gray-700">{customer.memo}</p>
              </div>
            </div>
          )}

          {/* 통계 카드 */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">총 지출</div>
              <div className="text-2xl font-bold text-blue-700">
                {customerDetail.totalSpent.toLocaleString()}원
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 mb-1">평균 지출</div>
              <div className="text-2xl font-bold text-green-700">
                {customerDetail.averageSpent.toLocaleString()}원
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">최근 30일</div>
              <div className="text-2xl font-bold text-purple-700">
                {customerDetail.last30DaysVisits}회
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">누적 포인트</div>
              <div className="text-2xl font-bold text-orange-700">
                {customerDetail.points.toLocaleString()}P
              </div>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
        >
          닫기
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          정보 수정
        </button>
      </ModalFooter>
    </Modal>
  );
}
