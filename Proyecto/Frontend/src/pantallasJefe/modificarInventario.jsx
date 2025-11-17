export default function ModificarInventarioJefe({volverAlInicio, controlInventarioBodega}) {
    return(
        <>
            <div>
                <button type="button" onClick={controlInventarioBodega}>
                    Atras
                </button>

                <br/><br/>
                
                <button type="button" onClick={volverAlInicio}>
                Volver al inicio
                </button>       
            </div>
        </>
    )
}