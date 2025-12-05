import { 
  getAllUsuariosMock,
  asignarRolAUsuarioMock,
  crearUsuarioMock,
  eliminarUsuarioMock
} from "../data/usuariosRoles.mock.js";
import { usuarios as usuariosAuth, actualizarContrasena } from "../data/usuarios.mock.js";

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

// Servicio: crear usuario con rol
export async function crearUsuario(nombre, rol, usuario, contrasena) {
  try {
    if (!nombre || !nombre.trim()) {
      return {
        ok: false,
        message: "El nombre es obligatorio"
      };
    }

    if (!usuario || !usuario.trim()) {
      return {
        ok: false,
        message: "El usuario es obligatorio"
      };
    }

    if (!contrasena || !contrasena.trim()) {
      return {
        ok: false,
        message: "La contraseña es obligatoria"
      };
    }

    // Validar usuario único
    const existe = usuariosAuth.find(
      (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase()
    );
    if (existe) {
      return {
        ok: false,
        message: "El usuario ya existe"
      };
    }

    const nuevoUsuario = await crearUsuarioMock({
      nombre: nombre.trim(),
      usuario: usuario.trim(),
      rol: rol && rol.trim() ? rol.trim() : "Empleada"
    });

    // Añadir credenciales al mock de autenticación
    usuariosAuth.push({
      usuario: usuario.trim(),
      contrasena: contrasena.trim(),
      rol: nuevoUsuario.rol || "Empleada"
    });

    return {
      ok: true,
      data: nuevoUsuario
    };
  } catch (error) {
    console.error("Error en crearUsuario:", error.message);
    throw new Error("Error al crear el usuario");
  }
}

// Servicio: cambiar contraseña
export async function cambiarContrasena(usuario, anterior, nueva) {
  try {
    if (!usuario || !anterior || !nueva) {
      return { ok: false, message: "Datos incompletos" };
    }

    const res = actualizarContrasena(usuario, anterior, nueva);
    if (!res.ok) {
      return { ok: false, message: res.message };
    }

    return { ok: true };
  } catch (error) {
    console.error("Error en cambiarContrasena:", error.message);
    throw new Error("Error al cambiar la contraseña");
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
