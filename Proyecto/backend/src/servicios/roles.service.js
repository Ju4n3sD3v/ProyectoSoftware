import { getAllRolesMock, crearRolMock } from "../data/roles.mock.js";

// Servicio: listar todos los roles
export async function listarRoles() {
  try {
    const roles = await getAllRolesMock();

    if (!roles) {
      return {
        ok: false,
        message: "No se encontraron roles registrados",
        data: []
      };
    }

    return {
      ok: true,
      data: roles
    };
  } catch (error) {
    console.error("Error en listarRoles:", error.message);
    throw new Error("Error al obtener los roles");
  }
}

// Servicio: crear un nuevo rol con permisos
export async function crearRol(nombre, permisosTexto) {
  try {
    if (!nombre || !nombre.trim()) {
      return {
        ok: false,
        message: "El nombre del rol es obligatorio"
      };
    }

    const permisos = (permisosTexto || "")
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const nuevoRol = await crearRolMock({ nombre: nombre.trim(), permisos });

    return {
      ok: true,
      data: nuevoRol
    };
  } catch (error) {
    console.error("Error en crearRol:", error.message);
    throw new Error("Error al crear el rol");
  }
}
