
export default function ControlInventarioBodega({volverAlInicio, volverLoginJefe}) {
    return(
        <>
            <div>
                <h1> Control de inventario en Bodega</h1>
                <label> Aca podra revisar las cantidades de los insumos los cuales se 
                    encuentra en este momento en el inventario

                </label>
                <br/><br/>

                <div>
                    <table style={{ border: "1px solid white", borderCollapse: "collapse" }}>
                        <tr>
                        <th style={{ border: "1px solid white", padding: "8px" }}>Producto</th>
                        <th style={{ border: "1px solid white", padding: "8px" }}>Cantidad</th>
                        </tr>

                        <tr>
                        <td style={{ border: "1px solid white", padding: "8px" }}>Vasos</td>
                        <td style={{ border: "1px solid white", padding: "8px" }}>120</td>
                        </tr>

                        <tr>
                        <td style={{ border: "1px solid white", padding: "8px" }}>Cocacola</td>
                        <td style={{ border: "1px solid white", padding: "8px" }}>120</td>
                        </tr>

                        <tr>
                        <td style={{ border: "1px solid white", padding: "8px" }}>Platos</td>
                        <td style={{ border: "1px solid white", padding: "8px" }}>120</td>
                        </tr>

                        <tr>
                        <td style={{ border: "1px solid white", padding: "8px" }}>Salsa</td>
                        <td style={{ border: "1px solid white", padding: "8px" }}>120</td>
                        </tr>
                    </table>
                    </div>

                <button
                    type="button"
                    onClick={volverLoginJefe}> 
                    Atras
                </button>
                <br/><br/>
                <button 
                    type="button" 
                    onClick={volverAlInicio}>
                    Volver al inicio
                </button>

            </div>
        </>
    )
}




