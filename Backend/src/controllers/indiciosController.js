const { executeStoredProcedure } = require('../config/database');

/**
 * Obtener indicios por expediente
 */
const getIndiciosPorExpediente = async (req, res) => {
    try {
        const { expediente_id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerIndiciosPorExpediente', { expediente_id });
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo indicios:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener indicio por ID
 */
const getIndicioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerIndicioPorId', { id });

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Indicio no encontrado'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error obteniendo indicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Crear indicio
 */
const crearIndicio = async (req, res) => {
    try {
        const { descripcion, color, tamano, peso, ubicacion, expediente_id, tecnico_id } = req.body;

        if (!descripcion || !expediente_id || !tecnico_id) {
            return res.status(400).json({
                success: false,
                message: 'Descripción, expediente y técnico son requeridos'
            });
        }

        const result = await executeStoredProcedure('sp_CrearIndicio', {
            descripcion,
            color: color || null,
            tamano: tamano || null,
            peso: peso || null,
            ubicacion: ubicacion || null,
            expediente_id,
            tecnico_id
        });

        res.status(201).json({
            success: true,
            message: 'Indicio creado exitosamente',
            data: { id: result.recordset[0].id }
        });
    } catch (error) {
        console.error('Error creando indicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Actualizar indicio
 */
const actualizarIndicio = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion, color, tamano, peso, ubicacion } = req.body;

        if (!descripcion) {
            return res.status(400).json({
                success: false,
                message: 'La descripción es requerida'
            });
        }

        const result = await executeStoredProcedure('sp_ActualizarIndicio', {
            id,
            descripcion,
            color: color || null,
            tamano: tamano || null,
            peso: peso || null,
            ubicacion: ubicacion || null
        });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Indicio no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Indicio actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando indicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Eliminar indicio
 */
const eliminarIndicio = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_EliminarIndicio', { id });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Indicio no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Indicio eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando indicio:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

module.exports = {
    getIndiciosPorExpediente,
    getIndicioPorId,
    crearIndicio,
    actualizarIndicio,
    eliminarIndicio
};
