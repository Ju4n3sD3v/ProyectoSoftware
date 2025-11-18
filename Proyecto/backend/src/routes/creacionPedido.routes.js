import express from "express";
import {
  guardarPedido,
  obtenerPedidos,
  obtenerPedidoPorId,
  eliminarPedido,
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
 * GET /api/pedidos/:id
 * Obtener un pedido específico
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

export default router;
