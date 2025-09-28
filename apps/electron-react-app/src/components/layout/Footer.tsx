import { APP_CONFIG } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Nexus Design System
            </a>
            . {APP_CONFIG.description}.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2025 {APP_CONFIG.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}