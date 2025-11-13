import React, { useState } from "react"

export default function LabelAndInputN({ label = "", id = "1" }) {
    const [value, setValue] = useState("0")

    const handleChange = (e) => {
        const newValue = e.target.value
        // Solo permitir números positivos (>= 0)
        if (newValue === "" || parseFloat(newValue) >= 0) {
            setValue(newValue)
        }
    }

    return (
        <div>
            <label className={label}>{label}: </label>
            <input 
                type="number" 
                name={label} 
                id={id} 
                required 
                value={value}
                onChange={handleChange}
                min="0"
            />
            {value && <h4 className="value-label">{label + ": "+ value}</h4>}
            <br />
        </div>
    )

}