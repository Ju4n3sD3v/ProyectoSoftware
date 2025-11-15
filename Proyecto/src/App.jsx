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
    // Aquí podrías validar nombre/contraseña más adelante
    setPantalla('app')
  }

  // ====== TU RETURN ORIGINAL (LO DEJO SOLO COMENTADO) ======
  /*
  return (
    <>
      <div>
        <fieldset>
          <center></center>
          <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
          <button>+</button>
          <button>-</button>
          <LabelAndInputN label ="bolsas_de_papas" id="bp01"/>
          <button>+</button>
          <button>-</button>
          <LabelAndInputN label ="salsas_BBQ" id=""/>
          <button>+</button>
          <button>-</button>
          <LabelAndInputN label ="salsas_Miel_Mostaza" id="ba01"/>
          <button>+</button>
          <button>-</button>
          <LabelAndInputN label ="bolsas_de_alitas" id="ba01"/>
          <button>+</button>
          <button>-</button>
          <Button name='Generar informe'></Button>
        </fieldset>
      </div>
    </>
  )
  */
  // =========================================================

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
              <label htmlFor="nombre">Nombre:</label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="contrasena">Contraseña:</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </div>

            <br />
            <button type="submit">Siguiente</button>
          </form>

          <br />
          <button type="button" onClick={() => setPantalla('inicio')}>
            Volver
          </button>
        </div>
      )}

      {/* PANTALLA 3: TU INTERFAZ ORIGINAL */}
      {pantalla === 'app' && (
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
          </div>
        </>
      )}
    </>
  )
}

export default App
