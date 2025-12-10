import express from "express";
import { empresa_lolalitas } from "../data.js";

const router = express.Router();

/**
 * GET /api/datos
 * Obtener todos los datos de empresa_lolalitas
 */
router.get("/api/datos", (req, res) => {
  console.log("Solicitud GET /api/datos");
  res.json({
    success: true,
    data: empresa_lolalitas,
  });
});

/**
 * GET /api/datos/productos
 * Obtener solo los productos
 */
router.get("/api/datos/productos", (req, res) => {
  console.log("Solicitud GET /api/datos/productos");
  res.json({
    success: true,
    productos: empresa_lolalitas.productos,
  });
});

/**
 * GET /api/datos/categorias
 * Obtener solo las categorías
 */
router.get("/api/datos/categorias", (req, res) => {
  console.log("Solicitud GET /api/datos/categorias");
  res.json({
    success: true,
    categorias: empresa_lolalitas.categorias,
  });
});

export default router;
