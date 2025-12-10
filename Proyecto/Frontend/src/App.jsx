import { useState } from 'react'
import './App.css'

import LabelAndInputN from './componentes/LabelAndInputN'
import Button from './componentes/Button'
import LoginJefe from './pantallasJefe/loginjefe'
import ControlInventarioBodega from './pantallasJefe/controlInventarioBodega'
import ModificarInventarioJefe from './pantallasJefe/modificarInventario'

import LoginLider from './pantallasLider/loginLider'

//import LoginTecnico from './pantallasTecnico/logintecnico'

import ReporteEntradaSalida from './pantallasLider/reporteEntradaSalida'
import CreacionPedido from './pantallasEmpleadas/creacionPedido'
import AnalisisInventarioLocal from './pantallasJefe/analisisInventarioLocal'
import RevisarPedidosJefe from './pantallasJefe/revisarPedidos.jsx'

import SupervisoraRoles from './pantallasJefe/supervisoraRoles.jsx'

import VerificarPedidoLider from './pantallasLider/verificarPedidoLider'

import FaltantesJefe from './pantallasJefe/FaltantesJefe'
import HistorialEnvios from './pantallasJefe/HistorialEnvios'
import InventarioPorLocal from './pantallasEmpleadas/InventarioPorLocal'
import ProfilePasswordForm from './componentes/ProfilePasswordForm'

import VariacionPorLocal from './pantallasJefe/VariacionPorLocal' 
import LoginTecnico from './pantallasTecnico/logintecnico.jsx'
import EstadoMaquinas from './pantallasTecnico/estadoMaquinas.jsx'

const IconBriefcase = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M9 6V5a3 3 0 0 1 6 0v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3zm2 0h2V5a1 1 0 1 0-2 0v1zm-5 4v7h12v-7H6zm7 2h-2v2h2v-2z"
    />
  </svg>
)

const IconTie = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M9 3h6l1 3-3 3 2 10-3 2-3-2 2-10-3-3 1-3Zm1.5 2-0.4 1.2L12 7.6l1.9-1.4L13.5 5h-3Z"
    />
  </svg>
)

const IconWrench = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20.7 7.3a6 6 0 0 1-7.9 7.8l-1.8 1.8 1.2 1.1-2.1 2.1-5.6-5.6 2.1-2.1 1.1 1.2 1.8-1.8A6 6 0 0 1 16.7 3l-2.4 2.4 1.3 2.9 2.9 1.3 2.2-2.3Z"
    />
  </svg>
)

const IconDelivery = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M15 5h2l1 2h3v6h-1a3 3 0 0 1-6 0h-2.2a3 3 0 1 1-5.8 0H4V8h4.2l1.1-3H15Zm-7 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm-8-5.5-.7 2H13V7h-3Z"
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

const AppBanner = () => (
  <div className="app-banner">
    Lolalitas Core
  </div>
)

