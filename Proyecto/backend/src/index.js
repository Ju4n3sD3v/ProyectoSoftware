import express from "express";
import cors from "cors";

import productosRoutes from "./routes/productos.routes.js";
import movimientosRoutes from "./routes/movimientos.routes.js";
import creacionPedidoRoutes from "./routes/creacionPedido.routes.js";
import datosRoutes from "./routes/datos.routes.js";
import analisisLocalRoutes from "./routes/analisisLocal.routes.js";
import verificarPedidoRoutes from "./routes/verificarPedido.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import variacionRoutes from "./routes/analisisVariacion.routes.js";
import maquinasRoutes from "./routes/maquinas.routes.js";


import { PORT } from "./config.js";

const app = express();

// Habilitar CORS para permitir peticiones desde el frontend
app.use(cors());

// Permitir lectura de JSON en requests
app.use(express.json());

// Registrar rutas existentes
app.use(productosRoutes);
app.use(movimientosRoutes);
app.use(creacionPedidoRoutes);
app.use(datosRoutes);
app.use(analisisLocalRoutes);
app.use(verificarPedidoRoutes);
app.use(rolesRoutes);
app.use(usuariosRoutes);
app.use(authRoutes);
app.use(variacionRoutes);
app.use("/api/maquinas", maquinasRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor escuchando en el puerto ${PORT}`);
  console.log(`✓ Rutas de creación de pedidos disponibles en http://localhost:${PORT}/api/pedidos`);
  console.log(`✓ Rutas de análisis por local disponibles en http://localhost:${PORT}/api/analisis-local`);
  console.log(`✓ Ruta de verificación de pedidos: POST http://localhost:${PORT}/api/verificar-pedido`);
});
