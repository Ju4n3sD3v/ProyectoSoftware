import { maquinas, registroMantenimientos, revisionesAgendadas } from '../data/maquinas.mock.js';

const MS_DIA = 1000 * 60 * 60 * 24;

// Calcula información de revisión mensual y auto-ajusta estado cuando corresponde
function enriquecerConRevision(maquina, hoy) {
  const ultima = new Date(maquina.ultimaRevision);
  const proxima = new Date(ultima);
  proxima.setMonth(proxima.getMonth() + 1); // revisión mensual

  const diasParaRevision = Math.ceil((proxima.getTime() - hoy.getTime()) / MS_DIA);

  // Si ya llegó la fecha y estaba operativa, pasa a espera para revisión
  // Nota: solo aplicar para máquinas operativas, no para las que ya están fuera de servicio
  let estadoFinal = maquina.estado;
  if (diasParaRevision <= 0 && maquina.estado === "Operativa") {
    estadoFinal = "En espera para revisión";
    maquina.estado = estadoFinal; // Actualizar en el original
  }

  return {
    ...maquina,
    estado: estadoFinal,
    fechaProximaRevision: proxima.toISOString().split('T')[0],
    diasParaRevision,
    alertaRevision: diasParaRevision > 0 && diasParaRevision <= 10,
  };
}

// Refresca estados y devuelve copia enriquecida
function obtenerEnriquecidas(lista) {
  const hoy = new Date();
  return lista.map((m) => enriquecerConRevision(m, hoy));
}

// Obtener todas las máquinas
export function obtenerTodasMaquinas() {
  return obtenerEnriquecidas(maquinas);
}

// Obtener máquinas de un local específico
export function obtenerMaquinasPorLocal(nombreLocal) {
  const filtradas = maquinas.filter((m) => m.local === nombreLocal);
  return obtenerEnriquecidas(filtradas);
}

// Obtener máquina por ID
export function obtenerMaquinaPorId(maquinaId) {
  const encontrada = maquinas.find((m) => m.id === maquinaId);
  if (!encontrada) return null;
  return obtenerEnriquecidas([encontrada])[0];
}

// Obtener máquinas en espera para revisión
export function obtenerMaquinasEnEspera() {
  const enriquecidas = obtenerEnriquecidas(maquinas);
  return enriquecidas.filter((m) => m.estado === "En espera para revisión");
}

// Actualizar estado de una máquina
export function actualizarEstadoMaquina(maquinaId, nuevoEstado) {
  const maquina = maquinas.find((m) => m.id === maquinaId);
  if (maquina) {
    maquina.estado = nuevoEstado;
    return { ok: true, mensaje: "Estado actualizado", maquina: obtenerMaquinaPorId(maquinaId) };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}

// Registrar revisión de una máquina
export function registrarRevision(maquinaId, fecha) {
  const maquina = maquinas.find((m) => m.id === maquinaId);
  if (maquina) {
    maquina.ultimaRevision = fecha;
    maquina.estado = "Operativa";
    return { ok: true, mensaje: "Revisión registrada", maquina: obtenerMaquinaPorId(maquinaId) };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}

// Agendar revisión con fecha y hora
export function agendarRevision(maquinaId, datos) {
  const maquina = maquinas.find((m) => m.id === maquinaId);
  if (!maquina) {
    return { ok: false, mensaje: "Máquina no encontrada" };
  }
  
  const revision = {
    id: `REV-${Date.now()}`,
    maquinaId,
    local: maquina.local,
    numeroMaquina: maquina.numero,
    fechaAgendada: datos.fecha,
    horaAgendada: datos.hora,
    descripcion: datos.descripcion || "",
    agendadaEn: new Date().toISOString(),
    estado: "pendiente"
  };
  
  revisionesAgendadas.push(revision);
  
  // Cambiar estado de la máquina a "En espera para revisión"
  maquina.estado = "En espera para revisión";
  
  return { ok: true, mensaje: "Revisión agendada", revision };
}

// Obtener revisiones agendadas de una máquina
export function obtenerRevisionesAgendadas(maquinaId) {
  return revisionesAgendadas.filter((r) => r.maquinaId === maquinaId);
}

// Registrar mantenimiento
export function registrarMantenimiento(maquinaId, datos) {
  const maquina = maquinas.find((m) => m.id === maquinaId);
  if (!maquina) {
    return { ok: false, mensaje: "Máquina no encontrada" };
  }
  
  const mantenimiento = {
    id: `MTT-${Date.now()}`,
    maquinaId,
    local: maquina.local,
    numeroMaquina: maquina.numero,
    fecha: datos.fecha,
    hora: datos.hora,
    tecnicoResponsable: datos.tecnicoResponsable,
    tipoMantenimiento: datos.tipoMantenimiento,
    descripcion: datos.descripcion || "",
    registradoEn: new Date().toISOString()
  };
  
  registroMantenimientos.push(mantenimiento);
  
  // Actualizar última revisión en la máquina
  maquina.ultimaRevision = datos.fecha;
  maquina.estado = "Operativa";
  
  return { ok: true, mensaje: "Mantenimiento registrado", mantenimiento };
}

// Obtener historial de mantenimientos de una máquina
export function obtenerHistorialMantenimiento(maquinaId) {
  return registroMantenimientos.filter((m) => m.maquinaId === maquinaId);
}
