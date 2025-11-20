import { useEffect, useState } from "react";

function InventarioPorLocal({ volver }) {
  const [local, setLocal] = useState("");
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [seleccionados, setSeleccionados] = useState({});
  const [previewReporte, setPreviewReporte] = useState(false);
  const [cantidadesReporte, setCantidadesReporte] = useState({});
  const [editando, setEditando] = useState({});

  const cargar = async () => {
    if (!local) {
      alert("Selecciona un local");
      return;
    }

    setCargando(true);
    setError(null);
    setProductos([]);
    setSeleccionados({});

    try {
      const res = await fetch(`http://localhost:4000/productos/local/${encodeURIComponent(local)}`);
      const data = await res.json();

      if (data.ok) {
        setProductos(data.data || []);
      } else {
        setError(data.error || "No se pudo cargar inventario");
      }
    } catch (err) {
      console.error("Error cargando inventario:", err);
      setError("Error de conexión con backend");
    } finally {
      setCargando(false);
    }
  };

  const toggleSeleccion = (nombre) => {
    setSeleccionados((prev) => ({ ...prev, [nombre]: !prev[nombre] }));
  };

  const iniciarReporte = () => {
    const seleccion = Object.entries(seleccionados).filter(([,v]) => v).map(([k]) => k);
    if (seleccion.length === 0) {
      alert('Selecciona al menos un producto para reportar');
      return;
    }

    // Inicializar cantidades de reporte en 1 (o 0 si quieres)
    const inicial = {};
    seleccion.forEach((nombre) => { inicial[nombre] = 1; });
    setCantidadesReporte(inicial);
    setPreviewReporte(true);
  };

  const enviarReporteFinal = async () => {
    // Construir faltantes desde cantidadesReporte
    const nombres = Object.keys(cantidadesReporte);
    if (nombres.length === 0) {
      alert('No hay productos en el reporte');
      return;
    }

    const faltantes = {};
    nombres.forEach((nombre) => {
      const qty = Number(cantidadesReporte[nombre] || 0);
      if (qty <= 0) return; // ignorar
      faltantes[nombre] = {
        solicitada: qty,
        recibida: 0,
        faltante: qty,
        origen: 'agotamiento',
      };
    });

    if (Object.keys(faltantes).length === 0) {
      alert('Ingresa cantidades válidas mayor a 0');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/reportes/faltantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ local, faltantes, motivo: 'Agotamiento de producto' }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert('Error enviando reporte: ' + (data.mensaje || data.error || ''));
        return;
      }

      alert('Reporte enviado correctamente');
      // Limpiar selección, preview y cantidades
      setSeleccionados({});
      setCantidadesReporte({});
      setPreviewReporte(false);
    } catch (err) {
      console.error('Error enviando reporte:', err);
      alert('Error de conexión con el backend');
    }
  };

  return (
    <div>
      <h1>Inventario por Local</h1>

      <div>
        <label>Seleccionar local: </label>
        <select value={local} onChange={(e) => setLocal(e.target.value)}>
          <option value="">-- elige local (solo Local 1 y Local 2) --</option>
          <option value="Local 1">Local 1</option>
          <option value="Local 2">Local 2</option>
        </select>
        <button onClick={cargar} style={{ marginLeft: '0.5rem' }}>Cargar inventario</button>
      </div>

      <br />

      {cargando && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!cargando && !error && productos.length > 0 && (
          <div>
          <div style={{ marginBottom: '0.5rem' }}>
            <label>Buscar: </label>
            <input type="text" value={filtro} onChange={(e) => setFiltro(e.target.value)} placeholder="Buscar por nombre..." />
          </div>

          <table border="1" cellPadding="6" style={{ margin: '0 auto', minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Producto</th>
                <th>Stock</th>
                <th>Editar stock</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .filter((p) => p.nombre.toLowerCase().includes(filtro.toLowerCase()))
                .map((p) => {
                  const editingValue = editando[p.id] !== undefined ? editando[p.id] : p.stock;
                  return (
                    <tr key={p.id}>
                      <td style={{ textAlign: 'left' }}>{p.nombre}</td>
                      <td style={{ textAlign: 'center' }}>{p.stock}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          value={editingValue}
                          onChange={(e) => setEditando((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          style={{ width: '100px' }}
                        />
                        <button
                          onClick={async () => {
                            // Guardar stock actualizado en backend
                            const nuevo = Number(editando[p.id] !== undefined ? editando[p.id] : p.stock);
                            try {
                              const resp = await fetch(`http://localhost:4000/productos/${p.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ stock: nuevo }),
                              });
                              const data = await resp.json();
                              if (!resp.ok) {
                                alert('Error actualizando stock: ' + (data.error || data.mensaje || ''));
                                return;
                              }
                              // actualizar UI
                              setProductos((prev) => prev.map((x) => (x.id === p.id ? { ...x, stock: nuevo } : x)));
                              setEditando((prev) => { const c = { ...prev }; delete c[p.id]; return c; });
                            } catch (err) {
                              console.error('Error actualizando stock:', err);
                              alert('Error de conexión al actualizar stock');
                            }
                          }}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Guardar
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {Number(p.stock) === 0 ? (
                          <button
                            onClick={() => toggleSeleccion(p.nombre)}
                            style={{ backgroundColor: seleccionados[p.nombre] ? '#4CAF50' : '#f44336', color: 'white', padding: '6px 10px', border: 'none', borderRadius: 4 }}
                          >
                            {seleccionados[p.nombre] ? 'Marcado' : 'Marcar para reporte'}
                          </button>
                        ) : (
                          <span style={{ color: '#666' }}>No aplicable</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <br />
          {!previewReporte ? (
            <button onClick={iniciarReporte}>Crear reporte</button>
          ) : (
            <div>
              <h3>Previsualizar reporte (Agotamiento de producto)</h3>
              <table border="1" cellPadding="6" style={{ margin: '0 auto', minWidth: 500 }}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad solicitada</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cantidadesReporte).map((nombre) => (
                    <tr key={nombre}>
                      <td style={{ textAlign: 'left' }}>{nombre}</td>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="number"
                          min="1"
                          value={cantidadesReporte[nombre]}
                          onChange={(e) => setCantidadesReporte((prev) => ({ ...prev, [nombre]: e.target.value }))}
                          style={{ width: '80px' }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '0.5rem' }}>
                <button onClick={enviarReporteFinal}>Enviar reporte al jefe</button>
                <button style={{ marginLeft: '0.5rem' }} onClick={() => { setPreviewReporte(false); setCantidadesReporte({}); }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      )}

      <br />
      <button onClick={volver}>Volver</button>
    </div>
  );
}

export default InventarioPorLocal;
