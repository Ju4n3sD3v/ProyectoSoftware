import { getAllProductosBodegaMock, 
  getProductosBodegaSinActualizar72Mock,
  actualizarStockProductoMock,
  getProductosPorLocal
} from "../data/productos.mock.js";

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
// Servicio: actualizar stock de un producto en bodega
export async function actualizarStockProducto(id, nuevoStock) {
  try {
    const productoActualizado = await actualizarStockProductoMock(id, nuevoStock);

    return {
      ok: true,
      data: productoActualizado
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}

// Servicio: listar productos por local (Local 1, Local 2, Bodega)
export async function listarProductosPorLocal(local) {
  try {
    const filtrados = getProductosPorLocal(local);

    if (!filtrados) {
      throw new Error("No se pudo obtener la lista de productos");
    }

    return {
      ok: true,
      data: filtrados,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}