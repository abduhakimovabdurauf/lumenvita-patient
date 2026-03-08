interface TelegramWebApp {
  ready(): void
  expand(): void
  colorScheme: 'light' | 'dark'
  BackButton: {
    show(): void
    hide(): void
    onClick(cb: () => void): void
  }
}

interface Window {
  Telegram?: {
    WebApp?: TelegramWebApp
  }
}
