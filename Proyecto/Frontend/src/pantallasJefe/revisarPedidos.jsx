import { useEffect, useState } from "react";

function RevisarPedidosJefe({ volverControlInventarioBodega, volverAlInicio }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [productosEditados, setProductosEditados] = useState({});
  const [filtro, setFiltro] = useState("pendientes"); // pendientes | revisados | archivados | todos
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      const resp = await fetch("http://localhost:4000/api/pedidos");
      const datos = await resp.json();

      if (datos.success) {
        setPedidos(datos.pedidos || []);
        setError(null);
      } else {
        setError(datos.mensaje || "No se pudieron cargar los pedidos");
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("Error de conexión con el backend");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const formatearFecha = (iso) => {
    if (!iso) return "";
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return iso;
    return fecha.toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const manejarSeleccionPedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setProductosEditados(pedido.productos || {});
  };

  const manejarCambioCantidad = (nombreProducto, nuevaCantidad) => {
    setProductosEditados((prev) => ({
      ...prev,
      [nombreProducto]: Number(nuevaCantidad),
    }));
  };

  const manejarGuardarYExportar = async () => {
    if (!pedidoSeleccionado) return;

    try {
      // 1. Actualizar pedido y marcar como revisado
      const resp = await fetch(
        `http://localhost:4000/api/pedidos/${pedidoSeleccionado.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productos: productosEditados }),
        }
      );

      const datos = await resp.json();

      if (!datos.success) {
        alert("Error al actualizar el pedido: " + (datos.mensaje || ""));
        return;
      }

      alert("✓ Pedido actualizado y marcado como revisado");

      // 2. Descargar Excel (CSV)
      const respExcel = await fetch(
        `http://localhost:4000/api/pedidos/${pedidoSeleccionado.id}/exportar`
      );

      if (!respExcel.ok) {
        alert(
          "El pedido se actualizó, pero hubo un problema al generar el Excel"
        );
      } else {
        const blob = await respExcel.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `pedido_${pedidoSeleccionado.id}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      // 3. Recargar lista de pedidos para ver el estado actualizado
      await cargarPedidos();

      // 4. Actualizar el pedido seleccionado en memoria con revisado = true
      setPedidoSeleccionado((prev) =>
        prev
          ? {
              ...prev,
              productos: productosEditados,
              revisado: true,
            }
          : prev
      );
    } catch (err) {
      console.error("Error al guardar y exportar pedido:", err);
      alert("Error de conexión con el servidor: " + err.message);
    }
  };

  const manejarArchivar = async (pedidoId, archivado = true) => {
    try {
      const resp = await fetch(`http://localhost:4000/api/pedidos/${pedidoId}/archivar`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archivado }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        alert(data.mensaje || "No se pudo archivar el pedido");
        return;
      }

      // refrescar lista
      await cargarPedidos();
      // si el que estaba seleccionado cambia de estado, limpiarlo
      if (pedidoSeleccionado && pedidoSeleccionado.id === pedidoId) {
        setPedidoSeleccionado(null);
        setProductosEditados({});
      }
    } catch (err) {
      console.error("Error al archivar pedido:", err);
      alert("Error al archivar el pedido");
    }
  };

  if (cargando) {
    return (
      <div className="page">
        <div className="card-surface">
          <h1>Cargando pedidos...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card-surface">
          <div className="page-header">
            <h1>Error al cargar pedidos</h1>
            <div className="actions">
              <button className="btn ghost" type="button" onClick={volverControlInventarioBodega}>
                Volver
              </button>
              <button className="btn ghost" type="button" onClick={volverAlInicio}>
                Cerrar sesión
              </button>
            </div>
          </div>
          <p className="alert error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="card-surface">
        <div className="page-header">
          <div>
            <h1>Revisar pedidos</h1>
            <p className="muted">Selecciona un pedido para actualizar cantidades y exportar a Excel.</p>
          </div>
          <div className="actions">
            <button className="btn ghost" type="button" onClick={volverControlInventarioBodega}>
              Volver
            </button>
            <button className="btn ghost" type="button" onClick={volverAlInicio}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="actions" style={{ marginBottom: "10px" }}>
          {["pendientes", "revisados", "archivados", "todos"].map((f) => (
            <button
              key={f}
              className={`btn ${filtro === f ? "" : "ghost"}`}
              type="button"
              onClick={() => {
                setPedidoSeleccionado(null);
                setProductosEditados({});
                setFiltro(f);
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="actions" style={{ marginBottom: "10px" }}>
          <label className="field" style={{ maxWidth: 220 }}>
            <span>Desde</span>
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </label>
          <label className="field" style={{ maxWidth: 220 }}>
            <span>Hasta</span>
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </label>
          <button
            className="btn ghost btn-small"
            type="button"
            onClick={() => {
              setFechaDesde("");
              setFechaHasta("");
            }}
          >
            Limpiar
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="panel">
            <div className="panel-head">
              <h3>Pedidos</h3>
            </div>
            <div className="table-scroll">
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.length === 0 && (
                    <tr>
                      <td colSpan="4">No hay pedidos registrados.</td>
                    </tr>
                  )}

                  {pedidos
                    .filter((p) => {
                      if (filtro === "todos") return true;
                      if (filtro === "pendientes") return !p.revisado && !p.archivado;
                      if (filtro === "revisados") return p.revisado && !p.archivado;
                      if (filtro === "archivados") return p.archivado;
                      return true;
                    })
                    .filter((p) => {
                      if (!fechaDesde && !fechaHasta) return true;
                      const f = p.fecha ? new Date(p.fecha) : null;
                      if (!f || Number.isNaN(f.getTime())) return true;
                      if (fechaDesde && f < new Date(fechaDesde)) return false;
                      if (fechaHasta) {
                        const limite = new Date(fechaHasta);
                        limite.setHours(23, 59, 59, 999);
                        if (f > limite) return false;
                      }
                      return true;
                    })
                    .map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{formatearFecha(p.fecha)}</td>
                        <td>{p.archivado ? "Archivado" : p.revisado ? "Revisado" : "Pendiente"}</td>
                        <td style={{ display: "flex", gap: "6px" }}>
                          {!p.archivado && (
                            <>
                              <button type="button" onClick={() => manejarSeleccionPedido(p)}>
                                Ver / Modificar
                              </button>
                              <button
                                type="button"
                                style={{ background: "#f0f0f0", color: "#333" }}
                                onClick={() => manejarArchivar(p.id, true)}
                                title="Archivar"
                              >
                                Archivar
                              </button>
                            </>
                          )}
                          {p.archivado && (
                            <>
                              <button type="button" onClick={() => manejarSeleccionPedido(p)}>
                                Ver
                              </button>
                              <button
                                type="button"
                                style={{ background: "#f0f0f0", color: "#333" }}
                                onClick={() => manejarArchivar(p.id, false)}
                                title="Desarchivar"
                              >
                                Desarchivar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {pedidoSeleccionado && (
            <div className="panel">
              <div className="panel-head">
                <div>
                  <h3>Pedido #{pedidoSeleccionado.id}</h3>
                  <p className="muted">
                    {formatearFecha(pedidoSeleccionado.fecha)} · {pedidoSeleccionado.revisado ? "Revisado" : "Pendiente"}
                  </p>
                </div>
                {!pedidoSeleccionado.archivado && (
                  <button className="btn secondary" type="button" onClick={manejarGuardarYExportar}>
                    Guardar y generar Excel
                  </button>
                )}
              </div>

              <div className="table-scroll">
                <table className="data-table compact">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(productosEditados).map(
                      ([nombreProducto, cantidad]) => (
                        <tr key={nombreProducto}>
                          <td>{nombreProducto}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={cantidad}
                              disabled={pedidoSeleccionado.archivado}
                              onChange={(e) =>
                                manejarCambioCantidad(
                                  nombreProducto,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RevisarPedidosJefe;
