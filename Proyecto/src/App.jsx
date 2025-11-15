import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LabelAndInputN from './componentes/LabelAndInputN'
import Button from './componentes/Button'
import './App.css'

function App() {
  // NUEVO: estados para controlar las pantallas y los datos del login
  const [pantalla, setPantalla] = useState('inicio')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [contrasena, setContrasena] = useState('')

  // Tu objeto de productos (no lo toco)
  const productos = {
    bolsasAlitas: 0,
    // Evitar referencia a variable inexistente en este scope.
    // Si quieres que bolsasHarinas dependa de bolsasAlitas, calcula después de crear el objeto.
    bolsasHarinas: 0,
    bolsasPapas: 0,
    SalsasBBQ: 0,
    SalsasMielMostaza: 0,
    SalsasPicanteSuave: 0,
    SalsasPicanteExtra: 0,
    Aceite20L: 0,
    Gaseosasx6Manzana: 0,
    Gaseosasx6Naranja: 0,
    Gaseosasx6Uva: 0,
    Gaseosasx6Pepsi: 0,
    Gaseosasx6Tamarindo: 0,
    Paquetex50Combo1: 0,
    Paquetex50Combo2: 0,
    Paquetex50Combo3: 0,
    Paquetex50Combo4: 0,
    Paquetex50Combo5: 0,
    Tapasx200: 0,
    CajaPapas: 0
  }

  // NUEVO: cuando seleccionas un tipo de usuario en la pantalla de inicio
  const irALogin = (tipo) => {
    setTipoUsuario(tipo)
    setPantalla('login')
  }

  // NUEVO: cuando envías el formulario de login
  const manejarSubmitLogin = (e) => {
  e.preventDefault()

  switch (tipoUsuario) {
    case "Jefe":
      setPantalla("jefe")
      break

    case "Supervisora":
      setPantalla("supervisora")
      break

    case "Líder":
      setPantalla("lider")
      break

    case "Empleada":
      setPantalla("empleada")
      break

    default:
      setPantalla("inicio")
  }
}


  const volverAlInicio = () => {
  setPantalla('inicio')
  setNombre('')
  setContrasena('')
}

  const crreacionPedido = () => {
    setPantalla('creacion de pedido')
  }

  // NUEVO RETURN CON LAS TRES PANTALLAS
  return (
    <>
      {/* PANTALLA 1: SELECCIÓN DE TIPO DE USUARIO */}
      {pantalla === 'inicio' && (
        <div className="pantalla-inicio">
          <h1>¿Qué tipo de usuario es?</h1>

          <div>
            <label>Jefe</label>
            <button onClick={() => irALogin('Jefe')}>Siguiente</button>
          </div>

          <div>
            <label>Supervisora</label>
            <button onClick={() => irALogin('Supervisora')}>Siguiente</button>
          </div>

          <div>
            <label>Líder</label>
            <button onClick={() => irALogin('Líder')}>Siguiente</button>
          </div>

          <div>
            <label>Empleada</label>
            <button onClick={() => irALogin('Empleada')}>Siguiente</button>
          </div>
        </div>
      )}

      {/* PANTALLA 2: LOGIN (NOMBRE Y CONTRASEÑA) */}
      {pantalla === 'login' && (
        <div className="pantalla-login">
          <h1>Ingreso de usuario</h1>
          <h2>{tipoUsuario}</h2>

          <form onSubmit={manejarSubmitLogin}>
            <div>
              <label htmlFor="nombre">Nombre: </label>
              <input
                id="nombre"
                type="text"
                placeholder=' pepito...'
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena">Contraseña: </label>
              <input
                id="contrasena"
                type="password"
                placeholder='***'
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <br />
            <button type="submit">Siguiente</button>
          </form>

          <br />
          <button type="button" onClick={volverAlInicio}>
            Volver
          </button>
        </div>
      )}

      {/* PANTALLA 3: TU INTERFAZ ORIGINAL */}
      {pantalla === 'creacion de pedido' && (
        <>
          <div>
            <fieldset>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
              <Button name='Generar informe'></Button>
            </fieldset>
            <br/><br/>
            <button type="button" onClick={volverAlInicio}> Volver al inicio </button>
          </div>
        </>
      )}

      {/*Pantalla Jefe */}
      {pantalla === 'jefe' &&(
        <>
          <div>
            <h1> ¿Qué desea hacer?</h1>
            <br/> 
            <button> Control de inventario en bodega</button>
            <br/> <br/> 
            <button> Analisis de inventario</button>
            <br/><br/>
            <button type="button" onClick={volverAlInicio}> Volver al inicio </button>

          </div>
        </>
      )}

      {/* Pantalla Lider*/}
      {pantalla === 'lider' &&(
        <>
          hola estoy en la pantalla de lider 
          <br/><br/>
          <button type="button" onClick={volverAlInicio}> Volver al inicio </button>
        </>
      )}

      {/* Pantalla Lider*/}
      {pantalla === 'supervisora' &&(
        <>
          hola estoy en la pantalla de supervisora 
          <br/><br/>
          <button type="button" onClick={volverAlInicio}> Volver al inicio </button>
        </>
      )}

      {/* Pantalla Lider*/}
      {pantalla === 'empleada' &&(
        <>
          <h1> Estoy en al pantalla empleada</h1>
          <button type = 'button' onClick={crreacionPedido}> Crear informe del pedido </button>
          <br/><br/>
          <button type="button" onClick={volverAlInicio}> Volver al inicio </button>
        </>
      )}
    </>
  )
}

export default App
