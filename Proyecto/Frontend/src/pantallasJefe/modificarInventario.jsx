import { useEffect, useState } from "react";

export default function ModificarInventarioJefe({ volverAlInicio, controlInventarioBodega }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({}); // id → valor nuevo (string)

  // Cargar productos de bodega al montar el componente
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        const respuesta = await fetch("http://localhost:4000/productos/bodega");
        const data = await respuesta.json();

        if (!data.ok) {
          throw new Error(data.error || "Error al obtener productos de la bodega.");
        }

        setProductos(data.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  // Manejar cambio en el input de nuevo stock
  const handleChangeStock = (idProducto, valor) => {
    if (valor === "" || parseInt(valor, 10) >= 0) {
      setValoresEditados(prev => ({
        ...prev,
        [idProducto]: valor
      }));
    }
  };

  // Aceptar cambio para un producto
  const handleAceptar = async (producto) => {
    const valorInput = valoresEditados[producto.id];

    // Si no se escribió nada, usamos el stock actual
    const nuevoStock = valorInput === undefined || valorInput === ""
      ? producto.stock
      : parseInt(valorInput, 10);

    if (Number.isNaN(nuevoStock) || nuevoStock < 0) {
      alert("El stock debe ser un número mayor o igual a 0.");
      return;
    }

    if (nuevoStock === producto.stock) {
      alert("No se detectaron cambios en el stock para este producto.");
      return;
    }

    try {
      const respuesta = await fetch(`http://localhost:4000/productos/${producto.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stock: nuevoStock })
      });

      const data = await respuesta.json();

      if (!data.ok) {
        alert("Error al actualizar el producto: " + (data.error || "Error desconocido."));
        return;
      }

      const productoActualizado = data.data;

      // Actualizar la lista de productos en el estado
      setProductos(prev =>
        prev.map(p => p.id === producto.id ? productoActualizado : p)
      );

      // Limpiar el valor editado de ese producto
      setValoresEditados(prev => ({
        ...prev,
        [producto.id]: ""
      }));

      alert("✓ Inventario actualizado correctamente para " + productoActualizado.nombre);
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor: " + err.message);
    }
  };

  // Rechazar cambio → no se modifica nada
  const handleRechazar = (idProducto) => {
    setValoresEditados(prev => ({
      ...prev,
      [idProducto]: ""
    }));
    alert("No se realizaron cambios en el inventario para este producto.");
  };

  return (
    <>
      <div>
        <h1>Modificar inventario de bodega</h1>

        {cargando && <p>Cargando productos...</p>}

        {error && (
          <p style={{ color: "red" }}>
            Ocurrió un error: {error}
          </p>
        )}

        {!cargando && !error && (
          <>
            {productos.length === 0 ? (
              <p>No hay productos en la bodega.</p>
            ) : (
              <table style={{ border: "1px solid white", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid white", padding: "8px" }}>ID</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Producto</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Lugar</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Stock actual</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Última actualización</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Nuevo stock</th>
                    <th style={{ border: "1px solid white", padding: "8px" }}>Acciones</th>
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
                      <td style={{ border: "1px solid white", padding: "8px" }}>
                        <input
                          type="number"
                          min="0"
                          value={
                            valoresEditados[p.id] !== undefined
                              ? valoresEditados[p.id]
                              : p.stock
                          }
                          onChange={(e) => handleChangeStock(p.id, e.target.value)}
                          style={{ width: "80px" }}
                        />
                      </td>
                      <td style={{ border: "1px solid white", padding: "8px" }}>
                        <button type="button" onClick={() => handleAceptar(p)}>
                          Aceptar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRechazar(p.id)}
                          style={{ marginLeft: "8px" }}
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        <br /><br />

        <button type="button" onClick={controlInventarioBodega}>
          Atrás (ver inventario)
        </button>

        <br /><br />

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
