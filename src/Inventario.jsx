import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  const [newProducto, setNewProducto] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    stock: '',
    barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  async function fetchProductos() {
    setCargando(true);
    const { data, error } = await supabase.from('productos').select('*').order('id', { ascending: false });
    if (!error) setProductos(data || []);
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
      if (!newProducto.nombre) throw new Error("El nombre del producto es obligatorio.");

      const productoParaGuardar = {
        ...newProducto,
        precio: parseFloat(newProducto.precio) || 0,
        stock: parseInt(newProducto.stock) || 0
      };

      const { data, error } = await supabase.from('productos').insert([productoParaGuardar]).select();
      if (error) throw error;

      setProductos([data[0], ...productos]);
      setIsAdding(false);
      setNewProducto({
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        stock: '',
        barberia_id: '48eaa5e0-2a40-40bd-b36c-62fe24025b95'
      });

      mostrarExito('¡Producto añadido al inventario correctamente!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto: ' + error.message);
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
        <h2 className="text-lg font-semibold">Inventario & Stock</h2>
        <div className="flex space-x-3">
          <button onClick={() => setIsAdding(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-500 transition-all">+ Nuevo Producto</button>
          <button onClick={fetchProductos} className="bg-barberGold text-barberDark px-4 py-2 rounded-xl font-bold text-sm hover:bg-barberGoldLight transition-all">🔄 Actualizar</button>
        </div>
      </div>

      {cargando ? <p className="text-barberGrayText text-sm">Cargando inventario...</p> : (
        <div className="bg-barberCard border border-barberBorder rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-barberBorder bg-barberSurface text-xs text-barberGrayText">
                <th className="p-4">ID</th>
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-barberBorder text-sm">
              {isAdding && (
                <tr className="bg-[#2a2a2a] border-b-2 border-green-600/30">
                  <td className="p-4 text-barberGrayText italic">Auto</td>
                  <td className="p-4 space-y-2">
                    <input type="text" placeholder="Nombre del producto..." className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newProducto.nombre} onChange={(e) => setNewProducto({...newProducto, nombre: e.target.value})} />
                    <input type="text" placeholder="Breve descripción..." className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newProducto.descripcion} onChange={(e) => setNewProducto({...newProducto, descripcion: e.target.value})} />
                  </td>
                  <td className="p-4">
                    <input type="text" placeholder="Ej: fijacion, barba..." className="w-full bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newProducto.categoria} onChange={(e) => setNewProducto({...newProducto, categoria: e.target.value})} />
                  </td>
                  <td className="p-4">
                    <input type="number" placeholder="0.00" step="0.01" className="w-20 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newProducto.precio} onChange={(e) => setNewProducto({...newProducto, precio: e.target.value})} />
                  </td>
                  <td className="p-4 flex items-center space-x-2">
                    <input type="number" placeholder="0" className="w-16 bg-[#1a1a1a] text-white text-xs border border-gray-600 rounded p-1.5 outline-none" value={newProducto.stock} onChange={(e) => setNewProducto({...newProducto, stock: e.target.value})} />
                    <button onClick={handleCreate} className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded">Guardar</button>
                    <button onClick={() => setIsAdding(false)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded">Cancelar</button>
                  </td>
                </tr>
              )}
              {productos.length === 0 && !isAdding && (
                <tr><td colSpan="5" className="p-4 text-center text-barberGrayText">No hay productos en el inventario.</td></tr>
              )}
              {productos.map((prod) => (
                <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-barberGold font-bold">#{prod.id}</td>
                  <td className="p-4">
                    <div className="font-semibold">{prod.nombre}</div>
                    <div className="text-xs text-barberGrayText">{prod.descripcion || 'Sin descripción'}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-barberSurface border border-barberBorder px-2.5 py-1 rounded-full text-xs font-semibold uppercase text-barberGold">
                      {prod.categoria || 'General'}
                    </span>
                  </td>
                  <td className="p-4 text-barberGold font-semibold">{prod.precio} €</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prod.stock > 10 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                      {prod.stock} un.
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}