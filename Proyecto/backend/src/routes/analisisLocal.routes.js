import { Router } from "express";
import {
  verInventarioLocal,
  verMovimientosHistoricos,
  verAlertasLocal
} from "../servicios/analisisLocal.service.js";

const router = Router();


// 1. Ver inventario actual de un local
router.get("/analisis/local/:id", async (req, res) => {
  try {
    const localId = Number(req.params.id);
    const datos = await verInventarioLocal(localId);

    if (!datos)
      return res.status(404).json({ error: "Local no encontrado" });

    res.json(datos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener inventario del local" });
  }
});


// 2. Ver movimientos por rango de fechas
router.get("/analisis/historial/:id", async (req, res) => {
  try {
    const localId = Number(req.params.id);
    const { inicio, fin } = req.query;

    const movimientos = await verMovimientosHistoricos(localId, inicio, fin);

    res.json(movimientos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener historial" });
  }
});


// 3. Ver alertas por niveles críticos
router.get("/analisis/alertas/:id", async (req, res) => {
  try {
    const localId = Number(req.params.id);
    const alertas = await verAlertasLocal(localId);

    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener alertas" });
  }
});

export default router;
