import { APP_NAME } from "@/lib/constants"

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>© 2024 {APP_NAME}. All rights reserved.</p>
          <p>Built with Nexus Design System</p>
        </div>
      </div>
    </footer>
  )
}