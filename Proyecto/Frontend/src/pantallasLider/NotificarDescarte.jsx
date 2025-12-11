import { useEffect, useMemo, useState } from "react";

const locales = ["Local 1", "Local 2"];

const formatearFechaInput = (fecha = new Date()) => {
  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, "0");
  const dd = String(fecha.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function NotificarDescarte({ volverLoginLider }) {
  const [localSeleccionado, setLocalSeleccionado] = useState(locales[0]);
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [usuario, setUsuario] = useState("Líder local");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [fechaFiltro, setFechaFiltro] = useState(formatearFechaInput());
  const [motivoFiltro, setMotivoFiltro] = useState("");
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [activeTab, setActiveTab] = useState("registrar");

  const productoSeleccionado = useMemo(
    () => productos.find((p) => String(p.id) === String(productoId)),
    [productoId, productos]
  );

  const productosFiltrados = useMemo(() => {
    if (!busqueda) return productos;
    return productos.filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, productos]);

  const historialFiltrado = useMemo(() => {
    if (!motivoFiltro) return historial;
    return historial.filter((h) =>
      h.motivo.toLowerCase().includes(motivoFiltro.toLowerCase())
    );
  }, [historial, motivoFiltro]);

  const resumenHistorial = useMemo(() => {
    const totalRegistros = historialFiltrado.length;
    const unidadesDescartadas = historialFiltrado.reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    const productosAfectados = new Set(historialFiltrado.map((i) => i.nombreProducto)).size;
    return { totalRegistros, unidadesDescartadas, productosAfectados };
  }, [historialFiltrado]);

  useEffect(() => {
    cargarProductos(localSeleccionado);
    cargarHistorial(localSeleccionado);
  }, [localSeleccionado, fechaFiltro]);

  const cargarProductos = async (local) => {
    try {
      setCargando(true);
      const resp = await fetch(
        `http://localhost:4000/productos/local/${encodeURIComponent(local)}`
      );
      const data = await resp.json();
      setProductos(data?.data || []);
      if (data?.data?.length) {
        setProductoId(String(data.data[0].id));
      }
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los productos del local.");
    } finally {
      setCargando(false);
    }
  };

  const cargarHistorial = async (local) => {
    try {
      setCargandoHistorial(true);
      const params = new URLSearchParams({
        fecha: fechaFiltro,
        lugar: local,
      });
      const resp = await fetch(
        `http://localhost:4000/api/descartes?${params.toString()}`
      );
      const data = await resp.json();
      setHistorial(data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!productoId || !cantidad || Number(cantidad) <= 0) {
      setError("Selecciona un producto y una cantidad mayor a 0.");
      return;
    }

    try {
      setCargando(true);
      const resp = await fetch("http://localhost:4000/api/descartes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId,
          nombreProducto: productoSeleccionado?.nombre,
          lugar: localSeleccionado,
          cantidad: Number(cantidad),
          motivo,
          usuario,
        }),
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.error || "No se pudo registrar el descarte.");
        return;
      }

      setMensaje("Descarte enviado al jefe y descontado del inventario.");
      setCantidad("");
      setMotivo("");
      cargarHistorial(localSeleccionado);
      cargarProductos(localSeleccionado);
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <div className="tabs-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === "registrar" ? "active" : ""}`}
          onClick={() => setActiveTab("registrar")}
        >
          🗑️ Registrar Descarte
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "historial" ? "active" : ""}`}
          onClick={() => setActiveTab("historial")}
        >
          📦 Historial de Descartes
        </button>
        <div className="tab-spacer" />
        <button className="btn ghost" type="button" onClick={volverLoginLider}>
          Volver
        </button>
      </div>

      {activeTab === "registrar" && (
        <div className="form-card">
          <div className="form-card__head">
            <div className="form-card__icon">🗑️</div>
            <div>
              <h2>Registrar Descarte de Producto</h2>
              <p className="muted">El inventario se descuenta y se notifica al jefe.</p>
            </div>
          </div>

          <div className="form-card__divider" />

          <div className="card-inline" style={{ display: "grid", gap: 10 }}>
            <label className="field" style={{ margin: 0 }}>
              <span>Local</span>
              <select
                value={localSeleccionado}
                onChange={(e) => setLocalSeleccionado(e.target.value)}
              >
                {locales.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {mensaje && <p className="alert">{mensaje}</p>}
          {error && <p className="alert error">{error}</p>}

          <form onSubmit={onSubmit} className="form-vertical">
            <label className="field">
              <span>Producto *</span>
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                disabled={cargando}
              >
                <option value="">Seleccione un producto</option>
                {productosFiltrados.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — Stock: {p.stock}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Cantidad a descartar *</span>
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder="Ingrese la cantidad"
              />
            </label>

            <label className="field">
              <span>Motivo del descarte *</span>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Seleccione o escribe el motivo"
              />
            </label>

            <label className="field">
              <span>Registrado por *</span>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nombre del responsable"
              />
            </label>

            <div className="actions" style={{ justifyContent: "flex-end" }}>
              <button className="btn" type="submit" disabled={cargando}>
                🗑️ Registrar Descarte
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "historial" && (
        <div className="form-card">
          <div className="form-card__head">
            <div className="form-card__icon">🗂️</div>
            <div>
              <h2>Historial de Descartes</h2>
              <p className="muted">Consulta registros por fecha y motivo.</p>
            </div>
          </div>
          <div className="form-card__divider" />

          <div className="stat-grid">
            <div className="stat-card soft">
              <p className="muted">Total Registros</p>
              <h2>{resumenHistorial.totalRegistros}</h2>
            </div>
            <div className="stat-card soft">
              <p className="muted">Unidades descartadas</p>
              <h2>{resumenHistorial.unidadesDescartadas}</h2>
            </div>
            <div className="stat-card soft">
              <p className="muted">Productos afectados</p>
              <h2>{resumenHistorial.productosAfectados}</h2>
            </div>
          </div>

          <div className="filters-box">
            <div className="field">
              <label>Fecha</label>
              <input
                type="date"
                value={fechaFiltro}
                onChange={(e) => setFechaFiltro(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Motivo</label>
              <input
                type="text"
                value={motivoFiltro}
                onChange={(e) => setMotivoFiltro(e.target.value)}
                placeholder="Buscar por motivo..."
              />
            </div>
          </div>

          {historialFiltrado.length === 0 ? (
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
                  {historialFiltrado.map((d) => (
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
      )}
    </div>
  );
}
