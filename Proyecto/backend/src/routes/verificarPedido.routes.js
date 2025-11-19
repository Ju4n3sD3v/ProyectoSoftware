// src/routes/verificarPedido.routes.js

import { Router } from "express";
import { verificarPedidoConBodega } from "../servicios/verificarPedido.service.js";

const router = Router();

// POST /api/verificar-pedido  (si la montas bajo /api en index.js)
router.post("/verificar-pedido", async (req, res) => {
  try {
    const { productos } = req.body;

    if (!productos || typeof productos !== "object") {
      return res.status(400).json({
        ok: false,
        error: "Debe enviar un objeto 'productos' con las cantidades del pedido."
      });
    }

    const resultado = await verificarPedidoConBodega(productos);

    if (!resultado.ok) {
      return res.status(400).json(resultado);
    }

    return res.status(200).json(resultado);

  } catch (error) {
    console.error("Error en ruta verificar pedido:", error);

    return res.status(500).json({
      ok: false,
      error: "Error interno verificando el pedido."
    });
  }
});

export default router;
