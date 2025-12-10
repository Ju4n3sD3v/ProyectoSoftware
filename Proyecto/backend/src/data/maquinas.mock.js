// Datos de máquinas por local
// Cada local tiene 2 máquinas con información de estado y última revisión

export const maquinas = [
  // LOCAL 1
  {
    id: "M001",
    local: "Local 1",
    numero: 1,
    estado: "Operativa",
    ultimaRevision: "2025-12-08"
  },
  {
    id: "M002",
    local: "Local 1",
    numero: 2,
    estado: "Operativa",
    ultimaRevision: "2025-11-25"
  },
  // LOCAL 2
  {
    id: "M003",
    local: "Local 2",
    numero: 1,
    estado: "En espera para revisión",
    ultimaRevision: "2025-12-05"
  },
  {
    id: "M004",
    local: "Local 2",
    numero: 2,
    estado: "Operativa",
    ultimaRevision: "2025-12-02"
  }
];

// Función para obtener máquinas de un local específico
export function obtenerMaquinasPorLocal(nombreLocal) {
  return maquinas.filter(m => m.local === nombreLocal);
}

// Función para obtener máquina por ID
export function obtenerMaquinaPorId(maquinaId) {
  return maquinas.find(m => m.id === maquinaId);
}

// Función para actualizar el estado de una máquina
export function actualizarEstadoMaquina(maquinaId, nuevoEstado) {
  const maquina = maquinas.find(m => m.id === maquinaId);
  if (maquina) {
    maquina.estado = nuevoEstado;
    return { ok: true, mensaje: "Estado actualizado" };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}

// Función para registrar revisión
export function registrarRevision(maquinaId, fecha) {
  const maquina = maquinas.find(m => m.id === maquinaId);
  if (maquina) {
    maquina.ultimaRevision = fecha;
    return { ok: true, mensaje: "Revisión registrada" };
  }
  return { ok: false, mensaje: "Máquina no encontrada" };
}
