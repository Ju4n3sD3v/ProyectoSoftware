// src/componentes/AvisosFaltantes.jsx
// import "./AvisosFaltantes.css"; // CSS no existe, comentado por ahora

function AvisosFaltantes({ faltantes }) {
  if (!faltantes || faltantes.length === 0) {
    return (
      <div className="avisos-card avisos-ok">
        <p>✅ No hay faltantes para este pedido. La bodega puede surtirlo completo.</p>
      </div>
    );
  }

  return (
    <div className="avisos-card">
      <h3>⚠️ Productos faltantes en bodega</h3>
      <table className="avisos-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Pedido</th>
            <th>En bodega</th>
            <th>Faltante</th>
          </tr>
        </thead>
        <tbody>
          {faltantes.map((item) => (
            <tr key={item.nombre}>
              <td>{item.nombre}</td>
              <td>{item.cantidadPedida}</td>
              <td>{item.stockBodega}</td>
              <td>{item.faltante}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AvisosFaltantes;
