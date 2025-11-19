import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta donde se guardarán los pedidos
const PEDIDOS_DIR = path.join(__dirname, "../data/pedidos");

// Crear carpeta de pedidos si no existe
if (!fs.existsSync(PEDIDOS_DIR)) {
  fs.mkdirSync(PEDIDOS_DIR, { recursive: true });
}

/**
 * Guardar un pedido en formato JSON
 * @param {Object} pedido - Objeto con los datos del pedido
 * @returns {Object} - Respuesta con éxito o error
 */
export const guardarPedido = (pedido) => {
  try {
    // Generar un ID único basado en timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const nombreArchivo = `pedido_${timestamp}.json`;
    const rutaArchivo = path.join(PEDIDOS_DIR, nombreArchivo);

    // Crear objeto con metadata
    const pedidoCompleto = {
    id: timestamp,
    fecha: new Date().toISOString(),
    revisado: false,              
    productos: pedido,
  };

    // Guardar el archivo
    fs.writeFileSync(rutaArchivo, JSON.stringify(pedidoCompleto, null, 2));

    // Mostrar en consola del servidor
    console.log("✓ Pedido guardado correctamente");
    console.log("ID:", timestamp);
    console.log("Archivo:", nombreArchivo);
    console.log("Contenido del JSON:");
    console.log(JSON.stringify(pedidoCompleto, null, 2));

    return {
      success: true,
      mensaje: "Pedido guardado correctamente",
      id: timestamp,
      archivo: nombreArchivo,
    };
  } catch (error) {
    console.error("Error al guardar pedido:", error);
    return {
      success: false,
      mensaje: "Error al guardar el pedido",
      error: error.message,
    };
  }
};

/**
 * Obtener todos los pedidos guardados
 * @returns {Array} - Array de pedidos
 */
export const obtenerPedidos = () => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const pedidos = archivos.map((archivo) => {
      const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
      const contenido = fs.readFileSync(rutaArchivo, "utf-8");
      return JSON.parse(contenido);
    });

    return {
      success: true,
      cantidad: pedidos.length,
      pedidos: pedidos,
    };
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    return {
      success: false,
      mensaje: "Error al obtener los pedidos",
      error: error.message,
    };
  }
};

/**
 * Obtener un pedido específico por ID
 * @param {String} id - ID del pedido
 * @returns {Object} - Datos del pedido
 */
export const obtenerPedidoPorId = (id) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado",
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    return {
      success: true,
      pedido: pedido,
    };
  } catch (error) {
    console.error("Error al obtener pedido:", error);
    return {
      success: false,
      mensaje: "Error al obtener el pedido",
      error: error.message,
    };
  }
};

/**
 * Eliminar un pedido por ID
 * @param {String} id - ID del pedido
 * @returns {Object} - Respuesta con éxito o error
 */
export const eliminarPedido = (id) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado",
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    fs.unlinkSync(rutaArchivo);

    return {
      success: true,
      mensaje: "Pedido eliminado correctamente",
    };
  } catch (error) {
    console.error("Error al eliminar pedido:", error);
    return {
      success: false,
      mensaje: "Error al eliminar el pedido",
      error: error.message,
    };
  }
};
  /**
 * Actualizar un pedido (cantidades) y marcarlo como revisado
 * @param {String} id - ID del pedido
 * @param {Object} nuevosProductos - Objeto { nombreProducto: cantidad }
 */
export const actualizarPedido = (id, nuevosProductos) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado",
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    // Actualizar productos y marcar como revisado
    pedido.productos = nuevosProductos;
    pedido.revisado = true;
    pedido.fechaRevision = new Date().toISOString();

    fs.writeFileSync(rutaArchivo, JSON.stringify(pedido, null, 2));

    return {
      success: true,
      mensaje: "Pedido actualizado y marcado como revisado",
      pedido,
    };
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    return {
      success: false,
      mensaje: "Error al actualizar el pedido",
      error: error.message,
    };
  }
};

/**
 * Generar contenido CSV (Excel) para un pedido
 * @param {String} id - ID del pedido
 */
export const exportarPedidoExcel = (id) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado",
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    const fecha = pedido.fecha || "";

    const lineas = [];
    // Cabecera
    lineas.push("ID Pedido;Fecha;Producto;Cantidad");

    // Filas
    Object.entries(pedido.productos || {}).forEach(([nombre, cantidad]) => {
      lineas.push(`${pedido.id};${fecha};${nombre};${cantidad}`);
    });

    const csv = lineas.join("\n");

    return {
      success: true,
      data: {
        nombreArchivo: `pedido_${pedido.id}.csv`,
        contenido: csv,
      },
    };
  } catch (error) {
    console.error("Error al exportar pedido a Excel:", error);
    return {
      success: false,
      mensaje: "Error al exportar el pedido",
      error: error.message,
    };
  }
  };

