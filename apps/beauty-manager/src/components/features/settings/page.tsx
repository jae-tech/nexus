import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { Card, Button, Input, Label } from "@nexus/ui";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import { Save, Download, Upload, FileSpreadsheet, Trash2 } from "lucide-react";

export function Settings() {
  const { isSidebarOpen } = useUIStore();
  const [businessInfo, setBusinessInfo] = useState({
    name: "뷰티 살롱",
    phone: "02-1234-5678",
    address: "서울시 강남구 테헤란로 123",
    email: "info@beautysalon.com",
    website: "www.beautysalon.com",
  });

  const [operatingHours, setOperatingHours] = useState({
    weekdays: { open: "09:00", close: "21:00" },
    saturday: { open: "09:00", close: "19:00" },
    sunday: { open: "10:00", close: "18:00" },
  });

  return (
    <div className={cn("transition-all duration-300 pt-20")}>
      <PageHeader
        title="설정"
        actions={
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save size={16} className="mr-2" />
            설정 저장
          </Button>
        }
      />

      <div className="p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 사업장 정보 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              사업장 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">사업장명</Label>
                <Input
                  id="business-name"
                  type="text"
                  value={businessInfo.name}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-phone">전화번호</Label>
                <Input
                  id="business-phone"
                  type="text"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="business-address">주소</Label>
                <Input
                  id="business-address"
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">이메일</Label>
                <Input
                  id="business-email"
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-website">웹사이트</Label>
                <Input
                  id="business-website"
                  type="text"
                  value={businessInfo.website}
                  onChange={(e) =>
                    setBusinessInfo({
                      ...businessInfo,
                      website: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </Card>

          {/* 운영 시간 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              운영 시간
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="font-medium text-gray-700">평일 (월-금)</div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={operatingHours.weekdays.open}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        weekdays: {
                          ...operatingHours.weekdays,
                          open: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="time"
                    value={operatingHours.weekdays.close}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        weekdays: {
                          ...operatingHours.weekdays,
                          close: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="font-medium text-gray-700">토요일</div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={operatingHours.saturday.open}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        saturday: {
                          ...operatingHours.saturday,
                          open: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="time"
                    value={operatingHours.saturday.close}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        saturday: {
                          ...operatingHours.saturday,
                          close: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="font-medium text-gray-700">일요일</div>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={operatingHours.sunday.open}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        sunday: {
                          ...operatingHours.sunday,
                          open: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="time"
                    value={operatingHours.sunday.close}
                    onChange={(e) =>
                      setOperatingHours({
                        ...operatingHours,
                        sunday: {
                          ...operatingHours.sunday,
                          close: e.target.value,
                        },
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* 알림 설정 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              알림 설정
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">예약 알림</div>
                  <div className="text-sm text-gray-500">
                    새로운 예약이 있을 때 알림을 받습니다
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">취소 알림</div>
                  <div className="text-sm text-gray-500">
                    예약이 취소될 때 알림을 받습니다
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">리뷰 알림</div>
                  <div className="text-sm text-gray-500">
                    새로운 리뷰가 등록될 때 알림을 받습니다
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus-ring rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* 데이터 관리 */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              데이터 관리
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <Download size={16} className="mr-2" />
                데이터 백업
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <Upload size={16} className="mr-2" />
                데이터 복원
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <FileSpreadsheet size={16} className="mr-2" />
                고객 데이터 내보내기
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 size={16} className="mr-2" />
                모든 데이터 삭제
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
