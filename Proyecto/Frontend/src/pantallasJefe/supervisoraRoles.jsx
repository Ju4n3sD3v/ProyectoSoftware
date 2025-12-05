import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

export default function SupervisoraRoles({ volverAlInicio }) {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("");

  const [nuevoUsuarioNombre, setNuevoUsuarioNombre] = useState("");
  const [nuevoUsuarioRol, setNuevoUsuarioRol] = useState("");
  const [nuevoUsuarioUser, setNuevoUsuarioUser] = useState("");
  const [nuevoUsuarioPass, setNuevoUsuarioPass] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const [resRoles, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/api/roles`),
        fetch(`${API_URL}/api/usuarios`)
      ]);

      const dataRoles = await resRoles.json();
      const dataUsuarios = await resUsuarios.json();

      setRoles(dataRoles.data || []);
      setUsuarios(dataUsuarios.data || []);
    } catch (err) {
      console.error("Error cargando datos de supervisora:", err);
      setError("Error al cargar roles o usuarios");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const normalizarRol = (rol) =>
    (rol || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const limites = {
    jefe: 2,
    supervisora: 2,
    lider: 1,
  };

  const contarRoles = () => {
    const cuenta = {};
    usuarios.forEach((u) => {
      const key = normalizarRol(u.rol);
      cuenta[key] = (cuenta[key] || 0) + 1;
    });
    return cuenta;
  };

  const puedeAsignar = (rolDestino, usuarioId = null) => {
    const cuenta = contarRoles();
    const key = normalizarRol(rolDestino);
    const limite = limites[key];
    if (!limite) return true; // sin límite (empleadas u otros)

    const usuarioActual = usuarios.find((u) => u.id === usuarioId);
    const rolActualKey = usuarioActual ? normalizarRol(usuarioActual.rol) : null;
    const yaCuenta = cuenta[key] || 0;

    // si ya tenía ese rol, no afecta
    if (rolActualKey === key) return true;

    return yaCuenta < limite;
  };

  const manejarCrearUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!nuevoUsuarioNombre.trim()) {
      setError("Debes ingresar un nombre");
      return;
    }

    if (!nuevoUsuarioUser.trim()) {
      setError("Debes ingresar un usuario");
      return;
    }

    if (!nuevoUsuarioPass.trim()) {
      setError("Debes ingresar una contraseña");
      return;
    }

    const rolDestino = nuevoUsuarioRol || "Empleada";
    if (!puedeAsignar(rolDestino, null)) {
      setError(`Límite alcanzado para el rol ${rolDestino}`);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoUsuarioNombre,
          rol: rolDestino,
          usuario: nuevoUsuarioUser,
          contrasena: nuevoUsuarioPass
        })
      });

      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo crear el usuario");
        return;
      }

      setMensaje("Usuario creado correctamente");
      setNuevoUsuarioNombre("");
      setNuevoUsuarioRol("");
      setNuevoUsuarioUser("");
      setNuevoUsuarioPass("");
      await cargarDatos();
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError("Error al crear el usuario");
    }
  };

  const manejarAsignarRol = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const idUsuario = Number(usuarioSeleccionado);
    if (!idUsuario || !rolSeleccionado) {
      setError("Debes seleccionar un usuario y un rol");
      return;
    }

    if (!puedeAsignar(rolSeleccionado, idUsuario)) {
      setError(`Límite alcanzado para el rol ${rolSeleccionado}`);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/usuarios/${idUsuario}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: rolSeleccionado })
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo asignar el rol");
        return;
      }

      setMensaje("Rol asignado correctamente");
      await cargarDatos();
    } catch (err) {
      console.error("Error al asignar rol:", err);
      setError("Error al asignar el rol");
    }
  };

  const manejarEliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    setMensaje("");
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: "DELETE"
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo eliminar el usuario");
        return;
      }

      setMensaje("Usuario eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError("Error al eliminar el usuario");
    }
  };

  return (
    <div className="page">
      <div className="card-surface">
        <div className="page-header">
          <div>
            <h1>Gestión de roles y usuarios</h1>
            <p className="muted">Registra usuarios con roles disponibles y controla asignaciones.</p>
          </div>
          <button className="btn ghost" type="button" onClick={volverAlInicio}>
            Cerrar sesión
          </button>
        </div>

        {mensaje && <p className="alert">{mensaje}</p>}
        {error && <p className="alert error">{error}</p>}

        <div className="dashboard-grid">
          <div className="panel">
            <h3>Registrar usuario</h3>
            <form className="form-grid" onSubmit={manejarCrearUsuario}>
              <label className="field">
                <span>Nombre</span>
                <input
                  type="text"
                  value={nuevoUsuarioNombre}
                  onChange={(e) => setNuevoUsuarioNombre(e.target.value)}
                  required
                  placeholder="Nombre completo"
                />
              </label>
              <label className="field">
                <span>Usuario</span>
                <input
                  type="text"
                  value={nuevoUsuarioUser}
                  onChange={(e) => setNuevoUsuarioUser(e.target.value)}
                  required
                  placeholder="usuario123"
                />
              </label>
              <label className="field">
                <span>Contraseña</span>
                <input
                  type="password"
                  value={nuevoUsuarioPass}
                  onChange={(e) => setNuevoUsuarioPass(e.target.value)}
                  required
                  placeholder="••••••"
                />
              </label>
              <label className="field">
                <span>Rol</span>
                <select
                  value={nuevoUsuarioRol}
                  onChange={(e) => setNuevoUsuarioRol(e.target.value)}
                  required
                >
                  <option value="">Selecciona un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.nombre}>{rol.nombre}</option>
                  ))}
                </select>
              </label>
              <p className="muted">
                Límite: 2 Jefes, 2 Supervisoras, 1 Líder, Empleadas sin límite.
              </p>
              <div className="actions">
                <button className="btn" type="submit">Crear usuario</button>
              </div>
            </form>

            <h4>Roles disponibles</h4>
            <div className="table-scroll" style={{ maxHeight: 220 }}>
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th>Permisos</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((rol) => (
                    <tr key={rol.id}>
                      <td>{rol.nombre}</td>
                      <td>{Array.isArray(rol.permisos) && rol.permisos.length > 0 ? rol.permisos.join(", ") : "Sin permisos"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel">
            <h3>Asignar rol</h3>
            <form className="form-grid" onSubmit={manejarAsignarRol}>
              <label className="field">
                <span>Empleado</span>
                <select
                  value={usuarioSeleccionado}
                  onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona un usuario --</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} (rol actual: {u.rol || "Sin rol"})
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Rol</span>
                <select
                  value={rolSeleccionado}
                  onChange={(e) => setRolSeleccionado(e.target.value)}
                  required
                >
                  <option value="">-- Selecciona un rol --</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.nombre}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted">
                Se aplican los mismos límites: 2 Jefes, 2 Supervisoras, 1 Líder.
              </p>
              <div className="actions">
                <button className="btn secondary" type="submit">Asignar rol</button>
              </div>
            </form>
          </div>
        </div>

        <div className="panel" style={{ marginTop: "14px" }}>
          <div className="panel-head">
            <h3>Usuarios actuales</h3>
          </div>
          <div className="table-scroll" style={{ maxHeight: 280 }}>
            <table className="data-table compact">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.rol || "Sin rol"}</td>
                    <td>
                      <button className="btn ghost" type="button" onClick={() => manejarEliminarUsuario(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
