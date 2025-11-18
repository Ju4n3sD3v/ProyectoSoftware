export default function LoginLider({ volverAlInicio, reporteEntradaSalida }) {
  return (
    <>
      <div>
        <h1>¿Qué desea hacer?</h1>
        <br />

        <button type="button" onClick={reporteEntradaSalida}>
          Reporte de Entrada/Salida
        </button>

        <br /><br />

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}

