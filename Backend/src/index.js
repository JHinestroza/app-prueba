const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const expedientesRoutes = require('./routes/expedientes');
const indiciosRoutes = require('./routes/indicios');
const utilsRoutes = require('./routes/utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API DICRI - Sistema de Gestión de Expedientes e Indicios',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            expedientes: '/api/expedientes',
            indicios: '/api/indicios',
            utils: '/api/utils'
        }
    });
});

// Health check para verificar conexión a BD
app.get('/health', async (req, res) => {
    try {
        await getConnection();
        res.json({
            success: true,
            message: 'Servidor funcionando correctamente',
            database: 'Conectado a SQL Server'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en la conexión a la base de datos',
            error: error.message
        });
    }
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/expedientes', expedientesRoutes);
app.use('/api/indicios', indiciosRoutes);
app.use('/api/utils', utilsRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Iniciar servidor
const startServer = async () => {
    try {
        // Intentar conectar a la base de datos
        await getConnection();
        console.log('[DB] Conexion establecida correctamente');

        app.listen(PORT, () => {
            console.log('╔═══════════════════════════════════════════════╗');
            console.log('║    Servidor Backend DICRI                  ║');
            console.log('╠═══════════════════════════════════════════════╣');
            console.log(`║    Puerto: ${PORT}                            ║`);
            console.log(`║    Entorno: ${process.env.NODE_ENV || 'development'}             ║`);
            console.log(`║    URL: http://localhost:${PORT}              ║`);
            console.log(`║    Docs: http://localhost:${PORT}/           ║`);
            console.log(`║    Health: http://localhost:${PORT}/health    ║`);
            console.log('╚═══════════════════════════════════════════════╝');
        });
    } catch (error) {
        console.error('ERROR: No se pudo iniciar el servidor:', error.message);
        console.error('Verifica que SQL Server este corriendo y las credenciales sean correctas');
        process.exit(1);
    }
};

startServer();

module.exports = app;
