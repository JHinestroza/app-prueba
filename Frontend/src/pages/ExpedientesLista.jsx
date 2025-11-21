import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/authService';
import expedientesService from '../services/expedientesService';
import { FiArrowLeft, FiFilter, FiSearch } from 'react-icons/fi';

function Expedientes() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [expedientes, setExpedientes] = useState([]);
    const [filteredExpedientes, setFilteredExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('todos');

    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }

        const user = authService.getCurrentUser();
        setUsuario(user);
        cargarExpedientes(user);
    }, [navigate]);

    useEffect(() => {
        filtrarExpedientes();
    }, [searchTerm, estadoFilter, expedientes]);

    const cargarExpedientes = async (user) => {
        try {
            setLoading(true);
            let response;
            
            if (user.rol_id === 1) {
                response = await expedientesService.getByTecnico(user.id);
            } else {
                response = await expedientesService.getAll();
            }

            if (response.success) {
                setExpedientes(response.data);
                setFilteredExpedientes(response.data);
            }
        } catch (error) {
            console.error('Error cargando expedientes:', error);
            toast.error('Error al cargar expedientes');
        } finally {
            setLoading(false);
        }
    };

    const filtrarExpedientes = () => {
        let filtered = [...expedientes];

        if (searchTerm) {
            filtered = filtered.filter(exp =>
                exp.id?.toString().includes(searchTerm) ||
                exp.tecnico_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exp.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (estadoFilter !== 'todos') {
            filtered = filtered.filter(exp => {
                const estadoId = exp.Estados_id || exp.estado_id;
                return estadoId?.toString() === estadoFilter;
            });
        }

        setFilteredExpedientes(filtered);
    };

    const getEstadoBadge = (estadoNombre) => {
        const badges = {
            'En Revisión': 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
            'Aprobado': 'bg-green-500/20 text-green-400 border border-green-500/30',
            'Rechazado': 'bg-red-500/20 text-red-400 border border-red-500/30'
        };
        return badges[estadoNombre] || 'bg-gray-500/20 text-gray-400';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando expedientes...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <FiArrowLeft className="text-white text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {usuario?.rol_id === 1 ? 'Mis Expedientes' : 'Todos los Expedientes'}
                            </h1>
                            <p className="text-gray-400 text-sm">Gestión y seguimiento de expedientes</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por ID, técnico o descripción..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="relative">
                            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={estadoFilter}
                                onChange={(e) => setEstadoFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="todos">Todos los estados</option>
                                <option value="1">En Revisión</option>
                                <option value="2">Aprobado</option>
                                <option value="3">Rechazado</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 text-gray-400 text-sm">
                        Mostrando {filteredExpedientes.length} de {expedientes.length} expedientes
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fecha</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Técnico</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Descripción</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Indicios</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {filteredExpedientes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                                            No se encontraron expedientes
                                        </td>
                                    </tr>
                                ) : (
                                    filteredExpedientes.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 text-white font-semibold">#{exp.id}</td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {new Date(exp.fecha_registro).toLocaleDateString('es-GT', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{exp.tecnico_nombre}</td>
                                            <td className="px-6 py-4 text-gray-300 max-w-xs truncate">
                                                {exp.descripcion || 'Sin descripción'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(exp.estado_nombre)}`}>
                                                    {exp.estado_nombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full font-semibold">
                                                    {exp.cantidad_indicios || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Expedientes;
