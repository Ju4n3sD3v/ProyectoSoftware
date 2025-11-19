// src/servicios/verificarPedido.service.js

import { getAllProductosBodegaMock } from "../data/productos.mock.js";

/**
 * Verifica un pedido contra el inventario de bodega.
 * @param {object} pedidoProductos - Objeto con cantidades pedidas: { "Aceite 20L": 2, ... }
 * @returns {object} Resultado con resumen, detalle y faltantes.
 */
export async function verificarPedidoConBodega(pedidoProductos) {
  try {
    // Obtener todos los productos de bodega (filtramos por lugar === "Bodega")
    const productos = await getAllProductosBodegaMock();
    const productosBodega = productos.filter(p => p.lugar === "Bodega");

    const detalle = Object.entries(pedidoProductos).map(
      ([nombre, cantidadPedida]) => {
        const pedida = Number(cantidadPedida) || 0;

        const productoBodega = productosBodega.find(p => p.nombre === nombre);
        const stockBodega = productoBodega ? productoBodega.stock : 0;

        const faltante = Math.max(pedida - stockBodega, 0);

        return {
          nombre,
          cantidadPedida: pedida,
          stockBodega,
          faltante,
          estado: faltante > 0 ? "FALTANTE" : "OK",
        };
      }
    );

    const faltantes = detalle.filter((item) => item.faltante > 0);

    return {
      ok: true,
      data: {
        resumen: {
          totalProductos: detalle.length,
          productosConProblema: faltantes.length,
        },
        detalle,
        faltantes,
      },
    };
  } catch (error) {
    console.log("Error verificando pedido:", error);

    return {
      ok: false,
      error: "Error en el servicio de verificación de pedidos.",
    };
  }
}
