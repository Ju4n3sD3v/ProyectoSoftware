import express from "express";
import cors from "cors";

import productosRoutes from "./routes/productos.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import creacionPedidoRoutes from "./routes/creacionPedido.routes.js";
import datosRoutes from "./routes/datos.routes.js";
import analisisLocalRoutes from "./routes/analisisLocal.routes.js"; // NUEVA RUTA HU06

import { PORT } from "./config.js";

const app = express();

// Habilitar CORS para permitir peticiones desde el frontend (Vite)
app.use(cors());

// Permitir lectura de JSON en body
app.use(express.json());

// Registrar las rutas
app.use(productosRoutes);
app.use(movimientosRoutes);
app.use(creacionPedidoRoutes);
app.use(datosRoutes);
app.use(analisisLocalRoutes); // HU06

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor escuchando en el puerto ${PORT}`);
  console.log(`✓ Rutas de creación de pedidos disponibles en http://localhost:${PORT}/api/pedidos`);
  console.log(`✓ Rutas de análisis por local disponibles en http://localhost:${PORT}/api/analisis-local`);
});
