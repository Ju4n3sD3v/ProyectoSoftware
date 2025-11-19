import { useEffect, useState } from "react";

function RevisarPedidosJefe({ volverControlInventarioBodega }) {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [productosEditados, setProductosEditados] = useState({});

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

  if (cargando) {
    return <h1>Cargando pedidos...</h1>;
  }

  if (error) {
    return (
      <div>
        <h1>Error: {error}</h1>
        <button type="button" onClick={volverControlInventarioBodega}>
          Volver a control de inventario
        </button>
      </div>
    );
  }

  return (
    <>
      <h1>Revisar pedidos de empleadas</h1>

      {/* Tabla con lista de pedidos */}
      <table border="1" cellPadding="8">
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

          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{formatearFecha(p.fecha)}</td>
              <td>{p.revisado ? "Revisado" : "Pendiente"}</td>
              <td>
                <button type="button" onClick={() => manejarSeleccionPedido(p)}>
                  Ver / Modificar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      {/* Detalle del pedido seleccionado */}
      {pedidoSeleccionado && (
        <div>
          <h2>Pedido seleccionado</h2>
          <p>
            <strong>ID:</strong> {pedidoSeleccionado.id}
            <br />
            <strong>Fecha:</strong> {formatearFecha(pedidoSeleccionado.fecha)}
            <br />
            <strong>Estado:</strong>{" "}
            {pedidoSeleccionado.revisado ? "Revisado" : "Pendiente"}
          </p>

          <table border="1" cellPadding="8">
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

          <br />

          <button type="button" onClick={manejarGuardarYExportar}>
            Guardar cambios y generar Excel
          </button>
        </div>
      )}

      <br />
      <button type="button" onClick={volverControlInventarioBodega}>
        Volver a control de inventario
      </button>
    </>
  );
}

export default RevisarPedidosJefe;
