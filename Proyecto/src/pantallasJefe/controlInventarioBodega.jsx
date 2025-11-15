
export default function ControlInventarioBodega({volverAlInicio, volverLoginJefe}) {
    return(
        <>
            <div>
                <h1> Control de inventario en Bodega</h1>
                <label> Aca podra revisar las cantidades de los insumos los cuales se 
                    encuentra en este momento en el inventario

                </label>
                <br/><br/>
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




