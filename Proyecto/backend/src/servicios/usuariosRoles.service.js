import { 
  getAllUsuariosMock,
  asignarRolAUsuarioMock,
  eliminarUsuarioMock
} from "../data/usuariosRoles.mock.js";

// Servicio: listar usuarios
export async function listarUsuarios() {
  try {
    const usuarios = await getAllUsuariosMock();

    if (!usuarios) {
      return {
        ok: false,
        message: "No se encontraron usuarios registrados",
        data: []
      };
    }

    return {
      ok: true,
      data: usuarios
    };
  } catch (error) {
    console.error("Error en listarUsuarios:", error.message);
    throw new Error("Error al obtener los usuarios");
  }
}

// Servicio: asignar un rol a un usuario
export async function asignarRol(id, rol) {
  try {
    const idNumero = Number(id);
    if (Number.isNaN(idNumero)) {
      return {
        ok: false,
        message: "ID de usuario inválido"
      };
    }

    if (!rol || !rol.trim()) {
      return {
        ok: false,
        message: "El rol es obligatorio"
      };
    }

    const usuarioActualizado = await asignarRolAUsuarioMock(idNumero, rol.trim());

    if (!usuarioActualizado) {
      return {
        ok: false,
        message: "Usuario no encontrado"
      };
    }

    return {
      ok: true,
      data: usuarioActualizado
    };
  } catch (error) {
    console.error("Error en asignarRol:", error.message);
    throw new Error("Error al asignar el rol al usuario");
  }
}

// Servicio: eliminar usuario
export async function eliminarUsuario(id) {
  try {
    const idNumero = Number(id);
    if (Number.isNaN(idNumero)) {
      return {
        ok: false,
        message: "ID de usuario inválido"
      };
    }

    const eliminado = await eliminarUsuarioMock(idNumero);

    if (!eliminado) {
      return {
        ok: false,
        message: "Usuario no encontrado"
      };
    }

    return {
      ok: true
    };
  } catch (error) {
    console.error("Error en eliminarUsuario:", error.message);
    throw new Error("Error al eliminar el usuario");
  }
}
