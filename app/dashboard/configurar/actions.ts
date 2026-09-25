'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarPreferencias(formData: FormData) {
  // 1. Instanciamos el cliente de servidor aquí mismo
  const supabaseServer = await createClient()

  // 2. Obtenemos el usuario autenticado
  const { data: { user }, error: userError } = await supabaseServer.auth.getUser()
  if (userError || !user) {
    redirect('/auth')
  }

  // 3. Extraemos los datos del formulario
  const hasAms = formData.get('has_ams') === 'true' || formData.get('has_ams') === 'on'
  const material = formData.get('primary_material') as string
  
  // Si manejas múltiples checkboxes para colores:
  const colores = formData.getAll('favorite_colors') as string[]

  // 4. Hacemos el upsert usando la variable ya definida
  const { error: upsertError } = await supabaseServer
    .from('box_preferences')
    .upsert({
      user_id: user.id,
      has_ams: hasAms,
      primary_material: material,
      favorite_colors: colores,
    }, { onConflict: 'user_id' })

  if (upsertError) {
    console.error(upsertError)
    redirect('/dashboard/configurar?error=No se pudo guardar la configuracion')
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}