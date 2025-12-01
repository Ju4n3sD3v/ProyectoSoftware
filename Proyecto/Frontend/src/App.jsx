import { useState } from 'react'
import './App.css'

import LabelAndInputN from './componentes/LabelAndInputN'
import Button from './componentes/Button'
import LoginJefe from './pantallasJefe/loginjefe'
import ControlInventarioBodega from './pantallasJefe/controlInventarioBodega'
import ModificarInventarioJefe from './pantallasJefe/modificarInventario'
import LoginLider from './pantallasLider/loginLider'

import ReporteEntradaSalida from './pantallasLider/reporteEntradaSalida'
import CreacionPedido from './pantallasEmpleadas/creacionPedido'
import AnalisisInventarioLocal from './pantallasJefe/analisisInventarioLocal'
import RevisarPedidosJefe from './pantallasJefe/revisarPedidos.jsx'

import SupervisoraRoles from './pantallasJefe/supervisoraRoles.jsx'

import VerificarPedidoLider from './pantallasLider/verificarPedidoLider'

import FaltantesJefe from './pantallasJefe/FaltantesJefe'
import HistorialEnvios from './pantallasJefe/HistorialEnvios'
import InventarioPorLocal from './pantallasEmpleadas/InventarioPorLocal'

const IconBriefcase = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M9 6V5a3 3 0 0 1 6 0v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3zm2 0h2V5a1 1 0 1 0-2 0v1zm-5 4v7h12v-7H6zm7 2h-2v2h2v-2z"
    />
  </svg>
)

const IconUserBadge = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8v-1.5c0-2.36 3.11-3.5 7-3.5s7 1.14 7 3.5V20Z"
    />
    <path
      fill="currentColor"
      d="M18 3H6a1 1 0 0 0-1 1v15.5a.5.5 0 0 0 .84.36l1.47-1.34a1 1 0 0 1 .68-.27h8.02a1 1 0 0 1 .68.27l1.47 1.34a.5.5 0 0 0 .84-.36V4a1 1 0 0 0-1-1Zm-1 13.2c-1.2-.76-3.09-1.2-5-.2-1.91-1-3.8-.56-5 .2V5h10Z"
    />
  </svg>
)

const IconUsers = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M8 13a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-2.14 0-4 .94-4 2.5V20h8v-2.5C20 15.94 18.14 15 16 15Zm-8 0c-2.67 0-5 1.12-5 3v2h10v-2c0-1.88-2.33-3-5-3Z"
    />
  </svg>
)

const IconUserCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-6 1.8-6 4v2h12v-2c0-2.2-2.67-4-6-4Z"
    />
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
    />
  </svg>
)

