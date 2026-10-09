import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Login as loginService } from "../../services/authServices";
import { Shield, Thermometer, AlertTriangle, Brain, CheckCircle } from "lucide-react";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await loginService({ email, password });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.user.role);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success("Login successful");
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Hero Section */}
                <div className="hidden md:block space-y-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-500 p-3 rounded-xl">
                            <Shield size={40} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800">Food Safety</h1>
                            <p className="text-green-600 font-semibold">Management System</p>
                        </div>
                    </div>
                    
                    <p className="text-xl text-gray-600 leading-relaxed">
                        AI-powered real-time monitoring for enhanced food safety control in food processing industries
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <Thermometer size={24} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Real-time Monitoring</h3>
                                <p className="text-gray-600 text-sm">Track temperature, humidity & storage conditions continuously</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-yellow-100 p-2 rounded-lg">
                                <AlertTriangle size={24} className="text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Instant Alerts</h3>
                                <p className="text-gray-600 text-sm">Get notified immediately when risks are detected</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <Brain size={24} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">AI Risk Analysis</h3>
                                <p className="text-gray-600 text-sm">Intelligent evaluation of batch safety and contamination risks</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <CheckCircle size={24} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Quality Control</h3>
                                <p className="text-gray-600 text-sm">Comprehensive inspection tracking and reporting</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Shield size={32} className="text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-center text-sm text-gray-600">
                            <span className="font-semibold">Demo Credentials:</span>
                        </p>
                        <p className="text-center text-xs text-gray-500 mt-1">
                            Admin: admin@example.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
