import { createContext, useState, useContext } from "react";


const AuthContext = createContext<any>(null);


export function AuthProvider({ children }: { children: React.ReactNode }) {
const [token, setToken] = useState(localStorage.getItem("token"));


const login = (newToken: string) => {
setToken(newToken);
localStorage.setItem("token", newToken);
};


const logout = () => {
setToken(null);
localStorage.removeItem("token");
};


return (
<AuthContext.Provider value={{ token, login, logout }}>
{children}
</AuthContext.Provider>
);
}


export function useAuth() {
return useContext(AuthContext);
}