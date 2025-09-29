import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function Dashboard() {
  const navigate = useNavigate()
  const [currentTime, setCurrentTime] = useState(new Date())

  // 시간 업데이트 - 자동 새로고침 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1분마다 업데이트

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          뷰티 살롱 관리 시스템 대시보드
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">총 고객</h3>
          <p className="text-3xl font-bold">150</p>
          <p className="text-xs text-gray-600 mt-1">전월 대비 +5%</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">오늘 예약</h3>
          <p className="text-3xl font-bold">24</p>
          <p className="text-xs text-gray-600 mt-1">완료 18건, 예정 6건</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">이번 달 매출</h3>
          <p className="text-3xl font-bold">₩2,450,000</p>
          <p className="text-xs text-gray-600 mt-1">전월 대비 +12%</p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-2">활성 직원</h3>
          <p className="text-3xl font-bold">8</p>
          <p className="text-xs text-gray-600 mt-1">근무 중 6명</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">최근 예약</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span>김민지 - 헤어컷</span>
              <span className="text-sm text-gray-600">10:00</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span>박서연 - 네일아트</span>
              <span className="text-sm text-gray-600">11:30</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <span>이지은 - 피부관리</span>
              <span className="text-sm text-gray-600">14:00</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold mb-4">인기 서비스</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>헤어컷 & 스타일링</span>
              <span className="text-sm text-gray-600">45회</span>
            </div>
            <div className="flex items-center justify-between">
              <span>네일아트</span>
              <span className="text-sm text-gray-600">32회</span>
            </div>
            <div className="flex items-center justify-between">
              <span>기본 피부관리</span>
              <span className="text-sm text-gray-600">28회</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}