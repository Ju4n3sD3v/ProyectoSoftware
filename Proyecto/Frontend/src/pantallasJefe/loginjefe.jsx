import { useEffect, useState } from "react";

export default function LoginJefe({
  volverAlInicio,
  controlInventarioBodega,
  mostrarAnalisisInventario,
  verFaltantesJefe,
  verHistorialDescartes,
}) {
  const [resumen, setResumen] = useState({
    productos: 0,
    stockTotal: 0,
    desactualizados: 0,
  });
  const [destacados, setDestacados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resumenChart, setResumenChart] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError("");

        const [resProductos, resDesactualizados] = await Promise.all([
          fetch("http://localhost:4000/productos/bodega"),
          fetch("http://localhost:4000/productos/bodega/sin-actualizar-72"),
        ]);

        const dataProd = await resProductos.json();
        const dataDesact = await resDesactualizados.json();

        const lista = dataProd?.data || [];
        const totalStock = lista.reduce((acc, p) => acc + Number(p.stock || 0), 0);

        setResumen({
          productos: lista.length,
          stockTotal: totalStock,
          desactualizados: dataDesact?.data?.length || 0,
        });

        const low = [...lista]
          .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
          .slice(0, 5);
        setDestacados(low);

        const maxStock = Math.max(...lista.map((p) => Number(p.stock || 0)), 1);
        const mini = lista.slice(0, 6).map((p) => ({
          nombre: p.nombre,
          valor: p.stock,
          ancho: Math.min(100, Math.round((Number(p.stock || 0) / maxStock) * 100)),
        }));
        setResumenChart(mini);
      } catch (err) {
        console.error(err);
        setError("No pudimos cargar el resumen de bodega.");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1>Panel del Jefe</h1>
          <p className="muted">Controla inventario, analiza stock y revisa faltantes desde un solo lugar.</p>
        </div>
        <button className="btn ghost" type="button" onClick={volverAlInicio}>
          Cerrar sesión
        </button>
      </div>

      {error && <p className="alert error">{error}</p>}

      <div className="stat-grid">
        <div className="stat-card">
          <p className="muted">Productos en bodega</p>
          <h2>{resumen.productos}</h2>
        </div>
        <div className="stat-card">
          <p className="muted">Stock total</p>
          <h2>{resumen.stockTotal}</h2>
        </div>
        <div className="stat-card warning">
          <p className="muted">Sin actualizar +72h</p>
          <h2>{resumen.desactualizados}</h2>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>Acciones rápidas</h3>
          <div className="action-grid actions-balanced">
            <button className="action-card" type="button" onClick={controlInventarioBodega}>
              <span className="action-title">Inventario de bodega</span>
              <span className="action-text">Ver y actualizar stock</span>
            </button>
            <button className="action-card" type="button" onClick={mostrarAnalisisInventario}>
              <span className="action-title">Análisis por local</span>
              <span className="action-text">Alertas y mínimos</span>
            </button>
            <button className="action-card" type="button" onClick={verFaltantesJefe}>
              <span className="action-title">Faltantes</span>
              <span className="action-text">Reportes de locales</span>
            </button>
            {typeof verHistorialDescartes === "function" && (
              <button className="action-card" type="button" onClick={verHistorialDescartes}>
                <span className="action-title">Historial de descartes</span>
                <span className="action-text">Motivos, cantidades y reposición</span>
              </button>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Vista gráfica del inventario</h3>
            {cargando && <span className="chip">Actualizando...</span>}
          </div>
          {resumenChart.length === 0 ? (
            <p className="muted">Cargando datos de bodega...</p>
          ) : (
            <div className="mini-chart">
              {resumenChart.map((item) => (
                <div key={item.nombre} className="mini-chart__row">
                  <span className="mini-chart__label">{item.nombre}</span>
                  <div className="mini-chart__bar">
                    <div className="mini-chart__fill" style={{ width: `${item.ancho}%` }} />
                  </div>
                  <span className="mini-chart__value">{item.valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h3>Productos con menor stock</h3>
            {cargando && <span className="chip">Actualizando...</span>}
          </div>
          {destacados.length === 0 ? (
            <p className="muted">No hay productos destacados.</p>
          ) : (
            <table className="data-table compact">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock</th>
                  <th>Última act.</th>
                </tr>
              </thead>
              <tbody>
                {destacados.map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.stock}</td>
                    <td>{p.actualizadoEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
