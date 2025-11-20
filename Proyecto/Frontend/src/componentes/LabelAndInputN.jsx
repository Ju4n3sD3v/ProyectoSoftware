import React, { useState, useEffect } from "react"

export default function LabelAndInputN({ label = "", id = "1", value: propValue, onChange }) {
  const isControlled = typeof onChange === "function" && propValue !== undefined
  const [internalValue, setInternalValue] = useState(propValue ?? "")

  useEffect(() => {
    if (propValue !== undefined) setInternalValue(propValue)
  }, [propValue])

  const handleChange = (e) => {
    const newValue = e.target.value

    // permitir vacío o números >= 0
    if (newValue === "" || (!isNaN(newValue) && parseFloat(newValue) >= 0)) {
      if (isControlled) {
        // 👈 Enviamos SOLO el valor al padre
        onChange(newValue)
      } else {
        setInternalValue(newValue)
      }
    }
  }

  // Normalizar al perder foco: quitar ceros a la izquierda
  const handleBlur = () => {
    const current = isControlled ? propValue : internalValue
    if (current === "" || current === undefined) return

    const n = Number(current)
    if (isNaN(n)) {
      // si no es un número válido, limpiar
      if (isControlled) onChange("")
      else setInternalValue("")
      return
    }

    // String(Number(...)) elimina ceros a la izquierda y normaliza formatos
    const normalized = String(n)
    if (isControlled) onChange(normalized)
    else setInternalValue(normalized)
  }

  return (
    <div className="divc">
      <br />
      <label className={label}>{label}: </label>
      <input
        type="number"
        id={id}
        value={isControlled ? propValue : internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        min={1}
        placeholder="0"   
      />
      <br /><br />
    </div>
  )
}
