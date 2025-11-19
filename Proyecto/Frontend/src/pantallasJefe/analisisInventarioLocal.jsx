import { useState } from "react";

export default function AnalisisInventarioLocal({ volverLoginJefe }) {
  const [localId, setLocalId] = useState(1);
  const [inventario, setInventario] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [alertas, setAlertas] = useState([]);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const backend = "http://localhost:4000";

  // ---- Obtener inventario actual ----
  const cargarInventario = async () => {
    const res = await fetch(`${backend}/analisis/local/${localId}`);
    const data = await res.json();
    setInventario(data);
    setAlertas(data.alertas || []);
  };

  // ---- Obtener movimientos con rango ----
  const cargarHistorico = async () => {
    if (!fechaInicio || !fechaFin) {
      alert("Selecciona ambas fechas");
      return;
    }

    const res = await fetch(
      `${backend}/analisis/historial/${localId}?inicio=${fechaInicio}&fin=${fechaFin}`
    );
    const data = await res.json();
    setHistorico(data);
  };

  return (
    <div>
      <h1>Análisis de inventario por local</h1>

      {/* Seleccionar local */}
      <label>Seleccionar local: </label>
      <select value={localId} onChange={e => setLocalId(Number(e.target.value))}>
        <option value={1}>Local 1</option>
        <option value={2}>Local 2</option>
      </select>

      <br /><br />
      <button onClick={cargarInventario}>Ver inventario</button>

      {/* Mostrar inventario */}
      {inventario && (
        <>
          <h2>Inventario Actual — {inventario.nombreLocal}</h2>

          <table border="1" style={{ margin: "0 auto" }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Stock</th>
                <th>Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {inventario.productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.stock}</td>
                  <td>{p.minimo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Alertas */}
          <h3>Alertas</h3>
          {alertas.length === 0 && <p>No hay productos críticos.</p>}

          {alertas.map((a, i) => (
            <p key={i} style={{ color: "red" }}>
              ⚠️ {a.mensaje}
            </p>
          ))}
        </>
      )}

      <hr />

      {/* HISTÓRICO DE MOVIMIENTOS */}
      <h2>Historial de movimientos</h2>

      <label>Desde: </label>
      <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />

      <label> Hasta: </label>
      <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />

      <br /><br />
      <button onClick={cargarHistorico}>Buscar movimientos</button>

      {historico.length > 0 && (
        <table border="1" style={{ margin: "20px auto" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {historico.map((m, i) => (
              <tr key={i}>
                <td>{m.fecha}</td>
                <td>{m.producto}</td>
                <td>{m.cantidad}</td>
                <td>{m.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={volverLoginJefe}>Volver</button>
    </div>
  );
}
