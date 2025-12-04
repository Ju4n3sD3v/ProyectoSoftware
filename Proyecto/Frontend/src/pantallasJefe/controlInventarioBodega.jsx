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
            <h1>Inventario de Bodega</h1>
            <p className="muted">Revisa y gestiona el stock central sin navegar por múltiples botones.</p>
          </div>
          <div className="actions">
            <button className="btn ghost" type="button" onClick={volverLoginJefe}>
              Volver al panel del jefe
            </button>
            <button className="btn ghost" type="button" onClick={volverAlInicio}>
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="stat-grid" style={{ marginBottom: "10px" }}>
          <div className="stat-card">
            <p className="muted">Productos</p>
            <h2>{productos.length}</h2>
          </div>
          <div className="stat-card">
            <p className="muted">Stock total</p>
            <h2>{productos.reduce((acc, p) => acc + Number(p.stock || 0), 0)}</h2>
          </div>
          <div className="stat-card">
            <p className="muted">Última actualización</p>
            <h2>Bodega</h2>
          </div>
        </div>

        <div className="panel" style={{ marginBottom: "14px" }}>
          <div className="panel-head">
            <h3>Acciones rápidas</h3>
          </div>
          <div className="action-grid">
            <button className="action-card" type="button" onClick={modificarInventarioJefe}>
              <span className="action-title">Modificar inventario</span>
              <span className="action-text">Actualiza cantidades de inmediato</span>
            </button>
            <button className="action-card" type="button" onClick={revisarPedidosJefe}>
              <span className="action-title">Revisar pedidos</span>
              <span className="action-text">Aprueba y exporta pedidos</span>
            </button>
          </div>
        </div>

        {cargando && <p className="muted">Cargando productos...</p>}

        {error && (
          <p className="alert error">
            Ocurrió un error: {error}
          </p>
        )}

        {!cargando && !error && (
          <div className="panel">
            <div className="panel-head">
              <h3>Inventario actual</h3>
              <span className="chip">Bodega</span>
            </div>
            {productos.length === 0 ? (
              <p className="muted">No hay productos en la bodega.</p>
            ) : (
              <div className="table-scroll">
                <table className="data-table compact">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Lugar</th>
                      <th>Stock</th>
                      <th>Última actualización</th>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
