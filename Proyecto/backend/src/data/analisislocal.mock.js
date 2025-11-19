// Inventario actual por local
let inventarioPorLocal = [
  {
    localId: 1,
    nombreLocal: "Local Centro",
    productos: [
      { id: 1, nombre: "Harina", stock: 120, minimo: 50 },
      { id: 2, nombre: "Queso", stock: 30, minimo: 40 },
      { id: 3, nombre: "Salsa", stock: 80, minimo: 25 }
    ]
  },
  {
    localId: 2,
    nombreLocal: "Local Norte",
    productos: [
      { id: 1, nombre: "Harina", stock: 200, minimo: 50 },
      { id: 2, nombre: "Queso", stock: 60, minimo: 40 },
      { id: 3, nombre: "Salsa", stock: 15, minimo: 25 }
    ]
  }
];


// Historial de movimientos por local
let movimientosHistoricos = [
  {
    localId: 1,
    fecha: "2025-01-01",
    productoId: 1,
    cantidad: -20
  },
  {
    localId: 1,
    fecha: "2025-01-05",
    productoId: 2,
    cantidad: 10
  },
  {
    localId: 2,
    fecha: "2025-01-03",
    productoId: 3,
    cantidad: -5
  }
];


// -------------------------------
// Funciones Mock
// -------------------------------

// Inventario
export async function obtenerInventarioDeLocalMock(localId) {
  return inventarioPorLocal.find(l => l.localId === localId) || null;
}


// Movimientos históricos filtrados por rango
export async function obtenerMovimientosPorRangoMock(localId, fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  return movimientosHistoricos
    .filter(m => {
      const fechaMov = new Date(m.fecha);
      return (
        m.localId === localId &&
        fechaMov >= inicio &&
        fechaMov <= fin
      );
    })
    .map(mov => {
      // Buscar nombre del producto
      const local = inventarioPorLocal.find(l => l.localId === mov.localId);
      const producto = local.productos.find(p => p.id === mov.productoId);

      return {
        fecha: mov.fecha,
        producto: producto.nombre,
        cantidad: mov.cantidad,
        tipo: mov.cantidad >= 0 ? "entrada" : "salida"
      };
    });
}
