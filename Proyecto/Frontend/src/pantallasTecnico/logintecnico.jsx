export default function LoginTecnico({ volverAlInicio, verEstadoMaquinas}) {
  return (
    <div className="role-shell">
      <div className="role-hero role-hero-tech">
        <div>
          <p className="chip">Panel técnico</p>
          <h1>¿Qué desea hacer?</h1>
          <p className="muted">Monitorea el estado de las máquinas y mantén todo operativo.</p>
        </div>
        <div className="role-insight role-insight-tech">
          <p className="muted">Estado general</p>
          <h3>Revisa alertas antes de comenzar la jornada.</h3>
          <div className="mini-bar"><div className="mini-bar__fill" /></div>
        </div>
      </div>

      <div className="role-grid">
        <div className="role-card">
          <div className="role-card__icon">🛠️</div>
          <div className="role-card__body">
            <h3>Ver estado de máquinas</h3>
            <p className="muted">Consulta estatus, fallos y mantenimientos.</p>
            <button className="btn" type="button" onClick={verEstadoMaquinas}>
              Abrir panel
            </button>
          </div>
        </div>

        <div className="role-card ghost">
          <div className="role-card__icon">↩️</div>
          <div className="role-card__body">
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
