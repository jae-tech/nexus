import { Button } from "@nexus/ui"
import { Search, Plus, Calendar, List } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-lg font-bold">{APP_NAME}</span>
        </div>

        <div className="flex items-center gap-4 flex-1 justify-center max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="고객명, 연락처, 서비스 검색..."
              className="h-9 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-1" />
            캘린더
          </Button>

          <Button variant="outline" size="sm">
            <List className="h-4 w-4 mr-1" />
            리스트
          </Button>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            새 예약 추가
          </Button>
        </div>
      </div>
    </header>
  )
}