const { executeStoredProcedure } = require('../config/database');
const md5 = require('md5');

/**
 * Obtener todos los usuarios
 */
const getUsuarios = async (req, res) => {
    try {
        const result = await executeStoredProcedure('sp_ObtenerUsuarios');
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener usuario por ID
 */
const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerUsuarioPorId', { id });

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Crear nuevo usuario
 */
const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, correo, contrasenia, rol_id } = req.body;

        if (!nombre || !apellido || !correo || !contrasenia || !rol_id) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        // Cifrar contraseña con MD5
        const contraseniaEncriptada = md5(contrasenia);

        const result = await executeStoredProcedure('sp_CrearUsuario', {
            nombre,
            apellido,
            correo,
            contrasenia: contraseniaEncriptada,
            rol_id
        });

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: { id: result.recordset[0].id }
        });
    } catch (error) {
        console.error('Error creando usuario:', error);
        res.status(500).json({
            success: false,
            message: error.message.includes('correo ya está registrado') 
                ? 'El correo ya está registrado' 
                : 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Actualizar usuario
 */
const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, correo, rol_id } = req.body;

        if (!nombre || !apellido || !correo || !rol_id) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son requeridos'
            });
        }

        const result = await executeStoredProcedure('sp_ActualizarUsuario', {
            id,
            nombre,
            apellido,
            correo,
            rol_id
        });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Cambiar contraseña
 */
const cambiarContrasenia = async (req, res) => {
    try {
        const { id } = req.params;
        const { contrasenia } = req.body;

        if (!contrasenia) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña es requerida'
            });
        }

        // Cifrar contraseña con MD5
        const contraseniaEncriptada = md5(contrasenia);

        const result = await executeStoredProcedure('sp_CambiarContrasenia', {
            id,
            contrasenia: contraseniaEncriptada
        });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente'
        });
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Eliminar usuario
 */
const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_EliminarUsuario', { id });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioPorId,
    crearUsuario,
    actualizarUsuario,
    cambiarContrasenia,
    eliminarUsuario
};
