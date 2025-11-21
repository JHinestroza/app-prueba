import api from './api';

/**
 * Servicio para la gestión de expedientes
 */
const expedientesService = {
    /**
     * Obtener todos los expedientes
     */
    getAll: async () => {
        const response = await api.get('/expedientes');
        return response.data;
    },

    /**
     * Obtener expediente por ID
     */
    getById: async (id) => {
        const response = await api.get(`/expedientes/${id}`);
        return response.data;
    },

    /**
     * Obtener expedientes por técnico
     */
    getByTecnico: async (tecnicoId) => {
        const response = await api.get(`/expedientes/tecnico/${tecnicoId}`);
        return response.data;
    },

    /**
     * Obtener expedientes por estado
     */
    getByEstado: async (estadoId) => {
        const response = await api.get(`/expedientes/estado/${estadoId}`);
        return response.data;
    },

    /**
     * Obtener expedientes por rango de fechas
     */
    getByFechas: async (fechaInicio, fechaFin) => {
        const response = await api.get('/expedientes/fecha', {
            params: { fecha_inicio: fechaInicio, fecha_fin: fechaFin }
        });
        return response.data;
    },

    /**
     * Crear expediente
     */
    create: async (expediente) => {
        const response = await api.post('/expedientes', expediente);
        return response.data;
    },

    /**
     * Actualizar expediente
     */
    update: async (id, expediente) => {
        const response = await api.put(`/expedientes/${id}`, expediente);
        return response.data;
    },

    /**
     * Revisar expediente (aprobar/rechazar)
     */
    revisar: async (id, revision) => {
        const response = await api.put(`/expedientes/${id}/revisar`, revision);
        return response.data;
    },

    /**
     * Eliminar expediente
     */
    delete: async (id) => {
        const response = await api.delete(`/expedientes/${id}`);
        return response.data;
    }
};

export default expedientesService;
