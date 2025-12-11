import { useEffect, useState } from "react";

const formatearFechaInput = (fecha = new Date()) => {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const locales = ["Todos", "Local 1", "Local 2"];

export default function HistorialDescartes({ volver }) {
  const [fecha, setFecha] = useState(formatearFechaInput());
  const [lugar, setLugar] = useState("Todos");
  const [items, setItems] = useState([]);
  const [resumen, setResumen] = useState({ totalDescartesHoy: 0, totalDescartesSemana: 0, productosCriticos: [] });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [fecha, lugar]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");
      const params = new URLSearchParams();
      if (fecha) params.set("fecha", fecha);
      if (lugar && lugar !== "Todos") params.set("lugar", lugar);

      const [resHistorial, resResumen] = await Promise.all([
        fetch(`http://localhost:4000/api/descartes?${params.toString()}`),
        fetch("http://localhost:4000/api/descartes/resumen"),
      ]);

      const dataHistorial = await resHistorial.json();
      const dataResumen = await resResumen.json();

      setItems(dataHistorial?.data || []);
      setResumen(dataResumen?.data || { totalDescartesHoy: 0, totalDescartesSemana: 0, productosCriticos: [] });
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial de descartes.");
    } finally {
      setCargando(false);
    }
  };

  const descartesSemana = resumen.totalDescartesSemana ?? resumen.totalDescartesHoy ?? 0;

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Historial de descartes</h1>
          <p className="muted">
            Visualiza los descartes enviados por los líderes, con motivos, responsables y stock restante.
          </p>
        </div>
        <button className="btn ghost" type="button" onClick={volver}>
          Volver al panel
        </button>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="stat-grid">
        <div className="stat-card">
          <p className="muted">Descartes (últimos 7 días)</p>
          <h2>{descartesSemana}</h2>
        </div>
        <div className="stat-card warning">
          <p className="muted">Productos críticos</p>
          <h2>{resumen.productosCriticos?.length || 0}</h2>
        </div>
        <div className="stat-card">
          <p className="muted">Filtro activo</p>
          <h2>{lugar === "Todos" ? "Todos los locales" : lugar}</h2>
        </div>
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Filtros</h3>
          {cargando && <span className="chip">Actualizando...</span>}
        </div>
        <div className="grid-actions" style={{ marginBottom: 0 }}>
          <div className="field">
            <label>Fecha</label>
            <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="field">
            <label>Local</label>
            <select value={lugar} onChange={(e) => setLugar(e.target.value)}>
              {locales.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="dashboard-grid is-historial">
        <div className="panel">
          <div className="panel-head">
            <h3>Listado</h3>
          </div>
          {items.length === 0 ? (
            <p className="muted">No hay descartes para los filtros seleccionados.</p>
          ) : (
            <div className="table-scroll">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Local</th>
                    <th>Cantidad</th>
                    <th>Motivo</th>
                    <th>Registrado por</th>
                    <th>Stock restante</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((d) => (
                    <tr key={d.id}>
                      <td>{d.fecha}</td>
                      <td>{d.nombreProducto}</td>
                      <td>{d.lugar}</td>
                      <td>{d.cantidad}</td>
                      <td>{d.motivo}</td>
                      <td>{d.usuario}</td>
                      <td>
                        {d.stockRestante}
                        {d.requiereReposicion && (
                          <span className="chip warning">Reposición</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Reposición sugerida</h3>
          </div>
          {resumen.productosCriticos?.length === 0 ? (
            <p className="muted">No hay productos en umbral crítico.</p>
          ) : (
            <ul className="list-clean">
              {resumen.productosCriticos.map((p) => (
                <li key={`${p.id}-${p.lugar}`} className="card-inline">
                  <div className="label-row">
                    <strong>{p.nombre}</strong> <span className="chip warning">Crítico</span>
                  </div>
                  <p className="muted">
                    {p.lugar} — Stock {p.stock} (Última act. {p.actualizadoEn})
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
