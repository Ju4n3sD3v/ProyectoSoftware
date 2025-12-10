import productos from "./productos.mock.js";
import { getAllMovimientosMock } from "./movimientos.mock.js";

// -------------------------------------------------------------
// MÍNIMOS POR LOCAL
// -------------------------------------------------------------
const minimosPorLocal = {
  Bodega: {
    "Bolsas de pollo": 25,
    "Bolsas de papas": 20,
    "Bolsas de harina": 40,
    "Aceite 20L": 10,
    "Combo#1": 1,
    "Combo#2": 2,
    "Combo#3": 3,
    "Combo#4": 4,
    "Combo#5": 4,
    "Tapas de combos": 14,
    "Cajas de papas": 200,
    BBQ: 9,
    "Miel Mostaza": 8,
    "Picante Suave": 2,
    "Extra Picante": 2,
    Rosada: 1,
    Roja: 1,
    "Piña": 1,
    Escoba: 5,
    Trapera: 2,
    Desengrasante: 4,
    Limpido: 4,
    "Papel higiénico": 3,
    Limpiones: 4,
    "Copas/Tapas": 10,
    Antibacterial: 5,
    "Jabón de manos": 5,
    Vinagre: 5,
    "Mata cucarachas": 5,
    Esponja: 2
  },
  "Local 1": {
    "Bolsas de pollo": 25,
    "Bolsas de papas": 20,
    "Bolsas de harina": 40,
    "Aceite 20L": 10,
    "Combo#1": 1,
    "Combo#2": 2,
    "Combo#3": 3,
    "Combo#4": 4,
    "Combo#5": 4,
    "Tapas de combos": 14,
    "Cajas de papas": 200,
    BBQ: 9,
    "Miel Mostaza": 8,
    "Picante Suave": 2,
    "Extra Picante": 2,
    Rosada: 1,
    Roja: 1,
    "Piña": 1,
    Escoba: 5,
    Trapera: 2,
    Desengrasante: 4,
    Limpido: 4,
    "Papel higiénico": 3,
    Limpiones: 4,
    "Copas/Tapas": 10,
    Antibacterial: 5,
    "Jabón de manos": 5,
    Vinagre: 5,
    "Mata cucarachas": 5,
    Esponja: 2
  },
  "Local 2": {
    "Bolsas de pollo": 25,
    "Bolsas de papas": 20,
    "Bolsas de harina": 40,
    "Aceite 20L": 10,
    "Combo#1": 1,
    "Combo#2": 2,
    "Combo#3": 3,
    "Combo#4": 4,
    "Combo#5": 4,
    "Tapas de combos": 14,
    "Cajas de papas": 200,
    BBQ: 9,
    "Miel Mostaza": 8,
    "Picante Suave": 2,
    "Extra Picante": 2,
    Rosada: 1,
    Roja: 1,
    "Piña": 1,
    Escoba: 5,
    Trapera: 2,
    Desengrasante: 4,
    Limpido: 4,
    "Papel higiénico": 3,
    Limpiones: 4,
    "Copas/Tapas": 10,
    Antibacterial: 5,
    "Jabón de manos": 5,
    Vinagre: 5,
    "Mata cucarachas": 5,
    Esponja: 2
  }
};

// -------------------------------------------------------------
// 1. OBTENER INVENTARIO REAL (BODEGA / LOCAL 1 / LOCAL 2)
// -------------------------------------------------------------
export async function obtenerInventarioDeLocalMock(localId) {
  let localNombre =
    localId === 0 ? "Bodega" :
    localId === 1 ? "Local 1" :
    localId === 2 ? "Local 2" : null;

  if (!localNombre) return null;

  // Filtrar productos por lugar
  const productosLocal = productos.filter(p => p.lugar === localNombre);

  if (productosLocal.length === 0) return null;

  // Obtener mínimos específicos del local
  const minimosLocal = minimosPorLocal[localNombre] || {};

  const productosFinal = productosLocal.map(p => ({
    id: p.id,
    nombre: p.nombre,
    stock: p.stock,
    minimo: minimosLocal[p.nombre] ?? 0
  }));

  const alertas = productosFinal
    .filter(p => p.stock < p.minimo)
    .map(p => ({
      producto: p.nombre,
      stockActual: p.stock,
      minimo: p.minimo,
      mensaje: `El producto ${p.nombre} está por debajo del mínimo (${p.minimo})`
    }));

  return {
    localId,
    nombreLocal: localNombre,
    productos: productosFinal,
    alertas
  };
}

// -------------------------------------------------------------
// 2. MOVIMIENTOS POR RANGO
// -------------------------------------------------------------
export async function obtenerMovimientosPorRangoMock(localId, fechaInicio, fechaFin) {
  let localNombre =
    localId === 0 ? "Bodega" :
    localId === 1 ? "Local 1" :
    localId === 2 ? "Local 2" : null;

  const movimientos = await getAllMovimientosMock();

  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  return movimientos
    .filter(m => {
      const fecha = new Date(m.fecha);
      return (
        m.local === localNombre &&
        fecha >= inicio &&
        fecha <= fin
      );
    })
    .map(m => ({
      fecha: m.fecha,
      producto: m.productoNombre,
      cantidad: m.cantidad,
      tipo: m.tipo,
      observaciones: m.observaciones
    }));
}
