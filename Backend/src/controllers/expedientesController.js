const { getConnection, sql } = require('../config/database');

/**
 * Obtener todos los expedientes
 */
const getExpedientes = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                e.id,
                e.descripcion,
                e.fecha_registro,
                e.Usuarios_id,
                t.nombre + ' ' + t.apellido as tecnico_nombre,
                e.Estados_id,
                est.nombre as estado_nombre
            FROM Expediente e
            INNER JOIN Usuarios t ON e.Usuarios_id = t.id
            INNER JOIN Estados est ON e.Estados_id = est.id
            ORDER BY e.fecha_registro DESC
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo expedientes:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener expediente por ID
 */
const getExpedientePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerExpedientePorId', { id });

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error obteniendo expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener expedientes por técnico
 */
const getExpedientesPorTecnico = async (req, res) => {
    try {
        const { tecnico_id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerExpedientesPorTecnico', { tecnico_id });
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo expedientes por técnico:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Crear expediente
 */
const crearExpediente = async (req, res) => {
    try {
        const { descripcion, tecnico_id } = req.body;

        if (!descripcion || !tecnico_id) {
            return res.status(400).json({
                success: false,
                message: 'Descripción y técnico son requeridos'
            });
        }

        const pool = await getConnection();
        const result = await pool.request()
            .input('descripcion', sql.VarChar, descripcion)
            .input('tecnico_id', sql.Int, tecnico_id)
            .query(`
                INSERT INTO Expediente (descripcion, Usuarios_id, Estados_id, fecha_registro)
                VALUES (@descripcion, @tecnico_id, 1, GETDATE());
                
                SELECT SCOPE_IDENTITY() as id;
            `);

        res.status(201).json({
            success: true,
            message: 'Expediente creado exitosamente',
            data: { id: result.recordset[0].id }
        });
    } catch (error) {
        console.error('Error creando expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Actualizar expediente
 */
const actualizarExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { descripcion } = req.body;

        if (!descripcion) {
            return res.status(400).json({
                success: false,
                message: 'La descripción es requerida'
            });
        }

        const result = await executeStoredProcedure('sp_ActualizarExpediente', {
            id,
            descripcion
        });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Expediente actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error actualizando expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Revisar expediente (aprobar/rechazar)
 */
const revisarExpediente = async (req, res) => {
    try {
        const { id } = req.params;
        const { coordinador_id, estado_id, justificacion } = req.body;

        if (!coordinador_id || !estado_id) {
            return res.status(400).json({
                success: false,
                message: 'Coordinador y estado son requeridos'
            });
        }

        // Validar que el estado sea 2 (Aprobado) o 3 (Rechazado)
        if (![2, 3].includes(parseInt(estado_id))) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido. Use 2 para Aprobar o 3 para Rechazar'
            });
        }

        // Si rechaza, la justificación es obligatoria
        if (parseInt(estado_id) === 3 && !justificacion) {
            return res.status(400).json({
                success: false,
                message: 'La justificación es requerida al rechazar un expediente'
            });
        }

        const result = await executeStoredProcedure('sp_RevisarExpediente', {
            expediente_id: id,
            coordinador_id,
            estado_id,
            justificacion: justificacion || null
        });

        const response = result.recordset[0];

        if (response.success === 0) {
            return res.status(400).json({
                success: false,
                message: response.mensaje
            });
        }

        res.json({
            success: true,
            message: response.mensaje
        });
    } catch (error) {
        console.error('Error revisando expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Eliminar expediente
 */
const eliminarExpediente = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await executeStoredProcedure('sp_EliminarExpediente', { id });

        if (result.recordset[0].affected_rows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Expediente no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Expediente eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error eliminando expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener expedientes por estado
 */
const getExpedientesPorEstado = async (req, res) => {
    try {
        const { estado_id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerExpedientesPorEstado', { estado_id });
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo expedientes por estado:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener expedientes por rango de fechas
 */
const getExpedientesPorFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({
                success: false,
                message: 'Fecha de inicio y fin son requeridas'
            });
        }

        const result = await executeStoredProcedure('sp_ObtenerExpedientesPorFecha', {
            fecha_inicio,
            fecha_fin
        });
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo expedientes por fecha:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

module.exports = {
    getExpedientes,
    getExpedientePorId,
    getExpedientesPorTecnico,
    crearExpediente,
    actualizarExpediente,
    revisarExpediente,
    eliminarExpediente,
    getExpedientesPorEstado,
    getExpedientesPorFecha
};
