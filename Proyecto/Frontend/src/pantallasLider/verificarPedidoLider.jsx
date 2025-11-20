import { useState, useEffect } from "react";

function VerificarPedidosLider({ volverAlInicio }) {
  const [local, setLocal] = useState("");
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [cantidadesRecibidas, setCantidadesRecibidas] = useState({});

  // Cargar pedidos pendientes por local
  const cargarPedidos = async (localSeleccionado) => {
    if (!localSeleccionado) return;

    setCargando(true);
    setError(null);

    try {
      const res = await fetch(
        `http://localhost:4000/api/pedidos/por-local/${encodeURIComponent(
          localSeleccionado
        )}?soloPendientes=true`
      );

      const data = await res.json();
      console.log("📥 Pedidos pendientes:", data);

      if (data.success) {
        setPedidos(data.pedidos || []);
      } else {
        setError(data.mensaje || "No se pudieron cargar los pedidos");
      }
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("Error de conexión al backend");
    } finally {
      setCargando(false);
    }
  };

  // Cuando cambie el local, cargar pedidos de ese local
  useEffect(() => {
    if (local) {
      setPedidoSeleccionado(null);
      setCantidadesRecibidas({});
      cargarPedidos(local);
    } else {
      setPedidos([]);
      setPedidoSeleccionado(null);
      setCantidadesRecibidas({});
    }
  }, [local]);

  const handleSeleccionarPedido = (pedido) => {
    setPedidoSeleccionado(pedido);

    // Inicializar cantidades recibidas igual a solicitadas (para facilitar)
    const inicial = {};
    Object.entries(pedido.productos || {}).forEach(
      ([nombreProducto, cantidadSolicitada]) => {
        if (Number(cantidadSolicitada) > 0) {
          inicial[nombreProducto] = String(cantidadSolicitada ?? 0);
        }
      }
    );
    setCantidadesRecibidas(inicial);
  };

  const handleCambiarCantidadRecibida = (nombreProducto, valor) => {
    console.log('handleCambiarCantidadRecibida called:', nombreProducto, valor);
    // permitir vacío
    if (valor === "") {
      setCantidadesRecibidas((prev) => ({
        ...prev,
        [nombreProducto]: "",
      }));
      return;
    }

    // solo números >= 0
    if (!isNaN(valor) && Number(valor) >= 0) {
      setCantidadesRecibidas((prev) => ({
        ...prev,
        [nombreProducto]: valor,
      }));
    }
  };

  const calcularFaltante = (nombreProducto) => {
    if (!pedidoSeleccionado) return 0;

    const solicitada =
      Number(pedidoSeleccionado.productos?.[nombreProducto] ?? 0);
    const recibida = Number(cantidadesRecibidas?.[nombreProducto] ?? 0);

    const faltante = solicitada - recibida;
    return faltante > 0 ? faltante : 0;
  };

  const calcularEstado = (nombreProducto) => {
    const faltante = calcularFaltante(nombreProducto);
    return faltante > 0 ? "Faltó" : "Completo";
  };

  const handleEnviarVerificacion = async () => {
    if (!pedidoSeleccionado) return;

    // Armar objeto productosRecibidos como números
    const productosRecibidos = {};
    Object.entries(cantidadesRecibidas).forEach(
      ([nombreProducto, valor]) => {
        productosRecibidos[nombreProducto] = Number(valor || 0);
      }
    );

    console.log("📤 Enviando verificación de pedido:", {
      id: pedidoSeleccionado.id,
      productosRecibidos,
    });

    try {
      const res = await fetch(
        `http://localhost:4000/api/pedidos/${pedidoSeleccionado.id}/verificacion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productosRecibidos }),
        }
      );

      const data = await res.json();
      console.log("Respuesta verificación:", data);

      if (data.success) {
        alert("✅ Pedido verificado y reporte de faltantes enviado al jefe.");
        // Recargar lista de pedidos pendientes
        cargarPedidos(local);
        setPedidoSeleccionado(null);
        setCantidadesRecibidas({});
      } else {
        alert("Error al verificar el pedido: " + data.mensaje);
      }
    } catch (err) {
      console.error("Error al enviar verificación:", err);
      alert("Error de conexión con el servidor: " + err.message);
    }
  };

  // UI principal
  return (
    <div>
      <h1>Verificar pedidos recibidos</h1>

      {/* 1. Primero escoger el local */}
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
      </div>

      {cargando && <p>Cargando pedidos...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* 2. Lista de pedidos pendientes por local */}
      {!pedidoSeleccionado && local && !cargando && (
        <div>
          <h2>Pedidos pendientes de verificación</h2>
          {pedidos.length === 0 ? (
            <p>No hay pedidos pendientes para este local.</p>
          ) : (
            <table border="1" cellPadding="4">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Revisado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.fecha
                        ? new Date(p.fecha).toLocaleString()
                        : "Sin fecha"}
                    </td>
                    <td>{p.revisado ? "Sí" : "No"}</td>
                    <td>
                      <button onClick={() => handleSeleccionarPedido(p)}>
                        Verificar este pedido
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* 3. Detalle del pedido seleccionado */}
      {pedidoSeleccionado && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2>
            Revisando pedido ID: {pedidoSeleccionado.id} (Local:{" "}
            {pedidoSeleccionado.local || local})
          </h2>
          <p>
            Fecha:{" "}
            {pedidoSeleccionado.fecha
              ? new Date(pedidoSeleccionado.fecha).toLocaleString()
              : "Sin fecha"}
          </p>

          <table border="1" cellPadding="4">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant. solicitada</th>
                <th>Cant. recibida</th>
                <th>Faltante</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pedidoSeleccionado.productos || {})
                
                .filter(([, cantidadSolicitada]) => Number(cantidadSolicitada) > 0)
                .map(([nombreProducto, cantidadSolicitada]) => (
                  <tr key={nombreProducto}>
                    <td>{nombreProducto}</td>
                    <td>{cantidadSolicitada}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={cantidadesRecibidas[nombreProducto] ?? ""}
                        onChange={(e) =>
                          handleCambiarCantidadRecibida(
                            nombreProducto,
                            e.target.value
                          )
                        }
                        style={{ width: "80px" }}
                      />
                    </td>
                    <td>{calcularFaltante(nombreProducto)}</td>
                    <td>{calcularEstado(nombreProducto)}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div style={{ marginTop: "1rem" }}>
            <button onClick={handleEnviarVerificacion}>
              ✅ Confirmar verificación y generar reporte de faltantes
            </button>
            <button
              style={{ marginLeft: "0.5rem" }}
              onClick={() => {
                setPedidoSeleccionado(null);
                setCantidadesRecibidas({});
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <br />
      <button type="button" onClick={volverAlInicio}>
        Volver al menú de líder
      </button>
    </div>
  );
}

export default VerificarPedidosLider;
