import express from "express";
import {
  obtenerPedidosListos,
  iniciarDespacho,
  obtenerDetallePedido,
  generarComprobantePDF
} from "../servicios/despacho.service.js";

const router = express.Router();

/**
 * GET /api/despacho/pedidos-listos
 * Obtener lista de pedidos listos para despachar
 */
router.get("/api/despacho/pedidos-listos", (req, res) => {
  const resultado = obtenerPedidosListos();
  const status = resultado.success ? 200 : 500;
  return res.status(status).json(resultado);
});

/**
 * POST /api/despacho/:id/iniciar
 * Iniciar despacho de un pedido
 * Body: { observaciones?: string }
 */
router.post("/api/despacho/:id/iniciar", (req, res) => {
  const { id } = req.params;
  const { observaciones } = req.body || {};

  const resultado = iniciarDespacho(id, observaciones || "");
  const status = resultado.success ? 200 : 400;

  return res.status(status).json(resultado);
});

/**
 * GET /api/despacho/:id/detalle
 * Obtener detalles completos de un pedido
 */
router.get("/api/despacho/:id/detalle", (req, res) => {
  const { id } = req.params;
  const resultado = obtenerDetallePedido(id);
  const status = resultado.success ? 200 : 404;

  return res.status(status).json(resultado);
});

/**
 * GET /api/despacho/:id/comprobante-pdf
 * Generar y descargar comprobante de despacho en PDF
 */
router.get("/api/despacho/:id/comprobante-pdf", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await generarComprobantePDF(id);

    if (!resultado.success) {
      return res.status(400).json(resultado);
    }

    // Configurar headers para descarga
    res.setHeader("Content-Type", resultado.data.tipo || "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resultado.data.nombreArchivo}"`
    );

    return res.status(200).send(resultado.data.contenido);
  } catch (error) {
    console.error("Error en ruta comprobante-pdf:", error);
    return res.status(500).json({
      success: false,
      mensaje: "Error al generar el comprobante PDF",
      error: error.message
    });
  }
});

export default router;