function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [origenInventario, setOrigenInventario] = useState(null)
  const [errorLogin, setErrorLogin] = useState('')
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [mostrarPerfil, setMostrarPerfil] = useState(false)

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
        tecnico: 'tecnico',
        despachador: 'despachador'
      }

      const rolDestino = mapaRol[rolNormalizado]

      if (!rolDestino) {
        setErrorLogin('Rol no reconocido desde el servidor')
        setPantalla('inicio')
        return
      }

      setUsuarioActual({ usuario: nombre, rol: data.rol })
      setPantalla(rolDestino)
    } catch (error) {
      console.error('Error al hacer login:', error)
      setErrorLogin('Error al conectar con el servidor de autenticación')
    }
  }

  const volverAlInicio = () => {
    setPantalla('inicio')
    setNombre('')
    setContrasena('')
    setErrorLogin('')
    setUsuarioActual(null)
    setMostrarPerfil(false)
  }

  const controlInventarioBodega = () => setPantalla('controlInventarioBodega')
  const volverLoginJefe = () => setPantalla('jefe')
  const modificarInventarioJefe = () => setPantalla('modificarInventarioJefe')
  const crreacionPedido = () => setPantalla('creacion de pedido')
  const volverLoginEmpleada = () => setPantalla('empleada')
  const reporteEntradaSalida = () => setPantalla('reporteEntradaSalida')
  const volverLoginLider = () => setPantalla('lider')
  const volverLoginSupervisora = () => setPantalla('supervisora')
  const volverLoginTecnico = () => setPantalla('tecnico')
  const volverLoginDespachador = () => setPantalla('despachador')
  const mostrarAnalisisInventario = () => setPantalla('analisisInventario')
  const revisarPedidosJefe = () => setPantalla('revisarPedidos')
  const verificarPedidoLider = () => setPantalla('verificarPedidoLider')
  const verFaltantesJefe = () => setPantalla('faltantesJefe')
  const verHistorialEnvios = () => setPantalla('historialEnvios')
  const verInventarioLocal = () => {
    setOrigenInventario(pantalla)
    setPantalla('inventarioLocal')
  }

  const mostrarVariacionPorLocal = () => setPantalla('variacionLocal')
  const verEstadoMaquinas = () => setPantalla('estadoMaquinas')

  return (
    <div className="app-shell">
      <AppBanner />

      {usuarioActual && (
        <div className="profile-bar">
          <button
            className="profile-btn"
            type="button"
            onClick={() => setMostrarPerfil((prev) => !prev)}
          >
            <span className="avatar-circle">{(usuarioActual.usuario || 'U').slice(0,1).toUpperCase()}</span>
          </button>
          {mostrarPerfil && (
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar-circle">{(usuarioActual.usuario || 'U').slice(0,1).toUpperCase()}</div>
                <div>
                  <div className="profile-name">{usuarioActual.usuario}</div>
                  <div className="profile-role">{usuarioActual.rol}</div>
                </div>
              </div>
              <ProfilePasswordForm
                usuario={usuarioActual.usuario}
                onClose={() => setMostrarPerfil(false)}
              />
            </div>
          )}
        </div>
      )}

      {pantalla === 'inicio' && (
        <div className="inicio-layout">
      <div className="inicio-card">
        <div className="brand-logo">
          <div className="brand-mark">L</div>
        </div>
        <h1 className="brand-title">Lolalitas</h1>
            <p className="brand-subtitle">Medellín, Colombia</p>

            <div className="brand-divider" />
            <p className="brand-instruction">Selecciona tu rol</p>
            <p className="brand-helper">Elige el rol con el que deseas ingresar al sistema</p>

            <div className="roles-grid">
              {[ 
                { key: 'Jefe', label: 'Jefe', color: '#f57c00', icon: <IconTie /> },
                { key: 'Supervisora', label: 'Supervisora', color: '#2d7bfa', icon: <IconBriefcase /> },
                { key: 'L?der', label: 'Lider', color: '#11a36c', icon: <IconUsers /> },
                { key: 'Empleada', label: 'Empleada', color: '#a54bff', icon: <IconUserCircle /> },
                { key: 'Tecnico', label: 'Tecnico', color: '#e24938ff', icon: <IconWrench /> },
                { key: 'Despachador', label: 'Despachador', color: '#1fdadaff', icon: <IconDelivery /> },
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
            <p className="muted">Autentícate para continuar como {tipoUsuario || 'usuario'}</p>

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
                <span>Contraseña</span>
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
          <CreacionPedido volverLoginEmpleada={volverLoginEmpleada}>
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
            volverAlInicio={volverAlInicio}
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
          <div>
            <SupervisoraRoles volverAlInicio={volverAlInicio} />
            <br />
            <button type="button" onClick={mostrarVariacionPorLocal}>
              Variación de productos entre locales
            </button>
          </div>
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

      {pantalla === 'tecnico' && (
        wrapScreen(
          <LoginTecnico
            volverAlInicio={volverAlInicio}
            verEstadoMaquinas={verEstadoMaquinas}
          />
        )
      )}

      {pantalla === 'estadoMaquinas' && (
        wrapScreen(
          <EstadoMaquinas volverAlInicio={volverAlInicio} />
        )
      )}    


        {pantalla === 'despachador' && (
        wrapScreen(
          <div>
            <h1>Panel de Despachador</h1>
            <p className="muted">Bienvenido al panel de despachador.</p>
            <div className="actions" style={{ marginTop: '12px' }}>
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

      {pantalla === 'variacionLocal' && (
        wrapScreen(
          <VariacionPorLocal volverLoginSupervisora={() => setPantalla('supervisora')} />
        )
      )}

    </div>
  )
}

export default App
