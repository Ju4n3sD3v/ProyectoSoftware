import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Archivo donde se va a guardar el inventario de forma persistente
const RUTA_JSON_PRODUCTOS = path.join(__dirname, "productos.json");


// Array en memoria (simula una tabla de BD) BASE DE DATOS PRODUCTOS
let productos = [
  // 1) Bolsas de pollo
  { id: 1,  lugar: "Bodega",  nombre: "Bolsas de pollo", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 2,  lugar: "Local 1", nombre: "Bolsas de pollo", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 3,  lugar: "Local 2", nombre: "Bolsas de pollo", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 2) Bolsas de papas
  { id: 4,  lugar: "Bodega",  nombre: "Bolsas de papas", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 5,  lugar: "Local 1", nombre: "Bolsas de papas", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 6,  lugar: "Local 2", nombre: "Bolsas de papas", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 3) Bolsas de harina
  { id: 7,  lugar: "Bodega",  nombre: "Bolsas de harina", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 8,  lugar: "Local 1", nombre: "Bolsas de harina", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 9,  lugar: "Local 2", nombre: "Bolsas de harina", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 4) Aceite 20L
  { id: 10, lugar: "Bodega",  nombre: "Aceite 20L", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 11, lugar: "Local 1", nombre: "Aceite 20L", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 12, lugar: "Local 2", nombre: "Aceite 20L", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 5) Combo#1
  { id: 13, lugar: "Bodega",  nombre: "Combo#1", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 14, lugar: "Local 1", nombre: "Combo#1", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 15, lugar: "Local 2", nombre: "Combo#1", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 6) Combo#2
  { id: 16, lugar: "Bodega",  nombre: "Combo#2", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 17, lugar: "Local 1", nombre: "Combo#2", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 18, lugar: "Local 2", nombre: "Combo#2", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 7) Combo#3
  { id: 19, lugar: "Bodega",  nombre: "Combo#3", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 20, lugar: "Local 1", nombre: "Combo#3", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 21, lugar: "Local 2", nombre: "Combo#3", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 8) Combo#4
  { id: 22, lugar: "Bodega",  nombre: "Combo#4", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 23, lugar: "Local 1", nombre: "Combo#4", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 24, lugar: "Local 2", nombre: "Combo#4", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 9) Combo#5
  { id: 25, lugar: "Bodega",  nombre: "Combo#5", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 26, lugar: "Local 1", nombre: "Combo#5", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 27, lugar: "Local 2", nombre: "Combo#5", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 10) Tapas de combos
  { id: 28, lugar: "Bodega",  nombre: "Tapas de combos", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 29, lugar: "Local 1", nombre: "Tapas de combos", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 30, lugar: "Local 2", nombre: "Tapas de combos", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 11) Cajas de papas
  { id: 31, lugar: "Bodega",  nombre: "Cajas de papas", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 32, lugar: "Local 1", nombre: "Cajas de papas", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 33, lugar: "Local 2", nombre: "Cajas de papas", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 12) BBQ
  { id: 34, lugar: "Bodega",  nombre: "BBQ", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 35, lugar: "Local 1", nombre: "BBQ", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 36, lugar: "Local 2", nombre: "BBQ", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 13) Miel Mostaza
  { id: 37, lugar: "Bodega",  nombre: "Miel Mostaza", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 38, lugar: "Local 1", nombre: "Miel Mostaza", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 39, lugar: "Local 2", nombre: "Miel Mostaza", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 14) Picante Suave
  { id: 40, lugar: "Bodega",  nombre: "Picante Suave", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 41, lugar: "Local 1", nombre: "Picante Suave", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 42, lugar: "Local 2", nombre: "Picante Suave", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 15) Extra Picante
  { id: 43, lugar: "Bodega",  nombre: "Extra Picante", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 44, lugar: "Local 1", nombre: "Extra Picante", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 45, lugar: "Local 2", nombre: "Extra Picante", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 16) Rosada
  { id: 46, lugar: "Bodega",  nombre: "Rosada", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 47, lugar: "Local 1", nombre: "Rosada", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 48, lugar: "Local 2", nombre: "Rosada", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 17) Roja
  { id: 49, lugar: "Bodega",  nombre: "Roja", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 50, lugar: "Local 1", nombre: "Roja", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 51, lugar: "Local 2", nombre: "Roja", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 18) Piña
  { id: 52, lugar: "Bodega",  nombre: "Piña", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 53, lugar: "Local 1", nombre: "Piña", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 54, lugar: "Local 2", nombre: "Piña", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 19) Escoba
  { id: 55, lugar: "Bodega",  nombre: "Escoba", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 56, lugar: "Local 1", nombre: "Escoba", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 57, lugar: "Local 2", nombre: "Escoba", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 20) Trapera
  { id: 58, lugar: "Bodega",  nombre: "Trapera", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 59, lugar: "Local 1", nombre: "Trapera", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 60, lugar: "Local 2", nombre: "Trapera", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 21) Desengrasante
  { id: 61, lugar: "Bodega",  nombre: "Desengrasante", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 62, lugar: "Local 1", nombre: "Desengrasante", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 63, lugar: "Local 2", nombre: "Desengrasante", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 22) Limpido
  { id: 64, lugar: "Bodega",  nombre: "Limpido", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 65, lugar: "Local 1", nombre: "Limpido", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 66, lugar: "Local 2", nombre: "Limpido", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 23) Papel higiénico
  { id: 67, lugar: "Bodega",  nombre: "Papel higiénico", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 68, lugar: "Local 1", nombre: "Papel higiénico", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 69, lugar: "Local 2", nombre: "Papel higiénico", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 24) Limpiones
  { id: 70, lugar: "Bodega",  nombre: "Limpiones", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 71, lugar: "Local 1", nombre: "Limpiones", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 72, lugar: "Local 2", nombre: "Limpiones", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 25) Copas/Tapas
  { id: 73, lugar: "Bodega",  nombre: "Copas/Tapas", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 74, lugar: "Local 1", nombre: "Copas/Tapas", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 75, lugar: "Local 2", nombre: "Copas/Tapas", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 26) Antibacterial
  { id: 76, lugar: "Bodega",  nombre: "Antibacterial", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 77, lugar: "Local 1", nombre: "Antibacterial", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 78, lugar: "Local 2", nombre: "Antibacterial", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 27) Jabón de manos
  { id: 79, lugar: "Bodega",  nombre: "Jabón de manos", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 80, lugar: "Local 1", nombre: "Jabón de manos", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 81, lugar: "Local 2", nombre: "Jabón de manos", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 28) Vinagre
  { id: 82, lugar: "Bodega",  nombre: "Vinagre", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 83, lugar: "Local 1", nombre: "Vinagre", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 84, lugar: "Local 2", nombre: "Vinagre", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 29) Mata cucarachas
  { id: 85, lugar: "Bodega",  nombre: "Mata cucarachas", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 86, lugar: "Local 1", nombre: "Mata cucarachas", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 87, lugar: "Local 2", nombre: "Mata cucarachas", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" },

  // 30) Esponja
  { id: 88, lugar: "Bodega",  nombre: "Esponja", stock: 100, actualizadoEn: "2025-02-01 10:00:00" },
  { id: 89, lugar: "Local 1", nombre: "Esponja", stock: 50,  actualizadoEn: "2025-02-01 11:00:00" },
  { id: 90, lugar: "Local 2", nombre: "Esponja", stock: 25,  actualizadoEn: "2025-02-01 12:00:00" }
];

// ===================== PERSISTENCIA EN JSON =====================
// Si existe un archivo productos.json, cargamos desde ahí para no perder cambios
try {
  if (fs.existsSync(RUTA_JSON_PRODUCTOS)) {
    const contenido = fs.readFileSync(RUTA_JSON_PRODUCTOS, "utf-8");
    const data = JSON.parse(contenido);
    if (Array.isArray(data)) {
      productos = data;
    }
  } else {
    // Si no existe, lo creamos con los valores iniciales
    fs.writeFileSync(RUTA_JSON_PRODUCTOS, JSON.stringify(productos, null, 2));
  }
} catch (error) {
  console.error("Error al cargar productos desde JSON:", error.message);
}


/*FUNCION MOCK PARA ENCONTRAR TODOS LOS PRODUCTOS DE BODEGA */
export async function getAllProductosBodegaMock() {
  return productos.filter(p => p.lugar === "Bodega");
}
/*FUNCION MOCK PARA ENCONTRAR LOS QUE NO SE HAN ACTUALIZADO EN 72 HORAS */
export async function getProductosBodegaSinActualizar72Mock() {
  const ahora = new Date();
  const MS_72_HORAS = 72 * 60 * 60 * 1000;

  const sublista = productos.filter(p =>
    p.lugar === "Bodega" &&
    (ahora - new Date(p.actualizadoEn)) >= MS_72_HORAS
  );

  return sublista;   
}

//ME FALTA ACA PARA COMPROBAR LO DEL PEDIDO DE LAS EMPLEADAS

// Prueba
// ✅ Actualizar stock de un producto de bodega
export async function actualizarStockProductoMock(id, nuevoStock) {
  // Validación de stock
  if (nuevoStock < 0) {
    throw new Error("El stock no puede ser negativo.");
  }

  // Buscar producto por id en la Bodega
  const producto = productos.find(p => p.id === id && p.lugar === "Bodega");

  if (!producto) {
    throw new Error("Producto no encontrado en la bodega.");
  }

  // Actualizar stock
  producto.stock = nuevoStock;

  // Actualizar fecha de última actualización en formato YYYY-MM-DD HH:mm:ss
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");
  const hh = String(ahora.getHours()).padStart(2, "0");
  const mi = String(ahora.getMinutes()).padStart(2, "0");
  const ss = String(ahora.getSeconds()).padStart(2, "0");

  producto.actualizadoEn = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

  guardarProductosEnArchivo();

  // Devolvemos el producto ya actualizado
  return producto;
}

// Función para obtener el siguiente ID disponible
function obtenerSiguienteId() {
  if (productos.length === 0) return 1;
  return Math.max(...productos.map(p => p.id)) + 1;
}

// Función para formatear fecha actual
function obtenerFechaActual() {
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, "0");
  const dd = String(ahora.getDate()).padStart(2, "0");
  const hh = String(ahora.getHours()).padStart(2, "0");
  const mi = String(ahora.getMinutes()).padStart(2, "0");
  const ss = String(ahora.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

// Función para guardar el array productos en el archivo JSON
function guardarProductosEnArchivo() {
  try {
    fs.writeFileSync(RUTA_JSON_PRODUCTOS, JSON.stringify(productos, null, 2));
  } catch (error) {
    console.error("Error al guardar productos en JSON:", error.message);
  }
}


// Función para registrar una entrada de producto (aumentar stock)
export async function registrarEntradaProductoMock(productoNombre, local, cantidad) {
  // Validaciones
  if (!productoNombre || !local || !cantidad) {
    throw new Error("Faltan datos requeridos: productoNombre, local, cantidad");
  }

  if (cantidad <= 0) {
    throw new Error("La cantidad debe ser mayor a 0");
  }

  // Buscar si el producto ya existe en ese local
  const productoExistente = productos.find(
    p => p.nombre === productoNombre && p.lugar === local
  );

  if (productoExistente) {
    // Si existe, aumentar el stock
    productoExistente.stock += cantidad;
    productoExistente.actualizadoEn = obtenerFechaActual();
    guardarProductosEnArchivo(); 
    return productoExistente;
  } else {
    // Si no existe, crear un nuevo producto en ese local
    const nuevoProducto = {
      id: obtenerSiguienteId(),
      lugar: local,
      nombre: productoNombre,
      stock: cantidad,
      actualizadoEn: obtenerFechaActual()
    };
    productos.push(nuevoProducto);
    guardarProductosEnArchivo(); 
    return nuevoProducto;
  }
}

// Función para registrar una salida de producto (disminuir stock)
export async function registrarSalidaProductoMock(productoNombre, local, cantidad) {
  // Validaciones
  if (!productoNombre || !local || !cantidad) {
    throw new Error("Faltan datos requeridos: productoNombre, local, cantidad");
  }

  if (cantidad <= 0) {
    throw new Error("La cantidad debe ser mayor a 0");
  }

  // Buscar el producto en ese local
  const productoExistente = productos.find(
    p => p.nombre === productoNombre && p.lugar === local
  );

  if (!productoExistente) {
    throw new Error(`El producto "${productoNombre}" no existe en ${local}`);
  }

  // Validar que haya suficiente stock
  if (productoExistente.stock < cantidad) {
    throw new Error(
      `Stock insuficiente. Stock actual: ${productoExistente.stock}, cantidad solicitada: ${cantidad}`
    );
  }

  // Disminuir el stock
  productoExistente.stock -= cantidad;
  productoExistente.actualizadoEn = obtenerFechaActual();

  // Si el stock llega a 0, eliminar el producto
  if (productoExistente.stock === 0) {
    const indice = productos.indexOf(productoExistente);
    productos.splice(indice, 1);
    guardarProductosEnArchivo(); 
    return null; // Retornar null para indicar que se eliminó
  }
  guardarProductosEnArchivo(); 
  return productoExistente;
}

export default productos;

