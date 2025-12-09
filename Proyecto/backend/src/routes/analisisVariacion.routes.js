import { Router } from "express";
import {
    compararLocales,
    obtenerDesbalances,
    generarRedistribucion
} from "../servicios/analisisVariacion.service.js";

const router = Router();

router.get("/variacion/comparar", async (req, res) => {
    try {
    const localesParam = req.query.locales || "1,2";
    const locales = localesParam.split(",").map(x => Number(x.trim()));
    const { inicio, fin, threshold } = req.query;
    const thresholdNum = threshold ? Number(threshold) : 20;

    const datos = await compararLocales(locales, inicio, fin, thresholdNum);
    res.json(datos);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en comparar locales" });
    }
});

router.get("/variacion/desbalances", async (req, res) => {
    try {
    const localesParam = req.query.locales || "1,2";
    const locales = localesParam.split(",").map(x => Number(x.trim()));
    const { inicio, fin, threshold } = req.query;
    const thresholdNum = threshold ? Number(threshold) : 20;

    const datos = await obtenerDesbalances(locales, inicio, fin, thresholdNum);
    res.json(datos);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en obtener desbalances" });
    }
});

router.get("/variacion/redistribucion", async (req, res) => {
    try {
    const localesParam = req.query.locales || "1,2";
    const locales = localesParam.split(",").map(x => Number(x.trim()));

    const datos = await generarRedistribucion(locales);
    res.json(datos);
    } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en generar redistribucion" });
    }
});

export default router;
