import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

export default function SupervisoraRoles({ volverAlInicio }) {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [nuevoUsuarioNombre, setNuevoUsuarioNombre] = useState("");
  const [nuevoUsuarioUser, setNuevoUsuarioUser] = useState("");
  const [nuevoUsuarioPass, setNuevoUsuarioPass] = useState("");
  const [nuevoUsuarioRol, setNuevoUsuarioRol] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setError("");
      const [resRoles, resUsuarios] = await Promise.all([
        fetch(`${API_URL}/api/roles`),
        fetch(`${API_URL}/api/usuarios`),
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

  const normalizarRol = (rol) =>
    (rol || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

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
    if (!limite) return true; // sin limite (empleadas u otros)

    const usuarioActual = usuarios.find((u) => u.id === usuarioId);
    const rolActualKey = usuarioActual ? normalizarRol(usuarioActual.rol) : null;
    const yaCuenta = cuenta[key] || 0;
    if (rolActualKey === key) return true;

    return yaCuenta < limite;
  };

  const manejarCrearUsuario = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!nuevoUsuarioNombre.trim()) return setError("Debes ingresar un nombre");
    if (!nuevoUsuarioUser.trim()) return setError("Debes ingresar un usuario");
    if (!nuevoUsuarioPass.trim()) return setError("Debes ingresar una contrasena");

    const rolDestino = nuevoUsuarioRol || "Empleada";
    if (!puedeAsignar(rolDestino, null)) {
      setError(`Limite alcanzado para el rol ${rolDestino}`);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoUsuarioNombre,
          usuario: nuevoUsuarioUser,
          contrasena: nuevoUsuarioPass,
          rol: rolDestino,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo crear el usuario");
        return;
      }

      setMensaje("Usuario creado correctamente");
      setNuevoUsuarioNombre("");
      setNuevoUsuarioUser("");
      setNuevoUsuarioPass("");
      setNuevoUsuarioRol("");
      await cargarDatos();
    } catch (err) {
      console.error("Error al crear usuario:", err);
      setError("Error al crear el usuario");
    }
  };

  const manejarAsignarRol = async (idUsuario, nuevoRol) => {
    setMensaje("");
    setError("");

    if (!idUsuario || !nuevoRol) {
      setError("Debes seleccionar un rol valido");
      return;
    }

    if (!puedeAsignar(nuevoRol, idUsuario)) {
      setError(`Limite alcanzado para el rol ${nuevoRol}`);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/api/usuarios/${idUsuario}/rol`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rol: nuevoRol }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo asignar el rol");
        return;
      }

      setMensaje("Rol actualizado correctamente");
      await cargarDatos();
    } catch (err) {
      console.error("Error al asignar rol:", err);
      setError("Error al asignar el rol");
    }
  };

  const manejarEliminarUsuario = async (id) => {
    if (!window.confirm("Seguro que deseas eliminar este usuario?")) return;
    setMensaje("");
    setError("");
    try {
      const resp = await fetch(`${API_URL}/api/usuarios/${id}`, {
        method: "DELETE",
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

  const usernameFrom = (u) =>
    (u.usuario || u.nombre || "").toLowerCase().replace(/\s+/g, "");

  return (
    <div className="page">
      <div className="card-surface">
        <div className="page-header">
          <div>
            <h1>Hola, Supervisora</h1>
            <p className="muted">
              Registra usuarios, asigna roles con limites y administra la lista actual.
            </p>
          </div>
          <button className="btn ghost" type="button" onClick={volverAlInicio}>
            Cerrar sesion
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
                <span>Contrasena</span>
                <input
                  type="password"
                  value={nuevoUsuarioPass}
                  onChange={(e) => setNuevoUsuarioPass(e.target.value)}
                  required
                  placeholder="******"
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
                    <option key={rol.id} value={rol.nombre}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted">
                Limite: 2 Jefes, 2 Supervisoras, 1 Lider. Empleadas, Tecnicos y Despachadores sin limite.
              </p>
              <div className="actions">
                <button className="btn" type="submit">
                  Crear usuario
                </button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h3>Roles disponibles</h3>
            <div className="table-scroll" style={{ maxHeight: 320 }}>
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
                      <td>
                        {Array.isArray(rol.permisos) && rol.permisos.length > 0
                          ? rol.permisos.join(", ")
                          : "Sin permisos"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="panel" style={{ marginTop: "14px" }}>
          <div className="panel-head">
            <h3>Usuarios actuales</h3>
            <div className="actions">
              <label className="field" style={{ minWidth: 180 }}>
                <span>Filtrar por rol</span>
                <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                  <option value="todos">Todos</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.nombre}>
                      {rol.nombre}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="table-scroll" style={{ maxHeight: 320 }}>
            <table className="data-table compact">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios
                  .filter((u) => (filtroRol === "todos" ? true : u.rol === filtroRol))
                  .map((u) => (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{usernameFrom(u)}</td>
                      <td>{u.rol || "Sin rol"}</td>
                      <td style={{ display: "flex", gap: "8px" }}>
                        <select
                          value={u.rol || ""}
                          onChange={(e) => manejarAsignarRol(u.id, e.target.value)}
                          style={{ minWidth: 140 }}
                        >
                          <option value="">-- Rol --</option>
                          {roles.map((rol) => (
                            <option key={rol.id} value={rol.nombre}>
                              {rol.nombre}
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn ghost"
                          type="button"
                          onClick={() => manejarEliminarUsuario(u.id)}
                        >
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
