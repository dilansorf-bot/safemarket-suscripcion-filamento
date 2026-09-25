"use client"

import { guardarPreferencias } from './actions'
import Link from "next/link"
import { useState } from "react"

const colorOptions = [
  "Negro",
  "Blanco",
  "Gris",
  "Rojo",
  "Azul",
  "Verde",
  "Especiales",
]

export default function ConfigurarPage() {
  const [usesAms, setUsesAms] = useState(true)
  const [material, setMaterial] = useState("PLA")
  const [selectedColors, setSelectedColors] = useState<string[]>(["Negro", "Blanco"])

  const handleToggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color],
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log({ usesAms, material, selectedColors })
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">
              SAFEMARKET
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Configuración de impresión
            </h1>
          </div>
        </div>

        <form action={guardarPreferencias}
          className="rounded-2xl border border-sky-100 bg-white p-6 shadow-[0_12px_30px_rgba(14,116,144,0.08)]"
        >
          <input type="hidden" name="has_ams" value={String(usesAms)} />

          <div className="space-y-6">
            <section className="rounded-xl border border-sky-100 bg-sky-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-sky-700">Sistema de impresión</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">
                    ¿Usas sistema AMS multicolor?
                  </h2>
                </div>

                <button
                  type="button"
                  aria-label="Toggle AMS multicolor"
                  aria-pressed={usesAms}
                  onClick={() => setUsesAms((current) => !current)}
                  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    usesAms ? "bg-sky-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                      usesAms ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label htmlFor="primary_material" className="block text-sm font-medium text-slate-700">
                Material principal
              </label>

              <select
                id="primary_material"
                name="primary_material"
                value={material}
                onChange={(event) => setMaterial(event.target.value)}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option value="PLA">PLA</option>
                <option value="PETG">PETG</option>
                <option value="ABS">ABS</option>
              </select>
            </section>

            <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Colores Favoritos</h2>
                <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-medium text-sky-700">
                  {selectedColors.length} seleccionados
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {colorOptions.map((color) => {
                  const isChecked = selectedColors.includes(color)

                  return (
                    <label
                      key={color}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                        isChecked
                          ? "border-sky-500 bg-sky-50 text-sky-900 shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-sky-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="favorite_colors"
                        value={color}
                        checked={isChecked}
                        onChange={() => handleToggleColor(color)}
                        className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                      />
                      <span className="text-sm font-medium">{color}</span>
                    </label>
                  )
                })}
              </div>
            </section>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
              >
                Volver al Dashboard
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
