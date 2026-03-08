import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App'

// Initialize Telegram Mini App
window.Telegram?.WebApp?.ready()
window.Telegram?.WebApp?.expand()

// Apply dark mode based on Telegram's color scheme
if (window.Telegram?.WebApp?.colorScheme === 'dark') {
  document.documentElement.classList.add('dark')
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 min — patient data doesn't change mid-session
    },
  },
})

const root = document.getElementById('root')!
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
)
