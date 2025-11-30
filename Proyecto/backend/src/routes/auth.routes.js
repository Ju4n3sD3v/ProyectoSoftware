// backend/src/routes/auth.routes.js
import { Router } from "express";
import { autenticarUsuario } from "../servicios/auth.service.js";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { usuario, contrasena }
 */
router.post("/api/auth/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos: usuario y contraseña son obligatorios" });
  }

  const user = autenticarUsuario(usuario, contrasena);

  if (!user) {
    return res
      .status(401)
      .json({ mensaje: "Usuario o contraseña incorrectos" });
  }

  return res.json({
    usuario: user.usuario,
    rol: user.rol,
  });
});

export default router;
