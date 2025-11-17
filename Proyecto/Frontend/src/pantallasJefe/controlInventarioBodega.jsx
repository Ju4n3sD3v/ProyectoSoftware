import { useEffect, useState } from "react";

export default function ControlInventarioBodega({ volverAlInicio, volverLoginJefe, modificarInventarioJefe }) {
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

        // data.data viene del backend: { ok: true, data: [...] }
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
    <>
      <div>
        <h1>Control de inventario en Bodega</h1>
        <label>
          Aca podra revisar las cantidades de los insumos los cuales se 
          encuentran en este momento en el inventario.
        </label>

        <br /><br />

        {cargando && <p>Cargando productos...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Ocurrió un error: {error}
          </p>
        )}

        {!cargando && !error && (
          <div>
            {productos.length === 0 ? (
              <p>No hay productos en la bodega.</p>
            ) : (
              <table style={{ border: "1px solid white", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid white", padding: "8px" }}>ID</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Producto</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Lugar</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Stock</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Última actualización</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td style={{ border: "1px solid white", padding: "8px" }}>{p.id}</td>
                      <td style={{ border: "1px solid white", padding: "8px" }}>{p.nombre}</td>
                      <td style={{ border: "1px solid white", padding: "8px" }}>{p.lugar}</td>
                      <td style={{ border: "1px solid white", padding: "8px" }}>{p.stock}</td>
                      <td style={{ border: "1px solid white", padding: "8px" }}>{p.actualizadoEn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        <br /><br />
        <button 
          type = "button"
          onClick={modificarInventarioJefe}
        > 
          Modificar Inventario
          
        </button>




        <br /><br />
        <button
          type="button"
          onClick={volverLoginJefe}
        >
          Volver al menú del jefe
        </button>

        <br /><br />

        <button
          type="button"
          onClick={volverAlInicio}
        >
          Volver al inicio
        </button>
      </div>
    </>
  );
}
