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

  return (
    <div>
      <br />
      <label className={label}>{label}: </label>
      <input
        type="number"
        id={id}
        value={isControlled ? propValue : internalValue}
        onChange={handleChange}
        min="0"
        placeholder="0"   // 👈 se ve el 0 pero no está escrito como valor
      />
      <br /><br />
    </div>
  )
}
