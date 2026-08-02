import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'cs',
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/cs',
  useParams: () => ({ locale: 'cs' }),
}))

// jsdom doesn't implement ResizeObserver; components like InfiniteSlider
// (via react-use-measure) call it unconditionally on mount.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (typeof globalThis.ResizeObserver === 'undefined') {
  ;(globalThis as { ResizeObserver?: unknown }).ResizeObserver = ResizeObserverMock
}

// jsdom doesn't implement IntersectionObserver either; framer-motion's
// `whileInView` animations rely on it.
class IntersectionObserverMock {
  root = null
  rootMargin = ''
  thresholds: number[] = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
if (typeof globalThis.IntersectionObserver === 'undefined') {
  ;(globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = IntersectionObserverMock
}
