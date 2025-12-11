import { useEffect, useState } from "react";

export default function PedidosListos({ volverAlInicio, volverLoginDespachador }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [observaciones, setObservaciones] = useState("");
  const [mostrarFormularioInicio, setMostrarFormularioInicio] = useState(false);

  const cargarPedidosListos = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch("http://localhost:4000/api/despacho/pedidos-listos");
      const data = await respuesta.json();

      if (data.success) {
        setPedidos(data.pedidos || []);
        setMostrarLista(true);
      } else {
        setError(data.mensaje || "Error al cargar los pedidos listos");
      }
    } catch (err) {
      console.error("Error al cargar pedidos listos:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (iso) => {
    if (!iso) return "";
    const fecha = new Date(iso);
    if (Number.isNaN(fecha.getTime())) return iso;
    return fecha.toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const manejarIniciarDespacho = async (pedidoId) => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(
        `http://localhost:4000/api/despacho/${pedidoId}/iniciar`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            observaciones: observaciones || undefined,
          }),
        }
      );

      const data = await respuesta.json();

      if (data.success) {
        alert("✓ Despacho iniciado correctamente");
        setMostrarFormularioInicio(false);
        setPedidoSeleccionado(null);
        setObservaciones("");
        // Recargar lista
        await cargarPedidosListos();
      } else {
        setError(data.mensaje || "Error al iniciar el despacho");
      }
    } catch (err) {
      console.error("Error al iniciar despacho:", err);
      setError("Error de conexión con el servidor: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarVerDetalles = async (pedidoId) => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(
        `http://localhost:4000/api/despacho/${pedidoId}/detalle`
      );
      const data = await respuesta.json();

      if (data.success) {
        setPedidoSeleccionado(data.pedido);
      } else {
        setError(data.mensaje || "Error al obtener los detalles del pedido");
      }
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      setError("Error de conexión con el servidor: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarGenerarPDF = async (pedidoId) => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(
        `http://localhost:4000/api/despacho/${pedidoId}/comprobante-pdf`
      );

      if (!respuesta.ok) {
        throw new Error("Error al generar el PDF");
      }

      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `comprobante_despacho_${pedidoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error al generar PDF:", err);
      setError("Error al generar el PDF: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Pedidos Listos para Despachar</h1>
          <p className="muted">
            Visualiza y gestiona los pedidos que ya fueron revisados por el jefe de bodega.
          </p>
        </div>
        <button className="btn ghost" type="button" onClick={volverAlInicio}>
          Cerrar sesión
        </button>
      </div>

      {error && (
        <div className="alert error" style={{ marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {!mostrarLista && (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <button
            className="btn primary"
            type="button"
            onClick={cargarPedidosListos}
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Ver pedidos listos"}
          </button>
        </div>
      )}

      {mostrarLista && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <button
              className="btn secondary"
              type="button"
              onClick={cargarPedidosListos}
              disabled={cargando}
            >
              {cargando ? "Actualizando..." : "Actualizar lista"}
            </button>
          </div>

          {cargando && pedidos.length === 0 && (
            <p style={{ textAlign: "center", padding: "20px" }}>
              Cargando pedidos...
            </p>
          )}

          {!cargando && pedidos.length === 0 && (
            <div className="panel">
              <p className="muted" style={{ textAlign: "center", padding: "40px" }}>
                No hay pedidos listos para despachar en este momento.
              </p>
            </div>
          )}

          {pedidos.length > 0 && (
            <div className="panel">
              <h3>Pedidos Listos ({pedidos.length})</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Local</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.local || "No especificado"}</td>
                      <td>{formatearFecha(pedido.fecha)}</td>
                      <td>
                        {pedido.estadoDespacho === "en_despacho" ? (
                          <span className="chip" style={{ backgroundColor: "#ffa726" }}>
                            En despacho
                          </span>
                        ) : (
                          <span className="chip" style={{ backgroundColor: "#66bb6a" }}>
                            Listo
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {pedido.estadoDespacho !== "en_despacho" && (
                            <button
                              className="btn small primary"
                              type="button"
                              onClick={() => {
                                setPedidoSeleccionado(pedido);
                                setMostrarFormularioInicio(true);
                              }}
                              disabled={cargando}
                            >
                              Iniciar despacho
                            </button>
                          )}
                          <button
                            className="btn small secondary"
                            type="button"
                            onClick={() => manejarVerDetalles(pedido.id)}
                            disabled={cargando}
                          >
                            Ver detalles
                          </button>
                          <button
                            className="btn small"
                            type="button"
                            onClick={() => manejarGenerarPDF(pedido.id)}
                            disabled={cargando}
                          >
                            Generar PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formulario para iniciar despacho */}
          {mostrarFormularioInicio && pedidoSeleccionado && (
            <div className="panel" style={{ marginTop: "20px" }}>
              <h3>Iniciar Despacho - Pedido #{pedidoSeleccionado.id}</h3>
              <p className="muted">
                Local: {pedidoSeleccionado.local || "No especificado"}
              </p>

              <div style={{ marginTop: "20px" }}>
                <label className="field">
                  <span>Observaciones (opcional)</span>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Ej: Productos listos, vehículo asignado, etc."
                    rows="3"
                    style={{ width: "100%", maxWidth: "500px" }}
                    disabled={cargando}
                  />
                </label>
              </div>

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => manejarIniciarDespacho(pedidoSeleccionado.id)}
                  disabled={cargando}
                >
                  {cargando ? "Iniciando..." : "Confirmar inicio de despacho"}
                </button>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setMostrarFormularioInicio(false);
                    setPedidoSeleccionado(null);
                    setObservaciones("");
                  }}
                  disabled={cargando}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Vista de detalles del pedido */}
          {pedidoSeleccionado && !mostrarFormularioInicio && (
            <div className="panel" style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3>Detalles del Pedido #{pedidoSeleccionado.id}</h3>
                <button
                  className="btn ghost small"
                  type="button"
                  onClick={() => setPedidoSeleccionado(null)}
                >
                  Cerrar
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <p><strong>Local destino:</strong> {pedidoSeleccionado.local || "No especificado"}</p>
                <p><strong>Fecha del pedido:</strong> {formatearFecha(pedidoSeleccionado.fecha)}</p>
                {pedidoSeleccionado.fechaRevision && (
                  <p><strong>Fecha de revisión:</strong> {formatearFecha(pedidoSeleccionado.fechaRevision)}</p>
                )}
                {pedidoSeleccionado.fechaInicioDespacho && (
                  <p><strong>Fecha de inicio de despacho:</strong> {formatearFecha(pedidoSeleccionado.fechaInicioDespacho)}</p>
                )}
                {pedidoSeleccionado.observacionesDespachador && (
                  <p><strong>Observaciones del despachador:</strong> {pedidoSeleccionado.observacionesDespachador}</p>
                )}
              </div>

              <div>
                <h4>Productos</h4>
                {pedidoSeleccionado.productos && Object.keys(pedidoSeleccionado.productos).length > 0 ? (
                  <table className="data-table compact">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(pedidoSeleccionado.productos)
                        .filter(([_, cantidad]) => (Number(cantidad) || 0) > 0)
                        .map(([nombre, cantidad]) => (
                          <tr key={nombre}>
                            <td>{nombre}</td>
                            <td>{cantidad} unidades</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="muted">No hay productos registrados</p>
                )}
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="btn primary"
                  type="button"
                  onClick={() => manejarGenerarPDF(pedidoSeleccionado.id)}
                  disabled={cargando}
                >
                  {cargando ? "Generando..." : "Generar comprobante PDF"}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          className="btn ghost"
          type="button"
          onClick={volverLoginDespachador}
        >
          Volver al menú del despachador
        </button>
      </div>
    </div>
  );
}

