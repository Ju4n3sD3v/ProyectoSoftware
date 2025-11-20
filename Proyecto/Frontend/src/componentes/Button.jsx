import React from "react"

export default function Button({ name = "", id, onClick = () => {}, className = "btn-primary" }) {
    return (
        <div>
            <button id={id} className={className} onClick={onClick}>{name}</button>
            <br /><br />
        </div>
    )

}