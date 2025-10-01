
import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@nexus/ui';
import CustomerInfoPanel from './components/CustomerInfoPanel';
import TreatmentHistory from './components/TreatmentHistory';
import SummaryStats from './components/SummaryStats';
import EditCustomerModal from './components/EditCustomerModal';
import AddTreatmentModal from './components/AddTreatmentModal';
import { mockCustomerDetail } from '@/mocks/customerDetail';

export function CustomerDetail() {
  const { id } = useParams({ from: '/customers/$id' });
  const navigate = useNavigate();
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
    toast.success('고객 정보가 성공적으로 수정되었습니다.');
  };

  const handleAddTreatmentSuccess = () => {
    setIsAddTreatmentModalOpen(false);
    toast.success('새 시술이 성공적으로 추가되었습니다.');
  };

  if (!customer) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <User size={48} className="text-gray-300 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">고객 정보를 찾을 수 없습니다</h3>
          <Button variant="primary" onClick={handleBack}>
            고객 목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header - Sidebar 로고 영역과 동일한 h-20 (80px) */}
      <div className="bg-white border-b border-gray-200 px-6 h-20 flex items-center">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-9 w-9 p-0">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{customer.name}</h1>
            <p className="text-sm text-gray-500">고객 상세 정보</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Panel - Customer Info (400px 고정폭) */}
        <div className="w-[400px] flex-shrink-0 bg-white border-r border-gray-200">
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
      <div className="bg-white border-t border-gray-200">
        <SummaryStats customer={customer} />
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
