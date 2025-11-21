const { getConnection, sql } = require('../config/database');
const md5 = require('md5');

/**
 * Login de usuario
 */
const login = async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;

        if (!correo || !contrasenia) {
            return res.status(400).json({
                success: false,
                message: 'Correo y contraseña son requeridos'
            });
        }

        // Cifrar contraseña con MD5
        const contraseniaEncriptada = md5(contrasenia);

        console.log('realizando consulta de login',contraseniaEncriptada);
        const pool = await getConnection();
        const result = await pool.request()
            .input('correo', sql.VarChar, correo)
            .input('contrasenia', sql.VarChar, contraseniaEncriptada)
            .query(`
                SELECT 
                    u.id,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    r.id as rol_id,
                    r.rol as rol_nombre
                FROM Usuarios u
                INNER JOIN Rol r ON u.rol_id = r.id
                WHERE u.correo = @correo 
                AND u.contrasenia = @contrasenia
            `);
        console.log('resultado de consulta de login',result);

        if (result.recordset.length === 0) {
            console.log('login fallido: credenciales inválidas');
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        const usuario = result.recordset[0];
        
        // No enviar la contraseña en la respuesta
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo: usuario.correo,
                rol_id: usuario.rol_id,
                rol_nombre: usuario.rol_nombre
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

/**
 * Obtener perfil del usuario (verificación de token/sesión)
 */
const getProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    u.id,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    r.id as rol_id,
                    r.rol as rol_nombre
                FROM Usuarios u
                INNER JOIN Rol r ON u.rol_id = r.id
                WHERE u.id = @id
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const usuario = result.recordset[0];
        
        res.json({
            success: true,
            data: usuario
        });
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

module.exports = {
    login,
    getProfile
};
