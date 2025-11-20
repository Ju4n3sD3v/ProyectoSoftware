import {
  getAllMovimientosMock,
  getMovimientosPorFechaMock,
  getMovimientosPorLocalYFechaMock,
  registrarMovimientoMock,
  getReporteDiarioMock
} from "../data/movimientos.mock.js";
import {
  registrarEntradaProductoMock,
  registrarSalidaProductoMock
} from "../data/productos.mock.js";

// Servicio: registrar una entrada
export async function registrarEntrada(datos) {
  try {
    // Validaciones
    if (!datos.productoId || !datos.productoNombre || !datos.local || !datos.cantidad) {
      throw new Error("Faltan datos requeridos: productoId, productoNombre, local, cantidad");
    }

    if (datos.cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    const movimiento = {
      ...datos,
      tipo: "entrada"
    };

    // Registrar el movimiento
    const nuevoMovimiento = await registrarMovimientoMock(movimiento);

    // Actualizar el stock del producto en el local correspondiente
    try {
      await registrarEntradaProductoMock(
        datos.productoNombre,
        datos.local,
        datos.cantidad
      );
    } catch (error) {
      // Si falla la actualización del producto, lanzar error
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }

    return {
      ok: true,
      message: "Entrada registrada exitosamente",
      data: nuevoMovimiento
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Servicio: registrar una salida
export async function registrarSalida(datos) {
  try {
    // Validaciones
    if (!datos.productoId || !datos.productoNombre || !datos.local || !datos.cantidad) {
      throw new Error("Faltan datos requeridos: productoId, productoNombre, local, cantidad");
    }

    if (datos.cantidad <= 0) {
      throw new Error("La cantidad debe ser mayor a 0");
    }

    const movimiento = {
      ...datos,
      tipo: "salida"
    };

    // Validar stock antes de registrar la salida
    try {
      await registrarSalidaProductoMock(
        datos.productoNombre,
        datos.local,
        datos.cantidad
      );
    } catch (error) {
      // Si no hay suficiente stock, lanzar error antes de registrar el movimiento
      throw new Error(`Error al procesar salida: ${error.message}`);
    }

    // Registrar el movimiento solo si la actualización del stock fue exitosa
    const nuevoMovimiento = await registrarMovimientoMock(movimiento);

    return {
      ok: true,
      message: "Salida registrada exitosamente",
      data: nuevoMovimiento
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Servicio: consultar movimientos por fecha
export async function consultarMovimientosPorFecha(fecha, local = null) {
  try {
    if (!fecha) {
      throw new Error("La fecha es requerida");
    }

    let movimientos;
    if (local) {
      movimientos = await getMovimientosPorLocalYFechaMock(local, fecha);
    } else {
      movimientos = await getMovimientosPorFechaMock(fecha);
    }

    return {
      ok: true,
      data: movimientos,
      message: movimientos.length === 0 
        ? `No hay movimientos registrados para la fecha ${fecha}${local ? ` en ${local}` : ""}`
        : undefined
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Servicio: generar reporte diario (entradas y salidas)
export async function generarReporteDiario(local, fecha) {
  try {
    if (!local || !fecha) {
      throw new Error("El local y la fecha son requeridos");
    }

    const reporte = await getReporteDiarioMock(local, fecha);

    return {
      ok: true,
      data: reporte,
      message: reporte.movimientos.length === 0
        ? `No hay movimientos registrados para ${local} en la fecha ${fecha}`
        : undefined
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Servicio: exportar reporte a PDF (simulación)
export async function exportarReportePDF(local, fecha) {
  try {
    const reporte = await getReporteDiarioMock(local, fecha);

    // Simulación de generación de PDF
    // En producción, usarías una librería como pdfkit o jspdf
    const contenidoPDF = `
REPORTE DE ENTRADAS Y SALIDAS
=============================
Local: ${reporte.local}
Fecha: ${reporte.fecha}
Generado: ${new Date().toLocaleString()}

ENTRADAS:
${reporte.entradas.length === 0 ? "No hay entradas registradas" : ""}
${reporte.entradas.map(e => `- ${e.productoNombre}: ${e.cantidad} unidades (${e.hora})`).join('\n')}
Total Entradas: ${reporte.totalEntradas} unidades

SALIDAS:
${reporte.salidas.length === 0 ? "No hay salidas registradas" : ""}
${reporte.salidas.map(s => `- ${s.productoNombre}: ${s.cantidad} unidades (${s.hora})`).join('\n')}
Total Salidas: ${reporte.totalSalidas} unidades

RESUMEN:
Diferencia: ${reporte.totalEntradas - reporte.totalSalidas} unidades
`;

    return {
      ok: true,
      data: {
        contenido: contenidoPDF,
        nombreArchivo: `reporte_${local}_${fecha}.pdf`,
        tipo: "application/pdf"
      }
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

// Servicio: exportar reporte a Excel (simulación)
export async function exportarReporteExcel(local, fecha) {
  try {
    const reporte = await getReporteDiarioMock(local, fecha);

    // Simulación de generación de Excel (CSV simple)
    // En producción, usarías una librería como exceljs
    let contenidoCSV = "Tipo,Producto,Cantidad,Hora,Observaciones\n";
    
    reporte.entradas.forEach(e => {
      contenidoCSV += `Entrada,"${e.productoNombre}",${e.cantidad},${e.hora},"${e.observaciones || ''}"\n`;
    });
    
    reporte.salidas.forEach(s => {
      contenidoCSV += `Salida,"${s.productoNombre}",${s.cantidad},${s.hora},"${s.observaciones || ''}"\n`;
    });

    return {
      ok: true,
      data: {
        contenido: contenidoCSV,
        nombreArchivo: `reporte_${local}_${fecha}.csv`,
        tipo: "text/csv"
      }
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

