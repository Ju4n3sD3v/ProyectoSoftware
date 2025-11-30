import { Router } from "express";
import { listarRoles, crearRol } from "../servicios/roles.service.js";

const router = Router();

// GET /api/roles -> lista todos los roles
router.get("/api/roles", async (req, res) => {
  try {
    const respuesta = await listarRoles();

    if (!respuesta.ok) {
      return res.status(404).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en GET /api/roles:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al obtener los roles"
    });
  }
});

// POST /api/roles -> crear un rol nuevo
router.post("/api/roles", async (req, res) => {
  try {
    const { nombre, permisosTexto } = req.body;

    const respuesta = await crearRol(nombre, permisosTexto);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(201).json(respuesta);
  } catch (error) {
    console.error("Error en POST /api/roles:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al crear el rol"
    });
  }
});

export default router;
