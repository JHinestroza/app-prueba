import api from './api';
import md5 from 'md5';

/**
 * Servicio de autenticación
 */
const authService = {
    /**
     * Login de usuario
     * @param {string} correo 
     * @param {string} contrasenia 
     * @returns {Promise}
     */
    login: async (correo, contrasenia) => {
        try {
            // Cifrar contraseña con MD5
            const contraseniaEncriptada = md5(contrasenia);
            
            const response = await api.post('/auth/login', {
                correo,
                contrasenia: contraseniaEncriptada
            });

            // Guardar usuario en localStorage
            if (response.data.success) {
                localStorage.setItem('usuario', JSON.stringify(response.data.data));
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    /**
     * Logout de usuario
     */
    logout: () => {
        localStorage.removeItem('usuario');
    },

    /**
     * Obtener usuario actual desde localStorage
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        const usuario = localStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    },

    /**
     * Verificar si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('usuario');
    },

    /**
     * Verificar si el usuario es técnico
     * @returns {boolean}
     */
    isTecnico: () => {
        const usuario = authService.getCurrentUser();
        return usuario?.rol_id === 1;
    },

    /**
     * Verificar si el usuario es coordinador
     * @returns {boolean}
     */
    isCoordinador: () => {
        const usuario = authService.getCurrentUser();
        return usuario?.rol_id === 2;
    },

    /**
     * Verificar si el usuario es administrador
     * @returns {boolean}
     */
    isAdmin: () => {
        const usuario = authService.getCurrentUser();
        return usuario?.rol_id === 3;
    }
};

export default authService;
