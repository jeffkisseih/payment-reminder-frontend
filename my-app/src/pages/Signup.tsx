import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Signup() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const navigate = useNavigate();


const handleSignup = async (e: React.FormEvent) => {
e.preventDefault();
try {
const res = await fetch("http://localhost:5000/api/auth/signup", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ email, password }),
});
if (res.ok) {
alert("Signup successful! Please login.");
navigate("/login");
} else {
const data = await res.json();
setError(data.error);
}
} catch {
setError("Server error");
}
};


return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
<h2 className="text-3xl font-bold text-center text-blue-700">Signup</h2>
<form onSubmit={handleSignup} className="space-y-4">
<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-xl" />
{error && <p className="text-red-500 text-sm">{error}</p>}
<button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-xl">Sign Up</button>
</form>
</div>
</div>
);
}
