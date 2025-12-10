import { useState, useEffect } from 'react';

export default function estadoMaquinas({ volverAlInicio }){
  const [maquinas, setMaquinas] = useState([]);
  const [localSeleccionado, setLocalSeleccionado] = useState("");
  const [maquinasEnEspera, setMaquinasEnEspera] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cargar datos de máquinas al montar el componente
  useEffect(() => {
    cargarMaquinas();
  }, []);

  const cargarMaquinas = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Obtener todas las máquinas
      const respMaquinas = await fetch("http://localhost:4000/api/maquinas");
      if (!respMaquinas.ok) throw new Error("Error al cargar máquinas");
      const dataMaquinas = await respMaquinas.json();
      setMaquinas(dataMaquinas);
      
      // Obtener máquinas en espera
      const respEspera = await fetch("http://localhost:4000/api/maquinas/espera/todas");
      if (respEspera.ok) {
        const dataEspera = await respEspera.json();
        setMaquinasEnEspera(dataEspera);
      }
    } catch (err) {
      setError("Error al cargar los datos de máquinas: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener máquinas del local seleccionado
  const maquinasLocal = localSeleccionado 
    ? maquinas.filter(m => m.local === localSeleccionado)
    : [];

  // Función para obtener color según estado
  const obtenerColorEstado = (estado) => {
    switch(estado) {
      case "Operativa":
        return "#28a745"; // Verde
      case "En espera para revisión":
        return "#dc3545"; // Rojo
      case "En mantenimiento":
        return "#ffc107"; // Amarillo
      case "Fuera de servicio":
        return "#dc3545"; // Rojo
      default:
        return "#000000";
    }
  };

  // Función para agendar revisión
  const agendarRevision = async (maquinaId) => {
    try {
      const resp = await fetch(`http://localhost:4000/api/maquinas/${maquinaId}/agendar-revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (!resp.ok) throw new Error("Error al agendar revisión");
      
      const resultado = await resp.json();
      alert("Revisión agendada exitosamente");
      cargarMaquinas(); // Recargar datos
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const localesDisponibles = [...new Set(maquinas.map(m => m.local))];

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>Estado de Máquinas</h1>
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h1>Estado de Máquinas</h1>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={cargarMaquinas} style={styles.botonVolver}>
          Reintentar
        </button>
        <button onClick={volverAlInicio} style={styles.botonVolver}>
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1>Estado de Máquinas</h1>
      
      {/* Sección de máquinas en espera para revisión */}
      {maquinasEnEspera.length > 0 && (
        <div style={styles.seccionAlerta}>
          <h2 style={{ color: "#dc3545" }}>⚠️ Máquinas en espera para revisión</h2>
          <ul style={styles.listaAlerta}>
            {maquinasEnEspera.map(m => (
              <li key={m.id} style={styles.itemAlerta}>
                {m.local} - Máquina {m.numero}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Selector de local */}
      <div style={styles.selectorLocal}>
        <label htmlFor="local" style={styles.label}>Seleccionar Local:</label>
        <select 
          id="local"
          value={localSeleccionado}
          onChange={(e) => setLocalSeleccionado(e.target.value)}
          style={styles.select}
        >
          <option value="">-- Selecciona un local --</option>
          {localesDisponibles.map(local => (
            <option key={local} value={local}>{local}</option>
          ))}
        </select>
      </div>

      {/* Listado de máquinas del local seleccionado */}
      {localSeleccionado && (
        <div style={styles.listaMaquinas}>
          <h3>{localSeleccionado}</h3>
          <div style={styles.gridMaquinas}>
            {maquinasLocal.map(m => (
              <div key={m.id} style={styles.tarjetaMaquina}>
                <h4>Máquina {m.numero}</h4>
                <p style={{ color: obtenerColorEstado(m.estado), fontSize: "18px", fontWeight: "bold" }}>
                  {m.estado}
                </p>
                <p><small>Última revisión: {m.ultimaRevision}</small></p>
                
                {(m.estado === "En espera para revisión" || m.estado === "Fuera de servicio") && (
                  <button 
                    onClick={() => agendarRevision(m.id)}
                    style={styles.botonAgendar}
                  >
                    Agendar revisión
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={volverAlInicio} style={styles.botonVolver}>
        Volver al Inicio
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif"
  },
  seccionAlerta: {
    backgroundColor: "#fff3cd",
    border: "2px solid #dc3545",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  listaAlerta: {
    listStyle: "none",
    padding: "10px 0",
    margin: "0"
  },
  itemAlerta: {
    padding: "8px",
    color: "#dc3545",
    fontWeight: "bold"
  },
  selectorLocal: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold"
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc"
  },
  listaMaquinas: {
    marginTop: "20px"
  },
  gridMaquinas: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "15px",
    marginTop: "15px"
  },
  tarjetaMaquina: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  botonAgendar: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },
  botonVolver: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  }
}