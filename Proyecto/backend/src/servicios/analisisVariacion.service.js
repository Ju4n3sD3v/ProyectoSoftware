import { getAllProductosMock } from "../data/productos.mock.js";
import { getAllMovimientosMock } from "../data/movimientos.mock.js";


function mapLocalIdToNombre(localId) {
    if (localId === 1) return "Local 1";
    if (localId === 2) return "Local 2";
    if (localId === 3) return "Bodega";
    return `Local ${localId}`;
}

export async function obtenerStocksPorLocales(locales = []) {
    const productos = await getAllProductosMock();
    const nombres = Array.from(new Set(productos.map(p => p.nombre)));
    const resultado = nombres.map(nombre => {
    const fila = { producto: nombre };
    locales.forEach(id => {
        const lugar = mapLocalIdToNombre(Number(id));
        const prod = productos.find(p => p.nombre === nombre && p.lugar === lugar);
        fila[`stock_local_${id}`] = prod ? prod.stock : 0;
    });
    return fila;
    });

    return resultado;
}

export async function calcularConsumoPorLocales(locales = [], inicio, fin) {
    const movimientos = await getAllMovimientosMock();
    const inicioDate = inicio ? new Date(inicio) : null;
    const finDate = fin ? new Date(fin) : null;

    const productosDesdeMov = Array.from(new Set(movimientos.map(m => m.productoNombre)));

    const nombres = productosDesdeMov;

    const consumo = nombres.map(nombre => {
    const fila = { producto: nombre };
    locales.forEach(id => {
        const lugar = mapLocalIdToNombre(Number(id));
        const totalSalida = movimientos
        .filter(m => m.productoNombre === nombre && m.local === lugar)
        .filter(m => {
            if (!inicioDate && !finDate) return true;
            const f = new Date(m.fecha);
            if (inicioDate && f < inicioDate) return false;
            if (finDate && f > finDate) return false;
            return true;
        })
        .reduce((s, m) => s + (m.tipo === "salida" ? m.cantidad : 0), 0);

        fila[`consumo_local_${id}`] = totalSalida;
    });
    return fila;
    });

    return consumo;
}

export async function compararLocales(locales = [], inicio, fin, thresholdPct = 20) {

    const stocks = await obtenerStocksPorLocales(locales);

    const consumos = await calcularConsumoPorLocales(locales, inicio, fin);


    const mapCons = new Map();
    consumos.forEach(c => mapCons.set(c.producto, c));


    const comparacion = stocks.map(s => {
    const producto = s.producto;
    const cObj = mapCons.get(producto) || {};


    const fila = { producto };


    locales.forEach(id => {
        fila[`stock_local_${id}`] = s[`stock_local_${id}`] ?? 0;
        fila[`consumo_local_${id}`] = cObj[`consumo_local_${id}`] ?? 0;
    });

    if (locales.length >= 2) {
        const idA = locales[0];
        const idB = locales[1];
        const stockA = fila[`stock_local_${idA}`];
        const stockB = fila[`stock_local_${idB}`];

        const diff = stockA - stockB;
        fila.diferencia = diff;
        const avg = Math.max(1, Math.round((Math.abs(stockA) + Math.abs(stockB)) / 2));
        const pct = Math.round((Math.abs(diff) / avg) * 100);
        fila.diferenciaPct = pct;

      if (pct >= thresholdPct * 1.5) fila.estado = "rojo";
        else if (pct >= thresholdPct) fila.estado = "amarillo";
        else fila.estado = "verde";
    } else {
        fila.diferencia = 0;
        fila.diferenciaPct = 0;
        fila.estado = "verde";
    }

    return fila;
    });

    return comparacion;
}

export async function obtenerDesbalances(locales = [], inicio, fin, thresholdPct = 20) {
    const comp = await compararLocales(locales, inicio, fin, thresholdPct);
    return comp.filter(f => f.estado === "amarillo" || f.estado === "rojo");
}

export async function generarRedistribucion(locales = []) {
    if (locales.length < 2) return [];

    const comp = await compararLocales(locales, null, null, 0);

    const idA = locales[0];
    const idB = locales[1];

    const recomendaciones = comp
    .filter(f => Math.abs(f.diferencia) > 0)
    .map(f => {
        const diff = f.diferencia;
        if (diff === 0) return null;
        const mover = Math.ceil(Math.abs(diff) / 2);
        if (diff > 0) {
        return {
            producto: f.producto,
            desde: idA,
            hacia: idB,
            cantidad: mover,
            razon: `Local ${idA} tiene ${f[`stock_local_${idA}`]} vs Local ${idB} ${f[`stock_local_${idB}`]}`
        };
        } else {
        return {
            producto: f.producto,
            desde: idB,
            hacia: idA,
            cantidad: mover,
            razon: `Local ${idB} tiene ${f[`stock_local_${idB}`]} vs Local ${idA} ${f[`stock_local_${idA}`]}`
        };
        }
    })
    .filter(Boolean);

    return recomendaciones;
}
