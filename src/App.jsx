import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './Login';
import Horarios from './Horarios'; 
import Inventario from './Inventario'; 
import Tarifas from './Tarifas';
import CitasAdmin from './citas';

// Función para determinar si una cita ha vencido (margen de 30 minutos)
export const esCitaVigente = (diaTexto, horaTexto) => {
  try {
    const partes = horaTexto.trim().split(":");
    const hora = parseInt(partes[0], 10);
    const minuto = parseInt(partes[1], 10);
    if (isNaN(hora)) return false;

    const ahora = new Date();
    const cita = new Date();
    cita.setHours(hora, minuto, 0, 0);

    const diaLimpio = diaTexto.trim().toLowerCase();

    // Caso 1: Fecha con formato numérico (ej: "05/11/2026", "2026-11-05")
    if (diaLimpio.includes("/") || diaLimpio.includes("-")) {
      const sep = diaLimpio.includes("/") ? "/" : "-";
      const p = diaLimpio.split(sep);
      let year, month, day;
      if (p[0].length === 4) { // yyyy-mm-dd
         year = p[0]; month = p[1]; day = p[2];
      } else { // dd/mm/yyyy
         day = p[0]; month = p[1]; year = p[2];
      }
      cita.setFullYear(year, month - 1, day);
    } else {
      // Caso 2: Nombre del día de la semana
      const diasMap = { "domingo": 0, "lunes": 1, "martes": 2, "miércoles": 3, "miercoles": 3, "jueves": 4, "viernes": 5, "sábado": 6, "sabado": 6 };
      if (!(diaLimpio in diasMap)) return false;
      
      const diaObjetivo = diasMap[diaLimpio];
      const diaActual = ahora.getDay();
      
      if (diaObjetivo < diaActual) return false;
      
      if (diaObjetivo > diaActual) {
        cita.setDate(ahora.getDate() + (diaObjetivo - diaActual));
      }
    }
    
    // Si han pasado más de 30 minutos, ya no es vigente
    const limite = cita.getTime() + (30 * 60 * 1000);
    return Date.now() <= limite;
  } catch(e) {
    return false;
  }
};

