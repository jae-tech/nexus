import { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layouts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CustomerInfoPanel from '@/features/customers/components/CustomerInfoPanel';
import TreatmentHistory from '@/features/customers/components/TreatmentHistory';
import SummaryStats from '@/features/customers/components/SummaryStats';
import EditCustomerModal from '@/features/customers/components/EditCustomerModal';
import AddTreatmentModal from '@/features/customers/components/AddTreatmentModal';
import { mockCustomerDetail } from '@/features/customers/api/mock-detail';
import { useToast } from '@/shared/hooks/useToast';

export default function CustomerDetail() {
  const { id } = useParams({ from: '/customers/$id' });
  const navigate = useNavigate();
  const { success: successToast, error: errorToast, info: infoToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddTreatmentModalOpen, setIsAddTreatmentModalOpen] = useState(false);

  // 실제로는 API에서 고객 정보를 가져와야 함
  const customer = mockCustomerDetail;

  const handleBack = () => {
    navigate({ to: '/customers' });
  };

  const handleEditCustomer = () => {
    setIsEditModalOpen(true);
  };

  const handleAddTreatment = () => {
    setIsAddTreatmentModalOpen(true);
  };

  const handleEditCustomerSuccess = () => {
    setIsEditModalOpen(false);
    successToast('고객 정보가 성공적으로 수정되었습니다.');
  };

  const handleAddTreatmentSuccess = () => {
    setIsAddTreatmentModalOpen(false);
    successToast('새 시술이 성공적으로 추가되었습니다.');
  };

  if (!customer) {
    return (
      <>
        <Header title="고객 상세" />
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="text-center">
            <User size={18} className="mb-4 text-gray-600" />
            <h3 className="mb-2 text-lg font-medium text-gray-600">
              고객 정보를 찾을 수 없습니다
            </h3>
            <Button variant="primary" onClick={handleBack}>
              고객 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title={customer.name}
        actions={
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            뒤로가기
          </Button>
        }
      />

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

      {/* Modals */}
      <EditCustomerModal
        open={isEditModalOpen}
        customer={customer}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditCustomerSuccess}
      />

      <AddTreatmentModal
        open={isAddTreatmentModalOpen}
        customerId={customer.id}
        onClose={() => setIsAddTreatmentModalOpen(false)}
        onSuccess={handleAddTreatmentSuccess}
      />
    </>
  );
}
