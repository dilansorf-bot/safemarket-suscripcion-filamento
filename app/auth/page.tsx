import { login, signup } from './actions'

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }> // Ahora es una promesa
}) {
  // Esperamos a que los parámetros de la URL carguen
  const resolvedSearchParams = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Accede a tu Suscripción
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ingresa para gestionar tus cajas de filamento Bambu Lab
          </p>
        </div>

        {/* Mostrar mensaje de error si Supabase rechaza el login/registro */}
        {resolvedSearchParams?.error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-sm text-red-700">{resolvedSearchParams.error}</p>
          </div>
        )}

        {/* El formulario no usa onSubmit, usa Server Actions */}
        <form className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input
                id="email"
                name="email" // Obligatorio para que formData.get('email') funcione
                type="email"
                autoComplete="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password" // Obligatorio para formData.get('password')
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            {/* Botón de Login */}
            <button
              formAction={login}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Iniciar Sesión
            </button>
            
            {/* Botón de Registro */}
            <button
              formAction={signup}
              className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Crear Cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}