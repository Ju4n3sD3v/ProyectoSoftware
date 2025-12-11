import { useState, useEffect } from 'react';

export default function estadoMaquinas({ volverAlInicio }){
  const [maquinas, setMaquinas] = useState([]);
  const [localSeleccionado, setLocalSeleccionado] = useState("");
  const [maquinasEnEspera, setMaquinasEnEspera] = useState([]);
  const [maquinasProximas, setMaquinasProximas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [maquinaSeleccionadaMantenimiento, setMaquinaSeleccionadaMantenimiento] = useState(null);
  const [historialMantenimiento, setHistorialMantenimiento] = useState([]);
  const [maquinaSeleccionadaRevision, setMaquinaSeleccionadaRevision] = useState(null);
  const [revisionesAgendadas, setRevisionesAgendadas] = useState([]);
  const [formMantenimiento, setFormMantenimiento] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    tecnicoResponsable: "",
    tipoMantenimiento: "preventivo",
    descripcion: ""
  });
  const [formRevision, setFormRevision] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    descripcion: ""
  });

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

      // Máquinas con alerta (faltan 10 días o menos)
      const proximas = dataMaquinas.filter(m => m.alertaRevision);
      setMaquinasProximas(proximas);
      
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
  const abrirFormularioRevision = async (maquina) => {
    setMaquinaSeleccionadaRevision(maquina);
    
    // Cargar revisiones agendadas de la máquina
    try {
      const resp = await fetch(`http://localhost:4000/api/maquinas/${maquina.id}/revisiones-agendadas`);
      if (resp.ok) {
        const data = await resp.json();
        setRevisionesAgendadas(data.revisiones);
      }
    } catch (err) {
      console.error("Error al cargar revisiones agendadas:", err);
    }
  };

  // Función para registrar revisión agendada
  const registrarRevisionAgendada = async (e) => {
    e.preventDefault();
    
    try {
      const resp = await fetch(
        `http://localhost:4000/api/maquinas/${maquinaSeleccionadaRevision.id}/agendar-revision`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formRevision)
        }
      );
      
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.mensaje || "Error al agendar revisión");
      }
      
      alert("Revisión agendada exitosamente para " + formRevision.fecha + " a las " + formRevision.hora);
      cerrarFormularioRevision();
      cargarMaquinas(); // Recargar datos
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const cerrarFormularioRevision = () => {
    setMaquinaSeleccionadaRevision(null);
    setFormRevision({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      descripcion: ""
    });
  };

  // Función para abrir formulario de mantenimiento
  const abrirFormularioMantenimiento = async (maquina) => {
    setMaquinaSeleccionadaMantenimiento(maquina);
    
    // Cargar historial de la máquina
    try {
      const resp = await fetch(`http://localhost:4000/api/maquinas/${maquina.id}/historial-mantenimiento`);
      if (resp.ok) {
        const data = await resp.json();
        setHistorialMantenimiento(data.mantenimientos);
      }
    } catch (err) {
      console.error("Error al cargar historial:", err);
    }
  };

  // Función para registrar mantenimiento
  const registrarMantenimiento = async (e) => {
    e.preventDefault();
    
    if (!formMantenimiento.tecnicoResponsable.trim()) {
      alert("Por favor ingresa el nombre del técnico responsable");
      return;
    }
    
    try {
      const resp = await fetch(
        `http://localhost:4000/api/maquinas/${maquinaSeleccionadaMantenimiento.id}/registrar-mantenimiento`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formMantenimiento)
        }
      );
      
      if (!resp.ok) {
        const error = await resp.json();
        throw new Error(error.mensaje || "Error al registrar mantenimiento");
      }
      
      alert("Mantenimiento registrado exitosamente");
      setMaquinaSeleccionadaMantenimiento(null);
      setFormMantenimiento({
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().slice(0, 5),
        tecnicoResponsable: "",
        tipoMantenimiento: "preventivo",
        descripcion: ""
      });
      cargarMaquinas(); // Recargar datos
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const cerrarFormularioMantenimiento = () => {
    setMaquinaSeleccionadaMantenimiento(null);
    setFormMantenimiento({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      tecnicoResponsable: "",
      tipoMantenimiento: "preventivo",
      descripcion: ""
    });
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

  // Si hay un formulario de revisión abierto, mostrar modal
  if (maquinaSeleccionadaRevision) {
    return (
      <div style={styles.container}>
        <div style={styles.modal}>
          <div style={styles.modalContenido}>
            <h2>Agendar Revisión</h2>
            <p style={{ marginBottom: "15px", fontSize: "14px" }}>
              <strong>{maquinaSeleccionadaRevision.local} - Máquina {maquinaSeleccionadaRevision.numero}</strong>
            </p>

            <form onSubmit={registrarRevisionAgendada} style={styles.formulario}>
              <div style={styles.grupo}>
                <label>Fecha de Revisión:</label>
                <input 
                  type="date" 
                  value={formRevision.fecha}
                  onChange={(e) => setFormRevision({ ...formRevision, fecha: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grupo}>
                <label>Hora de Revisión:</label>
                <input 
                  type="time" 
                  value={formRevision.hora}
                  onChange={(e) => setFormRevision({ ...formRevision, hora: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grupo}>
                <label>Descripción (opcional):</label>
                <textarea 
                  placeholder="Motivo de la revisión o notas adicionales"
                  value={formRevision.descripcion}
                  onChange={(e) => setFormRevision({ ...formRevision, descripcion: e.target.value })}
                  style={{ ...styles.input, minHeight: "80px", fontFamily: "Arial" }}
                />
              </div>

              <div style={styles.botones}>
                <button type="submit" style={styles.botonConfirmar}>
                  Agendar Revisión
                </button>
                <button type="button" onClick={cerrarFormularioRevision} style={styles.botonCancelar}>
                  Cancelar
                </button>
              </div>
            </form>

            {revisionesAgendadas.length > 0 && (
              <div style={styles.seccionHistorial}>
                <h3>Revisiones Agendadas</h3>
                <div style={styles.tablaHistorial}>
                  {revisionesAgendadas.map(rev => (
                    <div key={rev.id} style={styles.filaHistorial}>
                      <div style={styles.celda}><strong>{rev.fechaAgendada} {rev.horaAgendada}</strong></div>
                      <div style={styles.celda}>{rev.estado}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Si hay un formulario de mantenimiento abierto, mostrar modal
  if (maquinaSeleccionadaMantenimiento) {
    return (
      <div style={styles.container}>
        <div style={styles.modal}>
          <div style={styles.modalContenido}>
            <h2>Registrar Mantenimiento</h2>
            <p style={{ marginBottom: "15px", fontSize: "14px" }}>
              <strong>{maquinaSeleccionadaMantenimiento.local} - Máquina {maquinaSeleccionadaMantenimiento.numero}</strong>
            </p>

            <form onSubmit={registrarMantenimiento} style={styles.formulario}>
              <div style={styles.grupo}>
                <label>Fecha:</label>
                <input 
                  type="date" 
                  value={formMantenimiento.fecha}
                  onChange={(e) => setFormMantenimiento({ ...formMantenimiento, fecha: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grupo}>
                <label>Hora:</label>
                <input 
                  type="time" 
                  value={formMantenimiento.hora}
                  onChange={(e) => setFormMantenimiento({ ...formMantenimiento, hora: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grupo}>
                <label>Técnico Responsable:</label>
                <input 
                  type="text" 
                  placeholder="Nombre del técnico"
                  value={formMantenimiento.tecnicoResponsable}
                  onChange={(e) => setFormMantenimiento({ ...formMantenimiento, tecnicoResponsable: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.grupo}>
                <label>Tipo de Mantenimiento:</label>
                <select 
                  value={formMantenimiento.tipoMantenimiento}
                  onChange={(e) => setFormMantenimiento({ ...formMantenimiento, tipoMantenimiento: e.target.value })}
                  style={styles.input}
                >
                  <option value="preventivo">Preventivo</option>
                  <option value="correctivo">Correctivo</option>
                </select>
              </div>

              <div style={styles.grupo}>
                <label>Descripción (opcional):</label>
                <textarea 
                  placeholder="Detalle del mantenimiento realizado"
                  value={formMantenimiento.descripcion}
                  onChange={(e) => setFormMantenimiento({ ...formMantenimiento, descripcion: e.target.value })}
                  style={{ ...styles.input, minHeight: "80px", fontFamily: "Arial" }}
                />
              </div>

              <div style={styles.botones}>
                <button type="submit" style={styles.botonConfirmar}>
                  Guardar Mantenimiento
                </button>
                <button type="button" onClick={cerrarFormularioMantenimiento} style={styles.botonCancelar}>
                  Cancelar
                </button>
              </div>
            </form>

            {historialMantenimiento.length > 0 && (
              <div style={styles.seccionHistorial}>
                <h3>Historial de Mantenimientos</h3>
                <div style={styles.tablaHistorial}>
                  {historialMantenimiento.map(mant => (
                    <div key={mant.id} style={styles.filaHistorial}>
                      <div style={styles.celda}><strong>{mant.fecha} {mant.hora}</strong></div>
                      <div style={styles.celda}>{mant.tipoMantenimiento}</div>
                      <div style={styles.celda}>{mant.tecnicoResponsable}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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

      {/* Sección de revisiones próximas (<=10 días) */}
      {maquinasProximas.length > 0 && (
        <div style={styles.seccionProxima}>
          <h2 style={{ color: "#b8860b" }}>⏳ Revisiones próximas (≤ 10 días)</h2>
          <ul style={styles.listaAlerta}>
            {maquinasProximas.map(m => (
              <li key={m.id} style={{ ...styles.itemAlerta, color: "#b8860b" }}>
                {m.local} - Máquina {m.numero} · Faltan {m.diasParaRevision} días (próxima: {m.fechaProximaRevision})
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
                {m.fechaProximaRevision && (
                  <p><small>Próxima revisión: {m.fechaProximaRevision}</small></p>
                )}
                {typeof m.diasParaRevision === "number" && m.diasParaRevision > 0 && (
                  <p style={{ color: "#b8860b", marginTop: "4px" }}>
                    Faltan {m.diasParaRevision} días para revisión
                  </p>
                )}
                
                {(m.estado === "En espera para revisión" || m.estado === "Fuera de servicio") && (
                  <button 
                    onClick={() => abrirFormularioRevision(m)}
                    style={styles.botonAgendar}
                  >
                    Agendar revisión
                  </button>
                )}

                <button 
                  onClick={() => abrirFormularioMantenimiento(m)}
                  style={styles.botonMantenimiento}
                >
                  Registrar Mantenimiento
                </button>
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
  seccionProxima: {
    backgroundColor: "#fff7e6",
    border: "2px solid #b8860b",
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
  },
  botonMantenimiento: {
    marginTop: "10px",
    padding: "10px 15px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginLeft: "5px"
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modalContenido: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "8px",
    maxWidth: "600px",
    width: "90%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
  },
  formulario: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  grupo: {
    display: "flex",
    flexDirection: "column"
  },
  input: {
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginTop: "5px"
  },
  botones: {
    display: "flex",
    gap: "10px",
    marginTop: "15px"
  },
  botonConfirmar: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  botonCancelar: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  },
  seccionHistorial: {
    marginTop: "25px",
    paddingTop: "15px",
    borderTop: "1px solid #ddd"
  },
  tablaHistorial: {
    marginTop: "10px"
  },
  filaHistorial: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "13px"
  },
  celda: {
    padding: "5px 0"
  }
}
