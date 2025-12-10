import express from 'express';
import {
  obtenerTodasMaquinas,
  obtenerMaquinasPorLocal,
  obtenerMaquinaPorId,
  obtenerMaquinasEnEspera,
  agendarRevision,
  registrarRevision,
  actualizarEstadoMaquina
} from '../servicios/maquinas.service.js';

const router = express.Router();

// GET: Obtener todas las máquinas
router.get('/', (req, res) => {
  const maquinas = obtenerTodasMaquinas();
  res.json(maquinas);
});

// GET: Obtener máquinas en espera para revisión
router.get('/espera/todas', (req, res) => {
  const maquinas = obtenerMaquinasEnEspera();
  res.json(maquinas);
});

// GET: Obtener máquinas de un local específico
router.get('/local/:nombreLocal', (req, res) => {
  const { nombreLocal } = req.params;
  const maquinas = obtenerMaquinasPorLocal(nombreLocal);
  
  if (maquinas.length === 0) {
    return res.status(404).json({ ok: false, mensaje: "No hay máquinas en este local" });
  }
  
  res.json(maquinas);
});

// GET: Obtener máquina por ID
router.get('/id/:maquinaId', (req, res) => {
  const { maquinaId } = req.params;
  const maquina = obtenerMaquinaPorId(maquinaId);
  
  if (!maquina) {
    return res.status(404).json({ ok: false, mensaje: "Máquina no encontrada" });
  }
  
  res.json(maquina);
});

// POST: Agendar revisión para una máquina
router.post('/:maquinaId/agendar-revision', (req, res) => {
  const { maquinaId } = req.params;
  const resultado = agendarRevision(maquinaId);
  
  if (!resultado.ok) {
    return res.status(404).json(resultado);
  }
  
  res.json(resultado);
});

// POST: Registrar revisión realizada
router.post('/:maquinaId/registrar-revision', (req, res) => {
  const { maquinaId } = req.params;
  const { fecha } = req.body;
  
  if (!fecha) {
    return res.status(400).json({ ok: false, mensaje: "La fecha es requerida" });
  }
  
  const resultado = registrarRevision(maquinaId, fecha);
  
  if (!resultado.ok) {
    return res.status(404).json(resultado);
  }
  
  res.json(resultado);
});

// PUT: Actualizar estado de una máquina
router.put('/:maquinaId', (req, res) => {
  const { maquinaId } = req.params;
  const { nuevoEstado } = req.body;
  
  if (!nuevoEstado) {
    return res.status(400).json({ ok: false, mensaje: "El estado es requerido" });
  }
  
  const resultado = actualizarEstadoMaquina(maquinaId, nuevoEstado);
  
  if (!resultado.ok) {
    return res.status(404).json(resultado);
  }
  
  res.json(resultado);
});

export default router;
