import { Router } from "express";
import {
  registrarEntrada,
  registrarSalida,
  consultarMovimientosPorFecha,
  generarReporteDiario,
  exportarReportePDF,
  exportarReporteExcel
} from "../servicios/movimientos.service.js";

const router = Router();

// ✅ POST /movimientos/entrada - Registrar una entrada
router.post("/movimientos/entrada", async (req, res) => {
  try {
    const respuesta = await registrarEntrada(req.body);
    return res.status(201).json(respuesta);
  } catch (error) {
    console.error("Error en registrarEntrada:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

// ✅ POST /movimientos/salida - Registrar una salida
router.post("/movimientos/salida", async (req, res) => {
  try {
    const respuesta = await registrarSalida(req.body);
    return res.status(201).json(respuesta);
  } catch (error) {
    console.error("Error en registrarSalida:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

// ✅ GET /movimientos/fecha/:fecha - Consultar movimientos por fecha
// Query params opcionales: ?local=Local 1
router.get("/movimientos/fecha/:fecha", async (req, res) => {
  try {
    const { fecha } = req.params;
    const { local } = req.query;
    
    const respuesta = await consultarMovimientosPorFecha(fecha, local);
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en consultarMovimientosPorFecha:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

// ✅ GET /movimientos/reporte/:local/:fecha - Generar reporte diario
router.get("/movimientos/reporte/:local/:fecha", async (req, res) => {
  try {
    const { local, fecha } = req.params;
    
    const respuesta = await generarReporteDiario(local, fecha);
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en generarReporteDiario:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

// ✅ GET /movimientos/exportar/pdf/:local/:fecha - Exportar reporte a PDF
router.get("/movimientos/exportar/pdf/:local/:fecha", async (req, res) => {
  try {
    const { local, fecha } = req.params;
    
    const respuesta = await exportarReportePDF(local, fecha);
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', respuesta.data.tipo || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${respuesta.data.nombreArchivo}"`);
    
    return res.status(200).send(respuesta.data.contenido);
  } catch (error) {
    console.error("Error en exportarReportePDF:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

// ✅ GET /movimientos/exportar/excel/:local/:fecha - Exportar reporte a Excel (CSV)
router.get("/movimientos/exportar/excel/:local/:fecha", async (req, res) => {
  try {
    const { local, fecha } = req.params;
    
    const respuesta = await exportarReporteExcel(local, fecha);
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${respuesta.data.nombreArchivo}"`);
    
    return res.status(200).send(respuesta.data.contenido);
  } catch (error) {
    console.error("Error en exportarReporteExcel:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message
    });
  }
});

export default router;

