import { useState } from "react";

function FaltantesJefe({ volverControlInventarioBodega, volverLoginJefe }) {
  const [local, setLocal] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [faltantes, setFaltantes] = useState([]); // array de pedidos con faltantes
  const [enviados, setEnviados] = useState({}); // Rastrear qué productos fueron marcados como enviados

  const cargarFaltantes = async () => {
    if (!local) {
      alert("Seleccione un local primero");
      return;
    }

    setCargando(true);
    setError(null);
    setEnviados({}); // Limpiar estado de enviados al cargar nuevos faltantes

    try {
      const res = await fetch(
        `http://localhost:4000/api/pedidos/faltantes/${encodeURIComponent(
          local
        )}`
      );
      const data = await res.json();
      console.log("📥 Faltantes jefe:", data);

      if (data.success) {
        setFaltantes(data.faltantes || []);
      } else {
        setError(data.mensaje || "No se pudieron cargar los faltantes");
      }
    } catch (err) {
      console.error("Error cargando faltantes:", err);
      setError("Error de conexión al backend");
    } finally {
      setCargando(false);
    }
  };

  // Función para marcar un producto como enviado
  const marcarEnviado = (pedidoId, nombreProducto) => {
    const clave = `${pedidoId}-${nombreProducto}`;
    setEnviados((prev) => ({
      ...prev,
      [clave]: !prev[clave],
    }));
    console.log(`📤 Producto "${nombreProducto}" del pedido ${pedidoId} marcado como enviado`);
  };

  return (
    <div>
      <h1>Reporte de productos faltantes por local</h1>

      {/* Selector de local */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="select-local" style={{ marginRight: "0.5rem" }}>
          Local:
        </label>
        <select
          id="select-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
        >
          <option value="">Seleccione un local</option>
          <option value="Local 1">Local 1</option>
          <option value="Local 2">Local 2</option>
        </select>

        <button
          type="button"
          style={{ marginLeft: "0.5rem" }}
          onClick={cargarFaltantes}
        >
          Ver faltantes
        </button>
      </div>

      {cargando && <p>Cargando faltantes...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Lista de faltantes por pedido */}
      {!cargando && !error && local && (
        <div>
          {faltantes.length === 0 ? (
            <p>No hay faltantes reportados para este local.</p>
          ) : (
            faltantes.map((pedido) => (
              <div
                key={pedido.pedidoId}
                style={{
                  marginBottom: "1.5rem",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                }}
              >
                <h3>
                  Pedido ID: {pedido.pedidoId} | Local: {pedido.local}
                </h3>
                <p>
                  Fecha:{" "}
                  {pedido.fecha
                    ? new Date(pedido.fecha).toLocaleString()
                    : "Sin fecha"}
                </p>

                <table border="1" cellPadding="4">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant. solicitada</th>
                      <th>Cant. recibida</th>
                      <th>Faltante</th>
                      <th>Motivo</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(pedido.faltantes || {}).map(
                      ([nombreProducto, info]) => {
                        const clave = `${pedido.pedidoId}-${nombreProducto}`;
                        const esEnviado = enviados[clave] || false;

                        return (
                          <tr key={nombreProducto}>
                            <td>{nombreProducto}</td>
                            <td>{info.solicitada}</td>
                            <td>{info.recibida}</td>
                            <td>{info.faltante}</td>
                            <td>
                              {/* Por ahora todo viene de que NO llegó en el pedido */}
                              {info.origen === "agotado"
                                ? "Se agotó en el local"
                                : "No llegó completo en el pedido"}
                            </td>
                            <td>
                              <button
                                type="button"
                                onClick={() =>
                                  marcarEnviado(pedido.pedidoId, nombreProducto)
                                }
                                style={{
                                  backgroundColor: esEnviado ? "#4CAF50" : "#f44336",
                                  color: "white",
                                  padding: "0.4rem 0.8rem",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                {esEnviado ? "✓ Enviado" : "Enviar"}
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      )}

      <br />
      <button type="button" onClick={volverLoginJefe}>
        Volver al menú del jefe
      </button>
    </div>
  );
}

export default FaltantesJefe;
