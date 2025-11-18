import React from "react"

export default function Button({ name = "", id = "1", onClick = () => {} }) {
    return (
        <div>
            <button className={id} onClick={onClick}>{name}</button>
            <br /><br />
        </div>
    )

}