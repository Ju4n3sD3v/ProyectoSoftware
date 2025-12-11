import {
  registrarDescarte,
  listarDescartes,
  resumenReposicion,
} from "../data/descartes.mock.js";

export async function crearDescarte(payload) {
  const { productoId, nombreProducto, lugar, cantidad, motivo, usuario } = payload;

  if (!productoId || !lugar || !cantidad) {
    throw new Error("productoId, lugar y cantidad son obligatorios.");
  }

  return registrarDescarte({
    productoId,
    nombreProducto,
    lugar,
    cantidad,
    motivo,
    usuario,
  });
}

export async function obtenerDescartes(filtros = {}) {
  return listarDescartes(filtros);
}

export async function obtenerResumenReposicion() {
  return resumenReposicion();
}
