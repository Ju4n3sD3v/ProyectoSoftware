export default function LoginJefe({
  volverAlInicio,
  controlInventarioBodega,
  mostrarAnalisisInventario,
  verFaltantesJefe,   // 👈 NUEVO
}) {
  return (
    <>
      <div>
        <h1>¿Qué desea hacer?</h1>
        <br />

        <button type="button" onClick={controlInventarioBodega}>
          Control de inventario en bodega
        </button>

        <br /><br />

        <button type="button" onClick={mostrarAnalisisInventario}>
          Análisis de inventario
        </button>

        <br /><br />

        {/* 👇 NUEVO: opción para ver los productos faltantes por local */}
        <button type="button" onClick={verFaltantesJefe}>
          Ver reporte de productos faltantes
        </button>

        <br /><br />

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
