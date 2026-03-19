import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
            navigate("/dashboard");
        } catch (error: unknown) {
            if (error instanceof Error) alert(error.message);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            alert("Please enter your email first");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("Password reset email sent!");
        } catch (error: unknown) {
            if (error instanceof Error) alert(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">

            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Login to your account
                </h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Password */}
                <div className="relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                {/* Forgot password */}
                <p
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:underline cursor-pointer mb-4 text-right"
                >
                    Forgot Password?
                </p>

                {/* Login button */}
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                >
                    Login
                </button>

                {/* Signup */}
                <p className="text-sm text-center mt-6">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Sign up
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;