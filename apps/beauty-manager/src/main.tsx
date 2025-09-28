import { StrictMode } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@nexus/ui'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="beauty-manager-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
