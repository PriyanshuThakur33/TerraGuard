import { TopNav } from './TopNav'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full">
      <TopNav />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}

