import api from './api';

/**
 * Servicio para utilidades (estados, roles, estadísticas)
 */
const utilsService = {
    /**
     * Obtener roles
     */
    getRoles: async () => {
        const response = await api.get('/utils/roles');
        return response.data;
    },

    /**
     * Obtener estados
     */
    getEstados: async () => {
        const response = await api.get('/utils/estados');
        return response.data;
    },

    /**
     * Obtener estadísticas
     */
    getEstadisticas: async () => {
        const response = await api.get('/utils/estadisticas');
        return response.data;
    },

    /**
     * Obtener revisiones
     */
    getRevisiones: async () => {
        const response = await api.get('/utils/revisiones');
        return response.data;
    },

    /**
     * Obtener revisiones por expediente
     */
    getRevisionesByExpediente: async (expedienteId) => {
        const response = await api.get(`/utils/revisiones/expediente/${expedienteId}`);
        return response.data;
    }
};

export default utilsService;
