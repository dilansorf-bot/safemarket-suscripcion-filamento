import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function PagosAdminPage() {
  const supabase = await createClient()
  
  // Obtenemos todas las cajas que están esperando pago
  const { data: cajas } = await supabase
    .from('monthly_boxes')
    .select('*')
    .eq('payment_status', 'pending')

  // Server Action inline para aprobar el pago
  async function aprobarPago(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabaseServer = await createClient()
    
    await supabaseServer
      .from('monthly_boxes')
      .update({ payment_status: 'paid' })
      .eq('id', id)

    // Recargamos el panel de admin y el dashboard del cliente
    revalidatePath('/admin/pagos')
    revalidatePath('/dashboard')
  }

  return (
    <div className="bg-slate-900 min-h-screen p-8 rounded-xl text-white">
      <h1 className="text-2xl font-bold mb-2 text-blue-400">Validación de Pagos (Plan B)</h1>
      <p className="mb-8 text-slate-400 text-sm">
        Aprueba manualmente las transferencias bancarias para activar la suscripción del mes.
      </p>
      
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="p-4 font-medium uppercase tracking-wider text-xs">ID Caja (Ref)</th>
              <th className="p-4 font-medium uppercase tracking-wider text-xs">ID Usuario</th>
              <th className="p-4 font-medium uppercase tracking-wider text-xs">Período</th>
              <th className="p-4 font-medium uppercase tracking-wider text-xs">Estado</th>
              <th className="p-4 font-medium uppercase tracking-wider text-xs">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {cajas?.map((caja) => (
              <tr key={caja.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-4 font-mono text-slate-400">{caja.id.split('-')[0]}</td>
                <td className="p-4 font-mono text-slate-400">{caja.user_id.split('-')[0]}</td>
                <td className="p-4">{caja.period}</td>
                <td className="p-4">
                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                    Esperando Transferencia
                  </span>
                </td>
                <td className="p-4">
                  <form action={aprobarPago}>
                    <input type="hidden" name="id" value={caja.id} />
                    <button 
                      type="submit" 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-medium transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                      Aprobar Pago
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!cajas || cajas.length === 0) && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 bg-slate-800/50">
                  No hay pagos pendientes de validación en este momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}