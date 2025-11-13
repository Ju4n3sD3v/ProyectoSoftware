import React from "react"

export default function LabelAndInputN({ label = "", id = "1" }) {
    return (
        <div>
            <label className={label}>{label+": "}</label>
            <input type="number" name={label} id={id} key={id} required />
            <br /><br />
        </div>
    )

}