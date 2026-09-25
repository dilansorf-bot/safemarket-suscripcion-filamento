import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

type MonthlyBoxRow = {
  id: string
  user_id: string
  material?: string | null
  payment_status?: string | null
  shipping_status?: string | null
}

type BoxPreferenceRow = {
  user_id: string
  material?: string | null
  uses_ams?: boolean | null
  favorite_colors?: string[] | string | null
}

export default async function ArmadoCajasPage() {
  const supabase = await createClient()

  const { data: cajas, error: cajasError } = await supabase
    .from('monthly_boxes')
    .select('*')
    .eq('payment_status', 'paid')
    .eq('shipping_status', 'pending')

  const { data: preferencias, error: preferenciasError } = await supabase
    .from('box_preferences')
    .select('*')

  const preferenciasPorUsuario = new Map(
    (preferencias ?? []).map((preferencia) => [String(preferencia.user_id), preferencia])
  )

  const cajasPorArmar = (cajas ?? []).map((caja) => {
    const preferencia = preferenciasPorUsuario.get(String(caja.user_id)) as
      | BoxPreferenceRow
      | undefined

    const favoriteColors = Array.isArray(preferencia?.favorite_colors)
      ? preferencia.favorite_colors
      : typeof preferencia?.favorite_colors === 'string'
        ? preferencia.favorite_colors.split(',').map((color) => color.trim()).filter(Boolean)
        : []

    return {
      ...caja,
      material: preferencia?.material ?? caja.material ?? 'No especificado',
      uses_ams: preferencia?.uses_ams ?? false,
      favorite_colors: favoriteColors,
    }
  })

  async function marcarComoEnviada(formData: FormData) {
    'use server'

    const id = String(formData.get('id') ?? '')

    if (!id) return

    const supabaseServer = await createClient()

    await supabaseServer.from('monthly_boxes').update({ shipping_status: 'shipped' }).eq('id', id)

    revalidatePath('/admin/cajas')
  }

  const formatearColores = (colores: string[] | undefined) => {
    if (!colores || colores.length === 0) return 'Sin colores registrados'
    return colores.join(', ')
  }

  return (
    <main className="min-h-screen bg-slate-900 p-6 text-white sm:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Logística
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">Logística: Armado de Cajas</h1>
        </header>

        {(cajasError || preferenciasError) && (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            No se pudieron cargar algunas cajas o preferencias. Intenta nuevamente más tarde.
          </div>
        )}

        {cajasPorArmar.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-800/50 p-10 text-center">
            <p className="text-lg font-semibold text-slate-200">No hay cajas pendientes de envío.</p>
            <p className="mt-2 text-sm text-slate-400">
              Las suscripciones pagadas y pendientes de envío aparecerán aquí.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {cajasPorArmar.map((caja) => (
              <article
                key={caja.id}
                className="rounded-2xl border border-slate-700 bg-slate-800/80 p-5 shadow-lg shadow-slate-950/20"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
                    Caja {caja.id.slice(0, 8)}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-slate-400">Pendiente</span>
                </div>

                <div className="space-y-3 text-sm text-slate-200">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Material</p>
                    <p className="mt-1 font-medium text-white">{caja.material}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">¿Usa AMS?</p>
                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        caja.uses_ams
                          ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30'
                          : 'bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30'
                      }`}
                    >
                      {caja.uses_ams ? 'Sí' : 'No'}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Colores Favoritos</p>
                    <p className="mt-1 text-slate-200">{formatearColores(caja.favorite_colors)}</p>
                  </div>
                </div>

                <form action={marcarComoEnviada} className="mt-6">
                  <input type="hidden" name="id" value={caja.id} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Marcar como Enviada
                  </button>
                </form>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
