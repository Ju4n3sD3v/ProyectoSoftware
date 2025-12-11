import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { ajustarStockPorDescartes, getAllProductosMock } from "./productos.mock.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RUTA_JSON_DESCARTES = path.join(__dirname, "descartes.json");

let descartes = [];

try {
  if (fs.existsSync(RUTA_JSON_DESCARTES)) {
    const contenido = fs.readFileSync(RUTA_JSON_DESCARTES, "utf-8");
    const data = JSON.parse(contenido);
    if (Array.isArray(data)) {
      descartes = data;
    }
  } else {
    fs.writeFileSync(RUTA_JSON_DESCARTES, JSON.stringify(descartes, null, 2));
  }
} catch (error) {
  console.error("Error al cargar descartes desde JSON:", error.message);
}

function persistirDescartes() {
  try {
    fs.writeFileSync(RUTA_JSON_DESCARTES, JSON.stringify(descartes, null, 2));
  } catch (error) {
    console.error("No se pudo persistir descartes.json:", error.message);
  }
}

function formatearFecha(fecha = new Date()) {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  const hh = String(fecha.getHours()).padStart(2, "0");
  const mi = String(fecha.getMinutes()).padStart(2, "0");
  const ss = String(fecha.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function esDeUltimosDias(fechaStr, dias = 7) {
  const fecha = new Date(fechaStr);
  const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
  return fecha.getTime() >= limite;
}

export function registrarDescarte({
  productoId,
  nombreProducto,
  lugar,
  cantidad,
  motivo,
  usuario,
}) {
  const productoActualizado = ajustarStockPorDescartes({
    productoId,
    lugar,
    cantidad,
  });

  const requiereReposicion = Number(productoActualizado.stock) <= 15;

  const registro = {
    id: descartes.length ? descartes[descartes.length - 1].id + 1 : 1,
    productoId: Number(productoId),
    nombreProducto: nombreProducto || productoActualizado.nombre,
    lugar,
    cantidad: Number(cantidad),
    motivo: motivo || "No especificado",
    usuario: usuario || "Líder",
    fecha: formatearFecha(),
    stockRestante: productoActualizado.stock,
    requiereReposicion,
  };

  descartes.push(registro);
  persistirDescartes();
  return registro;
}

export function listarDescartes({ fecha, lugar }) {
  let resultado = [...descartes];

  if (fecha) {
    const normalizada = fecha.slice(0, 10);
    resultado = resultado.filter((d) => d.fecha.startsWith(normalizada));
  }

  if (lugar) {
    resultado = resultado.filter(
      (d) => d.lugar.toLowerCase() === lugar.toLowerCase()
    );
  }

  return resultado.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

export function resumenReposicion() {
  const productos = getAllProductosMock();
  const criticos = productos
    .filter((p) => Number(p.stock) <= 10)
    .map((p) => ({
      id: p.id,
      nombre: p.nombre,
      lugar: p.lugar,
      stock: p.stock,
      actualizadoEn: p.actualizadoEn,
    }));

  const totalDescartesSemana = listarDescartes({}).filter((d) =>
    esDeUltimosDias(d.fecha, 7)
  ).length;

  return {
    totalDescartesHoy: listarDescartes({ fecha: new Date().toISOString() }).length,
    totalDescartesSemana,
    productosCriticos: criticos,
  };
}

export default descartes;
