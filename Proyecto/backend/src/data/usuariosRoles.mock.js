// backend/src/data/usuariosRoles.mock.js
// Simulación de usuarios del sistema con su rol asignado

let usuarios = [
  { id: 1, nombre: "Laura", rol: "Empleada" },
  { id: 2, nombre: "Carlos", rol: "Líder" },
  { id: 3, nombre: "Ana", rol: "Supervisora" },
  { id: 4, nombre: "Marta", rol: "Empleada" }
];

// Obtener todos los usuarios
export async function getAllUsuariosMock() {
  return usuarios;
}

// Crear un nuevo usuario (opcional)
export async function crearUsuarioMock({ nombre, rol }) {
  const nuevoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

  const nuevoUsuario = {
    id: nuevoId,
    nombre,
    rol: rol || "Empleada"
  };

  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

// Asignar un rol a un usuario
export async function asignarRolAUsuarioMock(id, nuevoRol) {
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) return null;

  usuario.rol = nuevoRol;
  return usuario;
}

// Eliminar un usuario
export async function eliminarUsuarioMock(id) {
  const index = usuarios.findIndex((u) => u.id === id);
  if (index === -1) return false;

  usuarios.splice(index, 1);
  return true;
}
