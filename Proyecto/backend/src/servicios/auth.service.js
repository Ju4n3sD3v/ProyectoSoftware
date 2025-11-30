// backend/src/servicios/auth.service.js
import { usuarios } from "../data/usuarios.mock.js";

/**
 * Autentica un usuario por usuario, contraseña y rol esperado.
 * Devuelve null si algo no coincide.
 */
export const autenticarUsuario = (usuario, contrasena, rolEsperado) => {
  if (!usuario || !contrasena) return null;

  const encontrado = usuarios.find(
    (u) => u.usuario === usuario && u.contrasena === contrasena
  );

  if (!encontrado) return null;

  if (rolEsperado && encontrado.rol !== rolEsperado) {
    return null;
  }

  return {
    usuario: encontrado.usuario,
    rol: encontrado.rol,
  };
};
