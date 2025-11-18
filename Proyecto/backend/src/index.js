import express from "express";
import cors from "cors";
import productosRoutes from "./routes/productos.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import { PORT } from "./config.js";

const app = express();

// Para permitir peticiones desde el frontend (Vite)
app.use(cors());

// Para poder leer JSON del body (por si luego haces POST/PUT)
app.use(express.json());

// Registrar las rutas de productos
app.use(productosRoutes);

// Registrar las rutas de movimientos
app.use(movimientosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
