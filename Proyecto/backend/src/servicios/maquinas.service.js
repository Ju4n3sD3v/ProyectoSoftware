import { maquinas } from '../data/maquinas.mock.js';

// Obtener todas las máquinas
export function obtenerTodasMaquinas() {
  return maquinas;
}

// Obtener máquinas de un local específico
export function obtenerMaquinasPorLocal(nombreLocal) {
  return maquinas.filter(m => m.local === nombreLocal);
}

// Obtener máquina por ID
export function obtenerMaquinaPorId(maquinaId) {
  return maquinas.find(m => m.id === maquinaId);
}

// Obtener máquinas en espera para revisión
export function obtenerMaquinasEnEspera() {
  return maquinas.filter(m => m.estado === "En espera para revisión");
}

// Actualizar estado de una máquina
export function actualizarEstadoMaquina(maquinaId, nuevoEstado) {
  const maquina = maquinas.find(m => m.id === maquinaId);
  if (maquina) {
    maquina.estado = nuevoEstado;
    return { ok: true, mensaje: "Estado actualizado", maquina };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}

// Registrar revisión de una máquina
export function registrarRevision(maquinaId, fecha) {
  const maquina = maquinas.find(m => m.id === maquinaId);
  if (maquina) {
    maquina.ultimaRevision = fecha;
    maquina.estado = "Operativa";
    return { ok: true, mensaje: "Revisión registrada", maquina };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}

// Agendar revisión (cambiar estado a "En espera para revisión")
export function agendarRevision(maquinaId) {
  const maquina = maquinas.find(m => m.id === maquinaId);
  if (maquina) {
    maquina.estado = "En espera para revisión";
    return { ok: true, mensaje: "Revisión agendada", maquina };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}
