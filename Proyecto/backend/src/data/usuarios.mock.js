// backend/src/data/usuarios.mock.js

// Lista de usuarios de prueba para autenticación
export const usuarios = [
  { usuario: "jefe1", contrasena: "1234", rol: "Jefe" },
  { usuario: "super1", contrasena: "abcd", rol: "Supervisora" },
  { usuario: "lider1", contrasena: "1111", rol: "Líder" },
  { usuario: "emple1", contrasena: "0000", rol: "Empleada" },
  { usuario: "tecni1", contrasena: "2222", rol: "Tecnico" },
  { usuario: "despac1", contrasena: "3333", rol: "Despachador" },
  // Relacionados con la tabla de roles/usuarios
  { usuario: "laura", contrasena: "laura123", rol: "Empleada" },
  { usuario: "carlos", contrasena: "carlos123", rol: "Líder" },
  { usuario: "ana", contrasena: "ana123", rol: "Supervisora" },
  { usuario: "marta", contrasena: "marta123", rol: "Empleada" },
];

export function actualizarContrasena(usuario, contrasenaAnterior, nueva) {
  const idx = usuarios.findIndex(
    (u) => u.usuario.toLowerCase() === usuario.toLowerCase()
  );
  if (idx === -1) {
    return { ok: false, message: "Usuario no encontrado" };
  }
  if (usuarios[idx].contrasena !== contrasenaAnterior) {
    return { ok: false, message: "La contraseña anterior no coincide" };
  }
  usuarios[idx].contrasena = nueva;
  return { ok: true };
}
