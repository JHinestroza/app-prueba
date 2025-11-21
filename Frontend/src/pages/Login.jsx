import { useForm } from "react-hook-form";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMail } from "react-icons/io5";
import PasswordInput from "../components/PasswordInput";
import { InputField } from "../components/InputField";
import { Toaster, toast } from 'sonner';
import authService from '../services/authService';

function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Verificar si ya está autenticado
    useEffect(() => {
        if (authService.isAuthenticated()) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await authService.login(data.correo, data.contrasena);
            
            if (response.success) {
                toast.success('¡Inicio de sesión exitoso!');
                setTimeout(() => {
                    navigate("/dashboard");
                }, 500);
            } else {
                toast.error(response.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error en login:', error);
            toast.error(error.message || 'Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    });

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Toaster position="top-right" richColors />
            
            <div className="w-full py-8 lg:py-0 flex items-center justify-center">
                <div className="flex max-w-xl w-full px-6 lg:px-10 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl flex-col gap-4 items-center">
                    <div className="text-center mb-4">
                        <div className="mb-4">
                            <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">DICRI</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold text-white">
                            Sistema de Gestión
                        </h1>
                        <p className="text-white/60 mt-2">
                            Expedientes e Indicios - MP Guatemala
                        </p>
                    </div>
                    
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col w-full gap-4"
                    >
                        <InputField 
                            name="correo" 
                            type="email" 
                            label="Correo Electrónico" 
                            register={register} 
                            icon={IoMail} 
                            placeholder="usuario@dicri.gob.gt"
                            required
                        />
                        {errors.correo && (
                            <p className="text-red-400 -mt-2 text-sm">
                                Correo Electrónico requerido
                            </p>
                        )}

                        <PasswordInput 
                            name="contrasena" 
                            register={register}
                            required
                        />
                        {errors.contrasena && (
                            <p className="text-red-400 -mt-2 text-sm">
                                Contraseña requerida
                            </p>
                        )}
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-3 px-4 py-3 bg-blue-600 rounded-lg text-white font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>
                    </form>
                    
                    <div className="mt-4 text-center">
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;