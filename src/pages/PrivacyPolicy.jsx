import React from 'react';

export default function PrivacyPolicy({ onVolver }) {
  const handleVolver = () => {
    if (onVolver) {
      onVolver();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-neutral-200 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
        
        {/* Cabecera */}
        <div className="mb-8 border-b border-neutral-800 pb-5">
          <button
            onClick={handleVolver}
            className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#e5c158] transition mb-4 cursor-pointer bg-transparent border-none p-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a la plataforma
          </button>
          
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Política de Privacidad y Protección de Datos (RGPD)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2">
            Última actualización: Noviembre 2026 • Conforme al RGPD (UE 2016/679) y la LOPD-GDD 3/2018
          </p>
        </div>

        {/* Contenido Legal */}
        <div className="space-y-6 text-sm leading-relaxed text-neutral-300">
          
          {/* 1. Responsable */}
          <section className="bg-black/40 p-4 rounded-xl border border-neutral-800/80">
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#D4AF37] font-bold">1.</span> Responsable del Tratamiento
            </h2>
            <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-300">
              <li><strong>Titular / Responsable:</strong> CompuAlgaba</li>
              <li className="flex items-start gap-1.5 mt-1">
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span><strong>Domicilio profesional:</strong> Calle Boquerón 2, 41015 Sevilla, España</span>
              </li>
              <li className="flex items-center gap-1.5 mt-1">
                <svg className="w-4 h-4 text-[#D4AF37] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span><strong>Contacto de Privacidad:</strong> soporte@compualgaba.com</span>
              </li>
            </ul>
          </section>

          {/* 2. Datos y Finalidad */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#D4AF37] font-bold">2.</span> Datos que Recopilamos y Finalidad del Tratamiento
            </h2>
            <p className="mb-2">
              A través de la aplicación <strong>BARBERYA PRO</strong>, CompuAlgaba trata la información mínima y necesaria para los siguientes fines:
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
              <span className="text-[#D4AF37] font-bold">3.</span> Base Legal para el Tratamiento
            </h2>
            <p>
              La legitimación para el tratamiento de tus datos personales reside en la <strong>ejecución de un contrato o relación de prestación de servicios</strong> (artículo 6.1.b del RGPD) al registrar una cuenta o solicitar una reserva. Las notificaciones informativas voluntarias o promociones se sustentan en el <strong>consentimiento expreso</strong> del interesado (artículo 6.1.a del RGPD).
            </p>
          </section>

          {/* 4. Encargados del Tratamiento */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#D4AF37] font-bold">4.</span> Destinatarios y Proveedores de Infraestructura
            </h2>
            <p className="mb-2">
              CompuAlgaba no comercializa, alquila ni cede tus datos personales a terceras entidades. Para la prestación técnica del servicio web y móvil, se emplean proveedores de infraestructura cloud en calidad de <strong>Encargados del Tratamiento</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-black/40 border border-neutral-800 rounded-lg">
                <p className="font-semibold text-[#D4AF37] text-xs">Vercel Inc.</p>
                <p className="text-xs text-neutral-400 mt-0.5">Alojamiento de la aplicación web y red de entrega de contenido (CDN).</p>
              </div>
              <div className="p-3 bg-black/40 border border-neutral-800 rounded-lg">
                <p className="font-semibold text-[#D4AF37] text-xs">Supabase Inc.</p>
                <p className="text-xs text-neutral-400 mt-0.5">Gestión de base de datos PostgreSQL cifrada, autenticación y almacenamiento seguro.</p>
              </div>
            </div>
          </section>

          {/* 5. Conservación */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#D4AF37] font-bold">5.</span> Conservación de los Datos
            </h2>
            <p>
              Los datos se conservarán mientras mantengas tu cuenta activa o continúes utilizando el servicio de reservas. Puedes solicitar la supresión de tu perfil y citas en cualquier momento desde la sección <em>Mi Perfil</em> o contactando con CompuAlgaba. Una vez solicitada la baja, los datos se bloquearán para cumplir con las obligaciones legales y tributarias correspondientes.
            </p>
          </section>

          {/* 6. Derechos */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <span className="text-[#D4AF37] font-bold">6.</span> Ejercicio de tus Derechos
            </h2>
            <p className="mb-2">
              Tienes derecho a ejercitar en todo momento tus derechos de <strong>Acceso, Rectificación, Supresión, Limitación del tratamiento, Portabilidad y Oposición</strong>.
            </p>
            <p>
              Puedes ejercerlos remitiendo una comunicación por escrito a CompuAlgaba en <strong>Calle Boquerón 2, 41015 Sevilla</strong> o mediante correo electrónico a <strong>soporte@compualgaba.com</strong>, acreditando tu identidad. Si consideras que tus derechos han sido vulnerados, tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="text-[#D4AF37] underline">www.aepd.es</a>.
            </p>
          </section>

          {/* 7. Seguridad */}
          <section>
            <h2 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[#D4AF37] font-bold">7.</span> Medidas de Seguridad
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