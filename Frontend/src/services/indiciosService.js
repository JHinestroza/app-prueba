import api from './api';

/**
 * Servicio para la gestión de indicios
 */
const indiciosService = {
    /**
     * Obtener indicios por expediente
     */
    getByExpediente: async (expedienteId) => {
        const response = await api.get(`/indicios/expediente/${expedienteId}`);
        return response.data;
    },

    /**
     * Obtener indicio por ID
     */
    getById: async (id) => {
        const response = await api.get(`/indicios/${id}`);
        return response.data;
    },

    /**
     * Crear indicio
     */
    create: async (indicio) => {
        const response = await api.post('/indicios', indicio);
        return response.data;
    },

    /**
     * Actualizar indicio
     */
    update: async (id, indicio) => {
        const response = await api.put(`/indicios/${id}`, indicio);
        return response.data;
    },

    /**
     * Eliminar indicio
     */
    delete: async (id) => {
        const response = await api.delete(`/indicios/${id}`);
        return response.data;
    }
};

export default indiciosService;
