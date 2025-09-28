
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/feature/Sidebar';
import Card from '../../../components/base/Card';
import Button from '../../../components/base/Button';
import CustomerInfoPanel from './components/CustomerInfoPanel';
import TreatmentHistory from './components/TreatmentHistory';
import SummaryStats from './components/SummaryStats';
import EditCustomerModal from './components/EditCustomerModal';
import AddTreatmentModal from './components/AddTreatmentModal';
import { mockCustomerDetail } from '../../../mocks/customerDetail';
import { useToast } from '../../../hooks/useToast';

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
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 ml-60 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-user-line text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-lg font-medium text-gray-600 mb-2">고객 정보를 찾을 수 없습니다</h3>
            <Button variant="primary" onClick={handleBack}>
              고객 목록으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 ml-60">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="icon" onClick={handleBack}>
                <i className="ri-arrow-left-line text-lg"></i>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
                <p className="text-gray-600">고객 상세 정보</p>
              </div>
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
