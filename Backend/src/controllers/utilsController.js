const { getConnection, sql } = require('../config/database');

/**
 * Obtener todas las revisiones
 */
const getRevisiones = async (req, res) => {
    try {
        const result = await executeStoredProcedure('sp_ObtenerRevisiones');
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo revisiones:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener revisiones por expediente
 */
const getRevisionesPorExpediente = async (req, res) => {
    try {
        const { expediente_id } = req.params;

        const result = await executeStoredProcedure('sp_ObtenerRevisionesPorExpediente', { expediente_id });
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo revisiones por expediente:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener estadísticas generales
 */
const getEstadisticas = async (req, res) => {
    //console.log('Entrando a getEstadisticas');
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                (SELECT COUNT(*) FROM Expediente) as total_expedientes,
                (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 1) as expedientes_revision,
                (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 2) as expedientes_aprobados,
                (SELECT COUNT(*) FROM Expediente WHERE Estados_id = 3) as expedientes_rechazados,
                (SELECT COUNT(*) FROM Indicios) as total_indicios,
                (SELECT COUNT(*) FROM Usuarios WHERE rol_id = 1) as total_tecnicos,
                (SELECT COUNT(*) FROM Usuarios WHERE rol_id = 2) as total_coordinadores
        `);
        
        res.json({
            success: true,
            data: result.recordset[0]
        });
    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener roles
 */
const getRoles = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT id, rol
            FROM Rol
            ORDER BY id
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener estados
 */
const getEstados = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT id, nombre
            FROM Estados
            ORDER BY id
        `);
        
        res.json({
            success: true,
            data: result.recordset
        });
    } catch (error) {
        console.error('Error obteniendo estados:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

module.exports = {
    getRevisiones,
    getRevisionesPorExpediente,
    getEstadisticas,
    getRoles,
    getEstados
};
