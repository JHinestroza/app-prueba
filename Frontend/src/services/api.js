import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token (si se implementa JWT en el futuro)
api.interceptors.request.use(
    (config) => {
        // Aquí se puede agregar un token si se implementa JWT
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores globales
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de respuesta:', error.response.data);
            
            // Si el error es 401, redirigir al login
            if (error.response.status === 401) {
                localStorage.removeItem('usuario');
                window.location.href = '/';
            }
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta
            console.error('Error de red:', error.request);
        } else {
            // Algo sucedió al configurar la petición
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
