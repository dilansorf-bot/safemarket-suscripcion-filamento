import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
  }

  if (!user.user_metadata?.whatsapp) {
    redirect('/dashboard/onboarding')
  }

  // 1. Consultamos el estado de pago del mes actual para este usuario
  const { data: cajaMes } = await supabase
    .from('monthly_boxes')
    .select('payment_status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Si no hay registro, asumimos 'pending' por defecto
  const estadoPago = cajaMes?.payment_status || 'pending'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Suscripción</h1>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Cerrar Sesión
            </button>
          </form>
        </div>

        {/* 2. RENDERIZADO CONDICIONAL DEL BANNER SEGÚN EL PAGO */}
        {estadoPago === 'pending' ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-yellow-800">
                  ⚠️ Tu caja de septiembre está en pausa
                </p>
                <p className="text-sm text-yellow-700 mt-1">
                  Realiza el pago de $17.90 para armar tu paquete.
                </p>
              </div>
              <a 
                href="#" 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Pagar ahora
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded-r-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-bold text-green-800">
                  ¡Pago confirmado! Tu caja está en preparación.
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Te notificaremos a tu número de WhatsApp registrado cuando esté lista.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Columna Izquierda: Estado actual */}
          <div className="space-y-8">
            
            {/* Estado de la Caja dinámico */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Estado de tu caja</h2>
              
              {estadoPago === 'pending' ? (
                <div className="flex items-center text-blue-600 bg-blue-50 px-4 py-3 rounded-lg">
                  <span className="text-xl mr-2">⏳</span>
                  <span className="font-medium">Esperando confirmación de pago</span>
                </div>
              ) : (
                <div className="flex items-center text-green-700 bg-green-100 px-4 py-3 rounded-lg border border-green-200">
                  <span className="text-xl mr-2">📦</span>
                  <span className="font-medium">Lista para armar</span>
                </div>
              )}

              <p className="text-sm text-gray-500 mt-4">Plan Actual: <span className="font-bold text-gray-700">Maker (1 Bobina)</span></p>
              <p className="text-sm text-gray-500 mt-1">Entrega: <span className="font-bold text-gray-700">Retiro en Tienda</span></p>
            </div>

            {/* Color del Mes */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-xl shadow-md text-white">
              <h2 className="text-lg font-semibold mb-2">Color Sorpresa de Septiembre</h2>
              <p className="text-2xl font-bold mb-1">PLA Matte Sky Blue</p>
              <p className="text-sm opacity-80 mb-4">Código: 11603</p>
              <button className="bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 px-4 rounded-lg transition backdrop-blur-sm">
                Ver detalle del material
              </button>
            </div>
          </div>

          {/* Columna Derecha: Acciones */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Acciones Rápidas</h2>
            
            <div className="space-y-3">
              <Link href="/dashboard/configurar" className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                <div className="flex items-center text-gray-700 group-hover:text-blue-700">
                  <span className="text-xl mr-3">⚙️</span>
                  <span className="font-medium">Configurar mi caja (AMS/Colores)</span>
                </div>
                <span className="text-gray-400 group-hover:text-blue-500">→</span>
              </Link>

              <button className="flex items-center justify-between w-full p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
                <div className="flex items-center text-gray-700 group-hover:text-purple-700">
                  <span className="text-xl mr-3">🛒</span>
                  <span className="font-medium">Comprar extra (Precio miembro)</span>
                </div>
                <span className="text-gray-400 group-hover:text-purple-500">→</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}