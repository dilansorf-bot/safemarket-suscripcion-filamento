import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Cerramos la sesión en Supabase
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.redirect(new URL('/dashboard?error=No se pudo cerrar sesión', request.url))
  }

  // Redirigimos al catálogo público
  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/', request.url), {
    status: 302,
  })
}