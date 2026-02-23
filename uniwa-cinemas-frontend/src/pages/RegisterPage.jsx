import { useState } from "react";
import { api } from "../api/client";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setMsg("");

        try {
            await api.post("/auth/register", { username, password });
            setMsg("Registered! Now login.");
            setTimeout(() => navigate("/login"), 600);
        } catch (e2) {
            setError(e2?.response?.data?.error || e2?.response?.data?.message || e2.message || "Register failed");
        }
    }

    return (
        <div style={{ padding: 16, maxWidth: 420 }}>
            <h1>Register</h1>
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
                <button type="submit">Create account</button>
                {msg && <div style={{ color: "green" }}>{msg}</div>}
                {error && <div style={{ color: "crimson" }}>{error}</div>}
            </form>
        </div>
    );
}