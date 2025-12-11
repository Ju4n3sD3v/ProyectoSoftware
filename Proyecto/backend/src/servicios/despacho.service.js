import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta donde se guardan los pedidos
const PEDIDOS_DIR = path.join(__dirname, "../data/pedidos");

/**
 * Obtener todos los pedidos listos para despachar (revisados por el jefe)
 * @returns {Object} - Respuesta con lista de pedidos listos
 */
export const obtenerPedidosListos = () => {
  try {
    if (!fs.existsSync(PEDIDOS_DIR)) {
      return {
        success: true,
        pedidos: [],
        cantidad: 0,
        mensaje: "No hay pedidos listos para despachar"
      };
    }

    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const pedidos = archivos.map((archivo) => {
      const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
      const contenido = fs.readFileSync(rutaArchivo, "utf-8");
      return JSON.parse(contenido);
    });

    // Filtrar solo los pedidos revisados (listos para despachar)
    const pedidosListos = pedidos.filter((p) => p.revisado === true);

    return {
      success: true,
      pedidos: pedidosListos,
      cantidad: pedidosListos.length,
      mensaje: pedidosListos.length === 0 
        ? "No hay pedidos listos para despachar" 
        : undefined
    };
  } catch (error) {
    console.error("Error al obtener pedidos listos:", error);
    return {
      success: false,
      mensaje: "Error al obtener los pedidos listos",
      error: error.message,
      pedidos: []
    };
  }
};

/**
 * Iniciar despacho de un pedido
 * @param {String} id - ID del pedido
 * @param {String} observaciones - Observaciones del despachador (opcional)
 * @returns {Object} - Respuesta con éxito o error
 */
export const iniciarDespacho = (id, observaciones = "") => {
  try {
    if (!fs.existsSync(PEDIDOS_DIR)) {
      return {
        success: false,
        mensaje: "No se encontró el directorio de pedidos"
      };
    }

    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado"
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    // Verificar que el pedido esté revisado
    if (!pedido.revisado) {
      return {
        success: false,
        mensaje: "El pedido aún no ha sido revisado por el jefe de bodega"
      };
    }

    // Marcar como en despacho y agregar observaciones
    pedido.estadoDespacho = "en_despacho";
    pedido.fechaInicioDespacho = new Date().toISOString();
    if (observaciones) {
      pedido.observacionesDespachador = observaciones;
    }

    // Guardar cambios
    fs.writeFileSync(rutaArchivo, JSON.stringify(pedido, null, 2));

    return {
      success: true,
      mensaje: "Despacho iniciado correctamente",
      pedido: pedido
    };
  } catch (error) {
    console.error("Error al iniciar despacho:", error);
    return {
      success: false,
      mensaje: "Error al iniciar el despacho",
      error: error.message
    };
  }
};

/**
 * Obtener detalles completos de un pedido
 * @param {String} id - ID del pedido
 * @returns {Object} - Respuesta con detalles del pedido
 */
export const obtenerDetallePedido = (id) => {
  try {
    if (!fs.existsSync(PEDIDOS_DIR)) {
      return {
        success: false,
        mensaje: "No se encontró el directorio de pedidos"
      };
    }

    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      return {
        success: false,
        mensaje: "Pedido no encontrado"
      };
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    return {
      success: true,
      pedido: pedido
    };
  } catch (error) {
    console.error("Error al obtener detalle del pedido:", error);
    return {
      success: false,
      mensaje: "Error al obtener el detalle del pedido",
      error: error.message
    };
  }
};

/**
 * Generar comprobante de despacho en PDF
 * @param {String} id - ID del pedido
 * @returns {Promise<Object>} - Buffer del PDF y nombre del archivo
 */
export const generarComprobantePDF = async (id) => {
  try {
    if (!fs.existsSync(PEDIDOS_DIR)) {
      throw new Error("No se encontró el directorio de pedidos");
    }

    const archivos = fs.readdirSync(PEDIDOS_DIR);
    const archivo = archivos.find((arch) => arch.includes(id));

    if (!archivo) {
      throw new Error("Pedido no encontrado");
    }

    const rutaArchivo = path.join(PEDIDOS_DIR, archivo);
    const contenido = fs.readFileSync(rutaArchivo, "utf-8");
    const pedido = JSON.parse(contenido);

    // Generar PDF
    const pdfBuffer = await generarPDFBuffer(pedido);

    return {
      success: true,
      data: {
        contenido: pdfBuffer,
        nombreArchivo: `comprobante_despacho_${pedido.id}.pdf`,
        tipo: "application/pdf"
      }
    };
  } catch (error) {
    console.error("Error al generar comprobante PDF:", error);
    throw new Error(error.message || "Error al generar el comprobante PDF");
  }
};

/**
 * Función auxiliar para generar el buffer del PDF
 * @param {Object} pedido - Datos del pedido
 * @returns {Promise<Buffer>} - Buffer del PDF
 */
function generarPDFBuffer(pedido) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];

    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Título
    doc.fontSize(20).text("COMPROBANTE DE DESPACHO", { align: "center" });
    doc.moveDown();

    // Información general
    doc.fontSize(12);
    doc.text(`ID Pedido: ${pedido.id}`);
    doc.text(`Local Destino: ${pedido.local || "No especificado"}`);
    doc.text(`Fecha del Pedido: ${new Date(pedido.fecha).toLocaleString("es-CO")}`);
    
    if (pedido.fechaRevision) {
      doc.text(`Fecha de Revisión: ${new Date(pedido.fechaRevision).toLocaleString("es-CO")}`);
    }
    
    if (pedido.fechaInicioDespacho) {
      doc.text(`Fecha de Inicio de Despacho: ${new Date(pedido.fechaInicioDespacho).toLocaleString("es-CO")}`);
    }

    doc.moveDown();
    doc.fontSize(16).text("PRODUCTOS ENVIADOS", { underline: true });
    doc.moveDown();

    // Lista de productos
    if (pedido.productos && Object.keys(pedido.productos).length > 0) {
      doc.fontSize(12);
      let totalUnidades = 0;
      
      Object.entries(pedido.productos).forEach(([nombre, cantidad]) => {
        const cantidadNum = Number(cantidad) || 0;
        if (cantidadNum > 0) {
          doc.text(`• ${nombre}: ${cantidadNum} unidades`);
          totalUnidades += cantidadNum;
        }
      });

      doc.moveDown();
      doc.fontSize(14).text(`Total de productos: ${Object.keys(pedido.productos).filter(p => (Number(pedido.productos[p]) || 0) > 0).length}`, { bold: true });
      doc.text(`Total de unidades: ${totalUnidades}`, { bold: true });
    } else {
      doc.fontSize(12).text("No hay productos registrados");
    }

    // Observaciones del despachador
    if (pedido.observacionesDespachador) {
      doc.moveDown();
      doc.fontSize(14).text("OBSERVACIONES DEL DESPACHADOR", { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(pedido.observacionesDespachador);
    }

    // Fecha de generación
    doc.moveDown(2);
    doc.fontSize(10).fillColor("gray");
    doc.text(`Comprobante generado el: ${new Date().toLocaleString("es-CO")}`, { align: "right" });
    doc.fillColor("black");

    doc.end();
  });
}

