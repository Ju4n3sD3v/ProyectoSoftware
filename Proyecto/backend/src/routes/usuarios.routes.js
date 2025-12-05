import { Router } from "express";
import { listarUsuarios, asignarRol, eliminarUsuario, crearUsuario, cambiarContrasena } from "../servicios/usuariosRoles.service.js";

const router = Router();

// GET /api/usuarios -> lista usuarios con su rol
router.get("/api/usuarios", async (req, res) => {
  try {
    const respuesta = await listarUsuarios();

    if (!respuesta.ok) {
      return res.status(404).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en GET /api/usuarios:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al obtener los usuarios"
    });
  }
});

// PUT /api/usuarios/:id/rol -> asignar rol a un usuario
router.put("/api/usuarios/:id/rol", async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    const respuesta = await asignarRol(id, rol);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en PUT /api/usuarios/:id/rol:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al asignar el rol"
    });
  }
});

// DELETE /api/usuarios/:id -> eliminar un usuario
router.delete("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const respuesta = await eliminarUsuario(id);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en DELETE /api/usuarios/:id:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al eliminar el usuario"
    });
  }
});

// POST /api/usuarios -> crear usuario
router.post("/api/usuarios", async (req, res) => {
  try {
    const { nombre, rol, usuario, contrasena } = req.body;

    const respuesta = await crearUsuario(nombre, rol, usuario, contrasena);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(201).json(respuesta);
  } catch (error) {
    console.error("Error en POST /api/usuarios:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al crear el usuario"
    });
  }
});

// PATCH /api/usuarios/:usuario/contrasena -> cambiar contrasena
router.patch("/api/usuarios/:usuario/contrasena", async (req, res) => {
  try {
    const { usuario } = req.params;
    const { anterior, nueva } = req.body || {};

    const respuesta = await cambiarContrasena(usuario, anterior, nueva);

    if (!respuesta.ok) {
      return res.status(400).json(respuesta);
    }

    return res.status(200).json(respuesta);
  } catch (error) {
    console.error("Error en PATCH /api/usuarios/:usuario/contrasena:", error.message);
    return res.status(500).json({
      ok: false,
      message: "Error interno al cambiar la contraseña"
    });
  }
});

export default router;
