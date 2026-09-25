import { createClient } from '@/utils/supabase/server'

type BoxPreferenceRow = {
  id?: string | number | null
  user_id?: string | null
  material?: string | null
  uses_ams?: boolean | null
  favorite_colors?: string[] | string | null
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  let preferences: BoxPreferenceRow[] = []
  let queryError: Error | null = null

  try {
    const { data, error } = await supabase.from('box_preferences').select('*')

    if (error) {
      throw error
    }

    preferences = (data as BoxPreferenceRow[]) ?? []
  } catch (error) {
    queryError = error as Error
  }

  const getUserId = (row: BoxPreferenceRow) => {
    const value = row.user_id ?? row.id ?? 'N/A'
    return String(value).slice(0, 8)
  }

  const getFavoriteColors = (colors: string[] | string | null | undefined) => {
    if (!colors) return 'Sin colores'

    const normalized = Array.isArray(colors)
      ? colors
      : String(colors)
          .split(',')
          .map((color) => color.trim())
          .filter(Boolean)

    return normalized.length ? normalized.join(', ') : 'Sin colores'
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              Panel administrativo
            </p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Gestión de Suscripciones
            </h1>
          </div>
        </div>

        {queryError ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200 shadow-lg shadow-red-950/20">
            <p className="font-semibold">No se pudo cargar la información.</p>
            <p className="mt-1 text-sm text-red-100/80">
              {queryError.message || 'Ocurrió un error al consultar Supabase.'}
            </p>
          </div>
        ) : preferences.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-12 text-center shadow-xl shadow-slate-950/30">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-2xl text-slate-300">
              📦
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">No hay suscripciones registradas</h2>
            <p className="mt-2 text-sm text-slate-400">
              Cuando los usuarios guarden preferencias, aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800 text-left">
                <thead className="bg-slate-800/80">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      ID de Usuario
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Material
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      ¿Usa AMS?
                    </th>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      Colores Favoritos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                  {preferences.map((row) => (
                    <tr key={row.id ?? `${row.user_id}-${row.material}`} className="transition hover:bg-slate-800/50">
                      <td className="px-5 py-4 text-sm font-medium text-cyan-300">
                        {getUserId(row)}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-200">
                        {row.material ?? 'No especificado'}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.uses_ams
                              ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                              : 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30'
                          }`}
                        >
                          {row.uses_ams ? 'Sí' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-200">
                        {getFavoriteColors(row.favorite_colors)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
