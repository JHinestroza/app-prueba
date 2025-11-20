import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ name, register, defaultValue }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label htmlFor={name} className="block text-gray-300 mb-2">Contraseña</label>
            <div className="relative">
                <FaLock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
                <input
                    id={name}
                    {...register(name, { required: true })}
                    type={showPassword ? "text" : "password"}
                    defaultValue={defaultValue}
                    className="w-full pl-10 pr-12 py-3 bg-panel-dark text-white rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                >
                    {showPassword ? (
                        <FaEyeSlash className="w-5 h-5" />
                    ) : (
                        <FaEye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PasswordInput;