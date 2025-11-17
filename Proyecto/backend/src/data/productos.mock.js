// Array en memoria (simula una tabla de BD) BASE DE DATOS PRODUCTOS
let productos = [
  { id: 1,  lugar: "Bodega", nombre: "Bolsas de alitas", stock: 120, actualizadoEn: "2025-02-01 10:30:12" },
  { id: 2,  lugar: "Bodega", nombre: "Bolsa de papas", stock: 90, actualizadoEn: "2025-02-02 14:12:55" },
  { id: 3,  lugar: "Bodega", nombre: "Gaseosas", stock: 150, actualizadoEn: "2025-02-03 09:45:20" },

  { id: 4,  lugar: "Local 1", nombre: "Servilletas", stock: 200, actualizadoEn: "2025-02-04 16:05:10" },
  { id: 5,  lugar: "Local 1", nombre: "Tarros", stock: 60, actualizadoEn: "2025-02-05 08:20:33" },
  { id: 6,  lugar: "Local 1", nombre: "Salsas", stock: 100, actualizadoEn: "2025-02-06 11:15:40" },

  { id: 7,  lugar: "Local 2", nombre: "Bolsas de alitas", stock: 80, actualizadoEn: "2025-02-06 17:22:18" },
  { id: 8,  lugar: "Local 2", nombre: "Bolsa de papas", stock: 70, actualizadoEn: "2025-02-07 13:40:05" },
  { id: 9,  lugar: "Local 2", nombre: "Gaseosas", stock: 50, actualizadoEn: "2025-02-08 15:55:48" },

  { id: 10, lugar: "Bodega", nombre: "Servilletas", stock: 300, actualizadoEn: "2025-02-08 19:10:02" },
  { id: 11, lugar: "Local 1", nombre: "Bolsas de alitas", stock: 40, actualizadoEn: "2025-02-09 10:00:11" },
  { id: 12, lugar: "Local 2", nombre: "Tarros", stock: 55, actualizadoEn: "2025-02-09 12:33:29" },

  { id: 13, lugar: "Bodega", nombre: "Tarros", stock: 100, actualizadoEn: "2025-02-10 09:27:44" },
  { id: 14, lugar: "Local 1", nombre: "Salsas", stock: 85, actualizadoEn: "2025-02-10 14:48:50" },
  { id: 15, lugar: "Local 2", nombre: "Servilletas", stock: 140, actualizadoEn: "2025-02-11 07:05:17" }
];


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

  return sublista;   // ← aquí TIENES la sublista
}

console.log(getAllProductosBodegaMock());
console.log(getProductosBodegaSinActualizar72Mock());
