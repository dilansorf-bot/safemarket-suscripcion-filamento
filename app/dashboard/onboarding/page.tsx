import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/auth')
  }

  const resolvedParams = await searchParams;

  async function guardarWhatsapp(formData: FormData) {
    'use server'
    const telefono = formData.get('telefono') as string
    const supabaseServer = await createClient()
    
    // SOLUCIÓN: Guardamos el número en "user_metadata" para que Supabase no intente enviar un SMS
    const { error: updateError } = await supabaseServer.auth.updateUser({
      data: { whatsapp: telefono } 
    })

    if (updateError) {
      redirect('/dashboard/onboarding?error=Hubo un error al guardar el número')
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.827z"/>
          </svg>
        </div>
        
        <h2 className="text-2xl font-extrabold text-gray-900">¿A dónde enviamos tu caja?</h2>
        <p className="mt-2 text-sm text-gray-600 mb-6">
          Necesitamos tu número de WhatsApp para avisarte cuando tu filamento esté listo.
        </p>

        {resolvedParams?.error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm mb-4">
            {resolvedParams.error}
          </div>
        )}

        <form action={guardarWhatsapp} className="space-y-4">
          <div>
            <div className="relative mt-1 rounded-md shadow-sm">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+593</span>
              <input
                type="tel"
                name="telefono"
                required
                className="block w-full rounded-md border-gray-300 pl-12 pr-3 py-3 focus:border-green-500 focus:ring-green-500 sm:text-sm border"
                placeholder="099 123 4567"
              />
            </div>
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Vincular WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}