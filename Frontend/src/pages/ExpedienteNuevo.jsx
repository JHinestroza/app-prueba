import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import authService from '../services/authService';
import expedientesService from '../services/expedientesService';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

function ExpedienteNuevo() {
    const navigate = useNavigate();
    const usuario = authService.getCurrentUser();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        descripcion: '',
        tecnico_id: usuario?.id || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.descripcion.trim()) {
            toast.error('La descripción es requerida');
            return;
        }

        try {
            setLoading(true);
            const response = await expedientesService.create({
                descripcion: formData.descripcion,
                tecnico_id: parseInt(formData.tecnico_id)
            });

            if (response.success) {
                toast.success('Expediente creado exitosamente');
                navigate('/expedientes');
            } else {
                toast.error(response.message || 'Error al crear expediente');
            }
        } catch (error) {
            console.error('Error creando expediente:', error);
            toast.error('Error al crear expediente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard" className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                            <FiArrowLeft className="text-white text-xl" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Crear Nuevo Expediente</h1>
                            <p className="text-gray-400 text-sm">Registrar un nuevo expediente en el sistema</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Técnico asignado */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Técnico Asignado
                                </label>
                                <input
                                    type="text"
                                    value={`${usuario?.nombre} ${usuario?.apellido}`}
                                    disabled
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-gray-500 text-sm mt-1">
                                    El expediente será asignado automáticamente a tu usuario
                                </p>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                                    Descripción del Expediente *
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    rows="6"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Ingrese una descripción detallada del expediente..."
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                    required
                                />
                                <p className="text-gray-500 text-sm mt-1">
                                    Describe el caso, evidencias iniciales o detalles relevantes
                                </p>
                            </div>

                            {/* Estado inicial */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-blue-400 text-xl">ℹ</div>
                                    <div>
                                        <p className="text-blue-300 font-medium">Estado inicial</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            El expediente se creará con el estado "En Revisión" y podrá ser aprobado o rechazado por un coordinador.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors"
                                >
                                    <FiSave className="text-lg" />
                                    {loading ? 'Creando...' : 'Crear Expediente'}
                                </button>
                                <Link
                                    to="/dashboard"
                                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-colors"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ExpedienteNuevo;
