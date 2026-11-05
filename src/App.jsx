import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Horarios from './Horarios'; 
import Inventario from './Inventario'; 
import Tarifas from './Tarifas'; 

export default function App() {
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const [mensajeExito, setMensajeExito] = useState('');

  const [seccionActiva, setSeccionActiva] = useState('agenda');
  const [citas, setCitas] = useState([]);
  const [barberos, setBarberos] = useState([]);
  const [clientes, setClientes] = useState([]); 
  const [cargando, setCargando] = useState(true);
  const [isAddingCita, setIsAddingCita] = useState(false);
  
  const [newCita, setNewCita] = useState({ 
    user_id: '', 
    barbero_id: '', 
    dia: '', 
    hora: '', 
    total_precio: '',
    total_minutos: 30,
    barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95' 
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsSessionLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && seccionActiva === 'agenda') {
      fetchCitas();
      fetchBarberos();
      fetchClientes(); 
    }
  }, [seccionActiva, session]);

  async function fetchCitas() {
    setCargando(true);
    const { data, error } = await supabase.from('citas').select('*').order('id', { ascending: false });
    if (!error) setCitas(data || []);
    setCargando(false);
  }

  async function fetchBarberos() {
    const { data, error } = await supabase.from('barberos').select('*');
    if (!error) setBarberos(data || []);
  }

  async function fetchClientes() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error) setClientes(data || []);
  }

  const mostrarExito = (mensaje) => {
    setMensajeExito(mensaje);
    setTimeout(() => {
      setMensajeExito('');
    }, 3000);
  };

  const handleCreateCita = async () => {
    try {
      if (!newCita.user_id) throw new Error("Por favor, selecciona un cliente para la cita.");
      if (!newCita.barbero_id) throw new Error("Por favor, selecciona un barbero.");
      if (!newCita.dia || !newCita.hora) throw new Error("Por favor, selecciona fecha y hora.");

      // 1. Convertimos la fecha (AAAA-MM-DD) al nombre del día en español exacto para las pestañas del móvil
      const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const fechaLocal = new Date(`${newCita.dia}T00:00:00`); 
      const diaTexto = diasSemana[fechaLocal.getDay()]; 

      // 2. Mantenemos el timestamp real para el calendario del Administrador
      const fechaHoraIso = new Date(`${newCita.dia}T${newCita.hora}:00`).toISOString();

      const citaParaGuardar = {
        ...newCita,
        barbero_id: parseInt(newCita.barbero_id) || 1,
        total_precio: parseFloat(newCita.total_precio) || 0,
        dia: diaTexto, // Inyectamos "Jueves", "Miércoles", etc.
        fecha_hora_utc: fechaHoraIso,
        valorada: false // CRÍTICO: Obligatorio para que la app lo detecte como cita "pendiente"
      };

      const { data, error } = await supabase.from('citas').insert([citaParaGuardar]).select();
      if (error) throw error;
      
      setCitas([data[0], ...citas]);
      setIsAddingCita(false);
      
      setNewCita({ 
        user_id: '', 
        barbero_id: '', 
        dia: '', 
        hora: '', 
        total_precio: '',
        total_minutos: 30,
        barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
      });
      
      mostrarExito('¡Cita sincronizada con éxito en el móvil!');
      
    } catch (error) {
      console.error('Error detallado:', error);
      alert('Motivo del rechazo: ' + error.message); 
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isSessionLoading) return <div className="min-h-screen bg-barberDark flex items-center justify-center text-white">Cargando sistema...</div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-barberDark text-white flex font-sans relative">
      
      {mensajeExito && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl font-semibold flex items-center space-x-3 z-50 animate-bounce">
          <span className="text-xl">✅</span>
          <span>{mensajeExito}</span>
        </div>
      )}

      <aside className="w-64 bg-barberSurface border-r border-barberBorder flex flex-col p-6">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-8 h-8 rounded-full bg-barberGold flex items-center justify-center text-barberDark font-bold">B</div>
          <span className="font-serif font-bold text-lg tracking-wider">BARBER<span className="text-barberGold">YA</span> PRO</span>
        </div>

        <nav className="space-y-2 flex-1 text-sm">
          <button onClick={() => setSeccionActiva('agenda')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${seccionActiva === 'agenda' ? 'bg-barberGold/10 text-barberGold border border-barberGold/30' : 'text-barberGrayText hover:text-white'}`}><span>📅 Agenda Multi-Empleado</span></button>
          <button onClick={() => setSeccionActiva('horarios')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${seccionActiva === 'horarios' ? 'bg-barberGold/10 text-barberGold border border-barberGold/30' : 'text-barberGrayText hover:text-white'}`}><span>⏰ Horarios y Turnos</span></button>
          <button onClick={() => setSeccionActiva('inventario')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${seccionActiva === 'inventario' ? 'bg-barberGold/10 text-barberGold border border-barberGold/30' : 'text-barberGrayText hover:text-white'}`}><span>📦 Inventario & Stock</span></button>
          <button onClick={() => setSeccionActiva('tarifas')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${seccionActiva === 'tarifas' ? 'bg-barberGold/10 text-barberGold border border-barberGold/30' : 'text-barberGrayText hover:text-white'}`}><span>⚡ Tarifas & Precios Dinámicos</span></button>
        </nav>

        <div className="pt-6 border-t border-barberBorder text-xs text-barberGrayText">
          <p className="truncate">Admin: {session.user.email}</p>
          <p className="text-barberGold font-semibold mt-1">Conectado y Seguro 🟢</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 bg-barberSurface border-b border-barberBorder px-8 flex items-center justify-between">
          <h1 className="font-serif text-xl font-bold capitalize">Módulo: {seccionActiva}</h1>
          <div className="flex items-center space-x-4">
            <span className="text-xs bg-barberGold/10 text-barberGold border border-barberGold/30 px-3 py-1 rounded-full font-semibold">Modo Administrador</span>
            <button onClick={handleLogout} className="text-xs bg-red-900/40 text-red-400 border border-red-900/50 px-3 py-1 rounded-full font-semibold hover:bg-red-900/60 transition-colors">Cerrar Sesión</button>
            <div className="w-10 h-10 rounded-full bg-barberCard border border-barberBorder flex items-center justify-center font-bold text-barberGold">AD</div>
          </div>
        </header>

        <div className="p-8 flex-1 bg-barberDark overflow-y-auto">
          {seccionActiva === 'agenda' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Agenda en Tiempo Real</h2>
                <div className="flex space-x-3">
                  <button onClick={() => setIsAddingCita(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-500 transition-all">+ Nueva Cita</button>
                  <button onClick={fetchCitas} className="bg-barberGold text-barberDark px-4 py-2 rounded-xl font-bold text-sm hover:bg-barberGoldLight transition-all">🔄 Actualizar</button>
                </div>
              </div>

              {cargando ? <p className="text-barberGrayText text-sm">Cargando...</p> : (
                <div className="bg-barberCard border border-barberBorder rounded-2xl overflow-hidden shadow-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-barberBorder bg-barberSurface text-xs text-barberGrayText">
                        <th className="p-4">ID Cita</th><th className="p-4">Cliente & Barbero</th><th className="p-4">Día & Hora</th><th className="p-4">Precio Total</th><th className="p-4">Estado / Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-barberBorder text-sm">
                      {isAddingCita && (
                        <tr className="bg-[#2a2a2a] border-b-2 border-green-600/30">
                          <td className="p-4 text-barberGrayText italic">Auto</td>
                          <td className="p-4 flex flex-col space-y-2">
                            <select 
                              className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none cursor-pointer"
                              value={newCita.user_id} 
                              onChange={(e) => setNewCita({...newCita, user_id: e.target.value})}
                            >
                              <option value="">👤 Seleccionar Cliente...</option>
                              {clientes.map((c) => (
                                <option key={c.id} value={c.id}>{c.full_name || c.nombre || c.email || 'Cliente sin nombre'}</option>
                              ))}
                            </select>

                            <select 
                              className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none cursor-pointer"
                              value={newCita.barbero_id} 
                              onChange={(e) => setNewCita({...newCita, barbero_id: e.target.value})}
                            >
                              <option value="">✂️ Seleccionar Barbero...</option>
                              {barberos.map((b) => (
                                <option key={b.id} value={b.id}>{b.nombre || `Empleado #${b.id}`}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <input type="date" className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 cursor-pointer" value={newCita.dia} onChange={(e) => setNewCita({...newCita, dia: e.target.value})} />
                              <input type="time" className="bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 cursor-pointer" value={newCita.hora} onChange={(e) => setNewCita({...newCita, hora: e.target.value})} />
                            </div>
                          </td>
                          <td className="p-4">
                            <input type="number" placeholder="0.00" step="0.01" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newCita.total_precio} onChange={(e) => setNewCita({...newCita, total_precio: e.target.value})} />
                          </td>
                          <td className="p-4 space-x-2">
                            <button onClick={handleCreateCita} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded">Crear</button>
                            <button onClick={() => setIsAddingCita(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded">Cancelar</button>
                          </td>
                        </tr>
                      )}
                      {citas.map((cita) => {
                        const barberoAsignado = barberos.find((b) => b.id === cita.barbero_id);
                        const clienteAsignado = clientes.find((c) => c.id === cita.user_id);
                        
                        const nombreBarbero = barberoAsignado ? barberoAsignado.nombre : `Barbero #${cita.barbero_id}`;
                        const nombreCliente = clienteAsignado ? (clienteAsignado.full_name || clienteAsignado.nombre || clienteAsignado.email) : 'Cliente Web';

                        return (
                          <tr key={cita.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-mono text-barberGold font-bold">#{cita.id}</td>
                            <td className="p-4 flex flex-col">
                              <span className="font-semibold">{nombreCliente}</span>
                              <span className="text-xs text-barberGrayText">con {nombreBarbero}</span>
                            </td>
                            <td className="p-4">{cita.dia} a las {cita.hora}</td>
                            <td className="p-4 text-barberGold font-semibold">{cita.total_precio} €</td>
                            <td className="p-4"><span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">Confirmada</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {seccionActiva === 'horarios' && <Horarios />}
          {seccionActiva === 'inventario' && <Inventario />}
          {seccionActiva === 'tarifas' && <Tarifas />}
        </div>
      </main>
    </div>
  );
}