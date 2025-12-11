export default function LoginLider({ volverAlInicio, reporteEntradaSalida, verificarPedidoLider, verInventarioLocal, notificarDescarte }) {
  return (
    <div className="leader-shell">
      <div className="leader-hero">
        <div>
          <p className="chip">Panel líder</p>
          <h1>¿Qué desea hacer?</h1>
          <p className="muted">Gestiona reportes, verificaciones, descartes e inventario del local.</p>
        </div>
        <div className="leader-insight">
          <p className="muted">Consejo</p>
          <h3>Prioriza descartar y verificar antes de pedir reposición.</h3>
          <div className="mini-bar">
            <div className="mini-bar__fill" />
          </div>
        </div>
      </div>

      <div className="leader-grid">
        <div className="leader-card">
          <div className="leader-card__icon">📥</div>
          <div className="leader-card__body">
            <h3>Entradas y salidas</h3>
            <p className="muted">Registra movimientos recientes del local.</p>
            <button className="btn" type="button" onClick={reporteEntradaSalida}>
              Abrir reporte
            </button>
          </div>
        </div>

        <div className="leader-card">
          <div className="leader-card__icon">✅</div>
          <div className="leader-card__body">
            <h3>Verificar pedido</h3>
            <p className="muted">Confirma que cada entrega esté correcta.</p>
            <button className="btn secondary" type="button" onClick={verificarPedidoLider}>
              Verificar
            </button>
          </div>
        </div>

        {typeof notificarDescarte === 'function' && (
          <div className="leader-card">
            <div className="leader-card__icon">🗑️</div>
            <div className="leader-card__body">
              <h3>Notificar descarte</h3>
              <p className="muted">Reporta productos dañados o no aptos.</p>
              <button className="btn" type="button" onClick={notificarDescarte}>
                Notificar
              </button>
            </div>
          </div>
        )}

        {typeof verInventarioLocal === 'function' && (
          <div className="leader-card">
            <div className="leader-card__icon">📦</div>
            <div className="leader-card__body">
              <h3>Inventario por local</h3>
              <p className="muted">Visualiza stock y solicita reposición.</p>
              <button className="btn secondary" type="button" onClick={verInventarioLocal}>
                Abrir inventario
              </button>
            </div>
          </div>
        )}

        <div className="leader-card ghost">
          <div className="leader-card__icon">↩️</div>
          <div className="leader-card__body">
            <h3>Volver al inicio</h3>
            <p className="muted">Regresa a la selección de rol.</p>
            <button className="btn ghost" type="button" onClick={volverAlInicio}>
              Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
