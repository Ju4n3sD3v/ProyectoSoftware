import { useEffect, useState } from "react";

function HistorialEnvios({ volver }) {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [envios, setEnvios] = useState([]);

  const cargarEnvios = async () => {
    try {
      setCargando(true);
      const res = await fetch("http://localhost:4000/api/envios");
      const data = await res.json();

      if (data.success) {
        setEnvios(data.envios || []);
        setError(null);
      } else {
        setError(data.mensaje || "No se pudo cargar el historial");
      }
    } catch (err) {
      console.error("Error cargando historial de envíos:", err);
      setError("Error de conexión con el backend");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

  return (
    <div>
      <h1>Historial de envíos</h1>

      {cargando && <p>Cargando historial...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!cargando && !error && (
        <div>
          {envios.length === 0 ? (
            <p>No hay envíos registrados.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ margin: "0 auto" }}>
              <thead>
                <tr>
                  <th>Pedido ID</th>
                  <th>Local</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Fecha envío</th>
                </tr>
              </thead>
              <tbody>
                {envios.map((e, i) => (
                  <tr key={`${e.pedidoId}-${e.producto}-${i}`}>
                    <td>{e.pedidoId}</td>
                    <td>{e.local}</td>
                    <td>{e.producto}</td>
                    <td>{e.cantidad}</td>
                    <td>{e.fechaEnvio ? new Date(e.fechaEnvio).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <br />
          <button type="button" onClick={volver}>Volver</button>
        </div>
      )}
    </div>
  );
}

export default HistorialEnvios;
