import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function CitasAdmin() {
  const [citasProximas, setCitasProximas] = useState([])
  const [historialCitas, setHistorialCitas] = useState([])
  const [tabActiva, setTabActiva] = useState('proximas') // 'proximas' o 'historial'
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarCitas()
  }, [])

  const cargarCitas = async () => {
    setCargando(true)
    const ahoraIso = new Date().toISOString()

    // 1. Cargar citas próximas (futuras o de hoy en adelante)
    const { data: proximas, error: errorProximas } = await supabase
      .from('citas')
      .select('*')
      .gte('fecha_hora_utc', ahoraIso)
      .order('fecha_hora_utc', { ascending: true })

    if (errorProximas) console.error("Error en próximas:", errorProximas)

    // 2. Cargar historial (citas pasadas)
    const { data: pasadas, error: errorPasadas } = await supabase
      .from('citas')
      .select('*')
      .lt('fecha_hora_utc', ahoraIso)
      .order('fecha_hora_utc', { ascending: false })

    if (errorPasadas) console.error("Error en historial:", errorPasadas)

    setCitasProximas(proximas || [])
    setHistorialCitas(pasadas || [])
    setCargando(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Gestión de Citas - Panel Admin</h1>

      {/* Botones de Pestañas */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
        <button
          onClick={() => setTabActiva('proximas')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
            tabActiva === 'proximas' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
          }`}
        >
          Próximas Citas ({citasProximas.length})
        </button>
        <button
          onClick={() => setTabActiva('historial')}
          className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
            tabActiva === 'historial' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300'
          }`}
        >
          Historial / Pasadas ({historialCitas.length})
        </button>
      </div>

      {/* Contenido según la pestaña activa */}
      {cargando ? (
        <p className="text-gray-400">Cargando citas...</p>
      ) : (
        <div className="bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="p-3">Fecha y Hora</th>
                <th className="p-3">Barbero ID</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Estado de Pago</th>
              </tr>
            </thead>
            <tbody>
              {(tabActiva === 'proximas' ? citasProximas : historialCitas).map((cita) => (
                <tr key={cita.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-3">
                    {new Date(cita.fecha_hora_utc).toLocaleString()}
                  </td>
                  <td className="p-3">{cita.barbero_id || 'N/A'}</td>
                  <td className="p-3 font-bold text-yellow-500">{cita.total_precio} €</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-green-900 text-green-300">
                      {cita.estado_pagado || 'Completado'}
                    </span>
                  </td>
                </tr>
              ))}
              {(tabActiva === 'proximas' ? citasProximas : historialCitas).length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No hay registros en esta sección.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}