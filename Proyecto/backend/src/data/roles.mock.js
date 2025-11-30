// backend/src/data/roles.mock.js
// Simulación de tabla de roles con sus permisos

let roles = [
  {
    id: 1,
    nombre: "Jefe",
    permisos: [
      "Ver inventario de bodega",
      "Modificar inventario",
      "Ver pedidos",
      "Generar reportes",
      "Administrar roles"
    ]
  },
  {
    id: 2,
    nombre: "Supervisora",
    permisos: [
      "Administrar roles",
      "Ver usuarios del sistema"
    ]
  },
  {
    id: 3,
    nombre: "Líder",
    permisos: [
      "Ver pedidos",
      "Ver inventario por local"
    ]
  },
  {
    id: 4,
    nombre: "Empleada",
    permisos: [
      "Crear pedido",
      "Ver inventario por local"
    ]
  }
];

// Obtener todos los roles
export async function getAllRolesMock() {
  return roles;
}

// Crear un nuevo rol
export async function crearRolMock({ nombre, permisos }) {
  const nuevoId = roles.length ? Math.max(...roles.map((r) => r.id)) + 1 : 1;

  const nuevoRol = {
    id: nuevoId,
    nombre,
    permisos: Array.isArray(permisos) ? permisos : []
  };

  roles.push(nuevoRol);
  return nuevoRol;
}
