const express = require('express');
const router = express.Router();
const expedientesController = require('../controllers/expedientesController');

/**
 * @route   GET /api/expedientes
 * @desc    Obtener todos los expedientes
 */
router.get('/', expedientesController.getExpedientes);

/**
 * @route   GET /api/expedientes/estado/:estado_id
 * @desc    Obtener expedientes por estado
 */
router.get('/estado/:estado_id', expedientesController.getExpedientesPorEstado);

/**
 * @route   GET /api/expedientes/tecnico/:tecnico_id
 * @desc    Obtener expedientes por técnico
 */
router.get('/tecnico/:tecnico_id', expedientesController.getExpedientesPorTecnico);

/**
 * @route   GET /api/expedientes/fecha
 * @desc    Obtener expedientes por rango de fechas
 * @query   fecha_inicio, fecha_fin
 */
router.get('/fecha', expedientesController.getExpedientesPorFecha);

/**
 * @route   GET /api/expedientes/:id
 * @desc    Obtener expediente por ID
 */
router.get('/:id', expedientesController.getExpedientePorId);

/**
 * @route   POST /api/expedientes
 * @desc    Crear expediente
 */
router.post('/', expedientesController.crearExpediente);

/**
 * @route   PUT /api/expedientes/:id
 * @desc    Actualizar expediente
 */
router.put('/:id', expedientesController.actualizarExpediente);

/**
 * @route   PUT /api/expedientes/:id/revisar
 * @desc    Revisar expediente (aprobar/rechazar)
 */
router.put('/:id/revisar', expedientesController.revisarExpediente);

/**
 * @route   DELETE /api/expedientes/:id
 * @desc    Eliminar expediente
 */
router.delete('/:id', expedientesController.eliminarExpediente);

module.exports = router;
