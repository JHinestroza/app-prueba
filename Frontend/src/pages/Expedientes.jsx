import { useForm } from "react-hook-form";
import React, { useState,useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import { PiAirplaneTiltFill } from "react-icons/pi";
import { IoMail } from "react-icons/io5";
import PasswordInput from "../components/PasswordInput";
import { InputField } from "../components/InputField";
import { Toaster, toast } from 'sonner';

function LoginPage() {
    const navigate = useNavigate();

    
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm();
    


    const onSubmit = handleSubmit((data) => {
        console.log('Login data:', data);
        toast.success('Inicio de sesión exitoso');
        // TODO: Implementar lógica de autenticación
        // navigate("/home");
    });


    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-bg-dark">


            <div className="w-full py-8 lg:py-0 flex items-center justify-center">
                <div className="flex max-w-xl w-full px-6 lg:px-10 rounded-md flex-col gap-4 items-center">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-white">
                            ¡Bienvenido de nuevo!
                        </h1>
                        <span className="text-white/60">
                            Ingresa a tu cuenta para continuar
                        </span>
                    </div>
                    <form
                        onSubmit={onSubmit}
                        className="flex flex-col w-full gap-2"
                    >
                        <InputField 
                            name="correo" 
                            type="correo" 
                            label="Correo Electrónico" 
                            register={register} 
                            icon={IoMail} 
                            placeholder={"tu@correo.com"}
                        />
                        {errors.correo && (
                            <p className="text-red-400 my-1">
                                Correo Electrónico requerido
                            </p>
                        )}

                        <PasswordInput name="contrasena" register={register} />
                        {errors.contrasena && (
                            <p className="w-full text-red-400">
                                Contraseña requerida
                            </p>
                        )}
                        <button
                            type="submit"
                            className="mt-5 px-2 py-2 bg-blue-500 rounded-md my-2 text-white hover:bg-blue-600 hover:ease-in transition-colors"
                        >
                            Registrarse
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;