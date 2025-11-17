export default function LoginJefe({volverAlInicio, controlInventarioBodega}) {
    return(
        <>
            <div>
                <h1>¿Qué desea hacer?</h1>
                <br /> 
                
                <button type="button" onClick ={controlInventarioBodega}>
                Control de inventario en bodega
                </button>

                <br /><br /> 

                <button>
                Análisis de inventario
                </button>

                <br /><br />

                <button type="button" onClick={volverAlInicio}>
                Volver al inicio
                </button>       
            </div>
        </>
    )
}