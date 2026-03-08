import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../Services/authApi";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const from = location.state?.from || "/movies";
    const infoMessage = location.state?.message || "";

    async function onSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setErr("");
            await login(username, password);
            navigate(from, { replace: true });
        } catch (e) {
            setErr(e.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="details-card" style={{ maxWidth: 460, margin: "0 auto" }}>
                <h1 className="h1">Login</h1>

                {infoMessage ? <div className="alert">{infoMessage}</div> : null}
                {err ? <div className="alert">{err}</div> : null}

                <form className="form" onSubmit={onSubmit}>
                    <label className="label">
                        Username
                        <input
                            className="input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>

                    <label className="label">
                        Password
                        <input
                            className="input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button className="btn btnPrimary" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}