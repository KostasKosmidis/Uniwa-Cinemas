import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    const value = useMemo(
        () => ({
            token,
            isAuthed: !!token,
            login: (newToken) => {
                localStorage.setItem("token", newToken);
                setToken(newToken);
            },
            logout: () => {
                localStorage.removeItem("token");
                setToken(null);
            },
        }),
        [token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}