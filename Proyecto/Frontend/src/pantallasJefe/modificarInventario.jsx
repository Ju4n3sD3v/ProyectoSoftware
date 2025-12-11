import { useEffect, useState } from "react";

export default function ModificarInventarioJefe({ volverAlInicio, controlInventarioBodega }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [valoresEditados, setValoresEditados] = useState({});
  const [orden, setOrden] = useState("stock-desc"); // stock-desc | stock-asc | fecha-desc | fecha-asc

  const cargarProductos = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch("http://localhost:4000/productos/bodega");
      const data = await respuesta.json();

      if (!data.ok) {
        throw new Error(data.error || "Error al obtener productos de la bodega.");
      }

      const lista = Array.isArray(data.data) ? data.data : [];
      // Normalizar stocks como numero para mostrar los valores reales almacenados
      setProductos(lista.map((p) => ({ ...p, stock: Number(p.stock ?? 0) })));
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleChangeStock = (idProducto, valor) => {
    if (valor === "" || parseInt(valor, 10) >= 0) {
      setValoresEditados((prev) => ({
        ...prev,
        [idProducto]: valor,
      }));
    }
  };

  const handleAceptar = async (producto) => {
    const valorInput = valoresEditados[producto.id];

    const nuevoStock =
      valorInput === undefined || valorInput === "" ? producto.stock : parseInt(valorInput, 10);

    if (Number.isNaN(nuevoStock) || nuevoStock < 0) {
      alert("El stock debe ser un numero mayor o igual a 0.");
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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: nuevoStock }),
      });

      const data = await respuesta.json();

      if (!data.ok) {
        alert("Error al actualizar el producto: " + (data.error || "Error desconocido."));
        return;
      }

      const productoActualizado = data.data;

      // Recargar lista desde backend para reflejar el valor real guardado
      await cargarProductos();

      setValoresEditados((prev) => ({
        ...prev,
        [producto.id]: "",
      }));

      alert(`Inventario actualizado correctamente para ${productoActualizado.nombre}`);
    } catch (err) {
      console.error(err);
      alert("Error de conexion con el servidor: " + err.message);
    }
  };

  const handleRechazar = (idProducto) => {
    setValoresEditados((prev) => ({
      ...prev,
      [idProducto]: "",
    }));
    alert("No se realizaron cambios en el inventario para este producto.");
  };

  return (
    <div className="page">
      <div className="card-surface">
        <div className="page-header">
          <div>
            <h1>Modificar inventario de bodega</h1>
            <p className="muted">Ajusta stocks con filtros y ordenamientos.</p>
          </div>
          <div className="actions">
            <button className="btn ghost" type="button" onClick={controlInventarioBodega}>
              Volver
            </button>
            <button className="btn ghost" type="button" onClick={volverAlInicio}>
              Cerrar sesion
            </button>
          </div>
        </div>

        <div className="actions" style={{ marginBottom: "10px" }}>
          <label className="field" style={{ maxWidth: 260 }}>
            <span>Ordenar por</span>
            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="stock-desc">Stock: mayor a menor</option>
              <option value="stock-asc">Stock: menor a mayor</option>
              <option value="fecha-desc">Fecha: mas reciente</option>
              <option value="fecha-asc">Fecha: mas antigua</option>
            </select>
          </label>
        </div>

        {cargando && <p className="muted">Cargando productos...</p>}

        {error && <p className="alert error">Ocurrio un error: {error}</p>}

        {!cargando && !error && (
          <>
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
                      <th>Stock actual</th>
                      <th>Ultima actualizacion</th>
                      <th>Nuevo stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos
                      .slice()
                      .sort((a, b) => {
                        if (orden === "stock-desc") return Number(b.stock || 0) - Number(a.stock || 0);
                        if (orden === "stock-asc") return Number(a.stock || 0) - Number(b.stock || 0);
                        if (orden === "fecha-desc") return new Date(b.actualizadoEn) - new Date(a.actualizadoEn);
                        if (orden === "fecha-asc") return new Date(a.actualizadoEn) - new Date(b.actualizadoEn);
                        return 0;
                      })
                      .map((p) => {
                        const stockActual = Number(p.stock ?? 0);
                        const inputValue =
                          valoresEditados[p.id] !== undefined ? valoresEditados[p.id] : stockActual;
                        return (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>{p.lugar}</td>
                            <td>{stockActual}</td>
                            <td>{p.actualizadoEn}</td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                value={inputValue}
                                onChange={(e) => handleChangeStock(p.id, e.target.value)}
                                style={{ width: "90px" }}
                              />
                            </td>
                            <td style={{ display: "flex", gap: "8px" }}>
                              <button className="btn" type="button" onClick={() => handleAceptar(p)}>
                                Aceptar
                              </button>
                              <button className="btn ghost" type="button" onClick={() => handleRechazar(p.id)}>
                                Rechazar
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
