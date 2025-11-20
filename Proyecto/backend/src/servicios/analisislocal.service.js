import {
  obtenerInventarioDeLocalMock,
  obtenerMovimientosPorRangoMock
} from "../data/analisislocal.mock.js";

export async function verInventarioLocal(localId) {
  const inventario = await obtenerInventarioDeLocalMock(localId);

  if (!inventario) return null;

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

export async function verMovimientosHistoricos(localId, fechaInicio, fechaFin) {
  return await obtenerMovimientosPorRangoMock(localId, fechaInicio, fechaFin);
}

export async function verAlertasLocal(localId) {
  const inventario = await obtenerInventarioDeLocalMock(localId);

  if (!inventario) return [];

  return inventario.productos
    .filter(p => p.stock < p.minimo)
    .map(p => ({
      producto: p.nombre,
      stockActual: p.stock,
      minimo: p.minimo,
      mensaje: `El producto ${p.nombre} está por debajo del mínimo`
    }));
}
