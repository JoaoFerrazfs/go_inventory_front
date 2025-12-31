import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/racks');
        } catch (err) {
            console.error(err);
            const message = err?.response?.data?.error || err.message || 'Erro no login';
            setError(message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            {/* Banner */}
            <img
                src={process.env.PUBLIC_URL + "/img/banner1.png"}
                alt="Banner"
                className="w-3/4 max-w-sm rounded-lg mb-6 object-contain"
            />

            {/* Form container */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
                    Faça seu login
                </h2>

                {error && (
                    <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-4 text-center text-gray-500">
                    Não tem uma conta?{" "}
                    <a href="/register" className="text-blue-500 hover:underline">
                        Cadastre-se
                    </a>
                </p>
            </div>
        </div>
    );
}
