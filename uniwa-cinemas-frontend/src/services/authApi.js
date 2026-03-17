import { apiFetch, setToken, clearToken } from "./api";

export async function login(username, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    });

    if (!data?.token) {
        throw new Error("Wrong Credentials");
    }

    setToken(data.token);

    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.Role) {
            localStorage.setItem("role", data.user.Role);
        }
    }

    return data;
}

export function logout() {
    clearToken();
    localStorage.removeItem("user");
    localStorage.removeItem("role");
}