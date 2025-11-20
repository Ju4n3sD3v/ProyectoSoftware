import { useState } from "react";

function FaltantesJefe({ volverControlInventarioBodega, volverLoginJefe, verHistorialEnvios }) {
  const [local, setLocal] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [faltantes, setFaltantes] = useState([]); // array de pedidos con faltantes
  const [enviados, setEnviados] = useState({}); // Rastrear qué productos fueron marcados como enviados
  const [enviando, setEnviando] = useState({}); // Rastrear procesos en curso por clave
  const [consultado, setConsultado] = useState(false);

  const cargarFaltantes = async () => {
    if (!local) {
      alert("Seleccione un local primero");
      return;
    }

    setCargando(true);
    setError(null);
    setEnviados({}); // Limpiar estado de enviados al cargar nuevos faltantes
    setConsultado(false);

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
      setConsultado(true);
    }
  };

  // Enviar producto: decrementa stock en la bodega usando API backend
  const enviarProducto = async (pedidoId, nombreProducto, cantidad) => {
    const clave = `${pedidoId}-${nombreProducto}`;

    // evitar doble envío
    if (enviados[clave]) return;
    if (enviando[clave]) return;

    setEnviando((s) => ({ ...s, [clave]: true }));

    try {
      // 1) Obtener productos de Bodega
      const res = await fetch("http://localhost:4000/productos/bodega");
      const datos = await res.json();

      const lista = datos && (datos.data || datos) ? (datos.data || datos) : [];

      const productoBodega = lista.find((p) => p.nombre === nombreProducto && p.lugar === "Bodega");

      if (!productoBodega) {
        alert(`No se encontró el producto '${nombreProducto}' en la bodega.`);
        return;
      }

      const requerido = Number(cantidad || 0);

      // Si no hay stock suficiente para ESTE producto, mostrar mensaje con los productos
      // del pedido que SÍ se pueden enviar desde la bodega ahora.
      if (Number(productoBodega.stock) < requerido) {
        // buscar el pedido en el estado `faltantes`
        const pedidoObj = faltantes.find((p) => p.pedidoId === pedidoId);
        const puede = [];

        if (pedidoObj && pedidoObj.faltantes) {
          Object.entries(pedidoObj.faltantes).forEach(([nombreProd, inf]) => {
            const b = lista.find((x) => x.nombre === nombreProd && x.lugar === "Bodega");
            if (b && Number(b.stock) >= Number(inf.faltante)) {
              puede.push(`${nombreProd} (stock: ${b.stock} >= req: ${inf.faltante})`);
            }
          });
        }

        const detalles = puede.length > 0 ? `\nProductos que SÍ se pueden enviar ahora:\n- ${puede.join("\n- ")}` : "\nNingún producto del pedido tiene stock suficiente en bodega ahora.";

        alert(`No hay suficiente stock en bodega para '${nombreProducto}' (stock: ${productoBodega.stock}, requerido: ${requerido}).${detalles}`);
        return;
      }

      const nuevoStock = Math.max(0, Number(productoBodega.stock) - requerido);

      // 2) Llamar al endpoint para actualizar stock
      const respUpdate = await fetch(`http://localhost:4000/productos/${productoBodega.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: nuevoStock }),
      });

      const resultado = await respUpdate.json();

      if (!respUpdate.ok) {
        const mensaje = resultado && (resultado.error || resultado.mensaje) ? (resultado.error || resultado.mensaje) : "Error actualizando stock";
        alert(`No se pudo actualizar stock: ${mensaje}`);
        return;
      }

      // 3) Registrar envío en el pedido (backend)
      try {
        const reg = await fetch(`http://localhost:4000/api/pedidos/${pedidoId}/enviar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ producto: nombreProducto, cantidad: requerido }),
        });

        const regJson = await reg.json();
        if (!reg.ok || !regJson.success) {
          console.error("Error registrando envío en pedido:", regJson);
          alert("No se pudo registrar el envío en el pedido");
          return;
        }

        // marcar como enviado en UI
        setEnviados((prev) => ({ ...prev, [clave]: true }));
        console.log(`✅ Enviado ${cantidad} de '${nombreProducto}' (pedido ${pedidoId}). Nuevo stock: ${nuevoStock}`);

        // Actualizar estado `faltantes`: quitar el producto enviado del pedido
        setFaltantes((prev) => {
          return prev
            .map((p) => {
              if (p.pedidoId !== pedidoId) return p;
              const nuevosFalt = { ...(p.faltantes || {}) };
              delete nuevosFalt[nombreProducto];
              return { ...p, faltantes: nuevosFalt };
            })
            .filter((p) => p && p.faltantes && Object.keys(p.faltantes).length > 0);
        });
      } catch (err) {
        console.error("Error registrando envío en pedido:", err);
        alert("Error registrando el envío en el pedido");
        return;
      }
    } catch (err) {
      console.error("Error enviando producto:", err);
      alert("Error de conexión con el backend al intentar enviar producto");
    } finally {
      setEnviando((s) => ({ ...s, [clave]: false }));
    }
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
          onChange={(e) => {
            setLocal(e.target.value);
            setConsultado(false);
            setFaltantes([]);
            setEnviados({});
            setError(null);
          }}
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
      {!cargando && !error && consultado && (
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
                                  enviarProducto(pedido.pedidoId, nombreProducto, info.faltante)
                                }
                                disabled={esEnviado || !!enviando[clave]}
                                style={{
                                  backgroundColor: esEnviado ? "#4CAF50" : "#f44336",
                                  color: "white",
                                  padding: "0.4rem 0.8rem",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: esEnviado ? "default" : "pointer",
                                  fontSize: "0.9rem",
                                  opacity: !!enviando[clave] ? 0.7 : 1,
                                }}
                              >
                                {enviando[clave] ? "Enviando..." : esEnviado ? "✓ Enviado" : "Enviar"}
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
      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={volverLoginJefe} style={{ marginRight: '0.5rem' }}>
          Volver al menú del jefe
        </button>

        <button type="button" onClick={() => verHistorialEnvios && verHistorialEnvios()}>
          Ver historial de envíos
        </button>
      </div>
    </div>
  );
}

export default FaltantesJefe;
