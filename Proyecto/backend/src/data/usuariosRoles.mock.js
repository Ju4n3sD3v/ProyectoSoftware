// backend/src/data/usuariosRoles.mock.js
// Simulación de usuarios del sistema con su rol asignado

let usuarios = [
  { id: 1, nombre: "Laura", rol: "Empleada", usuario: "laura" },
  { id: 2, nombre: "Carlos", rol: "Líder", usuario: "carlos" },
  { id: 3, nombre: "Ana", rol: "Supervisora", usuario: "ana" },
  { id: 4, nombre: "Marta", rol: "Empleada", usuario: "marta" },
  // Relacionados con credenciales iniciales
  { id: 5, nombre: "Jefe 1", rol: "Jefe", usuario: "jefe1" },
  { id: 6, nombre: "Supervisora 1", rol: "Supervisora", usuario: "super1" },
  { id: 7, nombre: "Líder 1", rol: "Líder", usuario: "lider1" },
  { id: 8, nombre: "Empleada 1", rol: "Empleada", usuario: "emple1" },
  { id: 9, nombre: "Tecnico 1", rol: "Tecnico", usuario: "tecni1" },
  { id: 10, nombre: "Despachador 1", rol: "Despachador", usuario: "despac1" },
];

// Obtener todos los usuarios
export async function getAllUsuariosMock() {
  return usuarios;
}

// Crear un nuevo usuario
export async function crearUsuarioMock({ nombre, rol, usuario }) {
  const nuevoId = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;

  const nuevoUsuario = {
    id: nuevoId,
    nombre,
    usuario: usuario || nombre?.toLowerCase().replace(/\s+/g, ""),
    rol: rol || "Empleada",
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
