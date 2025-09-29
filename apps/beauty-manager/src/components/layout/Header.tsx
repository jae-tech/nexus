import { Button } from "@nexus/ui"
import { APP_NAME } from "@/lib/constants"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{APP_NAME}</span>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Settings
          </Button>
          <Button variant="ghost" size="sm">
            Profile
          </Button>
        </div>
      </div>
    </header>
  )
}