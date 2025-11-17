import express from "express";
import productosRoutes from "./routes/productos.routes.js";
import { PORT } from "./config.js";

const app = express();

// Middleware para poder leer JSON del body
app.use(express.json());

// Registrar las rutas de productos
app.use(productosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
