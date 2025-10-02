import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup  from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        {/* Default route shows Welcome page */}
        <Route path="/" element={<Welcome />} />

        {/* Add these placeholders for now */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
