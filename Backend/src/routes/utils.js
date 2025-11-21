const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utilsController');

/**
 * @route   GET /api/utils/revisiones
 * @desc    Obtener todas las revisiones
 */
router.get('/revisiones', utilsController.getRevisiones);

/**
 * @route   GET /api/utils/revisiones/expediente/:expediente_id
 * @desc    Obtener revisiones por expediente
 */
router.get('/revisiones/expediente/:expediente_id', utilsController.getRevisionesPorExpediente);

/**
 * @route   GET /api/utils/estadisticas
 * @desc    Obtener estadísticas generales
 */
router.get('/estadisticas', utilsController.getEstadisticas);

/**
 * @route   GET /api/utils/roles
 * @desc    Obtener roles
 */
router.get('/roles', utilsController.getRoles);

/**
 * @route   GET /api/utils/estados
 * @desc    Obtener estados
 */
router.get('/estados', utilsController.getEstados);

module.exports = router;
