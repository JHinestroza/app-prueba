const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT) || 1433,
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'PruebaTecnica',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

/**
 * Obtiene el pool de conexiones a SQL Server
 * @returns {Promise<sql.ConnectionPool>}
 */
async function getConnection() {
    try {
        if (pool && pool.connected) {
            return pool;
        }

        pool = await sql.connect(config);
        console.log('[SQL] Conexion pool inicializado');
        return pool;
    } catch (error) {
        console.error('[SQL] Error de conexion:', error.message);
        throw error;
    }
}

/**
 * Cierra el pool de conexiones
 */
async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            pool = null;
            console.log('[SQL] Pool de conexiones cerrado');
        }
    } catch (error) {
        console.error('[SQL] Error al cerrar pool:', error.message);
    }
}

/**
 * Ejecuta un stored procedure
 * @param {string} procedureName - Nombre del stored procedure
 * @param {Object} params - Parámetros del stored procedure
 * @returns {Promise<sql.IResult<any>>}
 */
async function executeStoredProcedure(procedureName, params = {}) {
    try {
        const connection = await getConnection();
        const request = connection.request();

        // Agregar parámetros al request
        Object.entries(params).forEach(([key, value]) => {
            request.input(key, value);
        });

        const result = await request.execute(procedureName);
        return result;
    } catch (error) {
        console.error(`[SQL] Error en stored procedure ${procedureName}:`, error.message);
        throw error;
    }
}

// Manejo de cierre de aplicación
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
});

module.exports = {
    getConnection,
    closeConnection,
    executeStoredProcedure,
    sql
};
