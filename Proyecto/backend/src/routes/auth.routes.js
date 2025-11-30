// backend/src/routes/auth.routes.js
import { Router } from "express";
import { autenticarUsuario } from "../servicios/auth.service.js";

const router = Router();

/**
 * POST /api/auth/login
 * Body: { usuario, contrasena, rolEsperado }
 */
router.post("/api/auth/login", (req, res) => {
  const { usuario, contrasena, rolEsperado } = req.body;

  if (!usuario || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: "Faltan datos: usuario y contraseña son obligatorios" });
  }

  const user = autenticarUsuario(usuario, contrasena, rolEsperado);

  if (!user) {
    return res
      .status(401)
      .json({ mensaje: "Usuario, contraseña o rol incorrectos" });
  }

  // En un futuro aquí se podría generar un token JWT
  return res.json({
    usuario: user.usuario,
    rol: user.rol,
  });
});

export default router;
