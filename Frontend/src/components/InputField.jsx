import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({ name, type = "text", label, register, icon: Icon,placeholder,defaultValue }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div>
            <label htmlFor={name} className="block text-gray-300 mb-2">{label}</label>
            <div className="relative">
                {Icon && <Icon className="w-5 h-5 text-gray-400 absolute left-3 top-3" />}
                <input
                    id={name}
                    {...register(name, { required: true })} // Es requerido 
                    type={type}
                    defaultValue={defaultValue}
                    className="w-full pl-10 pr-12 py-3 bg-panel-dark text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
};

export { InputField };