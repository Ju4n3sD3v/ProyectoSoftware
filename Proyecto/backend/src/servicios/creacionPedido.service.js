import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listarProductosPorLocal, actualizarStockProducto } from "./productos.service.js";

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
    const timestamp = Date.now();
    const nombreArchivo = `pedido_${timestamp}.json`;
    const rutaArchivo = path.join(PEDIDOS_DIR, nombreArchivo);

    // Separar local y productos
    // El pedido puede venir como: { local: "Local 1", productos: { "Bolsas de pollo": 2, ... } }
    const local = pedido.local || null;
    const productos = pedido.productos || pedido; // Si no hay "productos", todo es productos

    // Crear objeto completo
    const pedidoCompleto = {
      id: timestamp,
      fecha: new Date().toISOString(),
      revisado: false,
      local,
      productos,
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
 * Obtener pedidos por local (y opcionalmente solo los pendientes de revisar)
 */
export const obtenerPedidosPorLocal = (
  local,
  { soloPendientes = false } = {}
) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const pedidos = archivos.map((archivo) => {
      const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
      const contenido = fs.readFileSync(rutaArchivo, "utf-8");
      return JSON.parse(contenido);
    });

    const filtrados = pedidos.filter((p) => {
      if (local && p.local !== local) return false;
      if (soloPendientes && p.revisado) return false;
      return true;
    });

    return {
      success: true,
      cantidad: filtrados.length,
      pedidos: filtrados,
    };
  } catch (error) {
    console.error("Error al obtener pedidos por local:", error);
    return {
      success: false,
      mensaje: "Error al obtener los pedidos por local",
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

    // SI HAY cantidades revisadas, usamos SOLO esas.
    // Si no, usamos las originales.
    const productosParaExportar =
      pedido.productosRecibidos &&
      Object.keys(pedido.productosRecibidos).length > 0
        ? pedido.productosRecibidos
        : (pedido.productos || {});

    const lineas = [];
    lineas.push("ID Pedido;Fecha;Producto;Cantidad");

    // Para no descontar dos veces si vuelven a exportar
    const inventarioYaActualizado =
      pedido.inventarioActualizadoEnBodega === true;

    for (const [nombre, valor] of Object.entries(productosParaExportar)) {
      const cantidad = Number(valor) || 0;

      // 👉 Lo que se ve en el Excel
      lineas.push(`${pedido.id};${fecha};${nombre};${cantidad}`);

      // 👉 Actualizar inventario de Bodega SOLO la primera vez
      if (!inventarioYaActualizado && cantidad > 0) {
        try {
          // Restamos de Bodega lo que salió en el pedido
          registrarSalidaProductoMock(nombre, "Bodega", cantidad)
            .catch((err) => {
              console.error(
                `Error al actualizar inventario de "${nombre}" en Bodega:`,
                err.message
              );
            });
        } catch (error) {
          console.error(
            `Error al llamar registrarSalidaProductoMock para "${nombre}":`,
            error.message
          );
        }
      }
    }

    // Marcamos que ya se aplicó este pedido al inventario
    if (!inventarioYaActualizado) {
      pedido.inventarioActualizadoEnBodega = true;
      pedido.fechaActualizacionInventario = new Date().toISOString();
      fs.writeFileSync(rutaArchivo, JSON.stringify(pedido, null, 2));
    }

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


/**
 * 👉 Registrar la REVISION de un pedido
 * - Recibe las cantidades RECIBIDAS por el líder
 * - Calcula faltantes por producto
 * - Marca el pedido como revisado
 */
export const revisarPedido = async (id, productosRecibidos) => {
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

    const faltantes = {};

    // Calcular faltantes comparando solicitadas con recibidas
    Object.entries(pedido.productos || {}).forEach(
      ([nombre, cantidadSolicitada]) => {
        const recibidaBruta = productosRecibidos?.[nombre];
        const cantidadRecibida =
          recibidaBruta !== undefined ? Number(recibidaBruta) : 0;

        const faltante = Math.max(
          0,
          Number(cantidadSolicitada) - cantidadRecibida
        );

        if (faltante > 0) {
          faltantes[nombre] = {
            solicitada: Number(cantidadSolicitada),
            recibida: cantidadRecibida,
            faltante,
            origen: "pedido",
          };
        }
      }
    );

    // Intentar actualizar inventario del local: sumar las cantidades recibidas
    try {
      if (pedido.local) {
        const listaLocalRes = await listarProductosPorLocal(pedido.local);
        if (listaLocalRes && listaLocalRes.ok) {
          const productosLocal = listaLocalRes.data || [];

          // Para cada producto recibido > 0, buscar el producto en el local y sumarle la cantidad recibida
          for (const [nombre, recibidaBruta] of Object.entries(
            productosRecibidos
          )) {
            const cantidadRecibida = recibidaBruta !== undefined ? Number(recibidaBruta) : 0;
            if (cantidadRecibida <= 0) continue;

            const prodLocal = productosLocal.find((p) => p.nombre === nombre);
            if (prodLocal) {
              const nuevoStockLocal = Number(prodLocal.stock || 0) + cantidadRecibida;
              try {
                await actualizarStockProducto(prodLocal.id, nuevoStockLocal);
                console.log(`Stock actualizado para '${nombre}' en ${pedido.local}: +${cantidadRecibida}`);
              } catch (err) {
                console.warn(`No se pudo actualizar stock local para '${nombre}':`, err.message || err);
              }
            } else {
              console.warn(`Producto '${nombre}' no encontrado en inventario del local '${pedido.local}'`);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error actualizando inventario del local:", err);
    }

    // Guardar cambios en el pedido
    pedido.revisado = true;
    pedido.fechaRevision = new Date().toISOString();
    // Guardamos explícitamente lo que el jefe puso:
    pedido.productosRecibidos = productosRevisados;
    // Y también actualizamos productos para que el resto del sistema los vea igual:
    pedido.productos = productosRevisados;
    pedido.faltantes = faltantes;

    fs.writeFileSync(rutaArchivo, JSON.stringify(pedido, null, 2));

    return {
      success: true,
      mensaje: "Pedido revisado correctamente",
      pedido,
      faltantes,
    };
  } catch (error) {
    console.error("Error al revisar pedido:", error);
    return {
      success: false,
      mensaje: "Error al revisar el pedido",
      error: error.message,
    };
  }
};

/**
 * 👉 NUEVO: obtener todos los faltantes de un local para el JEFE
 */
export const obtenerFaltantesPorLocal = (local) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const pedidos = archivos.map((archivo) => {
      const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
      const contenido = fs.readFileSync(rutaArchivo, "utf-8");
      return JSON.parse(contenido);
    });

    const faltantesPorLocal = pedidos
      .filter(
        (p) =>
          (!local || p.local === local) &&
          p.revisado === true &&
          p.faltantes &&
          Object.keys(p.faltantes).length > 0
      )
      .map((p) => ({
        pedidoId: p.id,
        fecha: p.fecha,
        local: p.local,
        faltantes: p.faltantes,
      }));

    return {
      success: true,
      cantidad: faltantesPorLocal.length,
      faltantes: faltantesPorLocal,
    };
  } catch (error) {
    console.error("Error al obtener faltantes por local:", error);
    return {
      success: false,
      mensaje: "Error al obtener los faltantes por local",
      error: error.message,
    };
  }
};

/**
 * Registrar envío de un producto para un pedido: actualiza el pedido (quita/reduce faltante)
 * y añade un registro en `envios` dentro del mismo pedido.
 */
export const registrarEnvio = (pedidoId, productoNombre, cantidad) => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivoEncontrado = archivos.find((a) => a.includes(`pedido_${pedidoId}`) || a.includes(`_${pedidoId}.json`) || false);

    if (!archivoEncontrado) {
      return { success: false, mensaje: "Pedido no encontrado" };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivoEncontrado);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    if (!pedido.faltantes || !pedido.faltantes[productoNombre]) {
      return { success: false, mensaje: "Producto no está listado como faltante en este pedido" };
    }

    const requerido = Number(cantidad || 0);
    const actualFaltante = Number(pedido.faltantes[productoNombre].faltante || pedido.faltantes[productoNombre].solicitada || 0);

    // Si se envia una cantidad parcial, reducir el faltante. Si se envia completa, eliminar la entrada.
    if (requerido < actualFaltante) {
      pedido.faltantes[productoNombre].faltante = actualFaltante - requerido;
    } else {
      delete pedido.faltantes[productoNombre];
    }

    // Añadir registro de envío dentro del pedido
    pedido.envios = pedido.envios || [];
    pedido.envios.push({
      producto: productoNombre,
      cantidad: requerido,
      fecha: new Date().toISOString(),
    });

    // Guardar cambios
    fs.writeFileSync(rutaArchivo, JSON.stringify(pedido, null, 2));

    return { success: true, mensaje: "Envío registrado", pedido };
  } catch (error) {
    console.error("Error registrarEnvio:", error);
    return { success: false, mensaje: "Error registrando envío", error: error.message };
  }
};

/**
 * Obtener todos los envíos registrados en los pedidos
 */
export const obtenerEnvios = () => {
  try {
    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const envios = [];

    archivos.forEach((archivo) => {
      const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
      const contenido = fs.readFileSync(rutaArchivo, "utf-8");
      const pedido = JSON.parse(contenido);

      if (pedido.envios && Array.isArray(pedido.envios) && pedido.envios.length > 0) {
        pedido.envios.forEach((e) => {
          envios.push({
            pedidoId: pedido.id,
            local: pedido.local,
            fechaPedido: pedido.fecha,
            producto: e.producto,
            cantidad: e.cantidad,
            fechaEnvio: e.fecha,
          });
        });
      }
    });

    return { success: true, cantidad: envios.length, envios };
  } catch (error) {
    console.error("Error obtenerEnvios:", error);
    return { success: false, mensaje: "Error al obtener envíos", error: error.message };
  }
};

/**
 * Crear un reporte de faltantes enviado por empleado/líder
 * El reporte se guarda en la carpeta de pedidos para que el jefe lo vea
 */
export const crearReporteFaltantes = (local, faltantes) => {
  try {
    const timestamp = Date.now();
    const nombreArchivo = `reporte_faltantes_${timestamp}.json`;
    const rutaArchivo = path.join(PEDIDOS_DIR, nombreArchivo);

    const reporte = {
      id: timestamp,
      fecha: new Date().toISOString(),
      revisado: true,
      local,
      faltantes,
      origen: "reporte",
    };

    fs.writeFileSync(rutaArchivo, JSON.stringify(reporte, null, 2));

    return { success: true, mensaje: "Reporte creado", reporte };
  } catch (error) {
    console.error("Error crearReporteFaltantes:", error);
    return { success: false, mensaje: "Error creando reporte", error: error.message };
  }
};
