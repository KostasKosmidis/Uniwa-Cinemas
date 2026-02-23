import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await api.post("/auth/login", { username, password });
            const token = res.data?.token;

            if (!token) {
                throw new Error("No token returned from server");
            }

            login(token); // saves to localStorage + updates UI state
            navigate("/", { replace: true });
        } catch (err) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                err?.message ||
                "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 16, maxWidth: 420 }}>
            <h1>Login</h1>

            <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
                <label>
                    Username
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="username"
                        autoComplete="username"
                        style={{ width: "100%", padding: 10, marginTop: 6 }}
                    />
                </label>

                <label>
                    Password
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        type="password"
                        autoComplete="current-password"
                        style={{ width: "100%", padding: 10, marginTop: 6 }}
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading || !username || !password}
                    style={{ padding: 10, cursor: "pointer" }}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {error && (
                    <div style={{ color: "crimson", background: "#ffecec", padding: 10, borderRadius: 8 }}>
                        {error}
                    </div>
                )}
            </form>

            <p style={{ marginTop: 12 }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}