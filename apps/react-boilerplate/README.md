# Nexus React Boilerplate

A modern React 19 + Vite + TypeScript boilerplate integrated with the Nexus Design System.

## ✨ Features

- **React 19** - Latest React with concurrent features
- **Vite 7** - Fast build tool and dev server
- **TypeScript 5.9** - Type safety and developer experience
- **TailwindCSS v4** - Modern utility-first CSS framework
- **Nexus UI** - Complete component library
- **React Router v6** - Client-side routing
- **Theme Support** - Dark/Light mode with system preference
- **Absolute Imports** - Clean imports with `@/` prefix
- **Error Boundaries** - Graceful error handling
- **ESLint** - Code quality and consistency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm type-check       # Run TypeScript type checking
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   ├── common/          # Common reusable components
│   └── pages/           # Page-specific components
├── hooks/               # Custom React hooks
│   ├── use-theme.ts     # Theme management
│   └── use-local-storage.ts # Local storage hook
├── lib/                 # Utility functions and constants
│   ├── utils.ts         # General utilities
│   └── constants.ts     # App constants
├── types/               # TypeScript type definitions
│   ├── index.ts         # General types
│   └── api.ts           # API-related types
├── styles/              # Global styles
│   └── globals.css      # TailwindCSS and global styles
├── App.tsx              # Main app component
└── main.tsx             # Application entry point
```

## 🎨 Using Nexus UI Components

The boilerplate comes with the complete Nexus UI component library:

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch
} from '@nexus/ui'

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" />
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="notifications" />
          <Label htmlFor="notifications">Enable notifications</Label>
        </div>
        <Button>Submit</Button>
      </CardContent>
    </Card>
  )
}
```

## 🎯 Key Patterns

### Absolute Imports

Use `@/` for clean imports:

```tsx
import { cn } from '@/lib/utils'
import { Button } from '@nexus/ui'
import { Header } from '@/components/layout/Header'
import { useTheme } from '@/hooks/use-theme'
import type { User } from '@/types'
```

### Theme Management

The app includes a complete theme system:

```tsx
import { useTheme } from '@/hooks/use-theme'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  )
}
```

### Error Boundaries

Components are wrapped with error boundaries for better UX:

```tsx
import { ErrorBoundary } from '@/components/common/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <YourAppContent />
    </ErrorBoundary>
  )
}
```

## 🔧 Customization

### Adding New Pages

1. Create component in `src/components/pages/`
2. Add route in `src/App.tsx`
3. Update navigation in `src/components/layout/Sidebar.tsx`

### Adding Custom Hooks

Create hooks in `src/hooks/` following the naming convention `use-*.ts`

### Styling

- Use TailwindCSS utilities for styling
- Leverage Nexus design tokens
- Use `cn()` utility for conditional classes

## 🚀 Deployment

### Build for Production

```bash
pnpm build
```

The built files will be in the `dist/` directory.

### Environment Variables

Create `.env` files for different environments:

```bash
# .env.local
VITE_API_URL=http://localhost:3001
VITE_APP_NAME="My App"
```

## 📚 Learn More

- [React 19 Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS v4 Documentation](https://tailwindcss.com)
- [Nexus Design System](../ui/README.md)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.