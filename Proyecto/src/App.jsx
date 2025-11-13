import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import LabelAndInputN from './componentes/LabelAndInputN'
import './App.css'

function App() {
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
  return (
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
          <button type="button">Realizar pedido</button>
        </fieldset>
      </div>
    </>
  )
}

export default App

