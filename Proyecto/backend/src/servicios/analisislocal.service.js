import {
  obtenerInventarioDeLocalMock,
  obtenerMovimientosPorRangoMock
} from "../data/analisislocal.mock.js";


// 1. Inventario actual por local
export async function verInventarioLocal(localId) {
  const inventario = await obtenerInventarioDeLocalMock(localId);

  if (!inventario) return null;

  // Detectar productos críticos
  const alertas = inventario.productos
    .filter(p => p.stock < p.minimo)
    .map(p => ({
      producto: p.nombre,
      stockActual: p.stock,
      minimo: p.minimo,
      mensaje: `El producto ${p.nombre} está por debajo del mínimo`
    }));

  return {
    ...inventario,
    alertas
  };
}


// 2. Análisis histórico por rango de fechas
export async function verMovimientosHistoricos(localId, fechaInicio, fechaFin) {
  const movimientos = await obtenerMovimientosPorRangoMock(
    localId,
    fechaInicio,
    fechaFin
  );

  return movimientos;
}


// 3. Alertas por niveles críticos (solo alertas)
export async function verAlertasLocal(localId) {
  const inventario = await obtenerInventarioDeLocalMock(localId);

  if (!inventario) return [];

  const alertas = inventario.productos
    .filter(p => p.stock < p.minimo)
    .map(p => ({
      producto: p.nombre,
      stockActual: p.stock,
      minimo: p.minimo,
      mensaje: `El producto ${p.nombre} está por debajo del mínimo`
    }));

  return alertas;
}
