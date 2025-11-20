export default function LoginLider({ volverAlInicio, reporteEntradaSalida, verificarPedidoLider, verInventarioLocal }) {
  return (
    <>
      <div>
        <h1>¿Qué desea hacer?</h1>
        <br />

        <button type="button" onClick={reporteEntradaSalida}>
          Reporte de Entrada/Salida
        </button>

        <br /><br />

        <button type="button" onClick={verificarPedidoLider}>
          Verificar pedido
        </button>

        <br /><br />

        {/* Botón para ver inventario por local (Líder) */}
        {typeof verInventarioLocal === 'function' && (
          <>
            <button type="button" onClick={verInventarioLocal}>
              Ver inventario por local
            </button>

            <br /><br />
          </>
        )}

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
