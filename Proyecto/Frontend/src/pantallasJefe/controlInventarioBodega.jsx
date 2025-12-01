import { useEffect, useState } from "react";

export default function ControlInventarioBodega({
  volverAlInicio,
  volverLoginJefe,
  modificarInventarioJefe,
  revisarPedidosJefe,
}) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const respuesta = await fetch("http://localhost:4000/productos/bodega");
        const data = await respuesta.json();

        if (!data.ok) {
          throw new Error(data.error || "Error al obtener productos.");
        }

        setProductos(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="page">
      <div className="card-surface">
        <div className="page-header">
          <div>
            <h1>Control de inventario en bodega</h1>
            <p className="muted">Revisa las existencias actuales y la ultima actualizacion de los insumos.</p>
          </div>
          <span className="badge">Bodega</span>
        </div>

        {cargando && <p className="muted">Cargando productos...</p>}

        {error && (
          <p className="alert error">
            Ocurrio un error: {error}
          </p>
        )}

        {!cargando && !error && (
          <div>
            {productos.length === 0 ? (
              <p className="muted">No hay productos en la bodega.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Lugar</th>
                    <th>Stock</th>
                    <th>Ultima actualizacion</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.lugar}</td>
                      <td>{p.stock}</td>
                      <td>{p.actualizadoEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <div className="actions" style={{ marginTop: "18px" }}>
          <button
            className="btn"
            type="button"
            onClick={modificarInventarioJefe}
          >
            Modificar inventario
          </button>
          <button className="btn secondary" type="button" onClick={revisarPedidosJefe}>
            Revisar pedidos
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={volverLoginJefe}
          >
            Volver al menu del jefe
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={volverAlInicio}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
