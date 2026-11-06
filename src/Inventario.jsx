import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Tarifas() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Estados para la edición
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const [newServicio, setNewServicio] = useState({
    nombre: '', descripcion: '', duracion_min: '', precio: '',
    barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
  });

  useEffect(() => {
    fetchServicios();
  }, []);

  async function fetchServicios() {
    setCargando(true);
    const { data, error } = await supabase
      .from('servicios')
      .select('*')
      .eq('activo', true)
      .order('id', { ascending: false });
      
    if (!error) setServicios(data || []);
    setCargando(false);
  }

  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => setMensajeExito(''), 3000);
  };

  const handleCreate = async () => {
    try {
      if (!newServicio.nombre) throw new Error("El nombre del servicio es obligatorio.");
      const servicioParaGuardar = {
        ...newServicio,
        duracion_min: parseInt(newServicio.duracion_min) || 30,
        precio: parseFloat(newServicio.precio) || 0,
        activo: true
      };

      const { data, error } = await supabase.from('servicios').insert([servicioParaGuardar]).select();
      if (error) throw error;

      setServicios([data[0], ...servicios]);
      setIsAdding(false);
      setNewServicio({ nombre: '', descripcion: '', duracion_min: '', precio: '', barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95' });
      mostrarExito('¡Servicio creado correctamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar: ' + error.message);
    }
  };

  const handleDeleteServicio = async (servicioId) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este servicio?");
    if (confirmar) {
      try {
        const { error } = await supabase.from('servicios').update({ activo: false }).eq('id', servicioId);
        if (error) throw error;
        setServicios(servicios.filter((serv) => serv.id !== servicioId));
        mostrarExito('¡Servicio eliminado correctamente!');
      } catch (error) {
        console.error("Error al eliminar:", error.message);
        alert("Hubo un error al eliminar.");
      }
    }
  };

  // Preparar la fila para edición
  const handleEditClick = (serv) => {
    setEditingId(serv.id);
    setEditFormData({
      nombre: serv.nombre,
      descripcion: serv.descripcion || '',
      duracion_min: serv.duracion_min,
      precio: serv.precio
    });
  };

  // Guardar los cambios editados en Supabase
  const handleUpdateServicio = async (servicioId) => {
    try {
      if (!editFormData.nombre) throw new Error("El nombre no puede estar vacío.");

      const { error } = await supabase
        .from('servicios')
        .update({
          nombre: editFormData.nombre,
          descripcion: editFormData.descripcion,
          duracion_min: parseInt(editFormData.duracion_min) || 30,
          precio: parseFloat(editFormData.precio) || 0
        })
        .eq('id', servicioId);

      if (error) throw error;

      // Actualizar vista local
      setServicios(servicios.map(serv => serv.id === servicioId ? { ...serv, ...editFormData, duracion_min: parseInt(editFormData.duracion_min) || 30, precio: parseFloat(editFormData.precio) || 0 } : serv));
      setEditingId(null);
      mostrarExito('¡Servicio actualizado correctamente!');
    } catch (error) {
      console.error("Error al actualizar:", error.message);
      alert('Error al actualizar: ' + error.message);
    }
  };

  return (
    <div className="space-y-6 relative">
      {mensajeExito && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold flex items-center space-x-3 z-50 animate-bounce">
          <span className="text-xl">✅</span><span>{mensajeExito}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tarifas & Precios Dinámicos</h2>
        <div className="flex space-x-3">
          <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-500 transition-all">+ Nuevo Servicio</button>
          <button onClick={fetchServicios} className="bg-barberGold text-barberDark px-4 py-2 rounded-xl font-bold text-sm hover:bg-barberGoldLight transition-all">🔄 Actualizar</button>
        </div>
      </div>

      {cargando ? <p className="text-barberGrayText text-sm">Cargando tarifas...</p> : (
        <div className="bg-barberCard border border-barberBorder rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-barberBorder bg-barberSurface text-xs text-barberGrayText">
                <th className="p-4">ID</th><th className="p-4">Servicio</th>
                <th className="p-4">Duración</th><th className="p-4">Precio</th><th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-barberBorder text-sm">
              {isAdding && (
                <tr className="bg-[#2a2a2a] border-b-2 border-green-600/30">
                  <td className="p-4 text-barberGrayText italic">Auto</td>
                  <td className="p-4 space-y-2">
                    <input type="text" placeholder="Nombre..." className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newServicio.nombre} onChange={(e) => setNewServicio({...newServicio, nombre: e.target.value})} />
                    <input type="text" placeholder="Descripción..." className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newServicio.descripcion} onChange={(e) => setNewServicio({...newServicio, descripcion: e.target.value})} />
                  </td>
                  <td className="p-4"><input type="number" placeholder="Min" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newServicio.duracion_min} onChange={(e) => setNewServicio({...newServicio, duracion_min: e.target.value})} /></td>
                  <td className="p-4"><input type="number" placeholder="0.00" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newServicio.precio} onChange={(e) => setNewServicio({...newServicio, precio: e.target.value})} /></td>
                  <td className="p-4 flex flex-col items-center space-y-2">
                    <button onClick={handleCreate} className="w-full px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded">Guardar</button>
                    <button onClick={() => setIsAdding(false)} className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded">Cancelar</button>
                  </td>
                </tr>
              )}
              {servicios.length === 0 && !isAdding && (
                <tr><td colSpan="5" className="p-4 text-center text-barberGrayText">No hay servicios registrados.</td></tr>
              )}
              {servicios.map((serv) => (
                <tr key={serv.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-barberGold font-bold">#{serv.id}</td>
                  
                  {editingId === serv.id ? (
                    <>
                      <td className="p-4 space-y-2">
                        <input type="text" className="w-full bg-[#1a1a1a] text-white text-xs border border-barberGold rounded p-1.5 outline-none" value={editFormData.nombre} onChange={(e) => setEditFormData({...editFormData, nombre: e.target.value})} />
                        <input type="text" className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={editFormData.descripcion} onChange={(e) => setEditFormData({...editFormData, descripcion: e.target.value})} />
                      </td>
                      <td className="p-4"><input type="number" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={editFormData.duracion_min} onChange={(e) => setEditFormData({...editFormData, duracion_min: e.target.value})} /></td>
                      <td className="p-4"><input type="number" step="0.01" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={editFormData.precio} onChange={(e) => setEditFormData({...editFormData, precio: e.target.value})} /></td>
                      <td className="p-4 flex flex-col items-center space-y-2">
                        <button onClick={() => handleUpdateServicio(serv.id)} className="w-full px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded">Guardar</button>
                        <button onClick={() => setEditingId(null)} className="w-full px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded">Cancelar</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-4">
                        <div className="font-semibold">{serv.nombre}</div>
                        <div className="text-xs text-barberGrayText">{serv.descripcion || 'Sin descripción'}</div>
                      </td>
                      <td className="p-4">
                        <span className="bg-barberSurface border border-barberBorder px-2.5 py-1 rounded-full text-xs font-semibold text-barberGold">⏱️ {serv.duracion_min} mins</span>
                      </td>
                      <td className="p-4 text-barberGold font-semibold text-base">{serv.precio} €</td>
                      <td className="p-4 flex flex-col items-center space-y-2">
                        <button onClick={() => handleEditClick(serv)} className="w-full text-xs bg-blue-900/40 text-blue-400 border border-blue-900/50 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-900/60 transition-colors">Editar</button>
                        <button onClick={() => handleDeleteServicio(serv.id)} className="w-full text-xs bg-red-900/40 text-red-400 border border-red-900/50 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-900/60 transition-colors">Eliminar</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}