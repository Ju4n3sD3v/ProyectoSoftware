import { useMemo, useState } from "react";

function InventarioPorLocal({ volver }) {
  const [local, setLocal] = useState("");
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [seleccionados, setSeleccionados] = useState({});
  const [previewReporte, setPreviewReporte] = useState(false);
  const [cantidadesReporte, setCantidadesReporte] = useState({});
  const [editando, setEditando] = useState({});

  const stats = useMemo(() => {
    const totalProductos = productos.length;
    const totalUnidades = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    const stockBajo = productos.filter((p) => Number(p.stock) <= 15).length;
    return { totalProductos, totalUnidades, stockBajo };
  }, [productos]);

  const cargar = async () => {
    if (!local) {
      alert("Selecciona un local");
      return;
    }

    setCargando(true);
    setError(null);
    setProductos([]);
    setSeleccionados({});

    try {
      const res = await fetch(`http://localhost:4000/productos/local/${encodeURIComponent(local)}`);
      const data = await res.json();

      if (data.ok) {
        setProductos(data.data || []);
      } else {
        setError(data.error || "No se pudo cargar inventario");
      }
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setError("Error de conexión con backend");
    } finally {
      setCargando(false);
    }
  };

  const toggleSeleccion = (nombre) => {
    setSeleccionados((prev) => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  const iniciarReporte = () => {
    const seleccion = Object.entries(seleccionados).filter(([, v]) => v).map(([k]) => k);
    if (seleccion.length === 0) {
      alert("Selecciona al menos un producto para reportar");
      return;
    }
    const inicial = {};
    seleccion.forEach((nombre) => { inicial[nombre] = 1; });
    setCantidadesReporte(inicial);
    setPreviewReporte(true);
  };

  const enviarReporteFinal = async () => {
    const nombres = Object.keys(cantidadesReporte);
    if (nombres.length === 0) {
      alert("No hay productos en el reporte");
      return;
    }

    const faltantes = {};
    nombres.forEach((nombre) => {
      const qty = Number(cantidadesReporte[nombre] || 0);
      if (qty <= 0) return;
      faltantes[nombre] = {
        solicitada: qty,
        recibida: 0,
        faltante: qty,
        origen: "agotado",
      };
    });

    if (Object.keys(faltantes).length === 0) {
      alert("Ingresa cantidades válidas mayor a 0");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/reportes/faltantes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ local, faltantes, motivo: "Producto agotado" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert("Error enviando reporte: " + (data.mensaje || data.error || ""));
        return;
      }

      alert("Reporte enviado correctamente");
      setSeleccionados({});
      setCantidadesReporte({});
      setPreviewReporte(false);
    } catch (err) {
      console.error("Error enviando reporte:", err);
      alert("Error de conexión con el backend");
    }
  };

  const productosFiltrados = useMemo(() => (
    productos.filter((p) => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
  ), [productos, filtro]);

  return (
    <div className="inventory-page">
      <div className="tabs-bar">
        <div style={{ color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
          📦 Inventario por local
        </div>
        <div className="tab-spacer" />
        <button className="btn ghost" type="button" onClick={volver}>Volver</button>
      </div>

      <div className="form-card">
        <div className="form-card__head">
          <div className="form-card__icon">📍</div>
          <div>
            <h2>Selecciona el local</h2>
            <p className="muted">Carga los productos y ajusta stock, con reporte de agotados.</p>
          </div>
        </div>
        <div className="form-card__divider" />

        <div className="filters-box">
          <div className="field">
            <label>Local</label>
            <select value={local} onChange={(e) => setLocal(e.target.value)}>
              <option value="">-- elige local --</option>
              <option value="Local 1">Local 1</option>
              <option value="Local 2">Local 2</option>
            </select>
          </div>
          <div className="field">
            <label>Acciones</label>
            <button className="btn" type="button" onClick={cargar} disabled={cargando}>
              {cargando ? "Cargando..." : "Cargar inventario"}
            </button>
          </div>
        </div>

        {error && <p className="alert error">Error: {error}</p>}

        {productos.length > 0 && (
          <>
            <div className="stat-grid">
              <div className="stat-card soft">
                <p className="muted">Total productos</p>
                <h2>{stats.totalProductos}</h2>
              </div>
              <div className="stat-card soft">
                <p className="muted">Total unidades</p>
                <h2>{stats.totalUnidades}</h2>
              </div>
              <div className="stat-card soft warning">
                <p className="muted">Stock bajo</p>
                <h2>{stats.stockBajo}</h2>
              </div>
            </div>

            <div className="filters-box">
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Buscar producto</label>
                <input
                  type="text"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  placeholder="Nombre del producto..."
                />
              </div>
            </div>

            <div className="table-scroll">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Editar stock</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.map((p) => {
                    const editingValue = editando[p.id] !== undefined ? editando[p.id] : p.stock;
                    return (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td>{p.stock}</td>
                        <td>
                          <div className="input-inline">
                            <input
                              type="number"
                              min="0"
                              value={editingValue}
                              onChange={(e) => setEditando((prev) => ({ ...prev, [p.id]: e.target.value }))}
                            />
                            <button
                              className="btn secondary btn-small"
                              type="button"
                              onClick={async () => {
                                const nuevo = Number(editando[p.id] !== undefined ? editando[p.id] : p.stock);
                                try {
                                  const resp = await fetch(`http://localhost:4000/productos/${p.id}`, {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ stock: nuevo }),
                                  });
                                  const data = await resp.json();
                                  if (!resp.ok) {
                                    alert("Error actualizando stock: " + (data.error || data.mensaje || ""));
                                    return;
                                  }
                                  setProductos((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: nuevo } : x)));
                                  setEditando((prev) => { const c = { ...prev }; delete c[p.id]; return c; });
                                } catch (err) {
                                  console.error("Error actualizando stock:", err);
                                  alert("Error de conexión al actualizar stock");
                                }
                              }}
                            >
                              Guardar
                            </button>
                          </div>
                        </td>
                        <td>
                          {Number(p.stock) === 0 ? (
                            <button
                              className={`btn btn-small ${seleccionados[p.nombre] ? "" : "secondary"}`}
                              type="button"
                              onClick={() => toggleSeleccion(p.nombre)}
                            >
                              {seleccionados[p.nombre] ? "Marcado" : "Marcar para reporte"}
                            </button>
                          ) : (
                            <span className="muted">Disponible</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="actions" style={{ justifyContent: "space-between" }}>
              <div className="muted">Selecciona agotados (stock 0) para solicitar reposición.</div>
              {!previewReporte ? (
                <button className="btn" type="button" onClick={iniciarReporte}>
                  Crear reporte
                </button>
              ) : (
                <div className="actions" style={{ gap: 8 }}>
                  <button className="btn" type="button" onClick={enviarReporteFinal}>Enviar reporte al jefe</button>
                  <button className="btn ghost" type="button" onClick={() => { setPreviewReporte(false); setCantidadesReporte({}); }}>Cancelar</button>
                </div>
              )}
            </div>

            {previewReporte && (
              <div className="form-card" style={{ marginTop: 12 }}>
                <h3>Previsualizar reporte</h3>
                <div className="table-scroll">
                  <table className="data-table compact">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad solicitada</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(cantidadesReporte).map((nombre) => (
                        <tr key={nombre}>
                          <td>{nombre}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={cantidadesReporte[nombre]}
                              onChange={(e) => setCantidadesReporte((prev) => ({ ...prev, [nombre]: e.target.value }))}
                              style={{ width: "90px" }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InventarioPorLocal;
