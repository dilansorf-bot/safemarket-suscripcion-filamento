import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Header() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-black tracking-[0.2em] text-white">
          SAFEMARKET
        </Link>

        {user ? (
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Mi Panel
          </Link>
        ) : (
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-blue-500 hover:text-blue-300"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </header>
  )
}
