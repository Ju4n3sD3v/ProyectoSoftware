import { useState, useEffect } from 'react'
import LabelAndInputN from '../componentes/LabelAndInputN'
import Button from '../componentes/Button'

function CreacionPedido({ volverLoginEmpleada }) {
  // Estado para guardar los valores de los inputs
  const [pedido, setPedido] = useState({})
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estado para el local
  const [local, setLocal] = useState("")

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
            // dejar inputs vacíos para que el usuario los complete
            pedidoInicial[producto.nombre] = ""
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
    setPedido((prev) => ({
      ...prev,
      [nombreProducto]: valor
    }))
  }

  // Función para recolectar y procesar el pedido
  const handleGenerarInforme = async () => {
    console.log("🔵 Botón 'Generar informe' presionado");

    // Validar que el local esté seleccionado
    if (!local) {
      alert("Por favor selecciona un local antes de generar el pedido.")
      return
    }
    
    // Construir objeto final con las cantidades (vacío -> 0)
    const pedidoFinal = {}
    productos.forEach((producto) => {
      const nombre = producto.nombre
      const raw = pedido[nombre]
      const cantidad = raw === "" || raw === undefined || isNaN(parseFloat(raw)) ? 0 : parseFloat(raw)
      pedidoFinal[nombre] = cantidad
    })

    console.log("Pedido filtrado:", pedidoFinal);

    try {
      console.log("📤 Enviando pedido al backend...");
      // Enviar el pedido al backend
      const respuesta = await fetch("http://localhost:4000/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          local: local,
          productos: pedidoFinal
        })
      })

      console.log("Respuesta del servidor:", respuesta.status);
      const datos = await respuesta.json()

      if (datos.success) {
        console.log("✓ Pedido guardado exitosamente")
        console.log("ID del pedido:", datos.id)
        console.log("Archivo:", datos.archivo)
        console.log("Datos guardados en JSON:")
        console.log(JSON.stringify(pedidoFinal, null, 2))
        
        alert(`✓ Pedido guardado correctamente`)
        
        // Limpiar el formulario (volver a inputs vacíos)
        const pedidoLimpio = {}
        productos.forEach(producto => {
          pedidoLimpio[producto.nombre] = ""
        })
        setPedido(pedidoLimpio)
        setLocal("") // limpiar también el local
        
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
      <div className="creacion-pedido">
        <h1>Crear Pedido</h1>

        {/* Selector de local */}
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="select-local" style={{ marginRight: "0.5rem" }}>
            Local:
          </label>
          <select
            id="select-local"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
          >
            <option value="">Seleccione un local</option>
            <option value="Local 1">Local 1</option>
            <option value="Local 2">Local 2</option>
          </select>
        </div>

        <fieldset>
          {productos.map((producto) => (
            <LabelAndInputN 
              key={producto.id}
              label={producto.nombre}
              id={`producto-${producto.id}`}
              value={pedido[producto.nombre] ?? ""}
              onChange={(e) => {
                // 👇 Soporta evento o valor directo
                const valor = e?.target ? e.target.value : e
                handleInputChange(producto.nombre, valor)
              }}
            />
          ))}
          <Button 
            name='Generar informe'
            id='btn-generar'
            onClick={handleGenerarInforme}
          />
        </fieldset>
        <br/><br/>
        <button type="button" onClick={volverLoginEmpleada}> Volver al menú </button>
      </div>
    </>
  )
}

export default CreacionPedido
