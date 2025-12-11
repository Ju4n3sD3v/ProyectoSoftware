import express from 'express';
import {
  obtenerTodasMaquinas,
  obtenerMaquinasPorLocal,
  obtenerMaquinaPorId,
  obtenerMaquinasEnEspera,
  agendarRevision,
  obtenerRevisionesAgendadas,
  registrarRevision,
  actualizarEstadoMaquina,
  registrarMantenimiento,
  obtenerHistorialMantenimiento
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

// GET: Obtener revisiones agendadas de una máquina
router.get('/:maquinaId/revisiones-agendadas', (req, res) => {
  const { maquinaId } = req.params;
  const revisiones = obtenerRevisionesAgendadas(maquinaId);
  
  res.json({
    maquinaId,
    totalAgendadas: revisiones.length,
    revisiones
  });
});

// GET: Obtener historial de mantenimientos de una máquina
router.get('/:maquinaId/historial-mantenimiento', (req, res) => {
  const { maquinaId } = req.params;
  const historial = obtenerHistorialMantenimiento(maquinaId);
  
  res.json({
    maquinaId,
    totalRegistros: historial.length,
    mantenimientos: historial
  });
});

// POST: Agendar revisión para una máquina
router.post('/:maquinaId/agendar-revision', (req, res) => {
  const { maquinaId } = req.params;
  const { fecha, hora, descripcion } = req.body;
  
  if (!fecha || !hora) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: "Se requieren fecha y hora para agendar revisión" 
    });
  }
  
  const resultado = agendarRevision(maquinaId, { fecha, hora, descripcion });
  
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

// POST: Registrar mantenimiento realizado
router.post('/:maquinaId/registrar-mantenimiento', (req, res) => {
  const { maquinaId } = req.params;
  const { fecha, hora, tecnicoResponsable, tipoMantenimiento, descripcion } = req.body;
  
  // Validar campos requeridos
  if (!fecha || !hora || !tecnicoResponsable || !tipoMantenimiento) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: "Se requieren: fecha, hora, tecnicoResponsable, tipoMantenimiento" 
    });
  }
  
  // Validar que tipoMantenimiento sea preventivo o correctivo
  if (!["preventivo", "correctivo"].includes(tipoMantenimiento)) {
    return res.status(400).json({ 
      ok: false, 
      mensaje: "tipoMantenimiento debe ser 'preventivo' o 'correctivo'" 
    });
  }
  
  const resultado = registrarMantenimiento(maquinaId, {
    fecha,
    hora,
    tecnicoResponsable,
    tipoMantenimiento,
    descripcion
  });
  
  if (!resultado.ok) {
    return res.status(404).json(resultado);
  }
  
  res.status(201).json(resultado);
});

export default router;
