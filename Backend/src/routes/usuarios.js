const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios
 */
router.get('/', usuariosController.getUsuarios);

/**
 * @route   GET /api/usuarios/:id
 * @desc    Obtener usuario por ID
 */
router.get('/:id', usuariosController.getUsuarioPorId);

/**
 * @route   POST /api/usuarios
 * @desc    Crear nuevo usuario
 */
router.post('/', usuariosController.crearUsuario);

/**
 * @route   PUT /api/usuarios/:id
 * @desc    Actualizar usuario
 */
router.put('/:id', usuariosController.actualizarUsuario);

/**
 * @route   PUT /api/usuarios/:id/password
 * @desc    Cambiar contraseña de usuario
 */
router.put('/:id/password', usuariosController.cambiarContrasenia);

/**
 * @route   DELETE /api/usuarios/:id
 * @desc    Eliminar usuario
 */
router.delete('/:id', usuariosController.eliminarUsuario);

module.exports = router;