// Componente público de Política de Privacidad adaptado a CompuAlgaba
function PoliticaPrivacidad({ onVolver }) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        
        {/* Cabecera */}
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <button
            onClick={onVolver}
            className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 transition mb-4 cursor-pointer"
          >
            &larr; Volver a la plataforma
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Política de Privacidad y Protección de Datos (RGPD)
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Última actualización: Noviembre 2026 • Conforme al RGPD (UE 2016/679) y la LOPD-GDD 3/2018
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="space-y-6 text-sm leading-relaxed text-neutral-300">
          
          {/* 1. Responsable */}
          <section className="bg-neutral-950/60 p-4 rounded-xl border border-neutral-800/80">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">1.</span> Responsable del Tratamiento
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-neutral-300">
              <li><strong>Titular / Responsable:</strong> CompuAlgaba</li>
              <li><strong>Domicilio profesional:</strong> Calle Boquerón 2, 41015 Sevilla, España</li>
              <li><strong>Contacto de Privacidad:</strong> soporte@compualgaba.com</li>
            </ul>
          </section>

          {/* 2. Datos y Finalidad */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">2.</span> Datos que Recopilamos y Finalidad del Tratamiento
            </h2>
            <p className="mb-2">
              A través de la plataforma <strong>BARBERYA PRO</strong>, CompuAlgaba trata la información mínima y necesaria para los siguientes fines:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
              <li>
                <strong>Gestión de Reservas y Citas:</strong> Tratamiento de nombre, número de teléfono y correo electrónico para confirmar, modificar, recordar y gestionar turnos en el establecimiento.
              </li>
              <li>
                <strong>Ficha Técnica de Estilo:</strong> Preferencias de corte, degradado, estilo de barba y productos de acabado solicitados por el usuario para personalizar la atención del profesional.
              </li>
              <li>
                <strong>Programa de Fidelización y Puntos:</strong> Control de visitas, canje de cupones, códigos de invitación de embajadores y descuentos asociados al usuario.
              </li>
              <li>
                <strong>Soporte y Comunicación:</strong> Atención de dudas o mensajes operativos a través del canal de chat interno.
              </li>
            </ul>
          </section>

          {/* 3. Base Jurídica */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">3.</span> Base Legal para el Tratamiento
            </h2>
            <p>
              La legitimación para el tratamiento de tus datos personales reside en la <strong>ejecución de un contrato o relación de prestación de servicios</strong> (artículo 6.1.b del RGPD) al registrar una cuenta o solicitar una reserva. Las notificaciones informativas voluntarias o promociones se sustentan en el <strong>consentimiento expreso</strong> del interesado (artículo 6.1.a del RGPD).
            </p>
          </section>

          {/* 4. Encargados del Tratamiento */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">4.</span> Destinatarios y Proveedores de Infraestructura
            </h2>
            <p className="mb-2">
              CompuAlgaba no comercializa, alquila ni cede tus datos personales a terceras entidades. Para la prestación técnica del servicio web y móvil, se emplean proveedores de infraestructura cloud en calidad de <strong>Encargados del Tratamiento</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
                <p className="font-semibold text-amber-500 text-xs">Vercel Inc.</p>
                <p className="text-xs text-neutral-400 mt-0.5">Alojamiento de la aplicación web y red de entrega de contenido (CDN).</p>
              </div>
              <div className="p-3 bg-neutral-950/70 border border-neutral-800 rounded-lg">
                <p className="font-semibold text-amber-500 text-xs">Supabase Inc.</p>
                <p className="text-xs text-neutral-400 mt-0.5">Gestión de base de datos PostgreSQL cifrada, autenticación y almacenamiento seguro.</p>
              </div>
            </div>
          </section>

          {/* 5. Conservación */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">5.</span> Conservación de los Datos
            </h2>
            <p>
              Los datos se conservarán mientras mantengas tu cuenta activa o continúes utilizando el servicio de reservas. Puedes solicitar la supresión de tu perfil y citas en cualquier momento desde la sección <em>Mi Perfil</em> o contactando con CompuAlgaba. Una vez solicitada la baja, los datos se bloquearán para cumplir con las obligaciones legales y tributarias correspondientes.
            </p>
          </section>

          {/* 6. Derechos */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">6.</span> Ejercicio de tus Derechos
            </h2>
            <p className="mb-2">
              Tienes derecho a ejercitar en todo momento tus derechos de <strong>Acceso, Rectificación, Supresión, Limitación del tratamiento, Portabilidad y Oposición</strong>.
            </p>
            <p>
              Puedes ejercerlos remitiendo una comunicación por escrito a CompuAlgaba en <strong>Calle Boquerón 2, 41015 Sevilla</strong> o mediante correo electrónico a <strong>soporte@compualgaba.com</strong>, acreditando tu identidad. Si consideras que tus derechos han sido vulnerados, tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="text-amber-500 underline">www.aepd.es</a>.
            </p>
          </section>

          {/* 7. Seguridad */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-amber-500 font-bold">7.</span> Medidas de Seguridad
            </h2>
            <p>
              Implementamos medidas técnicas y organizativas rigurosas, tales como cifrado de comunicaciones mediante TLS/HTTPS, políticas de control de acceso por fila (Row Level Security en base de datos) y contraseñas cifradas para proteger tu información frente a accesos no autorizados.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Detección de ruta pública para política de privacidad
  const [mostrarPrivacidad, setMostrarPrivacidad] = useState(() => {
    const path = window.location.pathname.toLowerCase();
    return path.includes('privacidad') || path.includes('privacy');
  });

  const [seccionActiva, setSeccionActiva] = useState('agenda');
  const [barberos, setBarberos] = useState([]);
  const [clientes, setClientes] = useState([]); 

  // Escuchar cambios en la URL (por ejemplo atrás/adelante en el navegador)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      setMostrarPrivacidad(path.includes('privacidad') || path.includes('privacy'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
      fetchBarberos();
      fetchClientes(); 
    }
  }, [seccionActiva, session]);

  async function fetchBarberos() {
    const { data, error } = await supabase.from('barberos').select('*');
    if (!error) setBarberos(data || []);
  }

  async function fetchClientes() {
    const { data, error } = await supabase.from('profiles').select('*');
    if (!error) setClientes(data || []);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 1. Si la URL contiene /privacidad o se activa la vista, mostramos la política pública directamente
  if (mostrarPrivacidad) {
    return (
      <PoliticaPrivacidad
        onVolver={() => {
          window.history.pushState({}, '', '/');
          setMostrarPrivacidad(false);
        }}
      />
    );
  }

  // 2. Control de sesión y carga para el panel de administración
  if (isSessionLoading) return <div className="min-h-screen bg-barberDark flex items-center justify-center text-white">Cargando sistema...</div>;
  if (!session) return <Login />;

  return (
    <div className="min-h-screen bg-barberDark text-white flex font-sans relative">

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

        <div className="pt-6 border-t border-barberBorder text-xs text-barberGrayText space-y-2">
          <p className="truncate">Admin: {session.user.email}</p>
          <p className="text-barberGold font-semibold">Conectado y Seguro 🟢</p>
          <button 
            onClick={() => {
              window.history.pushState({}, '', '/privacidad');
              setMostrarPrivacidad(true);
            }} 
            className="text-gray-400 hover:text-barberGold text-[11px] underline block pt-2 transition-colors cursor-pointer"
          >
            Ver Política de Privacidad (RGPD)
          </button>
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
          {seccionActiva === 'agenda' && <CitasAdmin barberos={barberos} clientes={clientes} />}
          {seccionActiva === 'horarios' && <Horarios />}
          {seccionActiva === 'inventario' && <Inventario />}
          {seccionActiva === 'tarifas' && <Tarifas />}
        </div>
      </main>
    </div>
  );
}