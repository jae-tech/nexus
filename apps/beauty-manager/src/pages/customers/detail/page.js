"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerDetail;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("../../../components/feature/Sidebar");
var Button_1 = require("../../../components/base/Button");
var CustomerInfoPanel_1 = require("./components/CustomerInfoPanel");
var TreatmentHistory_1 = require("./components/TreatmentHistory");
var SummaryStats_1 = require("./components/SummaryStats");
var EditCustomerModal_1 = require("./components/EditCustomerModal");
var AddTreatmentModal_1 = require("./components/AddTreatmentModal");
var customerDetail_1 = require("../../../mocks/customerDetail");
var useToast_1 = require("../../../hooks/useToast");
function CustomerDetail() {
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var showToast = (0, useToast_1.useToast)().showToast;
    var _a = (0, react_1.useState)(false), isEditModalOpen = _a[0], setIsEditModalOpen = _a[1];
    var _b = (0, react_1.useState)(false), isAddTreatmentModalOpen = _b[0], setIsAddTreatmentModalOpen = _b[1];
    // 실제로는 API에서 고객 정보를 가져와야 함
    var customer = customerDetail_1.mockCustomerDetail;
    var handleBack = function () {
        navigate('/customers');
    };
    var handleEditCustomer = function () {
        setIsEditModalOpen(true);
    };
    var handleAddTreatment = function () {
        setIsAddTreatmentModalOpen(true);
    };
    var handleEditCustomerSuccess = function () {
        setIsEditModalOpen(false);
        showToast('고객 정보가 성공적으로 수정되었습니다.', 'success');
    };
    var handleAddTreatmentSuccess = function () {
        setIsAddTreatmentModalOpen(false);
        showToast('새 시술이 성공적으로 추가되었습니다.', 'success');
    };
    if (!customer) {
        return (<div className="min-h-screen bg-gray-50 flex">
        <Sidebar_1.default />
        <div className="flex-1 ml-60 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-user-line text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-lg font-medium text-gray-600 mb-2">고객 정보를 찾을 수 없습니다</h3>
            <Button_1.default variant="primary" onClick={handleBack}>
              고객 목록으로 돌아가기
            </Button_1.default>
          </div>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gray-50 flex">
      <Sidebar_1.default />
      
      <div className="flex-1 ml-60">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button_1.default variant="icon" onClick={handleBack}>
                <i className="ri-arrow-left-line text-lg"></i>
              </Button_1.default>
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
            <CustomerInfoPanel_1.default customer={customer} onEdit={handleEditCustomer}/>
          </div>

          {/* Right Panel - Treatment History (나머지 전체 폭) */}
          <div className="flex-1 bg-gray-50">
            <TreatmentHistory_1.default visitHistory={customer.visitHistory} onAddTreatment={handleAddTreatment}/>
          </div>
        </div>

        {/* Summary Stats - 전체 폭 */}
        <div className="bg-white border-t border-gray-200">
          <SummaryStats_1.default customer={customer}/>
        </div>
      </div>

      {/* Modals */}
      {isEditModalOpen && (<EditCustomerModal_1.default customer={customer} onClose={function () { return setIsEditModalOpen(false); }} onSuccess={handleEditCustomerSuccess}/>)}
      
      {isAddTreatmentModalOpen && (<AddTreatmentModal_1.default customerId={customer.id} onClose={function () { return setIsAddTreatmentModalOpen(false); }} onSuccess={handleAddTreatmentSuccess}/>)}
    </div>);
}
