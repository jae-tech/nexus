import { Button, Avatar, AvatarFallback, AvatarImage, Badge } from "@nexus/ui"
import { Link } from "react-router-dom"
import { useTheme } from "@/hooks/use-theme"
import { useElectronAppInfo, useElectronAvailable } from "@/hooks/use-electron"
import { APP_CONFIG, ROUTES } from "@/lib/constants"

export function Header() {
  const { theme, setTheme } = useTheme()
  const isElectron = useElectronAvailable()
  const appInfo = useElectronAppInfo()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to={ROUTES.HOME} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              {isElectron && appInfo ? appInfo.name : APP_CONFIG.name}
            </span>
            {isElectron && (
              <Badge variant="secondary" className="text-xs">
                Electron
              </Badge>
            )}
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to={ROUTES.DASHBOARD}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Settings
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other content can go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
            >
              {theme === "dark" ? "🌞" : "🌙"}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.png" alt="User" />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </nav>
        </div>
      </div>
    </header>
  )
}