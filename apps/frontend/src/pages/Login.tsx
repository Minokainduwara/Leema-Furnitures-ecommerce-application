import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

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
if (error instanceof Error) {
alert(error.message);
} else {
alert("Something went wrong");
}
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
if (error instanceof Error) {
alert(error.message);
} else {
alert("Something went wrong");
}
}
};

return (
<div style={{ padding: "20px" }}>
<h2>Login</h2>

<input
type="email"
placeholder="Email"
onChange={(e) => setEmail(e.target.value)}
style={{ width: "20%", padding: "8px" }}
/>
<br /><br />

<div style={{ position: "relative", width: "250px" }}>
<input
type={showPassword ? "text" : "password"}
placeholder="Password"
onChange={(e) => setPassword(e.target.value)}
style={{ width: "100%", padding: "6px 20px 8px 8px" }}
/>
<span
onClick={() => setShowPassword(!showPassword)}
style={{
position: "absolute",
right: "1px",
top: "18px",
transform: "translateY(-50%)",
cursor: "pointer"
}}
>
{showPassword ? <FaEyeSlash /> : <FaEye />}
</span>
<br />
<p
onClick={handleForgotPassword}
style={{
color: "blue",
cursor: "pointer",
fontSize: "14px",
marginTop: "5px"
}}
>
Forgot Password?
</p>

<p style={{ fontSize: "14px", marginTop: "8px" }}>
Don't have an account?{" "}
<Link to="/signup" style={{ color: "blue", fontWeight: "bold" }}>
Sign up here
</Link>
</p>
<button onClick={handleLogin}>Login</button>
</div>
</div>
);
}

export default Login;
