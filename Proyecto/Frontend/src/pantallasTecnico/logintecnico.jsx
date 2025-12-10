export default function LoginTecnico({ volverAlInicio, verEstadoMaquinas}) {
  return (
    <>
      <div>
        <h1>¿Qué desea hacer?</h1>
        <br />

        <button type="button" onClick={verEstadoMaquinas}>
          Ver estado de máquinas
        </button>

        <br /><br />

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
