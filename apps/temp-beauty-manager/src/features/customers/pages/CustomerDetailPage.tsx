import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import Sidebar from '@/shared/components/Sidebar';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import CustomerInfoPanel from '@/features/customers/components/CustomerInfoPanel';
import TreatmentHistory from '@/features/customers/components/TreatmentHistory';
import SummaryStats from '@/features/customers/components/SummaryStats';
import EditCustomerModal from '@/features/customers/components/EditCustomerModal';
import AddTreatmentModal from '@/features/customers/components/AddTreatmentModal';
import { mockCustomerDetail } from '@/features/customers/api/mock-detail';
import { useToast } from '@/shared/hooks/useToast';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState(false);

  // 실제로는 API에서 고객 정보를 가져와야 함
  const customer = mockCustomerDetail;

  const handleBack = () => {
    navigate('/customers');
  };

  const handleEditCustomer = () => {
    setIsEditModalOpen(true);
  };

  const handleAddTreatment = () => {
    setIsAddTreatmentModalOpen(true);
  };

  const handleEditCustomerSuccess = () => {
    setIsEditModalOpen(false);
    showToast('고객 정보가 성공적으로 수정되었습니다.', 'success');
  };

  const handleAddTreatmentSuccess = () => {
    setIsAddTreatmentModalOpen(false);
    showToast('새 시술이 성공적으로 추가되었습니다.', 'success');
  };

  if (!customer) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="ml-60 flex flex-1 items-center justify-center">
          <div className="text-center">
            <i className="ri-user-line mb-4 block text-6xl text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-600">
              고객 정보를 찾을 수 없습니다
            </h3>
            <Button variant="primary" onClick={handleBack}>
              고객 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-60 flex-1">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="icon" onClick={handleBack}>
                <i className="ri-arrow-left-line text-lg" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {customer.name}
                </h1>
                <p className="text-gray-600">고객 상세 정보</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex">
          {/* Left Panel - Customer Info (400px 고정폭) */}
          <div className="w-[400px] flex-shrink-0 border-r border-gray-200 bg-white">
            <CustomerInfoPanel
              customer={customer}
              onEdit={handleEditCustomer}
            />
          </div>

          {/* Right Panel - Treatment History (나머지 전체 폭) */}
          <div className="flex-1 bg-gray-50">
            <TreatmentHistory
              visitHistory={customer.visitHistory}
              onAddTreatment={handleAddTreatment}
            />
          </div>
        </div>

        {/* Summary Stats - 전체 폭 */}
        <div className="border-t border-gray-200 bg-white">
          <SummaryStats customer={customer} />
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (
        <EditCustomerModal
          customer={customer}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditCustomerSuccess}
        />
      )}

      {isAddTreatmentModalOpen && (
        <AddTreatmentModal
          customerId={customer.id}
          onClose={() => setIsAddTreatmentModalOpen(false)}
          onSuccess={handleAddTreatmentSuccess}
        />
      )}
    </div>
  );
}
