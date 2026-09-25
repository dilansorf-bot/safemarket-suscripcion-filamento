import Link from 'next/link'

type Plan = {
  name: string
  price: string
  description: string
  badge: string
  featured?: boolean
  features: string[]
}

const plans: Plan[] = [
  {
    name: 'Maker',
    price: '$29 / mes',
    description: '1 Bobina al mes, colores sorpresa y acceso a la tienda.',
    badge: 'Básico',
    features: ['1 bobina al mes', 'Colores sorpresa', 'Acceso a tienda'],
  },
  {
    name: 'Dúo',
    price: '$49 / mes',
    description: '2 Bobinas al mes, ideal para proyectos medianos y varias piezas a la vez.',
    badge: 'Popular',
    featured: true,
    features: ['2 bobinas al mes', 'Ideal para proyectos medianos', 'Descuentos en tienda'],
  },
  {
    name: 'Farm',
    price: '$129 / mes',
    description: '5+ Bobinas al mes con precio especial por volumen para producción continua.',
    badge: 'Volumen',
    features: ['5+ bobinas al mes', 'Precio especial por volumen', 'Ideal para producción continua'],
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.18),_transparent_22%)]" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-16 text-center sm:px-8 lg:px-10">
          <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
            SAFEMARKET Club 3D
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Nunca te quedes sin filamento
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
            Recibe filamento Bambu Lab mensual con colores sorpresa y descuentos en la tienda.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="#planes"
              className="inline-flex items-center justify-center rounded-full bg-blue-600 px-7 py-3.5 text-base font-semibold text-white transition hover:bg-blue-500"
            >
              Ver Planes
            </Link>
          </div>
        </div>
      </section>

      <section id="planes" className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Planes</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Elige tu nivel de impresión</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-7 shadow-xl shadow-slate-950/20 ${
                plan.featured
                  ? 'border-blue-500/40 bg-gradient-to-b from-slate-800 to-slate-900 ring-2 ring-blue-500/30'
                  : 'border-slate-700 bg-slate-900/80'
              }`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  {plan.badge}
                </span>
                {plan.featured && (
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                    Recomendado
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <p className="mt-3 text-sm text-slate-300">{plan.description}</p>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
                      ✓
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/auth"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-white text-slate-900 hover:bg-slate-200'
                }`}
              >
                Suscribirme
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
