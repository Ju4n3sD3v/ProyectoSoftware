import { Router } from "express";
import {
  listarProductosBodega,
  listarProductosBodegaSinActualizar72
} from "../servicios/productos.service.js";

const router = Router();

// ✅ GET /productos/bodega
router.get("/productos/bodega", async (req, res) => {
  try {
    const respuesta = await listarProductosBodega();

    // respuesta viene con { ok: true, data: [...] } o { ok: true, message, data: [] }
    return res.status(200).json(respuesta);
  } catch (error) {
    // Si el service hizo throw new Error(...)
    console.error("Error en listarProductosBodega:", error.message);

    return res.status(500).json({
      ok: false,
      error: "Error al obtener los productos de la bodega."
    });
  }
});

// ✅ GET /productos/bodega/no-actualizados
router.get("/productos/bodega/no-actualizados", async (req, res) => {
  try {
    const respuesta = await listarProductosBodegaSinActualizar72();

    // Igual: { ok: true, data: [...] } o { ok: true, message, data: [] }
    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en listarProductosBodegaSinActualizar72:", error.message);

    return res.status(500).json({
      ok: false,
      error: "Error al obtener los productos desactualizados de la bodega."
    });
  }
});

export default router;