function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [origenInventario, setOrigenInventario] = useState(null)
  const [errorLogin, setErrorLogin] = useState('')

  const wrapScreen = (children) => (
    <div className="page">
      <div className="card-surface">
        {children}
      </div>
    </div>
  )

  const irALogin = (tipo) => {
    setTipoUsuario(tipo)
    setPantalla('login')
  }

  const manejarSubmitLogin = async (e) => {
    e.preventDefault()
    setErrorLogin('')

    try {
      const respuesta = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: nombre,
          contrasena: contrasena,
          rolEsperado: tipoUsuario,
        }),
      })

      if (!respuesta.ok) {
        const dataError = await respuesta.json().catch(() => ({}))
        setErrorLogin(dataError.mensaje || 'Usuario, contrasena o rol incorrectos')
        return
      }

      const data = await respuesta.json()

      const rolNormalizado = (data.rol || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()

      const mapaRol = {
        jefe: 'jefe',
        supervisora: 'supervisora',
        lider: 'lider',
        empleada: 'empleada',
      }

      const rolDestino = mapaRol[rolNormalizado]

      if (!rolDestino) {
        setErrorLogin('Rol no reconocido desde el servidor')
        setPantalla('inicio')
        return
      }

      setPantalla(rolDestino)
    } catch (error) {
      console.error('Error al hacer login:', error)
      setErrorLogin('Error al conectar con el servidor de autenticaci?n')
    }
  }

  const volverAlInicio = () => {
    setPantalla('inicio')
    setNombre('')
    setContrasena('')
    setErrorLogin('')
  }

  const controlInventarioBodega = () => setPantalla('controlInventarioBodega')
  const volverLoginJefe = () => setPantalla('jefe')
  const modificarInventarioJefe = () => setPantalla('modificarInventarioJefe')
  const crreacionPedido = () => setPantalla('creacion de pedido')
  const reporteEntradaSalida = () => setPantalla('reporteEntradaSalida')
  const volverLoginLider = () => setPantalla('lider')
  const mostrarAnalisisInventario = () => setPantalla('analisisInventario')
  const revisarPedidosJefe = () => setPantalla('revisarPedidos')
  const verificarPedidoLider = () => setPantalla('verificarPedidoLider')
  const verFaltantesJefe = () => setPantalla('faltantesJefe')
  const verHistorialEnvios = () => setPantalla('historialEnvios')
  const verInventarioLocal = () => {
    setOrigenInventario(pantalla)
    setPantalla('inventarioLocal')
  }

  return (
    <>
      {pantalla === 'inicio' && (
        <div className="inicio-layout">
          <div className="inicio-card">
            <div className="brand-logo">
              <div className="brand-mark">L</div>
            </div>
            <h1 className="brand-title">Lolalitas</h1>
            <p className="brand-subtitle">Medell?n, Colombia</p>

            <div className="brand-divider" />
            <p className="brand-instruction">Selecciona tu rol</p>
            <p className="brand-helper">Elige el rol con el que deseas ingresar al sistema</p>

            <div className="roles-grid">
              {[
                { key: 'Jefe', label: 'Jefe', color: '#f57c00', icon: <IconBriefcase /> },
                { key: 'Supervisora', label: 'Supervisora', color: '#2d7bfa', icon: <IconUserBadge /> },
                { key: 'L?der', label: 'L?der', color: '#11a36c', icon: <IconUsers /> },
                { key: 'Empleada', label: 'Empleada', color: '#a54bff', icon: <IconUserCircle /> },
              ].map((rol) => (
                <button
                  key={rol.key}
                  type="button"
                  className="role-card"
                  onClick={() => irALogin(rol.key)}
                >
                  <span className="role-icon" style={{ backgroundColor: rol.color }}>
                    {rol.icon}
                  </span>
                  <span className="role-label">{rol.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {pantalla === 'login' && (
        <div className="page">
          <div className="card-surface form-card pantalla-login">
            <h1>Ingreso de usuario</h1>
            <p className="muted">Autent?cate para continuar como {tipoUsuario || 'usuario'}</p>

            <form className="form-grid" onSubmit={manejarSubmitLogin}>
              <label className="field">
                <span>Nombre</span>
                <input
                  id="nombre"
                  type="text"
                  placeholder="pepito..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </label>

              <label className="field">
                <span>Contrase?a</span>
                <input
                  id="contrasena"
                  type="password"
                  placeholder="***"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
              </label>

              {errorLogin && (
                <p className="alert error">{errorLogin}</p>
              )}

              <div className="actions">
                <button className="btn" type="submit">Siguiente</button>
                <button className="btn ghost" type="button" onClick={volverAlInicio}>Volver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {pantalla === 'creacion de pedido' && (
        wrapScreen(
          <CreacionPedido volverAlInicio={volverAlInicio}>
            <fieldset>
              {[...Array(9)].map((_, i) => (
                <LabelAndInputN key={i} label="bolsas_de_alitas" id={`ba${i}`} />
              ))}
              <Button name="Generar informe" />
            </fieldset>
          </CreacionPedido>
        )
      )}

      {pantalla === 'jefe' && (
        wrapScreen(
          <LoginJefe
            volverAlInicio={volverAlInicio}
            controlInventarioBodega={controlInventarioBodega}
            mostrarAnalisisInventario={mostrarAnalisisInventario}
            verFaltantesJefe={verFaltantesJefe}
          />
        )
      )}

      {pantalla === 'controlInventarioBodega' && (
        <ControlInventarioBodega
          volverAlInicio={volverAlInicio}
          volverLoginJefe={volverLoginJefe}
          modificarInventarioJefe={modificarInventarioJefe}
          revisarPedidosJefe={revisarPedidosJefe}
        />
      )}

      {pantalla === 'modificarInventarioJefe' && (
        wrapScreen(
          <ModificarInventarioJefe
            volverAlInicio={volverAlInicio}
            controlInventarioBodega={controlInventarioBodega}
          />
        )
      )}

      {pantalla === 'revisarPedidos' && (
        wrapScreen(
          <RevisarPedidosJefe
            volverControlInventarioBodega={controlInventarioBodega}
          />
        )
      )}

      {pantalla === 'lider' && (
        wrapScreen(
          <LoginLider
            volverAlInicio={volverAlInicio}
            reporteEntradaSalida={reporteEntradaSalida}
            verificarPedidoLider={verificarPedidoLider}
            verInventarioLocal={verInventarioLocal}
          />
        )
      )}

      {pantalla === 'reporteEntradaSalida' && (
        wrapScreen(
          <ReporteEntradaSalida
            volverAlInicio={volverAlInicio}
            volverLoginLider={volverLoginLider}
          />
        )
      )}

      {pantalla === 'verificarPedidoLider' && (
        wrapScreen(
          <VerificarPedidoLider
            volverAlInicio={volverLoginLider}
          />
        )
      )}

      {pantalla === 'faltantesJefe' && (
        wrapScreen(
          <FaltantesJefe
            volverControlInventarioBodega={controlInventarioBodega}
            volverLoginJefe={volverLoginJefe}
            verHistorialEnvios={verHistorialEnvios}
          />
        )
      )}

      {pantalla === 'inventarioLocal' && (
        wrapScreen(
          <InventarioPorLocal volver={() => {
            setPantalla(origenInventario || 'jefe')
            setOrigenInventario(null)
          }} />
        )
      )}

      {pantalla === 'historialEnvios' && (
        wrapScreen(
          <HistorialEnvios volver={() => setPantalla('faltantesJefe')} />
        )
      )}

      {pantalla === 'supervisora' && (
        wrapScreen(
          <SupervisoraRoles volverAlInicio={volverAlInicio} />
        )
      )}

      {pantalla === 'empleada' && (
        wrapScreen(
          <div>
            <h1>Panel de empleada</h1>
            <p className="muted">Crea informes de pedido o revisa inventario por local.</p>
            <div className="actions" style={{ marginTop: '12px' }}>
              <button type="button" onClick={crreacionPedido}>Crear informe del pedido</button>
              <button type="button" onClick={verInventarioLocal}>Ver inventario por local</button>
              <button className="btn ghost" type="button" onClick={volverAlInicio}>Volver al inicio</button>
            </div>
          </div>
        )
      )}

      {pantalla === 'analisisInventario' && (
        wrapScreen(
          <AnalisisInventarioLocal volverLoginJefe={volverLoginJefe} />
        )
      )}
    </>
  )
}

export default App
