// Array en memoria (simula una tabla de BD) BASE DE DATOS MOVIMIENTOS
// Estructura: { id, productoId, productoNombre, local, tipo, cantidad, fecha, hora, observaciones }
let movimientos = [
  { 
    id: 1, 
    productoId: 4, 
    productoNombre: "Servilletas", 
    local: "Local 1", 
    tipo: "entrada", 
    cantidad: 50, 
    fecha: "2025-02-11", 
    hora: "08:30:00",
    observaciones: "Recepción de pedido desde bodega"
  },
  { 
    id: 2, 
    productoId: 5, 
    productoNombre: "Tarros", 
    local: "Local 1", 
    tipo: "salida", 
    cantidad: 10, 
    fecha: "2025-02-11", 
    hora: "10:15:00",
    observaciones: "Productos usados en preparación"
  },
  { 
    id: 3, 
    productoId: 6, 
    productoNombre: "Salsas", 
    local: "Local 1", 
    tipo: "salida", 
    cantidad: 15, 
    fecha: "2025-02-11", 
    hora: "12:45:00",
    observaciones: "Venta al cliente"
  },
  { 
    id: 4, 
    productoId: 7, 
    productoNombre: "Bolsas de alitas", 
    local: "Local 2", 
    tipo: "entrada", 
    cantidad: 30, 
    fecha: "2025-02-11", 
    hora: "09:00:00",
    observaciones: "Recepción de pedido desde bodega"
  },
  { 
    id: 5, 
    productoId: 8, 
    productoNombre: "Bolsa de papas", 
    local: "Local 2", 
    tipo: "salida", 
    cantidad: 5, 
    fecha: "2025-02-11", 
    hora: "11:20:00",
    observaciones: "Productos usados en preparación"
  },
  { 
    id: 6, 
    productoId: 11, 
    productoNombre: "Bolsas de alitas", 
    local: "Local 1", 
    tipo: "entrada", 
    cantidad: 20, 
    fecha: "2025-02-10", 
    hora: "14:30:00",
    observaciones: "Recepción de pedido desde bodega"
  },
  { 
    id: 7, 
    productoId: 11, 
    productoNombre: "Bolsas de alitas", 
    local: "Local 1", 
    tipo: "salida", 
    cantidad: 8, 
    fecha: "2025-02-10", 
    hora: "16:00:00",
    observaciones: "Venta al cliente"
  }
];

let siguienteId = 8;

// Función para obtener todos los movimientos
export async function getAllMovimientosMock() {
  return movimientos;
}

// Función para obtener movimientos por fecha
export async function getMovimientosPorFechaMock(fecha) {
  return movimientos.filter(m => m.fecha === fecha);
}

// Función para obtener movimientos por local y fecha
export async function getMovimientosPorLocalYFechaMock(local, fecha) {
  return movimientos.filter(m => m.local === local && m.fecha === fecha);
}

// Función para registrar un movimiento (entrada o salida)
export async function registrarMovimientoMock(movimiento) {
  const nuevoMovimiento = {
    id: siguienteId++,
    productoId: movimiento.productoId,
    productoNombre: movimiento.productoNombre,
    local: movimiento.local,
    tipo: movimiento.tipo, // "entrada" o "salida"
    cantidad: movimiento.cantidad,
    fecha: movimiento.fecha || new Date().toISOString().split('T')[0], // Fecha actual si no se proporciona
    hora: movimiento.hora || new Date().toTimeString().split(' ')[0], // Hora actual si no se proporciona
    observaciones: movimiento.observaciones || ""
  };
  
  movimientos.push(nuevoMovimiento);
  return nuevoMovimiento;
}

// Función para obtener reporte del día (entradas y salidas combinadas)
export async function getReporteDiarioMock(local, fecha) {
  const movimientosDelDia = movimientos.filter(m => 
    m.local === local && m.fecha === fecha
  );
  
  const entradas = movimientosDelDia.filter(m => m.tipo === "entrada");
  const salidas = movimientosDelDia.filter(m => m.tipo === "salida");
  
  return {
    fecha,
    local,
    entradas,
    salidas,
    totalEntradas: entradas.reduce((sum, e) => sum + e.cantidad, 0),
    totalSalidas: salidas.reduce((sum, s) => sum + s.cantidad, 0),
    movimientos: movimientosDelDia
  };
}

