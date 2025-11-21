const express = require('express');
const router = express.Router();
const indiciosController = require('../controllers/indiciosController');

/**
 * @route   GET /api/indicios/expediente/:expediente_id
 * @desc    Obtener indicios por expediente
 */
router.get('/expediente/:expediente_id', indiciosController.getIndiciosPorExpediente);

/**
 * @route   GET /api/indicios/:id
 * @desc    Obtener indicio por ID
 */
router.get('/:id', indiciosController.getIndicioPorId);

/**
 * @route   POST /api/indicios
 * @desc    Crear indicio
 */
router.post('/', indiciosController.crearIndicio);

/**
 * @route   PUT /api/indicios/:id
 * @desc    Actualizar indicio
 */
router.put('/:id', indiciosController.actualizarIndicio);

/**
 * @route   DELETE /api/indicios/:id
 * @desc    Eliminar indicio
 */
router.delete('/:id', indiciosController.eliminarIndicio);

module.exports = router;
