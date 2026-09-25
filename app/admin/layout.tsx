import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold">SAFEMARKET Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-md bg-blue-600 text-white font-medium">
            Dashboard
          </Link>
          <Link href="/admin/cajas" className="block px-4 py-2 rounded-md hover:bg-slate-800 text-slate-300 transition">
            Armado de Cajas
          </Link>
          <Link href="/admin/pagos" className="block px-4 py-2 rounded-md hover:bg-slate-800 text-slate-300 transition">
            Validar Pagos (Plan B)
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800 text-sm text-slate-400">
          V 1.0 - Beta
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}