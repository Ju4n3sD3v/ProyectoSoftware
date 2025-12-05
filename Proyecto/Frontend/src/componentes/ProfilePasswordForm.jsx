import { useState } from "react";

export default function ProfilePasswordForm({ usuario, onClose }) {
  const [anterior, setAnterior] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!anterior || !nueva || !confirmar) {
      setError("Completa todos los campos");
      return;
    }

    if (nueva !== confirmar) {
      setError("La nueva contraseña y la verificación no coinciden");
      return;
    }

    try {
      setCargando(true);
      const resp = await fetch(`http://localhost:4000/api/usuarios/${encodeURIComponent(usuario)}/contrasena`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ anterior, nueva }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.message || "No se pudo cambiar la contraseña");
        return;
      }
      setMensaje("Contraseña actualizada");
      setAnterior("");
      setNueva("");
      setConfirmar("");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError("Error de red al cambiar la contraseña");
    } finally {
      setCargando(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <label className="field">
        <span>Contraseña actual</span>
        <input
          type="password"
          value={anterior}
          onChange={(e) => setAnterior(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Nueva contraseña</span>
        <input
          type="password"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Verificar nueva contraseña</span>
        <input
          type="password"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
          required
        />
      </label>
      {error && <p className="alert error">{error}</p>}
      {mensaje && <p className="alert">{mensaje}</p>}
      <div className="actions">
        <button className="btn" type="submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}
