const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/profile/:id
 * @desc    Obtener perfil de usuario
 * @access  Public (en producción debería ser Private con JWT)
 */
router.get('/profile/:id', authController.getProfile);

module.exports = router;
