import { Router } from "express";
import {
  crearDescarte,
  obtenerDescartes,
  obtenerResumenReposicion,
} from "../servicios/descartes.service.js";

const router = Router();

router.post("/api/descartes", async (req, res) => {
  try {
    const registro = await crearDescarte(req.body || {});
    return res.status(201).json({
      ok: true,
      data: registro,
      mensaje: "Descarte registrado y stock actualizado.",
    });
  } catch (error) {
    console.error("Error al registrar descarte:", error.message);
    return res.status(400).json({
      ok: false,
      error: error.message || "No se pudo registrar el descarte.",
    });
  }
});

router.get("/api/descartes", async (req, res) => {
  try {
    const { fecha, lugar } = req.query;
    const data = await obtenerDescartes({ fecha, lugar });
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Error al listar descartes:", error.message);
    return res.status(500).json({
      ok: false,
      error: "No se pudo obtener el historial de descartes.",
    });
  }
});

router.get("/api/descartes/resumen", async (_req, res) => {
  try {
    const data = await obtenerResumenReposicion();
    return res.status(200).json({ ok: true, data });
  } catch (error) {
    console.error("Error al obtener resumen de reposición:", error.message);
    return res.status(500).json({
      ok: false,
      error: "No se pudo obtener el resumen de reposición.",
    });
  }
});

export default router;
