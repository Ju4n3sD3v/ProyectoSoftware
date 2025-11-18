import { useState, useEffect } from 'react'
import LabelAndInputN from '../componentes/LabelAndInputN'
import Button from '../componentes/Button'

function CreacionPedido({ volverAlInicio }) {
  // Estado para guardar los valores de los inputs
  const [pedido, setPedido] = useState({})
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Cargar datos del backend al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log("📥 Cargando datos desde el backend...");
        const respuesta = await fetch("http://localhost:4000/api/datos/productos")
        const datos = await respuesta.json()

        if (datos.success) {
          console.log("✓ Datos cargados:", datos.productos);
          setProductos(datos.productos)

          // Inicializar el objeto pedido con todos los productos
          const pedidoInicial = {}
          datos.productos.forEach(producto => {
            pedidoInicial[producto.nombre] = "0"
          })
          setPedido(pedidoInicial)
          setCargando(false)
        } else {
          setError("No se pudieron cargar los datos")
          setCargando(false)
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error de conexión al backend")
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  // Función para manejar cambios en los inputs
  const handleInputChange = (nombreProducto, valor) => {
    setPedido({
      ...pedido,
      [nombreProducto]: valor
    })
  }

  // Función para recolectar y procesar el pedido
  const handleGenerarInforme = async () => {
    console.log("🔵 Botón 'Generar informe' presionado");
    
    // Filtrar solo los productos con cantidad > 0
    const pedidoFinal = {}
    
    Object.entries(pedido).forEach(([nombreProducto, cantidad]) => {
      if (cantidad !== "" && parseFloat(cantidad) > 0) {
        pedidoFinal[nombreProducto] = parseFloat(cantidad)
      }
    })

    console.log("Pedido filtrado:", pedidoFinal);

    if (Object.keys(pedidoFinal).length === 0) {
      alert("Por favor, ingresa al menos un producto")
      return
    }

    try {
      console.log("📤 Enviando pedido al backend...");
      // Enviar el pedido al backend
      const respuesta = await fetch("http://localhost:4000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(pedidoFinal)
      })

      console.log("Respuesta del servidor:", respuesta.status);
      const datos = await respuesta.json()

      if (datos.success) {
        console.log("✓ Pedido guardado exitosamente")
        console.log("ID del pedido:", datos.id)
        console.log("Archivo:", datos.archivo)
        console.log("Datos guardados en JSON:")
        console.log(JSON.stringify(pedidoFinal, null, 2))
        
        alert(`✓ Pedido guardado correctamente\nID: ${datos.id}\nArchivo: ${datos.archivo}`)
        
        // Limpiar el formulario
        const pedidoLimpio = {}
        productos.forEach(producto => {
          pedidoLimpio[producto.nombre] = "0"
        })
        setPedido(pedidoLimpio)
      } else {
        alert("Error: " + datos.mensaje)
      }
    } catch (error) {
      console.error("Error al guardar el pedido:", error)
      alert("Error de conexión con el servidor: " + error.message)
    }
  }

  // Mostrar mensaje de carga
  if (cargando) {
    return <div><h1>Cargando datos...</h1></div>
  }

  // Mostrar error si hay
  if (error) {
    return <div><h1>Error: {error}</h1></div>
  }

  return (
    <>
      <div>
        <h1>Crear Pedido</h1>
        <fieldset>
          {productos.map((producto) => (
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
