import { useEffect, useState } from "react";

const API_URL = "http://localhost:4000";

export default function SupervisoraRoles({ volverAlInicio }) {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const [nuevoRolNombre, setNuevoRolNombre] = useState("");
  const [nuevoRolPermisos, setNuevoRolPermisos] = useState("");

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [rolSeleccionado, setRolSeleccionado] = useState("");

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

  const manejarCrearRol = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const resp = await fetch(`${API_URL}/api/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nuevoRolNombre,
          permisosTexto: nuevoRolPermisos
        })
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo crear el rol");
        return;
      }

      setMensaje("Rol creado correctamente");
      setNuevoRolNombre("");
      setNuevoRolPermisos("");
      await cargarDatos();
    } catch (err) {
      console.error("Error al crear rol:", err);
      setError("Error al crear el rol");
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
    <div className="pantalla-supervisora">
      <h1>Gestión de roles y usuarios</h1>

      {mensaje && <p style={{ color: "green" }}>{mensaje}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* 1. Crear un rol con permisos */}
      <section>
        <h2>1. Crear un rol con permisos</h2>
        <p>
          La supervisora accede al módulo de administración de roles y registra un
          nuevo rol indicando qué permisos tendrá.
        </p>
        <form onSubmit={manejarCrearRol}>
          <div>
            <label>Nombre del rol:&nbsp;</label>
            <input
              type="text"
              value={nuevoRolNombre}
              onChange={(e) => setNuevoRolNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Permisos (separados por comas):&nbsp;</label>
            <input
              type="text"
              placeholder="Ej: crear pedidos, ver inventario, generar reportes"
              value={nuevoRolPermisos}
              onChange={(e) => setNuevoRolPermisos(e.target.value)}
            />
          </div>
          <br />
          <button type="submit">Crear rol</button>
        </form>

        <h3>Roles disponibles</h3>
        <ul>
          {roles.map((rol) => (
            <li key={rol.id}>
              <strong>{rol.nombre}</strong>{" "}
              {Array.isArray(rol.permisos) && rol.permisos.length > 0 && (
                <>- Permisos: {rol.permisos.join(", ")}</>
              )}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* 2. Asignar rol */}
      <section>
        <h2>2. Asignar rol a un empleado</h2>
        <p>
          La supervisora está en su pantalla y puede asignar un rol a un
          empleado.
        </p>
        <form onSubmit={manejarAsignarRol}>
          <div>
            <label>Empleado:&nbsp;</label>
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
          </div>
          <div>
            <label>Rol:&nbsp;</label>
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
          </div>
          <br />
          <button type="submit">Asignar rol</button>
        </form>
      </section>

      <hr />

      {/* 3. Eliminar usuario */}
      <section>
        <h2>3. Eliminar usuario</h2>
        <p>
          La jefe puede eliminar a algún empleado de su rol. El sistema actualiza
          la lista de usuarios activos.
        </p>

        <table border="1" cellPadding="4">
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
                  <button type="button" onClick={() => manejarEliminarUsuario(u.id)}>
                    Eliminar usuario
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <br />
      <button type="button" onClick={volverAlInicio}>
        Volver al inicio
      </button>
    </div>
  );
}
