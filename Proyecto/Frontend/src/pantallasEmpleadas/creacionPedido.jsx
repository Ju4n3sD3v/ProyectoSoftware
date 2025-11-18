import { useState } from 'react'
import LabelAndInputN from '../componentes/LabelAndInputN'
import Button from '../componentes/Button'
import { empresa_lolalitas } from '../data.js'

function CreacionPedido({ volverAlInicio }) {
  // Estado para guardar los valores de los inputs
  const [pedido, setPedido] = useState({})

  // Inicializar el objeto pedido con todos los productos
  if (Object.keys(pedido).length === 0) {
    const pedidoInicial = {}
    empresa_lolalitas.productos.forEach(producto => {
      pedidoInicial[producto.nombre] = "0"
    })
    setPedido(pedidoInicial)
  }

  // Función para manejar cambios en los inputs
  const handleInputChange = (nombreProducto, valor) => {
    setPedido({
      ...pedido,
      [nombreProducto]: valor
    })
  }

  // Función para recolectar y procesar el pedido
  const handleGenerarInforme = () => {
    // Filtrar solo los productos con cantidad > 0
    const pedidoFinal = {}
    
    Object.entries(pedido).forEach(([nombreProducto, cantidad]) => {
      if (cantidad !== "" && parseFloat(cantidad) > 0) {
        pedidoFinal[nombreProducto] = parseFloat(cantidad)
      }
    })

    console.log("Pedido generado:", pedidoFinal)
    
    // Aquí puedes hacer lo que necesites con los datos:
    // - Enviar al backend
    // - Guardar en estado global
    // - Mostrar en una pantalla de resumen
    alert(`Pedido generado con ${Object.keys(pedidoFinal).length} producto(s).\nVer en consola.`)
  }

  return (
    <>
      <div>
        <h1>Crear Pedido</h1>
        <fieldset>
          {empresa_lolalitas.productos.map((producto) => (
            <LabelAndInputN 
              key={producto.id}
              label={producto.nombre}
              id={`producto-${producto.id}`}
              value={pedido[producto.nombre] || "0"}
              onChange={(valor) => handleInputChange(producto.nombre, valor)}
            />
          ))}
          <Button 
            name='Generar informe'
            id='btn-generar'
            onClick={handleGenerarInforme}
          />
        </fieldset>
        <br/><br/>
        <button type="button" onClick={volverAlInicio}> Volver al inicio </button>
      </div>
    </>
  )
}

export default CreacionPedido
