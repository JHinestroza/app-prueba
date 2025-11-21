import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/authService';
import utilsService from '../services/utilsService';
import expedientesService from '../services/expedientesService';
import { 
    FiLogOut, 
    FiFileText, 
    FiCheckCircle, 
    FiXCircle, 
    FiClock,
    FiUsers,
    FiDatabase
} from 'react-icons/fi';

function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            navigate('/');
            return;
        }

        const user = authService.getCurrentUser();
        setUsuario(user);
        
        cargarDatos(user);
    }, [navigate]);

    const cargarDatos = async (user) => {
        try {
            setLoading(true);
            
            // Cargar estadísticas
            const statsResponse = await utilsService.getEstadisticas();
            if (statsResponse.success) {
                setEstadisticas(statsResponse.data);
            }

            // Cargar expedientes según el rol
            let expsResponse;
            if (user.rol_id === 1) {
                // Técnico: solo sus expedientes
                expsResponse = await expedientesService.getByTecnico(user.id);
            } else {
                // Coordinador/Admin: todos los expedientes
                expsResponse = await expedientesService.getAll();
            }

            if (expsResponse.success) {
                setExpedientes(expsResponse.data);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        toast.success('Sesión cerrada exitosamente');
        navigate('/');
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
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-white">DICRI</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    Sistema de Gestión de Expedientes
                                </h1>
                                <p className="text-gray-400 text-sm">
                                    {usuario?.nombre} {usuario?.apellido} - {usuario?.rol_nombre}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                        >
                            <FiLogOut /> Cerrar Sesión
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                {/* Estadísticas */}
                {estadisticas && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Expedientes</p>
                                    <p className="text-3xl font-bold text-white mt-2">
                                        {estadisticas.total_expedientes}
                                    </p>
                                </div>
                                <FiFileText className="text-4xl text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">En Revisión</p>
                                    <p className="text-3xl font-bold text-yellow-400 mt-2">
                                        {estadisticas.expedientes_en_revision}
                                    </p>
                                </div>
                                <FiClock className="text-4xl text-yellow-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Aprobados</p>
                                    <p className="text-3xl font-bold text-green-400 mt-2">
                                        {estadisticas.expedientes_aprobados}
                                    </p>
                                </div>
                                <FiCheckCircle className="text-4xl text-green-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Rechazados</p>
                                    <p className="text-3xl font-bold text-red-400 mt-2">
                                        {estadisticas.expedientes_rechazados}
                                    </p>
                                </div>
                                <FiXCircle className="text-4xl text-red-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Acciones rápidas */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(usuario?.rol_id === 1 || usuario?.rol_id === 3) && (
                            <Link
                                to="/expedientes/nuevo"
                                className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl text-white font-semibold text-center transition-all shadow-lg hover:shadow-blue-500/50"
                            >
                                + Crear Nuevo Expediente
                            </Link>
                        )}
                        <Link
                            to="/expedientes"
                            className="bg-gray-800/50 hover:bg-gray-700/50 p-6 rounded-xl text-white font-semibold text-center transition-all border border-gray-700"
                        >
                            Ver Todos los Expedientes
                        </Link>
                        {(usuario?.rol_id === 2 || usuario?.rol_id === 3) && (
                            <Link
                                to="/revisiones"
                                className="bg-gray-800/50 hover:bg-gray-700/50 p-6 rounded-xl text-white font-semibold text-center transition-all border border-gray-700"
                            >
                                Revisar Expedientes
                            </Link>
                        )}
                    </div>
                </div>

                {/* Lista de expedientes recientes */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">
                        {usuario?.rol_id === 1 ? 'Mis Expedientes Recientes' : 'Expedientes Recientes'}
                    </h2>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Fecha</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Técnico</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Estado</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Indicios</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {expedientes.slice(0, 10).map((exp) => (
                                        <tr key={exp.id} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4 text-white">#{exp.id}</td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {new Date(exp.fecha_registro).toLocaleDateString('es-GT')}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{exp.tecnico_nombre}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(exp.estado_nombre)}`}>
                                                    {exp.estado_nombre}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{exp.cantidad_indicios || 0}</td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/expedientes/${exp.id}`}
                                                    className="text-blue-400 hover:text-blue-300 font-medium"
                                                >
                                                    Ver detalles
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
