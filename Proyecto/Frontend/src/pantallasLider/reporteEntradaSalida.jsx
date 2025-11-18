import { useEffect, useState } from "react";

export default function ReporteEntradaSalida({ volverAlInicio, volverLoginLider }) {
  const [movimientos, setMovimientos] = useState([]);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada"); // "entrada" o "salida"
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    productoId: "",
    productoNombre: "",
    local: "Local 1", // Por defecto, se puede cambiar según el líder
    cantidad: "",
    observaciones: ""
  });

  // Obtener fecha actual en formato YYYY-MM-DD
  const fechaActual = new Date().toISOString().split('T')[0];

  // Cargar movimientos del día al montar el componente y cuando cambie el local
  useEffect(() => {
    const cargarDatos = async () => {
      const local = formData.local;
      try {
        setCargando(true);
        
        // Cargar movimientos
        const respuestaMovimientos = await fetch(
          `http://localhost:4000/movimientos/fecha/${fechaActual}?local=${encodeURIComponent(local)}`
        );
        const dataMovimientos = await respuestaMovimientos.json();

        if (dataMovimientos.ok) {
          setMovimientos(dataMovimientos.data || []);
        } else {
          setError(dataMovimientos.error || "Error al obtener movimientos.");
        }

        // Cargar reporte
        const respuestaReporte = await fetch(
          `http://localhost:4000/movimientos/reporte/${encodeURIComponent(local)}/${fechaActual}`
        );
        const dataReporte = await respuestaReporte.json();

        if (dataReporte.ok) {
          setReporte(dataReporte.data);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [formData.local, fechaActual]);

  const cargarMovimientosDelDia = async () => {
    try {
      setCargando(true);
      const respuesta = await fetch(
        `http://localhost:4000/movimientos/fecha/${fechaActual}?local=${encodeURIComponent(formData.local)}`
      );
      const data = await respuesta.json();

      if (!data.ok) {
        throw new Error(data.error || "Error al obtener movimientos.");
      }

      setMovimientos(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const cargarReporteDelDia = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:4000/movimientos/reporte/${encodeURIComponent(formData.local)}/${fechaActual}`
      );
      const data = await respuesta.json();

      if (data.ok) {
        setReporte(data.data);
      }
    } catch (err) {
      console.error("Error al cargar reporte:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // El useEffect se encargará de recargar cuando cambie formData.local
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.productoNombre || !formData.cantidad || parseFloat(formData.cantidad) <= 0) {
      setError("Por favor complete todos los campos requeridos y asegúrese de que la cantidad sea mayor a 0.");
      return;
    }

    try {
      setCargando(true);
      const endpoint = tipoMovimiento === "entrada" 
        ? "http://localhost:4000/movimientos/entrada"
        : "http://localhost:4000/movimientos/salida";

      const respuesta = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productoId: formData.productoId || Date.now(), // ID temporal si no se proporciona
          productoNombre: formData.productoNombre,
          local: formData.local,
          cantidad: parseInt(formData.cantidad),
          observaciones: formData.observaciones
        })
      });

      const data = await respuesta.json();

      if (!data.ok) {
        throw new Error(data.error || "Error al registrar el movimiento.");
      }

      // Limpiar formulario
      setFormData({
        productoId: "",
        productoNombre: "",
        local: formData.local,
        cantidad: "",
        observaciones: ""
      });
      setMostrarFormulario(false);

      // Recargar movimientos y reporte
      await cargarMovimientosDelDia();
      await cargarReporteDelDia();

      alert(`¡${tipoMovimiento === "entrada" ? "Entrada" : "Salida"} registrada exitosamente!`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const exportarPDF = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:4000/movimientos/exportar/pdf/${encodeURIComponent(formData.local)}/${fechaActual}`
      );

      if (!respuesta.ok) {
        throw new Error("Error al generar el PDF");
      }

      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_${formData.local}_${fechaActual}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setError("Error al exportar el PDF: " + err.message);
    }
  };

  const exportarExcel = async () => {
    try {
      const respuesta = await fetch(
        `http://localhost:4000/movimientos/exportar/excel/${encodeURIComponent(formData.local)}/${fechaActual}`
      );

      if (!respuesta.ok) {
        throw new Error("Error al generar el Excel");
      }

      const blob = await respuesta.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte_${formData.local}_${fechaActual}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      setError("Error al exportar el Excel: " + err.message);
    }
  };

  return (
    <>
      <div>
        <h1>Reporte de Entrada/Salida</h1>
        <label>
          Registre los movimientos de inventario (entradas y salidas) y genere reportes diarios.
        </label>

        <br /><br />

        <div>
          <label>Local: </label>
          <select
            name="local"
            value={formData.local}
            onChange={handleInputChange}
            disabled={cargando}
          >
            <option value="Local 1">Local 1</option>
            <option value="Local 2">Local 2</option>
          </select>
          <span> | Fecha: {fechaActual}</span>
        </div>

        <br /><br />

        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* Botones para mostrar formulario */}
        {!mostrarFormulario && (
          <>
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento("entrada");
                setMostrarFormulario(true);
              }}
              disabled={cargando}
            >
              Registrar Entrada
            </button>
            <br /><br />
            <button
              type="button"
              onClick={() => {
                setTipoMovimiento("salida");
                setMostrarFormulario(true);
              }}
              disabled={cargando}
            >
              Registrar Salida
            </button>
            <br /><br />
          </>
        )}

        {/* Formulario para registrar movimiento */}
        {mostrarFormulario && (
          <div style={{ border: "1px solid white", padding: "15px", margin: "15px 0" }}>
            <h3>Registrar {tipoMovimiento === "entrada" ? "Entrada" : "Salida"}</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nombre del Producto: *</label>
                <input
                  type="text"
                  name="productoNombre"
                  value={formData.productoNombre}
                  onChange={handleInputChange}
                  required
                  disabled={cargando}
                  placeholder="Ej: Bolsas de alitas"
                />
              </div>
              <br />
              <div>
                <label>ID del Producto (opcional):</label>
                <input
                  type="number"
                  name="productoId"
                  value={formData.productoId}
                  onChange={handleInputChange}
                  disabled={cargando}
                  placeholder="ID del producto"
                />
              </div>
              <br />
              <div>
                <label>Cantidad: *</label>
                <input
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  required
                  min="1"
                  disabled={cargando}
                  placeholder="Cantidad"
                />
              </div>
              <br />
              <div>
                <label>Observaciones:</label>
                <textarea
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  disabled={cargando}
                  placeholder="Ej: Recepción de pedido desde bodega"
                  rows="3"
                  style={{ width: "300px" }}
                />
              </div>
              <br />
              <button type="submit" disabled={cargando}>
                {cargando ? "Registrando..." : "Registrar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setError(null);
                }}
                disabled={cargando}
              >
                Cancelar
              </button>
            </form>
          </div>
        )}

        <br /><br />

        {/* Reporte del día */}
        {reporte && (
          <div>
            <h2>Reporte del Día</h2>
            <div style={{ marginBottom: "15px" }}>
              <strong>Total Entradas:</strong> {reporte.totalEntradas} unidades
              <br />
              <strong>Total Salidas:</strong> {reporte.totalSalidas} unidades
              <br />
              <strong>Diferencia:</strong> {reporte.totalEntradas - reporte.totalSalidas} unidades
            </div>

            <button
              type="button"
              onClick={exportarPDF}
              disabled={cargando || reporte.movimientos.length === 0}
            >
              Exportar a PDF
            </button>
            <button
              type="button"
              onClick={exportarExcel}
              disabled={cargando || reporte.movimientos.length === 0}
              style={{ marginLeft: "10px" }}
            >
              Exportar a Excel
            </button>
          </div>
        )}

        <br /><br />

        {/* Lista de movimientos del día */}
        <h2>Movimientos del Día</h2>
        {cargando && movimientos.length === 0 && <p>Cargando movimientos...</p>}

        {!cargando && movimientos.length === 0 && (
          <p>No hay movimientos registrados para hoy.</p>
        )}

        {movimientos.length > 0 && (
          <table style={{ border: "1px solid white", borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid white", padding: "8px" }}>Tipo</th>
                <th style={{ border: "1px solid white", padding: "8px" }}>Producto</th>
                <th style={{ border: "1px solid white", padding: "8px" }}>Cantidad</th>
                <th style={{ border: "1px solid white", padding: "8px" }}>Hora</th>
                <th style={{ border: "1px solid white", padding: "8px" }}>Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((mov) => (
                <tr key={mov.id}>
                  <td style={{ border: "1px solid white", padding: "8px" }}>
                    {mov.tipo === "entrada" ? "⬆️ Entrada" : "⬇️ Salida"}
                  </td>
                  <td style={{ border: "1px solid white", padding: "8px" }}>{mov.productoNombre}</td>
                  <td style={{ border: "1px solid white", padding: "8px" }}>{mov.cantidad}</td>
                  <td style={{ border: "1px solid white", padding: "8px" }}>{mov.hora}</td>
                  <td style={{ border: "1px solid white", padding: "8px" }}>{mov.observaciones || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <br /><br />

        <button type="button" onClick={volverLoginLider}>
          Volver al menú del líder
        </button>

        <br /><br />

        <button type="button" onClick={volverAlInicio}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}

