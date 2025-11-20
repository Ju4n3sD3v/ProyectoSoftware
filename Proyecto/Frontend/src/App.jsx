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
import RevisarPedidosJefe from './pantallasJefe/revisarPedidos.jsx';


import VerificarPedidoLider from './pantallasLider/verificarPedidoLider'

import FaltantesJefe from './pantallasJefe/FaltantesJefe'
import HistorialEnvios from './pantallasJefe/HistorialEnvios'
import InventarioPorLocal from './pantallasEmpleadas/InventarioPorLocal'

function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [nombre, setNombre] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [origenInventario, setOrigenInventario] = useState(null)

  const irALogin = (tipo) => {
    setTipoUsuario(tipo)
    setPantalla('login')
  }

  const manejarSubmitLogin = (e) => {
    e.preventDefault()

    switch (tipoUsuario) {
      case "Jefe": setPantalla("jefe"); break;
      case "Supervisora": setPantalla("supervisora"); break;
      case "Líder": setPantalla("lider"); break;
      case "Empleada": setPantalla("empleada"); break;
      default: setPantalla("inicio")
    }
  }

  const volverAlInicio = () => {
    setPantalla('inicio')
    setNombre('')
    setContrasena('')
  }

  const controlInventarioBodega = () => setPantalla('controlInventarioBodega')
  const volverLoginJefe = () => setPantalla('jefe')
  const modificarInventarioJefe = () => setPantalla('modificarInventarioJefe')
  const crreacionPedido = () => setPantalla('creacion de pedido')
  const reporteEntradaSalida = () => setPantalla('reporteEntradaSalida')
  const volverLoginLider = () => setPantalla('lider')
  const mostrarAnalisisInventario = () => setPantalla("analisisInventario")
  const revisarPedidosJefe = () => { setPantalla('revisarPedidos'); };

  
  const verificarPedidoLider = () => setPantalla('verificarPedidoLider')

  
  const verFaltantesJefe = () => setPantalla('faltantesJefe')
  const verHistorialEnvios = () => setPantalla('historialEnvios')
  const verInventarioLocal = () => {
    // Guardar desde qué pantalla se abre el inventario para saber adónde volver
    setOrigenInventario(pantalla)
    setPantalla('inventarioLocal')
  }

  return (
    <>
      {pantalla === 'inicio' && (
        <div className="pantalla-inicio">
          <h1>¿Qué tipo de usuario es?</h1>

          <div><label>Jefe</label> <button type="button" onClick={() => irALogin('Jefe')}>Siguiente</button></div>
          <div><label>Supervisora</label> <button type="button" onClick={() => irALogin('Supervisora')}>Siguiente</button></div>
          <div><label>Líder</label> <button type="button" onClick={() => irALogin('Líder')}>Siguiente</button></div>
          <div><label>Empleada</label> <button type="button" onClick={() => irALogin('Empleada')}>Siguiente</button></div>
        </div>
      )}

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
                placeholder='pepito...'
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
          <button type="button" onClick={volverAlInicio}>Volver</button>
        </div>
      )}

      {/* PANTALLA 3: CREACIÓN DE PEDIDO */}
      {pantalla === 'creacion de pedido' && (
        <CreacionPedido volverAlInicio={volverAlInicio}>
          <fieldset>
            {[...Array(9)].map((_, i) => (
              <LabelAndInputN key={i} label="bolsas_de_alitas" id={`ba${i}`} />
            ))}
            <Button name='Generar informe' />
          </fieldset>
        </CreacionPedido>
      )}

      {/* MENÚ JEFE */}
      {pantalla === 'jefe' && (
        <LoginJefe
          volverAlInicio={volverAlInicio}
          controlInventarioBodega={controlInventarioBodega}
          mostrarAnalisisInventario={mostrarAnalisisInventario}
          // 👇 NUEVO: opción para ver faltantes
          verFaltantesJefe={verFaltantesJefe}
        />
      )}

      {pantalla === 'controlInventarioBodega' &&(
        <ControlInventarioBodega
          volverAlInicio={volverAlInicio}
          volverLoginJefe={volverLoginJefe}
          modificarInventarioJefe={modificarInventarioJefe}
          revisarPedidosJefe={revisarPedidosJefe}   
        />
      )}

      {pantalla === 'modificarInventarioJefe' && (
        <ModificarInventarioJefe
          volverAlInicio={volverAlInicio}
          controlInventarioBodega={controlInventarioBodega}
        />
      )}

      {pantalla === 'revisarPedidos' && (
        <RevisarPedidosJefe
          volverControlInventarioBodega={controlInventarioBodega}
        />
      )}

      {/* MENÚ LÍDER */}
      {pantalla === 'lider' && (
        <LoginLider
          volverAlInicio={volverAlInicio}
          reporteEntradaSalida={reporteEntradaSalida}
          verificarPedidoLider={verificarPedidoLider}
          verInventarioLocal={verInventarioLocal}
        />
      )}

      {pantalla === 'reporteEntradaSalida' && (
        <ReporteEntradaSalida
          volverAlInicio={volverAlInicio}
          volverLoginLider={volverLoginLider}
        />
      )}

      {pantalla === 'verificarPedidoLider' && (
        <VerificarPedidoLider
          volverAlInicio={volverLoginLider}
        />
      )}

      {/* (Inventario para Líder ahora está dentro de LoginLider) */}

      {/* 👇 NUEVA PANTALLA: faltantes para el Jefe */}
      {pantalla === 'faltantesJefe' && (
        <FaltantesJefe
          volverControlInventarioBodega={controlInventarioBodega}
          volverLoginJefe={volverLoginJefe}
          verHistorialEnvios={verHistorialEnvios}
        />
      )}

      {pantalla === 'inventarioLocal' && (
        <InventarioPorLocal volver={() => {
          // Volver a la pantalla que abrió el inventario; por defecto 'jefe'
          setPantalla(origenInventario || 'jefe')
          setOrigenInventario(null)
        }} />
      )}

      {pantalla === 'historialEnvios' && (
        <HistorialEnvios volver={() => setPantalla('faltantesJefe')} />
      )}

      {pantalla === 'supervisora' && (
        <>
          hola estoy en la pantalla de supervisora
          <br /><br />
          <button type="button" onClick={volverAlInicio}>Volver al inicio</button>
        </>
      )}

      {pantalla === 'empleada' && (
        <>
          <h1>Estoy en la pantalla empleada</h1>
          <button type="button" onClick={crreacionPedido}>Crear informe del pedido</button>
          <br /><br />
          <button type="button" onClick={verInventarioLocal}>Ver inventario por local</button>
          <br /><br />
          <button type="button" onClick={volverAlInicio}>Volver al inicio</button>
        </>
      )}

      {pantalla === "analisisInventario" && (
        <AnalisisInventarioLocal volverLoginJefe={volverLoginJefe} />
      )}
    </>
  )
}

export default App
