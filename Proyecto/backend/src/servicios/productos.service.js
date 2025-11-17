import { getAllProductosBodegaMock, getProductosBodegaSinActualizar72Mock } from "../data/productos.mock.js";

// Servicio: obtener productos de bodega
export async function listarProductosBodega() {
  try {
    const productos = await getAllProductosBodegaMock();

    // Validación 1: productos es null o undefined (casi nunca pasa, pero es correcto tenerla)
    if (!productos) {
      throw new Error("No se pudo obtener los productos de la bodega.");
    }

    // Validación 2: lista vacía
    if (productos.length === 0) {
      return {
        ok: true,
        message: "No hay productos en la bodega.",
        data: []
      };
    }

    // Caso normal
    return {
      ok: true,
      data: productos
    };

  } catch (error) {
    // Aquí atrapamos errores y los mandamos para que las rutas los manejen
    throw new Error(error.message);
  }
}


// Servicio: obtener productos de bodega que no se han actualizado en 72 horas
export async function listarProductosBodegaSinActualizar72() {
  try {
    const productos = await getProductosBodegaSinActualizar72Mock();

    if (!productos) {
      throw new Error("No se pudo obtener los productos desactualizados.");
    }

    if (productos.length === 0) {
      return {
        ok: true,
        message: "No hay productos desactualizados en la bodega.",
        data: []
      };
    }

    return {
      ok: true,
      data: productos
    };

  } catch (error) {
    throw new Error(error.message);
  }
}

