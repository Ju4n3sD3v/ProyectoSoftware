import { Router } from "express";
import {
  listarProductosBodega,
  listarProductosBodegaSinActualizar72,
  actualizarStockProducto
} from "../servicios/productos.service.js";

const router = Router();

// ✅ GET /productos/bodega
router.get("/productos/bodega", async (req, res) => {
  try {
    const respuesta = await listarProductosBodega();

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en listarProductosBodega:", error.message);

    return res.status(500).json({
      ok: false,
      error: "Error al obtener los productos de la bodega."
    });
  }
});

// ✅ GET /productos/bodega/sin-actualizar-72
router.get("/productos/bodega/sin-actualizar-72", async (req, res) => {
  try {
    const respuesta = await listarProductosBodegaSinActualizar72();

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en listarProductosBodegaSinActualizar72:", error.message);

    return res.status(500).json({
      ok: false,
      error: "Error al obtener los productos desactualizados de la bodega."
    });
  }
});

// ✅ PUT /productos/:id  → actualizar stock de un producto de bodega
router.put("/productos/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { stock } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      ok: false,
      error: "ID de producto inválido."
    });
  }

  if (stock === undefined || typeof stock !== "number" || stock < 0) {
    return res.status(400).json({
      ok: false,
      error: "El stock debe ser un número mayor o igual a 0."
    });
  }

  try {
    const respuesta = await actualizarStockProducto(id, stock);

    if (!respuesta.ok) {
      // Error controlado desde el servicio
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error al actualizar producto:", error.message);
    return res.status(500).json({
      ok: false,
      error: "Error interno al actualizar el producto."
    });
  }
});

export default router;
