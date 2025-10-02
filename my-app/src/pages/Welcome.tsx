import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      {/* App Title */}
      <h1 className="text-5xl font-extrabold text-blue-900 mb-10">Strappay</h1>

      {/* Buttons */}
      <div className="space-x-6">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="px-6 py-3 rounded-2xl bg-white text-blue-600 border border-blue-600 text-lg font-semibold shadow-lg hover:bg-blue-50 transition"
        >
          Signup
        </button>
      </div>
    </div>
  );
}
