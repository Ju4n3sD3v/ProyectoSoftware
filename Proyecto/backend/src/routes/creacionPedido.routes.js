import express from "express";
import {
  guardarPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  eliminarPedido,
  actualizarPedido,
  exportarPedidoExcel,
  obtenerPedidosPorLocal,
  revisarPedido,
  obtenerFaltantesPorLocal,
} from "../servicios/creacionPedido.service.js";

const router = express.Router();

/**
 * POST /api/pedidos
 * Guardar un nuevo pedido
 */
router.post("/api/pedidos", (req, res) => {
  console.log("📨 Petición POST recibida en /api/pedidos");
  console.log("Datos recibidos:", req.body);

  const pedido = req.body;

  if (!pedido || Object.keys(pedido).length === 0) {
    return res.status(400).json({
      success: false,
      mensaje: "El pedido no puede estar vacío",
    });
  }

  const resultado = guardarPedido(pedido);
  console.log("Resultado de guardado:", resultado);
  res.json(resultado);
});

/**
 * GET /api/pedidos
 * Obtener todos los pedidos
 */
router.get("/api/pedidos", (req, res) => {
  const resultado = obtenerPedidos();
  res.json(resultado);
});

/**
 * IMPORTANTE: Las rutas más específicas DEBEN ir ANTES de las genéricas
 */

/**
 * GET /api/pedidos/por-local/:local
 * Obtener pedidos por local (con opción de solo pendientes)
 * Query: ?soloPendientes=true
 */
router.get("/api/pedidos/por-local/:local", (req, res) => {
  const { local } = req.params;
  const { soloPendientes } = req.query;

  console.log("📥 GET /api/pedidos/por-local/:local", { local, soloPendientes });

  const resultado = obtenerPedidosPorLocal(decodeURIComponent(local), {
    soloPendientes: soloPendientes === "true",
  });

  console.log("📤 Resultado:", resultado);
  res.json(resultado);
});

/**
 * GET /api/pedidos/faltantes/:local
 * JEFE: obtener todos los faltantes de un local
 */
router.get("/api/pedidos/faltantes/:local", (req, res) => {
  const { local } = req.params;

  console.log("📥 GET /api/pedidos/faltantes/:local", { local });

  const resultado = obtenerFaltantesPorLocal(decodeURIComponent(local));
  const status = resultado.success ? 200 : 500;

  return res.status(status).json(resultado);
});

/**
 * GET /api/pedidos/:id/exportar
 * Exportar el pedido a Excel (CSV)
 */
router.get("/api/pedidos/:id/exportar", (req, res) => {
  const { id } = req.params;

  const resultado = exportarPedidoExcel(id);

  if (!resultado.success) {
    return res.status(400).json(resultado);
  }

  // Configurar headers para descarga
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${resultado.data.nombreArchivo}"`
  );

  return res.status(200).send(resultado.data.contenido);
});

/**
 * GET /api/pedidos/:id
 * Obtener un pedido específico (RUTA GENÉRICA - va AL FINAL)
 */
router.get("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const resultado = obtenerPedidoPorId(id);
  res.json(resultado);
});

/**
 * DELETE /api/pedidos/:id
 * Eliminar un pedido
 */
router.delete("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const resultado = eliminarPedido(id);
  res.json(resultado);
});

/**
 * PATCH /api/pedidos/:id
 * Actualizar cantidades del pedido y marcarlo como revisado
 */
router.patch("/api/pedidos/:id", (req, res) => {
  const { id } = req.params;
  const { productos } = req.body;

  if (!productos || typeof productos !== "object") {
    return res.status(400).json({
      success: false,
      mensaje: "Debes enviar un objeto 'productos' en el body",
    });
  }

  const resultado = actualizarPedido(id, productos);
  const status = resultado.success ? 200 : 400;

  return res.status(status).json(resultado);
});

/**
 * POST /api/pedidos/:id/verificacion
 * Registrar la verificación de un pedido (cantidades recibidas)
 */
router.post("/api/pedidos/:id/verificacion", (req, res) => {
  const { id } = req.params;
  const { productosRecibidos } = req.body;

  if (!productosRecibidos || typeof productosRecibidos !== "object") {
    return res.status(400).json({
      success: false,
      mensaje: "Debes enviar un objeto 'productosRecibidos' en el body",
    });
  }

  const resultado = revisarPedido(id, productosRecibidos);
  const status = resultado.success ? 200 : 400;

  return res.status(status).json(resultado);
});

export default router;
