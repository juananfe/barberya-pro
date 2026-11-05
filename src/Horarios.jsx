import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Horarios() {
  const [horarios, setHorarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const [newHorario, setNewHorario] = useState({
    dia_semana: 'Lunes',
    activo: true,
    hora_apertura: '10:00',
    hora_cierre: '21:00',
    descanso_inicio: '',
    descanso_fin: '',
    barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
  });

  useEffect(() => {
    fetchHorarios();
  }, []);

  async function fetchHorarios() {
    setCargando(true);
    const { data, error } = await supabase.from('horarios_barberia').select('*').order('id', { ascending: true });
    if (!error) setHorarios(data || []);
    setCargando(false);
  }

  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => {
      setMensajeExito('');
    }, 3000);
  };

  const handleCreate = async () => {
    try {
      const horarioParaGuardar = {
        ...newHorario,
        descanso_inicio: newHorario.descanso_inicio || null,
        descanso_fin: newHorario.descanso_fin || null
      };

      const { data, error } = await supabase.from('horarios_barberia').insert([horarioParaGuardar]).select();
      if (error) throw error;

      setHorarios([...horarios, data[0]]);
      setIsAdding(false);
      setNewHorario({
        dia_semana: 'Lunes',
        activo: true,
        hora_apertura: '10:00',
        hora_cierre: '21:00',
        descanso_inicio: '',
        descanso_fin: '',
        barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
      });

      mostrarExito('¡Horario guardado correctamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el horario: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* NOTIFICACIÓN TOAST FLOTANTE */}
      {mensajeExito && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold flex items-center space-x-3 z-50 animate-bounce">
          <span className="text-xl">✅</span>
          <span>{mensajeExito}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Gestión de Horarios y Turnos</h2>
        <div className="flex space-x-3">
          <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-500 transition-all">+ Nuevo Horario</button>
          <button onClick={fetchHorarios} className="bg-barberGold text-barberDark px-4 py-2 rounded-xl font-bold text-sm hover:bg-barberGoldLight transition-all">🔄 Actualizar</button>
        </div>
      </div>

      {cargando ? <p className="text-barberGrayText text-sm">Cargando horarios...</p> : (
        <div className="bg-barberCard border border-barberBorder rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-barberBorder bg-barberSurface text-xs text-barberGrayText">
                <th className="p-4">ID</th>
                <th className="p-4">Día de la Semana</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Apertura - Cierre</th>
                <th className="p-4">Descanso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-barberBorder text-sm">
              {isAdding && (
                <tr className="bg-[#2a2a2a] border-b-2 border-green-600/30">
                  <td className="p-4 text-barberGrayText italic">Auto</td>
                  <td className="p-4">
                    <select 
                      className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none cursor-pointer"
                      value={newHorario.dia_semana} 
                      onChange={(e) => setNewHorario({...newHorario, dia_semana: e.target.value})}
                    >
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select 
                      className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none cursor-pointer"
                      value={newHorario.activo} 
                      onChange={(e) => setNewHorario({...newHorario, activo: e.target.value === 'true'})}
                    >
                      <option value="true">Activo</option>
                      <option value="false">Cerrado</option>
                    </select>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <input type="time" className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none [color-scheme:dark] cursor-pointer" value={newHorario.hora_apertura} onChange={(e) => setNewHorario({...newHorario, hora_apertura: e.target.value})} />
                    <span className="text-barberGrayText self-center">-</span>
                    <input type="time" className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none [color-scheme:dark] cursor-pointer" value={newHorario.hora_cierre} onChange={(e) => setNewHorario({...newHorario, hora_cierre: e.target.value})} />
                  </td>
                  <td className="p-4 space-x-2">
                    <button onClick={handleCreate} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded">Guardar</button>
                    <button onClick={() => setIsAdding(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded">Cancelar</button>
                  </td>
                </tr>
              )}
              {horarios.length === 0 && !isAdding && (
                <tr><td colSpan="5" className="p-4 text-center text-barberGrayText">No hay horarios configurados.</td></tr>
              )}
              {horarios.map((horario) => (
                <tr key={horario.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-barberGold font-bold">#{horario.id}</td>
                  <td className="p-4 font-semibold">{horario.dia_semana}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${horario.activo ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {horario.activo ? 'Abierto' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="p-4">{horario.hora_apertura} - {horario.hora_cierre}</td>
                  <td className="p-4 text-barberGrayText">{horario.descanso_inicio ? `${horario.descanso_inicio} - ${horario.descanso_fin}` : 'Sin descanso'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}