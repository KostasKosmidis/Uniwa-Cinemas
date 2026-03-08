const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function getToken() {
    return localStorage.getItem("token");
}

export function setToken(token) {
    localStorage.setItem("token", token);
}

export function clearToken() {
    localStorage.removeItem("token");
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    // add Authorization only if token exists
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    // Try parse JSON, else fallback text
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = { message: text };
    }

    if (!res.ok) {
        const msg = data?.message || data?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return data;
}