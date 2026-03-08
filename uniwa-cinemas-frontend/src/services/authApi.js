import { apiFetch, setToken, clearToken } from "./api";

export async function login(username, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

    if (!data?.token) {
        throw new Error("No token returned from server.");
    }

    setToken(data.token);

    // save user if backend returns it
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Logged in user:", data.user);
    } else {
        // fallback: decode token payload
        const payload = decodeJwt(data.token);
        if (payload) {
            localStorage.setItem("user", JSON.stringify(payload));
            console.log("Logged in user (from token):", payload);
        }
    }

    return data;
}

export function logout() {
    clearToken();
    localStorage.removeItem("user");
}

export function getCurrentUser() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function decodeJwt(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}