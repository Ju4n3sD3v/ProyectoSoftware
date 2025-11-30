// backend/src/servicios/auth.service.js
import { usuarios } from "../data/usuarios.mock.js";

/**
 * Autentica un usuario por usuario y contraseña.
 * Devuelve { usuario, rol } si es válido, o null si no.
 */
export const autenticarUsuario = (usuario, contrasena) => {
  if (!usuario || !contrasena) return null;

  const usuarioLimpio = usuario.trim();
  const contrasenaLimpia = contrasena.trim();

  const encontrado = usuarios.find(
    (u) =>
      u.usuario === usuarioLimpio &&
      u.contrasena === contrasenaLimpia
  );

  if (!encontrado) return null;

  return {
    usuario: encontrado.usuario,
    rol: encontrado.rol,
  };
};
